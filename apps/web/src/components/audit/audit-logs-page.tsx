import { useState } from "react";
import { History, Loader2, Search } from "lucide-react";
import { useAllAuditLogs } from "@/hooks/use-audit.hook";
import { AuditLogEntry } from "./audit-log-entry";
import { AuditFilters } from "./audit-filters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Layout from "../layout";
import CenteredContainer from "../centered-container";
import { AuditStats } from "./audit-stats";

export function AuditLogsPage() {
  const [action, setAction] = useState("all");
  const [entityType, setEntityType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useAllAuditLogs({
    action: action === "all" ? undefined : action,
    entityType: entityType === "all" ? undefined : entityType,
  });

  const filteredLogs =
    data?.data.filter((log) => {
      const matchesSearch =
        searchTerm === "" ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityId.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    }) || [];

  const handleClearFilters = () => {
    setAction("all");
    setEntityType("all");
    setSearchTerm("");
  };

  return (
    <Layout>
      <CenteredContainer>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Histórico de Auditoria
                </h1>
                <p className="text-sm text-zinc-400">
                  Visualize todas as ações realizadas no sistema
                </p>
              </div>
            </div>
          </div>

          {data && <AuditStats logs={data.data} />}

          <div className="space-y-3">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    placeholder="Buscar por descrição ou ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-zinc-900 border-zinc-800"
                  />
                </div>
              </div>
              <AuditFilters
                action={action}
                entityType={entityType}
                onActionChange={setAction}
                onEntityTypeChange={setEntityType}
                onClear={handleClearFilters}
              />
            </div>

            {data && (
              <div className="text-sm text-zinc-500">
                Mostrando {filteredLogs.length} de {data.data.length}{" "}
                {data.data.length === 1 ? "registro" : "registros"}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 sm:p-6">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  Erro ao carregar histórico. Tente novamente.
                </AlertDescription>
              </Alert>
            )}

            {data && filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <History className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
                <p className="text-zinc-500">
                  {searchTerm || action !== "all" || entityType !== "all"
                    ? "Nenhum registro encontrado com os filtros aplicados"
                    : "Nenhum histórico encontrado"}
                </p>
              </div>
            )}

            {data && filteredLogs.length > 0 && (
              <ScrollArea className="max-h-[60vh] sm:h-[600px] pr-4">
                <div className="space-y-1">
                  {filteredLogs.map((log, index) => (
                    <AuditLogEntry
                      key={log.id}
                      log={log}
                      isLast={index === filteredLogs.length - 1}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </CenteredContainer>
    </Layout>
  );
}
