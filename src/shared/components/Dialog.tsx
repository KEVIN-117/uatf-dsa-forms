import { AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

type Props = {
    message: string;
    description: string;
    actionLabel: string;
    cancelLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AlertDialogCustom({
    message,
    description,
    actionLabel,
    cancelLabel,
    onConfirm,
    onCancel,
    open,
    onOpenChange
}: Props) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="glass-card border-border/40 shadow-xl">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 shrink-0">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <AlertDialogTitle className="text-lg">{message}</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="pl-13">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3">
                    <AlertDialogCancel onClick={onCancel} className="hover:bg-muted/80 transition-colors">{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-primary hover:bg-primary/90 hover-lift">
                        {actionLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}