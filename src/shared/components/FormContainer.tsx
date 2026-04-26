import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/shared/ui/card";

interface FormContainerProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export function FormContainer({ title, description, children }: FormContainerProps) {
    return (
        <div className="flex items-center justify-center min-h-full p-4 bg-background">
            <Card className="w-full max-w-6xl shadow-lg border-border">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl text-center font-display text-primary">
                        {title}
                    </CardTitle>
                    <CardDescription className="text-center font-body text-muted-foreground">
                        {description}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </div>
    )
}
