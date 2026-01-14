import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormError } from './FormError';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
    description?: string;
}

export function FormField({ name, label, description, ...props }: FormFieldProps) {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-sm font-semibold text-foreground">
                {label}
                {props.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
            <Input
                id={name}
                {...register(name)}
                {...props}
                className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {error && <FormError message={error} />}
        </div>
    );
}
