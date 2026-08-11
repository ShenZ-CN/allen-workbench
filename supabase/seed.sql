insert into public.customers(code,name,country,tier,customer_grade,risk_level,strategic_value,main_products,plants,contacts)
values
('ZF','ZF Friedrichshafen AG','Germany','Tier 1','A','low','strategic',array['TRB Cage','DGBB Cage'],'["Friedrichshafen"]','[]'),
('SCHAEFFLER','Schaeffler AG','Germany','Tier 1','A','low','core',array['DGBB Cage','CRB Cage'],'["Herzogenaurach"]','[]')
on conflict(code)do nothing;
