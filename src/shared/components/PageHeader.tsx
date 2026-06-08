import type { LucideIcon } from "lucide-react";
import { Button } from "#/shared/ui/button";

interface PageHeaderProps {
	title: string;
	description?: string;
	icon?: LucideIcon;
	action?: {
		label: string;
		icon?: LucideIcon;
		onClick: () => void;
	};
	children?: React.ReactNode;
}

export function PageHeader({
	title,
	description,
	icon: Icon,
	action,
	children,
}: PageHeaderProps) {
	const ActionIcon = action?.icon;

	return (
		<div className="animate-fade-up relative overflow-hidden rounded-2xl border border-border/40 p-6 md:p-8 bg-linear-to-br from-primary/8 via-card to-secondary/5 glass-card">
			<div className="gradient-blob -top-20 -right-20 w-48 h-48 bg-primary/5" />
			<div className="gradient-blob -bottom-16 -left-16 w-40 h-40 bg-secondary/8" />

			<div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex items-start gap-4">
					{Icon && (
						<div className="hidden md:flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
							<Icon className="w-6 h-6 text-primary" />
						</div>
					)}
					<div>
						<h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
							{title}
						</h1>
						{description && (
							<p className="text-sm text-muted-foreground mt-1 max-w-lg">
								{description}
							</p>
						)}
					</div>
				</div>

				{action && (
					<Button
						onClick={action.onClick}
						className="gap-2 shrink-0 self-start sm:self-center"
					>
						{ActionIcon && <ActionIcon className="h-4 w-4" />}
						{action.label}
					</Button>
				)}
				{children}
			</div>
		</div>
	);
}
