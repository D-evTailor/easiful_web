export interface Subscription {
  plan: string;
  status: "Activo" | "Cancelado" | "Prueba";
  price: string;
  nextPayment: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "Pagado" | "Pendiente" | "Fallido";
} 