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
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"

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
  const { t } = useLanguage();
  
  return (
    <section>
      <h2 className="text-2xl font-semibold text-stone-700 mb-4">{t("dashboard.invoices.title")}</h2>
      <Card className="shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("dashboard.invoices.invoiceNumber")}</TableHead>
              <TableHead>{t("dashboard.invoices.date")}</TableHead>
              <TableHead>{t("dashboard.invoices.amount")}</TableHead>
              <TableHead>{t("dashboard.invoices.status")}</TableHead>
              <TableHead className="text-right">{t("dashboard.invoices.actions")}</TableHead>
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
                      variant={invoice.status === t("status.paid") ? "default" : "destructive"}
                      className={invoice.status === t("status.paid") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{invoice.amount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" disabled={!isPremium}>
                      {t("dashboard.invoices.download")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-stone-500 py-8">
                  {isPremium 
                    ? t("dashboard.invoices.noInvoices")
                    : t("dashboard.invoices.premiumOnly")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </section>
  )
} 