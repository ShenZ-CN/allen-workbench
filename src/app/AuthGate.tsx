import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

function isInviteCallback() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const search = new URLSearchParams(window.location.search);
  return hash.get("type") === "invite" || search.get("type") === "invite";
}

function ConfigurationRequired() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-6">
      <Card className="max-w-xl p-7">
        <p className="eyebrow">Allen Automotive Business OS</p>
        <h1 className="mt-2 text-2xl font-semibold">等待连接 Supabase</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          React 架构已经启动，但业务数据必须来自 PostgreSQL。复制 <code>.env.example</code> 为
          <code> .env.local</code>，填写 <code>VITE_SUPABASE_URL</code> 和
          <code> VITE_SUPABASE_ANON_KEY</code> 后重新启动。
        </p>
        <div className="mt-4 rounded-md bg-slate-950 p-4 font-mono text-xs text-slate-200">
          supabase db push<br />npm run dev
        </div>
      </Card>
    </main>
  );
}

function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-nav p-6">
      <Card className="w-full max-w-md p-7">{children}</Card>
    </main>
  );
}

export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [inviteMode, setInviteMode] = useState(() => isInviteCallback());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data, error }) => {
      setSession(data.session);
      if (error) setMessage(error.message);
    });

    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      if (event === "PASSWORD_RECOVERY") setInviteMode(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) return <ConfigurationRequired />;
  if (session === undefined) {
    return <div className="grid min-h-screen place-items-center text-sm text-slate-500">正在验证内部账号…</div>;
  }

  async function submitPassword(event: FormEvent) {
    event.preventDefault();
    if (password.length < 8) {
      setMessage("密码至少需要 8 个字符。");
      return;
    }
    if (password !== passwordConfirm) {
      setMessage("两次输入的密码不一致。");
      return;
    }

    setBusy(true);
    setMessage("正在设置密码…");
    const { error } = await supabase!.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }

    window.history.replaceState({}, document.title, window.location.pathname);
    setInviteMode(false);
    setMessage("");
  }

  async function submitLogin(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("正在登录…");
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    setBusy(false);
    setMessage(error ? error.message : "");
  }

  if (inviteMode) {
    if (!session) {
      return (
        <AuthShell>
          <p className="eyebrow">Invitation</p>
          <h1 className="mt-2 text-2xl font-semibold">邀请链接无法验证</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            链接可能已过期或已经使用。请返回 Supabase 重新发送邀请。
          </p>
          {message && <p className="mt-4 text-xs text-rose-600">{message}</p>}
        </AuthShell>
      );
    }

    return (
      <AuthShell>
        <p className="eyebrow">First-time access</p>
        <h1 className="mt-2 text-2xl font-semibold">设置初始密码</h1>
        <p className="mt-2 text-sm text-slate-500">完成后即可进入 Allen Automotive Business OS。</p>
        <form className="mt-6 space-y-4" onSubmit={submitPassword}>
          <label className="block text-xs font-semibold text-slate-600">
            新密码
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            确认密码
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              type="password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              minLength={8}
              required
            />
          </label>
          {message && <p className="text-xs text-rose-600">{message}</p>}
          <Button className="w-full" type="submit" disabled={busy}>设置密码并进入系统</Button>
        </form>
      </AuthShell>
    );
  }

  if (session) return children;

  return (
    <AuthShell>
      <p className="eyebrow">Internal access</p>
      <h1 className="mt-2 text-2xl font-semibold">Allen Automotive Business OS</h1>
      <p className="mt-2 text-sm text-slate-500">汽车零部件经营系统 · 授权账号登录</p>
      <form className="mt-6 space-y-4" onSubmit={submitLogin}>
        <label className="block text-xs font-semibold text-slate-600">
          邮箱
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="block text-xs font-semibold text-slate-600">
          密码
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {message && <p className="text-xs text-rose-600">{message}</p>}
        <Button className="w-full" type="submit" disabled={busy}>登录系统</Button>
      </form>
    </AuthShell>
  );
}
