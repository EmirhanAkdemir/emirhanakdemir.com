import { useState } from "react";
import { KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Field, Message, useAdmin } from "./shared";
export function Settings() {
  const { t } = useAdmin();
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <>
      <h1 className="mb-10 text-3xl">{t.settings}</h1>
      <section className="max-w-lg border-t border-border pt-7">
        <h2 className="mb-6 text-xl">{t.security}</h2>
        <form
          className="space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            if (password.length < 8) {
              setMessage(t.passwordRule);
              return;
            }
            setBusy(true);
            const r = await supabase.auth.updateUser({ password, current_password: current });
            setMessage(r.error ? t.error : t.passwordChanged);
            if (!r.error) {
              setPassword("");
              setCurrent("");
            }
            setBusy(false);
          }}
        >
          <Field
            label={t.currentPassword}
            type="password"
            value={current}
            onChange={setCurrent}
            required
          />
          <Field
            label={t.newPassword}
            type="password"
            value={password}
            onChange={setPassword}
            required
          />
          <Message text={message} />
          <Button disabled={busy} type="submit">
            <KeyRound />
            {t.changePassword}
          </Button>
        </form>
      </section>
    </>
  );
}
