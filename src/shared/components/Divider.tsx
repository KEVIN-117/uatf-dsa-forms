export function Divider({ className }: { className?: string }) {
    return (
        <div className={`max-w-7xl mx-auto px-6 py-6 ${className}`}>
            <div className="h-[4px] bg-linear-to-r from-transparent to-transparent via-border" />
        </div>
    )
}