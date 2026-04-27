import { Card, CardDescription, CardHeader, CardTitle } from "#/shared/ui/card";

export function StatePanel({ title, description }: { title: string; description: string }) {
    return (
        <div className="container mx-auto max-w-3xl py-10">
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}