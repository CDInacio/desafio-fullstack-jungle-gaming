import CenteredContainer from "@/components/centered-container";

export function LoadingState({
  message = "Carregando...",
}: {
  message?: string;
}) {
  return (
    <CenteredContainer>
      <div className="flex items-center justify-center h-64">
        <p className="text-zinc-400">{message}</p>
      </div>
    </CenteredContainer>
  );
}
