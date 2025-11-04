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
      <Card className="bg-primary border-zinc-800">
        <CardContent className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-16 h-16 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-zinc-400">{message}</p>
        </CardContent>
      </Card>
    </CenteredContainer>
  );
}
