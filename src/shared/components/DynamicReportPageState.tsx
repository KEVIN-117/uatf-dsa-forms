export function DynamicReportPageState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="container max-w-3xl mx-auto py-10">
            <div className="rounded-lg border border-destructive/20 bg-card p-6 shadow-sm">
                <h1 className="text-2xl font-display font-bold text-primary">{title}</h1>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
