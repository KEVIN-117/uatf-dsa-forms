import { Skeleton } from "../ui/skeleton";

export function DynamicReportPageSkeleton() {
	return (
		<div className="container max-w-3xl mx-auto py-10 animate-fade-up">
			<div className="mb-8 space-y-3">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-10 w-72" />
			</div>

			<div className="rounded-2xl border border-border/40 bg-card/80 p-6 shadow-sm glass-card overflow-hidden relative">
				{/* Decorative blob */}
				<div className="gradient-blob -top-16 -right-16 w-40 h-40 bg-primary/3" />

				<div className="relative space-y-3">
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
				</div>

				<div className="relative mt-8 space-y-6">
					<Skeleton className="h-10 w-full rounded-lg" />
					<Skeleton className="h-10 w-full rounded-lg" />
					<Skeleton className="h-10 w-full rounded-lg" />
					<Skeleton className="h-11 w-full rounded-lg" />
				</div>
			</div>
		</div>
	);
}
