"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "Pagado" | "Pendiente" | "Fallido";
}

interface InvoiceHistoryProps {
  invoices: Invoice[];
}

export default function InvoiceHistory({ invoices }: InvoiceHistoryProps) {
  const statusClasses = {
    Pagado: "text-emerald-600",
    Pendiente: "text-amber-600",
    Fallido: "text-red-600",
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold text-stone-700 mb-4">Historial de Facturas</h2>
      <Card className="shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Factura</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Importe</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell className={statusClasses[invoice.status]}>{invoice.status}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-stone-500 py-8">
                  No hay facturas que mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </section>
  )
} 