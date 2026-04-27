export function BuilderSkeleton() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-8 space-y-3">
                <div className="h-5 w-40 rounded-full bg-muted" />
                <div className="h-9 w-80 rounded-full bg-muted" />
                <div className="h-4 w-full max-w-3xl rounded-full bg-muted" />
            </div>
            <div className="grid gap-6 xl:grid-cols-[1fr_3fr_1fr]">

                <div className="space-y-6">
                    <div className="h-[520px] rounded-xl border border-border bg-muted/20" />
                    <div className="h-[520px] rounded-xl border border-border bg-muted/20" />
                </div>
                <div className="space-y-6">
                    <div className="h-[420px] rounded-xl border border-border bg-muted/20" />
                    <div className="h-[420px] rounded-xl border border-border bg-muted/20" />
                </div>
            </div>
        </div>
    );
}
