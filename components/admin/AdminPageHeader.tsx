import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  total?: number;
  countLabel?: string;
  newHref?: string;
  newLabel?: string;
}

export function AdminPageHeader({ title, total, countLabel, newHref, newLabel }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {total !== undefined && (
          <p className="text-muted-foreground">
            {total} {countLabel ?? "total"}
          </p>
        )}
      </div>
      {newHref && (
        <Button asChild>
          <Link href={newHref}>
            <Plus className="mr-2 h-4 w-4" />
            {newLabel ?? "New"}
          </Link>
        </Button>
      )}
    </div>
  );
}
