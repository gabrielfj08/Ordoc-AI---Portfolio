import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
    message: string;
}

export function FormError({ message }: FormErrorProps) {
    return (
        <div className="flex items-center gap-1.5 text-destructive">
            <AlertCircle size={14} />
            <span className="text-xs font-medium">{message}</span>
        </div>
    );
}
