'use client';

import React, { useState, useEffect } from 'react';
import { Receivable, Category, Bank, Transaction } from '@/api/entities/all';
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
import { Plus, ArrowUpCircle } from "lucide-react";
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
  RECEIVED: "bg-green-100 text-green-800 border-green-200",
  LATE: "bg-red-100 text-red-800 border-red-200"
};

const STATUS_LABELS = {
  PENDING: "Pendente",
  RECEIVED: "Recebido",
  LATE: "Atrasado"
};

export default function Receivables() {
  const [receivables, setReceivables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banks, setBanks] = useState([]);
  const [newReceivable, setNewReceivable] = useState({
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
    const [receivablesData, categoriesData, banksData] = await Promise.all([
      Receivable.list('-due_date'),
      Category.list(),
      Bank.list()
    ]);
    setReceivables(receivablesData);
    setCategories(categoriesData);
    setBanks(banksData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReceivable.description.trim() || !newReceivable.amount_total || !newReceivable.due_date) return;

    await Receivable.create({
      description: newReceivable.description.trim(),
      amount_total: parseFloat(newReceivable.amount_total),
      due_date: newReceivable.due_date,
      status: newReceivable.status,
      total_installments: parseInt(newReceivable.total_installments),
      payment_method: newReceivable.payment_method || undefined,
      category_id: newReceivable.category_id || undefined,
      bank_id: newReceivable.bank_id || undefined
    });

    setNewReceivable({
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
    const receivable = receivables.find(r => r.id === id);
    if (!receivable) return;

    try {
      const updates = { status };
      if (status === 'RECEIVED') {
        updates.received_date = new Date().toISOString().split('T')[0];

        // If there's a linked bank, create transaction and update bank balance
        if (receivable.bank_id) {
          // Create deposit transaction
          await Transaction.create({
            description: `Recebimento: ${receivable.description}`,
            amount: receivable.amount_total,
            transaction_date: updates.received_date,
            transaction_type: "DEPOSIT",
            bank_id: receivable.bank_id,
            category_id: receivable.category_id,
            receivable_id: receivable.id
          });

          // Get current bank data
          const bank = banks.find(b => b.id === receivable.bank_id);
          if (bank) {
            // Update bank balance
            await Bank.update(receivable.bank_id, {
              balance: bank.balance + receivable.amount_total
            });
          }
        }
      }

      await Receivable.update(id, updates);
      loadData(); // Reload all data to get updated balances
    } catch (error) {
      console.error("Error updating receivable status:", error);
      // You might want to add error handling UI here
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Contas a Receber</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Nova Conta a Receber</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  value={newReceivable.description}
                  onChange={(e) => setNewReceivable({ ...newReceivable, description: e.target.value })}
                  placeholder="Descrição"
                  maxLength={100}
                />
              </div>
              <div>
                <Input
                  type="number"
                  step="0.01"
                  value={newReceivable.amount_total}
                  onChange={(e) => setNewReceivable({ ...newReceivable, amount_total: e.target.value })}
                  placeholder="Valor total"
                />
              </div>
              <div>
                <Input
                  type="date"
                  value={newReceivable.due_date}
                  onChange={(e) => setNewReceivable({ ...newReceivable, due_date: e.target.value })}
                />
              </div>
              <div>
                <Select
                  value={newReceivable.payment_method}
                  onValueChange={(value) => setNewReceivable({ ...newReceivable, payment_method: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Forma de recebimento" />
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
                  value={newReceivable.category_id}
                  onValueChange={(value) => setNewReceivable({ ...newReceivable, category_id: value })}
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
                  value={newReceivable.total_installments}
                  onChange={(e) => setNewReceivable({ ...newReceivable, total_installments: e.target.value })}
                  placeholder="Número de parcelas"
                />
              </div>
              <div>
                <Select
                  value={newReceivable.status}
                  onValueChange={(value) => setNewReceivable({ ...newReceivable, status: value })}
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
                  value={newReceivable.bank_id}
                  onValueChange={(value) => setNewReceivable({ ...newReceivable, bank_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Banco de destino (opcional)" />
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
              {receivables.map((receivable) => (
                <TableRow key={receivable.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <ArrowUpCircle className="w-4 h-4 text-green-500" />
                      {receivable.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    {categories.find(c => c.id === receivable.category_id)?.description || "-"}
                  </TableCell>
                  <TableCell>
                    {banks.find(b => b.id === receivable.bank_id)?.name || "-"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(receivable.due_date), "dd 'de' MMMM", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(receivable.amount_total)}
                  </TableCell>
                  <TableCell>
                    {receivable.total_installments}x
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={STATUS_COLORS[receivable.status]}>
                      {STATUS_LABELS[receivable.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {receivable.status !== "RECEIVED" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleStatusChange(receivable.id, "RECEIVED")}
                        >
                          Marcar como Recebido
                        </Button>
                      </div>
                    )}
                    {receivable.status === "RECEIVED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 text-xs"
                        onClick={() => handleStatusChange(receivable.id, "PENDING")}
                      >
                        Desfazer Recebimento
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {receivables.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-4">
                    Nenhuma conta a receber cadastrada
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
