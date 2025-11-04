import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-lg bg-blue-600 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <p className="text-zinc-400 text-sm">Carregando...</p>
      </div>
    </div>
  );
}
