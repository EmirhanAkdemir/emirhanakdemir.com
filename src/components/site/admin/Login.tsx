import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { LockKeyhole, ArrowRight, ArrowUpLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { checkAdmin } from "@/lib/cms/admin.functions";
import { getDict } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Field, Message } from "./shared";
export function Login() {
  const t = getDict("tr").admin;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const check = useServerFn(checkAdmin);
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(async (r) => {
      if (r.data.user) {
        try {
          await check();
          if (active) await navigate({ to: "/admin", replace: true });
        } catch {
          if (active) setMessage(t.denied);
        }
      }
    });
    return () => {
      active = false;
    };
  }, [check, navigate, t.denied]);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const r = await supabase.auth.signInWithPassword({ email, password });
      if (r.error) throw new Error("login");
      await check();
      await navigate({ to: "/admin", replace: true });
    } catch (error) {
      setMessage(
        error instanceof Error && error.message.includes("CMS_ACCESS_DENIED") ? t.denied : t.error,
      );
      await supabase.auth.signOut();
    } finally {
      setBusy(false);
      setPassword("");
    }
  }
  return (
    <main className="flex min-h-screen flex-col px-6 py-8">
      <Link to="/" className="flex w-fit items-center gap-2 text-sm text-muted-foreground">
        <ArrowUpLeft className="size-4" />
        {t.website}
      </Link>
      <section className="m-auto w-full max-w-md py-16">
        <div className="mb-10 border-b border-border pb-8">
          <LockKeyhole className="mb-6 size-8 text-primary" />
          <p className="mb-3 font-mono text-xs text-primary">EMIRHAN AKDEMIR / CMS</p>
          <h1 className="text-3xl">{t.login}</h1>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <Field label={t.email} value={email} onChange={setEmail} type="email" required />
          <Field
            label={t.password}
            value={password}
            onChange={setPassword}
            type="password"
            required
          />
          <Message text={message} />
          <Button className="w-full" disabled={busy} type="submit">
            {busy ? t.loading : t.signIn}
            <ArrowRight />
          </Button>
        </form>
      </section>
    </main>
  );
}
