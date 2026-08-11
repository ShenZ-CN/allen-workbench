import { useState, type FormEvent } from "react";
import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { askAllen } from "@/modules/ai/api/ai-api";

type Source = { id: string; title: string; category: string };

export function AiPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError("");
    try {
      const result = await askAllen(question);
      setAnswer(result.answer);
      setSources(result.sources ?? []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "AI 服务暂不可用");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
      <Card>
        <CardHeader title="只读经营分析" subtitle="AI 不会修改客户、报价、项目或财务记录" />
        <div className="rounded-md border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-blue-800">
          可询问客户风险、RFQ 商业价值、项目延期原因、量产经营和历史经验。回答只基于当前账号可访问的数据。
        </div>
        <form className="mt-4" onSubmit={submit}>
          <textarea className="min-h-36 w-full rounded-md border p-3 text-sm" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="例如：ZF 当前高风险项目有哪些？结合历史知识给出行动建议。" />
          <Button className="mt-3" disabled={loading}><Send size={15} />{loading ? "分析中…" : "询问 Allen"}</Button>
        </form>
      </Card>
      <Card>
        <CardHeader title="分析结果" action={<Bot className="text-primary" />} />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        {answer ? (
          <>
            <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{answer}</div>
            {sources.length > 0 && <div className="mt-5 border-t pt-4"><b className="text-xs uppercase text-slate-500">知识来源</b>{sources.map((source) => <div key={source.id} className="mt-2 text-sm">{source.title} <span className="text-xs text-slate-400">· {source.category}</span></div>)}</div>}
          </>
        ) : <div className="py-16 text-center text-sm text-slate-400">等待经营问题</div>}
      </Card>
    </div>
  );
}
