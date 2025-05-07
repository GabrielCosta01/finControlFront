import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  transaction_date: string;
  transaction_type: "DEPOSIT" | "WITHDRAWAL";
  category_id?: string;
  bank_id?: string;
  safe_id?: string;
}

interface Category {
  id: string;
  description: string;
}

interface Bank {
  id: string;
  name: string;
}

interface Safe {
  id: string;
  name: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  categories: Category[];
  banks: Bank[];
  safes: Safe[];
}

export default function TransactionHistory({ 
  transactions, 
  categories, 
  banks, 
  safes 
}: TransactionHistoryProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Descrição</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Conta</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                {transaction.transaction_type === "DEPOSIT" ? (
                  <ArrowUpCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownCircle className="w-4 h-4 text-red-500" />
                )}
                {transaction.description}
              </div>
            </TableCell>
            <TableCell>
              {format(new Date(transaction.transaction_date), "dd 'de' MMMM", { 
                locale: ptBR 
              })}
            </TableCell>
            <TableCell className={
              transaction.transaction_type === "DEPOSIT" 
                ? "text-green-600 font-medium" 
                : "text-red-600 font-medium"
            }>
              {transaction.transaction_type === "DEPOSIT" ? "+" : "-"}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
              }).format(transaction.amount)}
            </TableCell>
            <TableCell>
              {transaction.category_id 
                ? categories.find(c => c.id === transaction.category_id)?.description || "-" 
                : "-"}
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={
                  transaction.transaction_type === "DEPOSIT"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-red-100 text-red-800 border-red-200"
                }
              >
                {transaction.transaction_type === "DEPOSIT" ? "Entrada" : "Saída"}
              </Badge>
            </TableCell>
            <TableCell>
              {transaction.bank_id && banks.find(b => b.id === transaction.bank_id)?.name}
              {transaction.safe_id && safes.find(s => s.id === transaction.safe_id)?.name}
            </TableCell>
          </TableRow>
        ))}
        {transactions.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-gray-500 py-4">
              Nenhuma transação encontrada
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}