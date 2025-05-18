'use client';

import React, { useState, useEffect } from 'react';
import { Payable, Category, Bank, Transaction } from '@/api/entities/all';

interface PayableData {
  id: string;
  description: string;
  amount_total: number;
  due_date: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  total_installments: number;
  payment_method?: string;
  category_id?: string;
  bank_id?: string;
  created_date: string;
  updated_date?: string;
}

interface CategoryData {
  id: string;
  description: string;
  type: 'EXPENSE' | 'INCOME';
}

interface BankData {
  id: string;
  name: string;
}

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
import { Plus, ArrowDownCircle, RefreshCw, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
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
  const [payables, setPayables] = useState<PayableData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [banks, setBanks] = useState<BankData[]>([]);
  const [newPayable, setNewPayable] = useState({
    description: "",
    amount_total: "",
    due_date: "",
    payment_method: "none",
    category_id: "none",
    bank_id: "none",
    total_installments: "1"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [payablesData, categoriesData, banksData] = await Promise.all([
      Payable.list(),
      Category.list(),
      Bank.list()
    ]);
    
    setPayables(payablesData);
    setCategories(categoriesData.filter((c: CategoryData) => c.type === 'EXPENSE'));
    setBanks(banksData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayable.description.trim() || !newPayable.amount_total || !newPayable.due_date) return;

    await Payable.create({
      description: newPayable.description.trim(),
      amount_total: parseFloat(newPayable.amount_total),
      due_date: newPayable.due_date,
      payment_method: newPayable.payment_method === "none" ? undefined : newPayable.payment_method,
      category_id: newPayable.category_id === "none" ? undefined : newPayable.category_id,
      bank_id: newPayable.bank_id === "none" ? undefined : newPayable.bank_id,
      total_installments: parseInt(newPayable.total_installments),
      status: 'PENDING'
    });

    setNewPayable({
      description: "",
      amount_total: "",
      due_date: "",
      payment_method: "none",
      category_id: "none",
      bank_id: "none",
      total_installments: "1"
    });
    loadData();
  };

  const handleDelete = async (id: string) => {
    await Payable.delete(id);
    loadData();
  };

  const handleStatusChange = async (id: string, status: 'PENDING' | 'PAID' | 'OVERDUE') => {
    await Payable.update(id, { status });
    loadData();
  };

  return (
    <div className="h-full w-full">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contas a Pagar</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={loadData}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formulário de Nova Conta */}
          <div className="lg:col-span-4">
            <Card className="bg-white shadow-lg border-0 sticky top-6">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-red-500" />
                  Nova Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <Input
                      value={newPayable.description}
                      onChange={(e) => setNewPayable({ ...newPayable, description: e.target.value })}
                      placeholder="Descrição"
                      className="w-full border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={newPayable.amount_total}
                      onChange={(e) => setNewPayable({ ...newPayable, amount_total: e.target.value })}
                      placeholder="Valor total"
                      className="w-full border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                    <Input
                      type="date"
                      value={newPayable.due_date}
                      onChange={(e) => setNewPayable({ ...newPayable, due_date: e.target.value })}
                      className="w-full border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                    <Select
                      value={newPayable.payment_method}
                      onValueChange={(value) => setNewPayable({ ...newPayable, payment_method: value })}
                    >
                      <SelectTrigger className="w-full border-gray-200 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Forma de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Selecione</SelectItem>
                        {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={newPayable.category_id}
                      onValueChange={(value) => setNewPayable({ ...newPayable, category_id: value })}
                    >
                      <SelectTrigger className="w-full border-gray-200 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Categoria (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={newPayable.bank_id}
                      onValueChange={(value) => setNewPayable({ ...newPayable, bank_id: value })}
                    >
                      <SelectTrigger className="w-full border-gray-200 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Banco (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        {banks.map(bank => (
                          <SelectItem key={bank.id} value={bank.id}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min="1"
                      value={newPayable.total_installments}
                      onChange={(e) => setNewPayable({ ...newPayable, total_installments: e.target.value })}
                      placeholder="Número de parcelas"
                      className="w-full border-gray-200 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 border-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Conta
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Contas */}
          <div className="lg:col-span-8">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <ArrowDownCircle className="w-5 h-5 text-red-500" />
                  Contas Cadastradas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {payables.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                    <ArrowDownCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Nenhuma conta cadastrada</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Adicione uma conta usando o formulário ao lado
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
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
                          <TableHead className="text-right">Ações</TableHead>
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
                              <Badge className={STATUS_COLORS[payable.status]}>
                                {STATUS_LABELS[payable.status]}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  onClick={() => handleStatusChange(payable.id, 'PAID')}
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  disabled={payable.status === 'PAID'}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => handleStatusChange(payable.id, 'OVERDUE')}
                                  variant="ghost"
                                  size="sm"
                                  className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                  disabled={payable.status === 'OVERDUE'}
                                >
                                  <AlertCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDelete(payable.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
