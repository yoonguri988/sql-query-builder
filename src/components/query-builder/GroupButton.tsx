import { Button } from "@/components/ui/button";
import { memo } from "react";

interface Props {
  name: string;
  variant?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  onClick: () => void;
}

export default function GroupButton({
  name,
  variant = "outline",
  onClick,
}: Props) {
  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      onClick={onClick}
      className={`h-8 text-xs ${variant === "ghost" ? "text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950" : ""}`}
    >
      {name}
    </Button>
  );
}
