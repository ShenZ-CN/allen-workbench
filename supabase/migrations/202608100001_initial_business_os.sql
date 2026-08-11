create extension if not exists pgcrypto;
create extension if not exists vector with schema extensions;

create type public.risk_level as enum ('low','medium','high');
create type public.project_stage as enum ('RFQ','Quotation','Technical Review','Sample','PPAP','SOP','Mass Production');
create type public.knowledge_visibility as enum ('internal','restricted');
create type public.knowledge_category as enum ('success_factor','failure_reason','technical_experience','quotation_experience','customer_experience','competitive_intelligence');

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$begin new.updated_at=now();return new;end$$;

create table public.customers(
  id uuid primary key default gen_random_uuid(), legacy_id text unique, code text not null unique, name text not null,
  country text, tier text not null default 'Tier 1', customer_grade text not null default 'C' check(customer_grade in('A','B','C','D')),
  risk_level public.risk_level not null default 'low', strategic_value text not null default 'develop' check(strategic_value in('strategic','core','key','develop','watch')),
  main_products text[] not null default '{}', plants jsonb not null default '[]', contacts jsonb not null default '[]', notes text,
  created_by uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.customer_annual_financials(
  id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers on delete cascade, year int not null check(year between 2000 and 2200),
  predicted_sales numeric(18,2) not null default 0, predicted_profit numeric(18,2) not null default 0,
  actual_sales numeric(18,2), actual_profit numeric(18,2), confirmed_sales numeric(18,2), confirmed_profit numeric(18,2), notes text,
  created_by uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(customer_id,year)
);
create table public.rfqs(
  id uuid primary key default gen_random_uuid(), legacy_id text unique, customer_id uuid not null references public.customers,
  code text not null unique, project_name text not null, owner text, stage text not null default 'RFQ', due_date date, source text,
  status text not null default 'active', strategic_significance smallint not null default 3 check(strategic_significance between 1 and 5), notes text,
  created_by uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.rfq_parts(
  id uuid primary key default gen_random_uuid(), legacy_id text unique, rfq_id uuid not null references public.rfqs on delete cascade,
  part_number text, business_segment text not null default 'Bearing Cage', product_subcategory text, status text not null default 'pending',
  lifecycle_years int not null default 1 check(lifecycle_years between 1 and 20), sop_year int, annual_demands jsonb not null default '{}', annual_lta jsonb not null default '{}', eav numeric(18,2) not null default 0,
  currency text not null default 'EUR', cost_rmb numeric(18,4) not null default 0, bare_price_rmb numeric(18,4) not null default 0, quote_fx numeric(18,6) not null default 1,
  mold_fee_rmb numeric(18,2) not null default 0, mold_amortization_quantity numeric(18,2) not null default 0, rebate_percent numeric(7,4) not null default 0,
  technical_match smallint not null default 3 check(technical_match between 1 and 5), competitive_advantage smallint not null default 3 check(competitive_advantage between 1 and 5), assessment_notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(rfq_id,part_number)
);
create table public.quotation_versions(
  id uuid primary key default gen_random_uuid(), rfq_part_id uuid not null references public.rfq_parts on delete cascade, version text not null,
  quoted_at date not null default current_date, cost_rmb numeric(18,4) not null, bare_price_rmb numeric(18,4) not null,
  quote_fx numeric(18,6) not null, mold_fee_rmb numeric(18,2) not null default 0, notes text,
  created_by uuid references auth.users(id), created_at timestamptz not null default now(), unique(rfq_part_id,version)
);
create table public.rfq_assessments(
  id uuid primary key default gen_random_uuid(), rfq_id uuid not null unique references public.rfqs on delete cascade,
  customer_value numeric(7,2), profit_potential numeric(7,2), technical_match numeric(7,2), competitive_advantage numeric(7,2), strategic_significance numeric(7,2),
  score numeric(7,2), value_grade text check(value_grade in('A','B','C','D')), system_win_probability numeric(7,2), manual_win_probability numeric(7,2) check(manual_win_probability between 0 and 100),
  assessment_notes text, updated_by uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.projects(
  id uuid primary key default gen_random_uuid(), legacy_id text unique, rfq_id uuid not null references public.rfqs,
  project_name text not null, current_stage public.project_stage not null default 'RFQ', risk_level public.risk_level not null default 'low', risk_notes text,
  commercial_value numeric(18,2) not null default 0, customer_part_number text, internal_part_number text, sap_code text, ppap_status text, one_time_commission numeric(18,2) not null default 0,
  status text not null default 'active', created_by uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.project_parts(
  project_id uuid not null references public.projects on delete cascade, rfq_part_id uuid not null references public.rfq_parts,
  created_at timestamptz not null default now(), primary key(project_id,rfq_part_id)
);
create table public.project_milestones(
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects on delete cascade,
  stage public.project_stage not null, sequence smallint not null check(sequence between 1 and 7), planned_date date, actual_date date,
  status text not null default 'pending' check(status in('pending','active','completed','blocked')), owner text, action_notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(project_id,stage), unique(project_id,sequence)
);
create table public.production_records(
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects on delete cascade, rfq_part_id uuid not null references public.rfq_parts,
  period date not null check(extract(day from period)=1), forecast_quantity numeric(18,2) not null default 0, forecast_unit_price numeric(18,4) not null default 0,
  order_quantity numeric(18,2) not null default 0, order_status text not null default 'none', due_quantity numeric(18,2) not null default 0, delivered_quantity numeric(18,2) not null default 0,
  delivery_date date, delivery_status text not null default 'on_track' check(delivery_status in('on_track','risk','delayed')),
  ppm numeric(18,2) not null default 0, ppm_target numeric(18,2) not null default 500, customer_complaints int not null default 0,
  return_scrap_quantity numeric(18,2) not null default 0, quality_status text not null default 'normal' check(quality_status in('normal','attention','risk')), quality_actions text,
  actual_unit_price numeric(18,4), actual_unit_cost numeric(18,4), notes text,
  created_by uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(project_id,rfq_part_id,period)
);
create table public.revenue_records(
  id uuid primary key default gen_random_uuid(), production_record_id uuid not null unique references public.production_records on delete cascade,
  period date not null, actual_revenue numeric(18,2) not null default 0, actual_profit numeric(18,2) not null default 0,
  calculation_basis jsonb not null default '{}', confirmation_status text not null default 'calculated' check(confirmation_status in('calculated','confirmed')),
  confirmed_by uuid references auth.users(id), confirmed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.knowledge_entries(
  id uuid primary key default gen_random_uuid(), project_id uuid references public.projects on delete set null, customer_id uuid references public.customers on delete set null, rfq_part_id uuid references public.rfq_parts on delete set null,
  title text not null, category public.knowledge_category not null, summary text not null, background text, action_taken text, result text, recommendation text,
  project_stage public.project_stage, project_outcome text, tags text[] not null default '{}', visibility public.knowledge_visibility not null default 'internal',
  created_by uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.knowledge_embeddings(
  knowledge_entry_id uuid primary key references public.knowledge_entries on delete cascade, embedding extensions.vector(1536) not null,
  model text not null default 'text-embedding-3-small', index_status text not null default 'ready', updated_at timestamptz not null default now()
);
create table public.documents(
  id uuid primary key default gen_random_uuid(), customer_id uuid references public.customers on delete set null, rfq_id uuid references public.rfqs on delete set null,
  project_id uuid references public.projects on delete set null, knowledge_entry_id uuid references public.knowledge_entries on delete set null,
  bucket text not null default 'business-documents', object_path text not null unique, filename text not null, mime_type text, size_bytes bigint,
  created_by uuid references auth.users(id), created_at timestamptz not null default now()
);
create table public.import_runs(
  id uuid primary key default gen_random_uuid(), source_format text not null, status text not null default 'pending', source_summary jsonb not null default '{}', result_summary jsonb, errors jsonb not null default '[]',
  created_by uuid references auth.users(id), created_at timestamptz not null default now(), completed_at timestamptz
);

create index rfq_parts_rfq_idx on public.rfq_parts(rfq_id);
create index projects_rfq_idx on public.projects(rfq_id);
create index milestones_project_seq_idx on public.project_milestones(project_id,sequence);
create index production_period_idx on public.production_records(period,project_id);
create index revenue_period_idx on public.revenue_records(period);
create index knowledge_metadata_idx on public.knowledge_entries(category,visibility,project_stage);
create index knowledge_tags_idx on public.knowledge_entries using gin(tags);
create index knowledge_embedding_hnsw on public.knowledge_embeddings using hnsw(embedding extensions.vector_cosine_ops);

do $$declare t text;begin foreach t in array array['customers','customer_annual_financials','rfqs','rfq_parts','quotation_versions','rfq_assessments','projects','project_parts','project_milestones','production_records','revenue_records','knowledge_entries','knowledge_embeddings','documents','import_runs'] loop execute format('alter table public.%I enable row level security',t);execute format('create policy %I on public.%I for select to authenticated using (true)',t||'_read',t);execute format('create policy %I on public.%I for insert to authenticated with check (true)',t||'_insert',t);execute format('create policy %I on public.%I for update to authenticated using (true) with check (true)',t||'_update',t);execute format('create policy %I on public.%I for delete to authenticated using (true)',t||'_delete',t);end loop;end$$;

do $$declare t text;begin foreach t in array array['customers','customer_annual_financials','rfqs','rfq_parts','rfq_assessments','projects','project_milestones','production_records','revenue_records','knowledge_entries'] loop execute format('create trigger %I before update on public.%I for each row execute function public.touch_updated_at()',t||'_touch_updated_at',t);end loop;end$$;

insert into storage.buckets(id,name,public) values('business-documents','business-documents',false) on conflict(id)do nothing;
create policy "business_documents_read" on storage.objects for select to authenticated using(bucket_id='business-documents');
create policy "business_documents_insert" on storage.objects for insert to authenticated with check(bucket_id='business-documents');
create policy "business_documents_update" on storage.objects for update to authenticated using(bucket_id='business-documents') with check(bucket_id='business-documents');
create policy "business_documents_delete" on storage.objects for delete to authenticated using(bucket_id='business-documents');

create or replace view public.annual_revenue_summary with(security_invoker=true) as
select p.rfq_id,r.period::date,extract(year from r.period)::int as year,sum(r.actual_revenue) actual_revenue,sum(r.actual_profit) actual_profit
from public.revenue_records r join public.production_records pr on pr.id=r.production_record_id join public.projects p on p.id=pr.project_id group by p.rfq_id,r.period,extract(year from r.period);

create or replace view public.customer_360 with(security_invoker=true) as
with base as(
 select c.*,count(distinct p.id)::int project_count,
 coalesce(max(coalesce(f.confirmed_sales,f.actual_sales,f.predicted_sales)),0)::numeric annual_sales,
 coalesce(max(coalesce(f.confirmed_profit,f.actual_profit,f.predicted_profit)),0)::numeric annual_profit
 from public.customers c left join public.rfqs r on r.customer_id=c.id left join public.projects p on p.rfq_id=r.id
 left join public.customer_annual_financials f on f.customer_id=c.id and f.year=extract(year from current_date)::int group by c.id
), scored as(select base.*,
 25*annual_sales/nullif(max(annual_sales)over(),0)+25*annual_profit/nullif(max(annual_profit)over(),0)+15*project_count/nullif(max(project_count)over(),0)
 +case risk_level when 'low' then 15 when 'medium' then 8 else 0 end
 +case strategic_value when 'strategic' then 20 when 'core' then 16 when 'key' then 12 when 'develop' then 8 else 4 end raw_score from base)
select id,code,name,country,tier,customer_grade,risk_level,strategic_value,main_products,project_count,annual_sales,annual_profit,
least(100,coalesce(raw_score,case strategic_value when 'strategic' then 20 else 8 end))::numeric(7,2) value_score,
case when risk_level='high' then 'risk' when coalesce(raw_score,0)>=70 then 'healthy' else 'attention' end health_status from scored;

create or replace view public.rfq_pipeline with(security_invoker=true) as
with parts as(select rfq_id,count(*)::int part_count,
 avg(case when bare_price_rmb>0 then (bare_price_rmb-cost_rmb*.87)/bare_price_rmb else 0 end) margin,
 sum(technical_match*greatest(eav,1))/nullif(sum(greatest(eav,1)),0) technical,
 sum(competitive_advantage*greatest(eav,1))/nullif(sum(greatest(eav,1)),0) competition from public.rfq_parts group by rfq_id), calc as(
 select r.*,c.name customer_name,coalesce(p.part_count,0) part_count,
 (c.value_score*.20+least(greatest(coalesce(p.margin,0),0)/.35,1)*25+coalesce(p.technical,3)/5*20+coalesce(p.competition,3)/5*20+r.strategic_significance/5.0*15)::numeric(7,2) computed_score,
 a.manual_win_probability,a.score saved_score,a.value_grade saved_grade from public.rfqs r join public.customer_360 c on c.id=r.customer_id left join parts p on p.rfq_id=r.id left join public.rfq_assessments a on a.rfq_id=r.id)
select id,code,project_name,customer_name,stage,due_date,part_count,coalesce(saved_score,computed_score) score,
coalesce(saved_grade,case when computed_score>=80 then 'A' when computed_score>=65 then 'B' when computed_score>=50 then 'C' else 'D' end) value_grade,
coalesce(manual_win_probability,coalesce(saved_score,computed_score)) win_probability,status,created_at from calc;

create or replace view public.project_overview with(security_invoker=true) as
select p.id,p.project_name,c.name customer_name,p.current_stage,n.stage next_stage,n.planned_date next_due_date,
case when n.planned_date<current_date then 'delayed' when n.planned_date<=current_date+14 then 'due_soon' else 'on_track' end delay_status,
p.risk_level,p.commercial_value,rp.value_grade rfq_grade
from public.projects p join public.rfqs r on r.id=p.rfq_id join public.customers c on c.id=r.customer_id left join public.rfq_pipeline rp on rp.id=r.id
left join lateral(select m.stage,m.planned_date from public.project_milestones m where m.project_id=p.id and m.actual_date is null order by m.sequence limit 1)n on true;

create or replace view public.production_overview with(security_invoker=true) as
select pr.id,p.project_name,c.name customer_name,rp.part_number,to_char(pr.period,'YYYY-MM') period,
pr.forecast_quantity*pr.forecast_unit_price forecast_sales,coalesce(rr.actual_revenue,0) actual_revenue,coalesce(rr.actual_profit,0) actual_profit,
pr.delivery_status,pr.quality_status,pr.ppm from public.production_records pr join public.projects p on p.id=pr.project_id join public.rfqs r on r.id=p.rfq_id join public.customers c on c.id=r.customer_id join public.rfq_parts rp on rp.id=pr.rfq_part_id left join public.revenue_records rr on rr.production_record_id=pr.id;

create or replace view public.knowledge_library with(security_invoker=true) as
select k.id,k.title,k.category,k.summary,k.visibility,c.name customer_name,p.project_name,k.tags,k.updated_at,
to_tsvector('simple',concat_ws(' ',k.title,k.summary,k.background,k.action_taken,k.result,k.recommendation,array_to_string(k.tags,' '),c.name,p.project_name)) searchable_text
from public.knowledge_entries k left join public.customers c on c.id=k.customer_id left join public.projects p on p.id=k.project_id;

create or replace view public.dashboard_summary with(security_invoker=true) as
select (select count(*) from public.rfqs where status='active')::int active_rfqs,(select count(*) from public.projects where status='active')::int active_projects,
coalesce((select sum(actual_revenue)from public.revenue_records where extract(year from period)=extract(year from current_date)),0)::numeric annual_revenue,
coalesce((select sum(actual_profit)from public.revenue_records where extract(year from period)=extract(year from current_date)),0)::numeric annual_profit,
(select count(*)from public.customers where risk_level='high')::int high_risk_customers,
(select count(*)from public.project_overview where delay_status='delayed')::int delayed_projects;

create or replace function public.match_knowledge(query_embedding extensions.vector(1536),match_count int default 8,include_restricted boolean default false)
returns table(id uuid,title text,category public.knowledge_category,summary text,similarity float) language sql stable security invoker set search_path=public,extensions as $$
select k.id,k.title,k.category,k.summary,1-(e.embedding<=>query_embedding) similarity from public.knowledge_embeddings e join public.knowledge_entries k on k.id=e.knowledge_entry_id
where(include_restricted or k.visibility='internal') order by e.embedding<=>query_embedding limit greatest(1,least(match_count,20))$$;

create or replace function public.get_business_snapshot() returns jsonb language sql stable security invoker set search_path=public as $$
select jsonb_build_object('summary',(select to_jsonb(x)from public.dashboard_summary x),'high_risk_projects',(select coalesce(jsonb_agg(to_jsonb(x)),'[]')from(select *from public.project_overview where risk_level='high' or delay_status<>'on_track' limit 10)x),'top_customers',(select coalesce(jsonb_agg(to_jsonb(x)),'[]')from(select *from public.customer_360 order by value_score desc limit 10)x))$$;

grant select on public.customer_360,public.rfq_pipeline,public.project_overview,public.production_overview,public.knowledge_library,public.dashboard_summary to authenticated;
grant execute on function public.match_knowledge(extensions.vector,int,boolean),public.get_business_snapshot() to authenticated;
