import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
// Eliminado: AlertDialogTrigger

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
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{message}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3">
                    <AlertDialogCancel onClick={onCancel}>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-primary hover:bg-primary/90">
                        {actionLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}