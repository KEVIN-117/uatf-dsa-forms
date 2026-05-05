import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "#/shared/ui/sheet"

interface EntityFormSheetProps {
    title: string
    description?: string
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
    side?: "left" | "right" | "top" | "bottom"
    className?: string
}

export function EntityFormSheet({
    title,
    description,
    open,
    onOpenChange,
    children,
    side = "right",
    className = ''
}: EntityFormSheetProps) {

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className={`${className} overflow-y-auto glass-card border-l-border/40 data-[side=bottom]:max-h-[50vh] data-[side=bottom]:max-w-[50vw] data-[side=top]:max-h-[50vh] `} side={side}>
                <SheetHeader className="border-b border-border/30 pb-4">
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
