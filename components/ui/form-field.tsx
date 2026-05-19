import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id?: string;
  label: React.ReactNode;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ id, label, required, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && " *"}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
