import { AlertTriangle } from "lucide-react";

export function DynamicReportPageState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="container max-w-3xl mx-auto py-10 animate-fade-up">
            <div className="rounded-2xl border border-destructive/20 bg-card/80 p-6 shadow-sm glass-card overflow-hidden relative">
                {/* Decorative blob */}
                <div className="gradient-blob -top-16 -right-16 w-40 h-40 bg-destructive/5" />

                <div className="relative flex items-start gap-4">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-destructive/10 shrink-0">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-foreground">{title}</h1>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
