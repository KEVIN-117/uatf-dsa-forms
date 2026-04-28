import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "#/shared/ui/sheet"

interface EntityFormSheetProps {
    title: string
    description?: string
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}

export function EntityFormSheet({
    title,
    description,
    open,
    onOpenChange,
    children,
}: EntityFormSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-xl font-display">{title}</SheetTitle>
                    {description && (
                        <SheetDescription>{description}</SheetDescription>
                    )}
                </SheetHeader>
                <div className="p-6 space-y-4">
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    )
}
