import CenteredContainer from "@/components/centered-container";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function NotFoundState({
  message = "Item não encontrado",
}: {
  message?: string;
}) {
  return (
    <CenteredContainer>
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-12 w-12 text-zinc-500 mb-4" />
          <p className="text-zinc-400">{message}</p>
        </CardContent>
      </Card>
    </CenteredContainer>
  );
}
