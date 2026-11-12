import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

export type Field = { id: string; label: string; type?: string; textarea?: boolean; full?: boolean };

export function InquiryForm({ fields, submit, demo }: { fields: Field[]; submit: string; demo: string }) {
  const [sent, setSent] = useState(false);
  return (
    <form
      className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      {fields.map((f) => (
        <Row key={f.id} full={Boolean(f.full || f.textarea)}>
          <label htmlFor={f.id} className="label-mono text-muted-foreground">{f.label}</label>
          {f.textarea ? (
            <textarea id={f.id} rows={4} className="mt-2 w-full resize-none border-b border-input bg-transparent py-2 text-lg outline-none transition-colors focus:border-primary" />
          ) : (
            <input id={f.id} type={f.type ?? "text"} className="mt-2 w-full border-b border-input bg-transparent py-2 text-lg outline-none transition-colors focus:border-primary" />
          )}
        </Row>
      ))}
      <div className="flex flex-wrap items-center gap-6 md:col-span-2">
        <Button type="submit" size="lg" className="rounded-none px-8">{submit} →</Button>
        <p className="label-mono text-muted-foreground" aria-live="polite">{sent ? `✓ ${demo}` : demo}</p>
      </div>
    </form>
  );
}
function Row({ children, full }: { children: ReactNode; full?: boolean }) {
  return <div className={full ? "md:col-span-2" : ""}>{children}</div>;
}
