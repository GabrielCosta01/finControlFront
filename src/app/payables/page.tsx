'use client';

import React, { useState, useEffect } from 'react';
import { Payable, Category, Bank, Transaction } from '@/api/entities/all';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowDownCircle } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PAYMENT_METHODS = {
  CASH: "Dinheiro",
  CARD: "Cartão",
  PIX: "PIX",
  TRANSFER: "Transferência",
  BOLETO: "Boleto",
  OTHER: "Outro"
};

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PAID: "bg-green-100 text-green-800 border-green-200",
  OVERDUE: "bg-red-100 text-red-800 border-red-200"
};

const STATUS_LABELS = {
  PENDING: "Pendente",
  PAID: "Pago",
  OVERDUE: "Atrasado"
};

export default function Payables() {
  const [payables, setPayables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banks, setBanks] = useState([]);
  const [newPayable, setNewPayable] = useState({
    description: "",
    amount_total: "",
    due_date: "",
    status: "PENDING",
    total_installments: "1",
    payment_method: "",
    category_id: "",
    bank_id: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [payablesData, categoriesData, banksData] = await Promise.all([
      Payable.list('-due_date'),
      Category.list(),
      Bank.list()
    ]);
    setPayables(payablesData);
    setCategories(categoriesData);
    setBanks(banksData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPayable.description.trim() || !newPayable.amount_total || !newPayable.due_date) return;

    await Payable.create({
      description: newPayable.description.trim(),
      amount_total: parseFloat(newPayable.amount_total),
      due_date: newPayable.due_date,
      status: newPayable.status,
      total_installments: parseInt(newPayable.total_installments),
      payment_method: newPayable.payment_method || undefined,
      category_id: newPayable.category_id || undefined,
      bank_id: newPayable.bank_id || undefined
    });

    setNewPayable({
      description: "",
      amount_total: "",
      due_date: "",
      status: "PENDING",
      total_installments: "1",
      payment_method: "",
      category_id: "",
      bank_id: ""
    });
    loadData();
  };

  const handleStatusChange = async (id, status) => {
    const payable = payables.find(p => p.id === id);
    if (!payable) return;

    try {
      const updates = { status };
      if (status === 'PAID') {
        updates.paid_date = new Date().toISOString().split('T')[0];

        // If there's a linked bank, create transaction and update bank balance
        if (payable.bank_id) {
          // Create withdrawal transaction
          await Transaction.create({
            description: `Pagamento: ${payable.description}`,
            amount: payable.amount_total,
            transaction_date: updates.paid_date,
            transaction_type: "WITHDRAWAL",
            bank_id: payable.bank_id,
            category_id: payable.category_id,
            payable_id: payable.id
          });

          // Get current bank data
          const bank = banks.find(b => b.id === payable.bank_id);
          if (bank) {
            // Update bank balance
            await Bank.update(payable.bank_id, {
              balance: bank.balance - payable.amount_total
            });
          }
        }
      }

      await Payable.update(id, updates);
      loadData(); // Reload all data to get updated balances
    } catch (error) {
      console.error("Error updating payable status:", error);
      // You might want to add error handling UI here
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Contas a Pagar</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Nova Conta a Pagar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  value={newPayable.description}
                  onChange={(e) => setNewPayable({ ...newPayable, description: e.target.value })}
                  placeholder="Descrição"
                  maxLength={100}
                />
              </div>
              <div>
                <Input
                  type="number"
                  step="0.01"
                  value={newPayable.amount_total}
                  onChange={(e) => setNewPayable({ ...newPayable, amount_total: e.target.value })}
                  placeholder="Valor total"
                />
              </div>
              <div>
                <Input
                  type="date"
                  value={newPayable.due_date}
                  onChange={(e) => setNewPayable({ ...newPayable, due_date: e.target.value })}
                />
              </div>
              <div>
                <Select
                  value={newPayable.payment_method}
                  onValueChange={(value) => setNewPayable({ ...newPayable, payment_method: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={newPayable.category_id}
                  onValueChange={(value) => setNewPayable({ ...newPayable, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Nenhuma</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  type="number"
                  min="1"
                  value={newPayable.total_installments}
                  onChange={(e) => setNewPayable({ ...newPayable, total_installments: e.target.value })}
                  placeholder="Número de parcelas"
                />
              </div>
              <div>
                <Select
                  value={newPayable.status}
                  onValueChange={(value) => setNewPayable({ ...newPayable, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={newPayable.bank_id}
                  onValueChange={(value) => setNewPayable({ ...newPayable, bank_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Banco de saída (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Nenhum</SelectItem>
                    {banks.map(bank => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Conta
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Contas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Parcelas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payables.map((payable) => (
                <TableRow key={payable.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <ArrowDownCircle className="w-4 h-4 text-red-500" />
                      {payable.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    {categories.find(c => c.id === payable.category_id)?.description || "-"}
                  </TableCell>
                  <TableCell>
                    {banks.find(b => b.id === payable.bank_id)?.name || "-"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(payable.due_date), "dd 'de' MMMM", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(payable.amount_total)}
                  </TableCell>
                  <TableCell>
                    {payable.total_installments}x
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={STATUS_COLORS[payable.status]}>
                      {STATUS_LABELS[payable.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {payable.status !== "PAID" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleStatusChange(payable.id, "PAID")}
                        >
                          Marcar como Pago
                        </Button>
                      </div>
                    )}
                    {payable.status === "PAID" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 text-xs"
                        onClick={() => handleStatusChange(payable.id, "PENDING")}
                      >
                        Desfazer Pagamento
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {payables.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-4">
                    Nenhuma conta a pagar cadastrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
