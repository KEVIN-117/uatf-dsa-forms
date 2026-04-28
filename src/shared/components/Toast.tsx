import { toast } from "sonner"

const toastStyles = {
    success: {
        backgroundColor: "#22c55e",
        color: "#ffffff",
        border: "1px solid #16a34a",
    }, // Verde
    error: {
        backgroundColor: "#ef4444",
        color: "#ffffff",
        border: "1px solid #dc2626",
    }, // Rojo
    warning: {
        backgroundColor: "#eab308",
        color: "#ffffff",
        border: "1px solid #ca8a04",
    }, // Amarillo
};


interface ToastProps {
    title?: string;
    description?: string;
    message: string;
    type: "success" | "error" | "warning";
    duration?: number;
    closeButton?: boolean;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    style?: React.CSSProperties;
    className?: string;
}

export function useToast({ message, type, title, description, duration, closeButton, position, style, className }: ToastProps) {
    return (
        toast[type](title ?? "", {
            description: description ?? message,
            duration,
            closeButton,
            position,
            style: { ...toastStyles[type], ...style },
            className,
        })
    );
}


export function useToastPromise<T>({
    promise,
    pendingText,
    successText,
    errorText,
    position = 'top-right',
    duration = 5000,
}: {
    promise: Promise<T> | (() => Promise<T>);
    pendingText: string;
    successText: string;
    errorText: string;
    duration?: number;
    closeButton?: boolean;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}) {
    return (
        toast.promise<T>(promise, {
            loading: `Procesando... ${pendingText}`,
            success: (data: T) => `${successText} ${String(data)}`,
            error: (err: Error) => `Error: ${errorText} ${err?.message}`,
            position: position,
            duration: duration,
        })
    )
}