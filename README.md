# Allen Automotive Business OS

面向汽车零部件制造出口企业的内部经营系统，覆盖 Customer → RFQ → Project → SOP → Production → Revenue → Knowledge。它不包含 CRM 线索、拜访或客户开发流程。

## 技术栈

- React + TypeScript + Vite
- Tailwind CSS + Shadcn UI conventions
- Supabase Auth、PostgreSQL、Storage、Edge Functions
- PostgreSQL pgvector + OpenAI Responses API

## 本地启动

1. 安装依赖：`npm install`
2. 复制 `.env.example` 为 `.env.local`，填写 Supabase URL 与 anon key。
3. 使用 Supabase CLI 执行迁移：`npx supabase db push`
4. 为 Edge Functions 配置 `SUPABASE_SERVICE_ROLE_KEY`、`OPENAI_API_KEY`、`OPENAI_MODEL` 和 `OPENAI_EMBEDDING_MODEL`。
5. 启动前端：`npm run dev`

Windows 也可以直接双击 `start-allen.cmd` 启动；不要直接双击 `europa-flow/index.html`。

开发地址为 `/europa-flow/`。根目录旧 Workbuddy 页面没有被本次重构覆盖。

## 后端部署

```powershell
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
npx supabase functions deploy import-legacy-data
npx supabase functions deploy index-knowledge
npx supabase functions deploy ai-query
```

创建唯一内部账号后，即可通过 Dashboard 的“旧版数据迁移”导入 Europa Flow V2 或 Workbuddy JSON。OpenAI Key 只能配置为 Supabase Function secret，不能使用 `VITE_` 前缀。

## 验证

- `npm run typecheck`
- `npm test`
- `npm run build`

数据库 schema 位于 `supabase/migrations`，前端模块位于 `src/modules`。
