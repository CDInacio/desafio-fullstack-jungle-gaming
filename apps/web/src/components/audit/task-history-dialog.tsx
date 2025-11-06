// import { useState } from "react";
// import { History, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useTaskHistory } from "@/hooks/use-audit.hook";
// import { AuditLogEntry } from "./audit-log-entry";

// interface TaskHistoryDialogProps {
//   taskId: string;
//   taskTitle: string;
// }

// export function TaskHistoryDialog({
//   taskId,
//   taskTitle,
// }: TaskHistoryDialogProps) {
//   const [open, setOpen] = useState(false);
//   const { data, isLoading, error } = useTaskHistory(taskId, open);

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline" size="sm">
//           <History className="h-4 w-4 mr-2" />
//           Histórico
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-2xl max-h-[80vh]">
//         <DialogHeader>
//           <DialogTitle>Histórico de Alterações</DialogTitle>
//           <DialogDescription>{taskTitle}</DialogDescription>
//         </DialogHeader>

//         <ScrollArea className="h-[500px] pr-4">
//           {isLoading && (
//             <div className="flex items-center justify-center py-8">
//               <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//             </div>
//           )}

//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>
//                 Erro ao carregar histórico. Tente novamente.
//               </AlertDescription>
//             </Alert>
//           )}

//           {data && data.data.length === 0 && (
//             <div className="text-center py-8 text-muted-foreground">
//               <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
//               <p>Nenhum histórico encontrado</p>
//             </div>
//           )}

//           {data && data.data.length > 0 && (
//             <div className="space-y-1">
//               {data.data.map((log, index) => (
//                 <AuditLogEntry
//                   key={log.id}
//                   log={log}
//                   isLast={index === data.data.length - 1}
//                 />
//               ))}
//             </div>
//           )}
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// }
