import * as React from 'react';
import { Label as UILabel } from '@/components/ui/label';

interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof UILabel> {
    required?: boolean;
}

export function FormLabel({ children, required, ...props }: FormLabelProps) {
    return (
        <UILabel {...props} className="text-sm font-semibold text-foreground">
            {children}
            {required && <span className="text-destructive ml-1">*</span>}
        </UILabel>
    );
}
