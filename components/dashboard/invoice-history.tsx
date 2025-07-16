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
import { Badge } from "@/components/ui/badge"

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "Pagado" | "Pendiente" | "Fallido";
}

interface InvoiceHistoryProps {
  invoices: Invoice[];
  isPremium: boolean;
}

export default function InvoiceHistory({ invoices, isPremium }: InvoiceHistoryProps) {
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
                  <TableCell>
                    <Badge 
                      variant={invoice.status === "Pagado" ? "default" : "destructive"}
                      className={invoice.status === "Pagado" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{invoice.amount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" disabled={!isPremium}>
                      Descargar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-stone-500 py-8">
                  {isPremium 
                    ? "No tienes facturas anteriores." 
                    : "El historial de facturas es una función premium."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </section>
  )
} 