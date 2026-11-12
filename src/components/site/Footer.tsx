import type { Dict } from "@/i18n/tr";
export function Footer({ t }: { t: Dict }) {
  return (
    <footer className="border-t border-border py-10">
      <div className="container-grid gap-y-4">
        <p className="label-mono col-span-12 text-muted-foreground md:col-span-4">© 2026 Emirhan Akdemir. {t.footer.rights}</p>
        <p className="label-mono col-span-12 text-muted-foreground md:col-span-5">[{t.footer.social}]</p>
        <a href="#top" className="label-mono col-span-12 text-foreground hover:text-primary md:col-span-3 md:text-right">
          {t.footer.top} ↑
        </a>
      </div>
    </footer>
  );
}
