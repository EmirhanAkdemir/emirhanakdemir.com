import type { Dict } from "@/i18n/tr";
import { SectionHead } from "./SectionHead";
import { InquiryForm } from "./InquiryForm";
export function Contact({ t }: { t: Dict }) {
  const c = t.contact;
  return (
    <section id="contact" className="py-24 md:py-36">
      <div className="container-grid gap-y-12">
        <SectionHead index="05" label={c.label} title={c.title} />
        <div className="col-span-12 md:col-span-3">
          <p className="label-mono text-muted-foreground">{c.direct}</p>
          <p className="mt-3 text-primary">{c.emailPlaceholder}</p>
        </div>
        <div className="col-span-12 md:col-span-8 md:col-start-5">
          <InquiryForm
            submit={c.send}
            demo={c.demo}
            fields={[
              { id: "name", label: c.name },
              { id: "email", label: c.email, type: "email" },
              { id: "company", label: c.company },
              { id: "service", label: c.service },
              { id: "budget", label: c.budget, full: true },
              { id: "message", label: c.message, textarea: true },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
