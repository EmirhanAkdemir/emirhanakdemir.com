export function SectionHead({ index, label, title }: { index: string; label: string; title: string }) {
  return (
    <div className="col-span-12 grid grid-cols-12 gap-x-5 border-t border-border pt-6 md:gap-x-6">
      <p className="label-mono col-span-6 text-muted-foreground md:col-span-3">
        <span className="text-primary">{index}</span> / {label}
      </p>
      <h2 className="col-span-12 mt-6 text-4xl font-medium leading-[1.02] md:col-span-8 md:mt-0 md:text-6xl">{title}</h2>
    </div>
  );
}
