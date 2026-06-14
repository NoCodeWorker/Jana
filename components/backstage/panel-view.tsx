"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle, DollarSign, FileText, Loader2, Lock, Search, TrendingUp } from "lucide-react";
import { CRMInvoice, Student, Teacher, useMockData } from "@/components/mock-data-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { JanaRole } from "@/lib/jana-auth";
export function PanelView({
  activeSede,
  teachers,
  students,
  activeRole,
}: {
  activeSede: string;
  teachers: Teacher[];
  students: Student[];
  activeRole: JanaRole;
}) {
  const { invoices, eventLogs } = useMockData();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todas" | CRMInvoice["status"]>("todas");
  const [verifactuFilter, setVerifactuFilter] = useState<"todas" | CRMInvoice["verifactuStatus"]>("todas");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Dialog States
  const [selectedInvoice, setSelectedInvoice] = useState<CRMInvoice | null>(null);

  // Simulated external CRM review actions
  const [reviewRequestId, setReviewRequestId] = useState<string | null>(null);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filter teachers for the active Sede
  const sedeTeachers = useMemo(() => {
    return teachers.filter(t => t.sede === activeSede);
  }, [teachers, activeSede]);

  // Compute mock financial metrics
  const totalRevenue = useMemo(() => {
    return invoices
      .filter(inv => inv.sede === activeSede && inv.status === "completado")
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [invoices, activeSede]);

  // Compute teacher estimated payroll (25€ per accumulated teaching hour)
  const estimatedPayroll = useMemo(() => {
    return sedeTeachers.reduce((acc, t) => acc + (t.hours * 25), 0);
  }, [sedeTeachers]);

  const marginPercentage = useMemo(() => {
    if (totalRevenue === 0) return 0;
    return Math.round(((totalRevenue - estimatedPayroll) / totalRevenue) * 100);
  }, [totalRevenue, estimatedPayroll]);

  // Dynamic Last Sync date
  const [lastSyncTime, setLastSyncTime] = useState("");
  useEffect(() => {
    const updateSync = () => {
      const now = new Date();
      const diff = 4 * 60 * 1000; // 4 minutes ago
      const syncDate = new Date(now.getTime() - diff);
      setLastSyncTime(
        syncDate.toISOString().split("T")[0] + " " + syncDate.toTimeString().split(" ")[0].slice(0, 5)
      );
    };
    updateSync();
    const interval = setInterval(updateSync, 60000);
    return () => clearInterval(interval);
  }, []);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      if (inv.sede !== activeSede) return false;
      const matchesSearch =
        inv.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "todas" || inv.status === statusFilter;
      const matchesVerifactu = verifactuFilter === "todas" || inv.verifactuStatus === verifactuFilter;
      return matchesSearch && matchesStatus && matchesVerifactu;
    });
  }, [invoices, activeSede, searchQuery, statusFilter, verifactuFilter]);

  // Paginated invoices
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInvoices, currentPage]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, verifactuFilter]);

  const handleRequestCrmReview = (invId: string) => {
    setReviewRequestId(invId);
    setSyncLogs([
      `[${new Date().toLocaleTimeString("es-ES")}] Solicitud de revisión creada para el registro ${invId} en el CRM de origen.`,
      `[${new Date().toLocaleTimeString("es-ES")}] JANA OS mantiene modo lectura: no modifica facturas, cobros ni estados contables.`,
    ]);

    setTimeout(() => {
      setSyncLogs(prev => [
        `[${new Date().toLocaleTimeString("es-ES")}] Tarea enviada al responsable administrativo para resolverla dentro del CRM existente.`,
        ...prev
      ]);
      setReviewRequestId(null);
    }, 1200);
  };

  const handleDownloadRecord = (invId: string) => {
    setDownloadingId(invId);
    setTimeout(() => {
      setDownloadingId(null);
      const blob = new Blob([
        `Registro CRM importado - ID: ${invId}\nConcepto: ${selectedInvoice?.concept}\nImporte: ${selectedInvoice?.amount}€\nNota: JANA OS no es el sistema de facturación; este archivo es una ficha de auditoría interna.`
      ], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `registro_crm_${invId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 1000);
  };

  if (activeRole === "profesor" || activeRole === "alumno") {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-surface/30">
        <Lock className="size-10 text-muted-foreground mb-3" />
        <h3 className="font-bold text-lg text-foreground">Acceso Restringido</h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">No tienes permisos para visualizar datos económicos importados del CRM externo ni señales operativas de dirección.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-canvas grid gap-6 text-left xl:grid-cols-12">
      {/* METRICS ROW */}
      <div className="xl:col-span-8 space-y-6">
        
        {/* KPI CARDS */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="rounded-lg bg-surface/90 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-foreground-muted">Ingresos Importados del CRM</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold flex items-center gap-1 text-foreground">
                <DollarSign className="size-6 text-success" />
                {totalRevenue}€
              </p>
              <span className="text-[10px] text-success font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="size-3" /> +14.2% mes anterior
              </span>
            </CardContent>
          </Card>

          <Card className="rounded-lg bg-surface/90 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-foreground-muted">Alumnos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{students.length}</p>
              <span className="text-[10px] text-muted-foreground block mt-1.5">Matriculados en {activeSede}</span>
            </CardContent>
          </Card>

          <Card className="rounded-lg bg-surface/90 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-foreground-muted">Margen Operativo Sede</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{marginPercentage}%</p>
              <div className="mt-2 h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    marginPercentage > 50 ? "bg-success" : marginPercentage > 20 ? "bg-warning" : "bg-destructive"
                  )}
                  style={{ width: `${Math.max(0, Math.min(100, marginPercentage))}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground block mt-1">
                Personal: {estimatedPayroll}€ (estimado)
              </span>
            </CardContent>
          </Card>
        </div>

        {/* CRM READ-ONLY DATA STREAM */}
        <Card className="rounded-lg bg-surface/90 border-border">
          <CardHeader className="border-b border-border pb-3 flex flex-wrap justify-between items-center gap-4">
            <div className="text-left">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="size-4 text-jana-primary" />
                Lectura de datos del CRM externo
              </CardTitle>
              <p className="text-[10px] text-muted-foreground mt-0.5">JANA OS no sustituye al CRM: importa, cruza y audita sus datos para dirección.</p>
            </div>
          </CardHeader>
          
          {/* SEARCH AND FILTERS TOOLBAR */}
          <div className="p-3 bg-black/10 border-b border-border flex flex-wrap items-center gap-3">
            <div className="relative min-w-44 flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por concepto o alumno..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface pl-8 pr-3 py-1 text-xs text-foreground placeholder-foreground-muted outline-none focus:border-jana-primary transition h-8"
              />
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Pago:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "todas" | CRMInvoice["status"])}
                className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-foreground outline-none focus:border-jana-primary transition h-8 cursor-pointer"
              >
                <option value="todas">Todos</option>
                <option value="completado">Completado</option>
                <option value="pendiente">Pendiente</option>
                <option value="fallido">Fallido</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Fiscalidad:</span>
              <select
                value={verifactuFilter}
                onChange={(e) => setVerifactuFilter(e.target.value as "todas" | CRMInvoice["verifactuStatus"])}
                className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-foreground outline-none focus:border-jana-primary transition h-8 cursor-pointer"
              >
                <option value="todas">Todos</option>
                <option value="enviado">Enviado</option>
                <option value="registrado">Registrado</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase text-[9px] tracking-wider bg-black/5">
                  <th className="p-3">ID CRM</th>
                  <th className="p-3">Concepto</th>
                  <th className="p-3">Alumno</th>
                  <th className="p-3">Monto</th>
                  <th className="p-3">Estado Pago</th>
                  <th className="p-3">Fiscalidad CRM</th>
                  <th className="p-3">Sincronización</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No se encontraron transacciones con los criterios seleccionados.
                    </td>
                  </tr>
                ) : (
                  paginatedInvoices.map((inv) => (
                    <tr 
                      key={inv.id} 
                      onClick={() => setSelectedInvoice(inv)}
                      className="border-b border-border hover:bg-surface-elevated/40 transition cursor-pointer"
                    >
                      <td className="p-3 font-mono font-semibold text-foreground">{inv.id}</td>
                      <td className="p-3 text-foreground-muted">{inv.concept}</td>
                      <td className="p-3 font-bold">{inv.studentName}</td>
                      <td className="p-3 font-mono font-semibold text-foreground">{inv.amount}€</td>
                      <td className="p-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-medium",
                          inv.status === "completado" 
                            ? "bg-success/15 text-success" 
                            : inv.status === "pendiente" 
                              ? "bg-warning/15 text-warning" 
                              : "bg-destructive/15 text-destructive"
                        )}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-medium",
                          inv.verifactuStatus === "enviado" 
                            ? "bg-info/15 text-info" 
                            : inv.verifactuStatus === "registrado" 
                              ? "bg-warning/15 text-warning" 
                              : "bg-destructive/15 text-destructive"
                        )}>
                          {inv.verifactuStatus}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-muted-foreground">{inv.syncTime}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-border flex items-center justify-between text-xs bg-black/5">
              <span className="text-muted-foreground">
                Página {currentPage} de {totalPages} ({filteredInvoices.length} registros)
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-3 text-xs border-border cursor-pointer"
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-3 text-xs border-border cursor-pointer"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* RIGHT SIDE: EXTERNAL CRM SIGNALS & STAFF LIST */}
      <div className="xl:col-span-4 space-y-6">
        
        {/* SEDE TEACHERS LIST */}
        <Card className="rounded-lg bg-surface/90 border-border">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold text-left">Profesorado en {activeSede}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {sedeTeachers.map((teacher) => (
              <div key={teacher.id} className="p-3 rounded-lg border border-border bg-surface-elevated/40 text-xs flex justify-between items-center text-left">
                <div className="min-w-0 flex-1 pr-2">
                  <span className="font-bold text-foreground block truncate">{teacher.name}</span>
                  <span className="text-muted-foreground block text-[10px] mt-0.5 truncate">{teacher.subjects.join(", ")}</span>
                </div>
                <span className="text-[10px] bg-jana-primary/10 text-jana-primary-accessible px-2 py-0.5 rounded font-bold font-mono shrink-0">
                  {teacher.hours}h acumu.
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CRM SYNC METRICS CARD */}
        <Card className="rounded-lg bg-surface/90 border-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-left">Logs de Sincronización del CRM</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Estado de conexión:</span>
              <span className="text-success font-semibold flex items-center gap-1">
                <CheckCircle className="size-3.5" /> En Línea
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Sincronización automática:</span>
              <span className="text-foreground-muted">Cada 10 minutos</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Último paquete enviado:</span>
              <span className="text-foreground-muted font-mono">{lastSyncTime}</span>
            </div>
            <div className="border-t border-border pt-3 mt-1 text-[10px] text-muted-foreground leading-normal flex items-start gap-2">
              <AlertTriangle className="size-3.5 text-warning flex-shrink-0 mt-0.5" />
              <span>
                Fiscalidad en modo Lectura/Auditoría. Las transacciones y sus estados legales se mantienen en el CRM de origen.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* EVENT BUS (REDIS STREAMS) MONITOR */}
        <Card className="rounded-lg bg-surface/90 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-left flex items-center justify-between">
              Monitor del Event Bus (Redis)
              <span className="animate-pulse size-2 rounded-full bg-success" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-3 text-left">
            <p className="text-[10px] text-muted-foreground">Flujo asíncrono de señales operativas en tiempo real.</p>
            <div className="h-44 overflow-y-auto rounded-lg border border-border bg-black/25 p-2 font-mono text-[9px] leading-relaxed space-y-2">
              {eventLogs.map((log) => (
                <div key={log.id} className="border-b border-border/5 pb-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[8px] text-muted-foreground">{log.timestamp}</span>
                    <span className={cn(
                      "px-1 rounded text-[7px] font-bold uppercase",
                      log.status === "completed" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                    )}>
                      {log.status}
                    </span>
                  </div>
                  <div className="font-semibold text-brain mt-0.5">{log.type}</div>
                  <div className="text-foreground-muted truncate mt-0.5">{log.payload}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MODAL: CRM RECORD DETAILS & REVIEW ACTIONS */}
      <Dialog open={Boolean(selectedInvoice)} onOpenChange={(open) => { if (!open) { setSelectedInvoice(null); setSyncLogs([]); } }}>
        <DialogContent className="glass-panel sm:max-w-xl text-foreground text-left max-h-[85vh] overflow-y-auto">
          {selectedInvoice && (
            <>
              <DialogHeader className="border-b border-border pb-3">
                <DialogTitle className="flex items-center justify-between text-lg font-black">
                  <span>Detalle de registro CRM {selectedInvoice.id}</span>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase",
                    selectedInvoice.verifactuStatus === "enviado" 
                      ? "bg-info/15 text-info" 
                      : selectedInvoice.verifactuStatus === "registrado" 
                        ? "bg-warning/15 text-warning" 
                        : "bg-destructive/15 text-destructive"
                  )}>
                    Fiscalidad: {selectedInvoice.verifactuStatus}
                  </span>
                </DialogTitle>
                <DialogDescription>
                  Registro importado desde el CRM existente para auditoría e inteligencia directiva.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 pt-3">
                
                {/* Details grid */}
                <div className="grid grid-cols-2 gap-4 text-xs border-b border-border pb-4 bg-black/10 p-3 rounded-lg">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Concepto</span>
                    <strong className="text-foreground block text-sm mt-0.5">{selectedInvoice.concept}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Monto Cobrado</span>
                    <strong className="text-foreground block text-sm mt-0.5 font-mono">{selectedInvoice.amount},00€</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Alumno / Cliente</span>
                    <strong className="text-foreground block mt-0.5">{selectedInvoice.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Estado Pago</span>
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold mt-1",
                      selectedInvoice.status === "completado" ? "bg-success/15 text-success" : selectedInvoice.status === "pendiente" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"
                    )}>
                      {selectedInvoice.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Sede</span>
                    <span className="text-foreground block mt-0.5">{selectedInvoice.sede}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Timestamp Sinc.</span>
                    <span className="text-foreground block font-mono mt-0.5">{selectedInvoice.syncTime}</span>
                  </div>
                </div>

                {/* External CRM compliance data */}
                <div className="space-y-2 text-xs">
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Huella fiscal importada del CRM</span>
                  <div className="p-2.5 rounded-lg border border-border bg-black/25 font-mono text-[9px] text-foreground-muted break-all">
                    SHA256: 6a8dfa64010d29fae8b15d6f83cb4f2a7db76cd5ef23f8510ad6a89c9e89ffda23a23
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  {selectedInvoice.verifactuStatus === "error" && (
                    <Button
                      disabled={reviewRequestId !== null}
                      onClick={() => handleRequestCrmReview(selectedInvoice.id)}
                      className="bg-jana-primary hover:bg-jana-primary-hover text-white text-xs font-bold px-4 h-9 rounded-lg cursor-pointer"
                    >
                      {reviewRequestId !== null ? (
                        <>
                          <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                          Enviando aviso...
                        </>
                      ) : (
                        "Solicitar revisión en CRM"
                      )}
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadRecord(selectedInvoice.id)}
                    disabled={downloadingId !== null}
                    className="border-border text-xs font-semibold px-4 h-9 rounded-lg cursor-pointer"
                  >
                    {downloadingId !== null ? (
                      <>
                        <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                        Generando ficha...
                      </>
                    ) : (
                      "Descargar ficha"
                    )}
                  </Button>
                </div>

                {/* Simulated CRM Review Console */}
                {syncLogs.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Log de revisión CRM</p>
                    <div className="h-28 overflow-y-auto rounded-lg border border-border bg-black/45 p-2 font-mono text-[9px] text-brain leading-tight space-y-1">
                      {syncLogs.map((log, idx) => (
                        <div key={idx} className="border-b border-border/5 pb-0.5">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


/* ==========================================================================
   BRAND AND MARKS
   ========================================================================== */

/* 5. BACKSTAGE STUDIO (Advanced Video Composition Editor) */

