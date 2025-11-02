import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export function TaskCommentsCard() {
  return (
    <Card className="bg-primary border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Comentários</CardTitle>
        <CardDescription className="text-zinc-400">
          Discussões sobre esta tarefa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-400 text-center py-12">
          Nenhum comentário ainda. Seja o primeiro a comentar!
        </p>
      </CardContent>
    </Card>
  );
}
