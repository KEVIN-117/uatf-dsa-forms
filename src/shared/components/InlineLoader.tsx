interface InlineLoaderProps {
  text?: string;
}

export function InlineLoader({ text = "Cargando..." }: InlineLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 animate-fade-up">
      <div className="relative flex items-center justify-center w-10 h-10">
        <div
          className="absolute inset-0 rounded-full border-[2.5px] border-primary/10"
          style={{
            borderTopColor: 'var(--primary)',
            animation: 'loader-spin-slow 1.5s linear infinite',
          }}
        />
        <div
          className="absolute inset-1.5 rounded-full border-2 border-secondary/10"
          style={{
            borderBottomColor: 'var(--secondary)',
            animation: 'loader-spin-reverse 1.2s linear infinite',
          }}
        />
      </div>
      <p className="text-xs font-medium text-muted-foreground">{text}</p>
    </div>
  );
}
