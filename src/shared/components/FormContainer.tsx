import { FileText } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/shared/ui/card";

interface FormContainerProps {
	title: string;
	description: string;
	children: React.ReactNode;
}

export function FormContainer({
	title,
	description,
	children,
}: FormContainerProps) {
	return (
		<div className="flex items-center justify-center min-h-full px-4 py-8 sm:px-6 lg:px-8 bg-background">
			<Card className="w-full max-w-7xl glass-card shadow-lg border-border/40 overflow-hidden relative animate-fade-up">
				{/* Decorative gradient */}
				<div className="gradient-blob -top-24 -right-24 w-56 h-56 bg-primary/5" />
				<div className="gradient-blob -bottom-20 -left-20 w-44 h-44 bg-secondary/5" />

				<CardHeader className="relative space-y-3 px-6 sm:px-8 pt-8 pb-4">
					<div className="flex items-center justify-center">
						<div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 animate-scale-bounce">
							<FileText className="w-6 h-6 text-primary" />
						</div>
					</div>
					<CardTitle className="text-2xl sm:text-3xl text-center font-display text-primary">
						{title}
					</CardTitle>
					<CardDescription className="text-center font-body text-muted-foreground max-w-lg mx-auto leading-relaxed">
						{description}
					</CardDescription>

					{/* Decorative separator */}
					<div className="flex items-center gap-3 pt-2">
						<div className="flex-1 h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />
						<div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
						<div className="flex-1 h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />
					</div>
				</CardHeader>

				<CardContent className="relative px-6 sm:px-8 pb-8">
					{children}
				</CardContent>
			</Card>
		</div>
	);
}
