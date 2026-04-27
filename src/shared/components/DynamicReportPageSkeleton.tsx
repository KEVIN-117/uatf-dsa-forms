import { Skeleton } from "../ui/skeleton";

export function DynamicReportPageSkeleton() {
    return (
        <div className="container max-w-3xl mx-auto py-10">
            <div className="mb-8 space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-72" />
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <div className="space-y-3">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>

                <div className="mt-8 space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-11 w-full" />
                </div>
            </div>
        </div>
    );
}
