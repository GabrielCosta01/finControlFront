'use client';

import React, { useState, useEffect } from 'react';
import { Receivable, Category, Bank } from '@/api/entities/all';
import { withAuth } from '@/components/withAuth';
import { toast } from 'react-toastify';

interface ReceivableData {
  id: string;
  description: string;
  amount_total: number;
  due_date: string;
  status: 'PENDING' | 'RECEIVED' | 'LATE';
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
import { Plus, ArrowUpCircle, RefreshCw, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
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

function ReceivablesPage() {
  const [receivables, setReceivables] = useState<ReceivableData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [banks, setBanks] = useState<BankData[]>([]);
  const [newReceivable, setNewReceivable] = useState({
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
    try {
      const [receivablesData, categoriesData, banksData] = await Promise.all([
        Receivable.list(),
        Category.list(),
        Bank.list()
      ]);
      
      setReceivables(receivablesData.content || []);
      setCategories(categoriesData.filter((c: CategoryData) => c.type === 'INCOME'));
      setBanks(banksData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar os dados. Tente novamente.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReceivable.description.trim() || !newReceivable.amount_total || !newReceivable.due_date) return;

    await Receivable.create({
      description: newReceivable.description.trim(),
      amount_total: parseFloat(newReceivable.amount_total),
      due_date: newReceivable.due_date,
      payment_method: newReceivable.payment_method === "none" ? undefined : newReceivable.payment_method,
      category_id: newReceivable.category_id === "none" ? undefined : newReceivable.category_id,
      bank_id: newReceivable.bank_id === "none" ? undefined : newReceivable.bank_id,
      total_installments: parseInt(newReceivable.total_installments),
      status: 'PENDING'
    });

    setNewReceivable({
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
    await Receivable.delete(id);
    loadData();
  };

  const handleStatusChange = async (id: string, status: 'PENDING' | 'RECEIVED' | 'LATE') => {
    await Receivable.update(id, { status });
    loadData();
  };

  return (
    <div className="h-full w-full">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contas a Receber</h1>
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
                  <Plus className="w-5 h-5 text-green-500" />
                  Nova Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <Input
                      value={newReceivable.description}
                      onChange={(e) => setNewReceivable({ ...newReceivable, description: e.target.value })}
                      placeholder="Descrição"
                      className="w-full border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={newReceivable.amount_total}
                      onChange={(e) => setNewReceivable({ ...newReceivable, amount_total: e.target.value })}
                      placeholder="Valor total"
                      className="w-full border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                    <Input
                      type="date"
                      value={newReceivable.due_date}
                      onChange={(e) => setNewReceivable({ ...newReceivable, due_date: e.target.value })}
                      className="w-full border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                    <Select
                      value={newReceivable.payment_method}
                      onValueChange={(value) => setNewReceivable({ ...newReceivable, payment_method: value })}
                    >
                      <SelectTrigger className="w-full border-gray-200 focus:border-green-500 focus:ring-green-500">
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
                      value={newReceivable.category_id}
                      onValueChange={(value) => setNewReceivable({ ...newReceivable, category_id: value })}
                    >
                      <SelectTrigger className="w-full border-gray-200 focus:border-green-500 focus:ring-green-500">
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
                      value={newReceivable.bank_id}
                      onValueChange={(value) => setNewReceivable({ ...newReceivable, bank_id: value })}
                    >
                      <SelectTrigger className="w-full border-gray-200 focus:border-green-500 focus:ring-green-500">
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
                      value={newReceivable.total_installments}
                      onChange={(e) => setNewReceivable({ ...newReceivable, total_installments: e.target.value })}
                      placeholder="Número de parcelas"
                      className="w-full border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 border-0">
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
                  <ArrowUpCircle className="w-5 h-5 text-green-500" />
                  Contas Cadastradas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {receivables.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                    <ArrowUpCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
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
                              <Badge className={STATUS_COLORS[receivable.status]}>
                                {STATUS_LABELS[receivable.status]}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  onClick={() => handleStatusChange(receivable.id, 'RECEIVED')}
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  disabled={receivable.status === 'RECEIVED'}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => handleStatusChange(receivable.id, 'LATE')}
                                  variant="ghost"
                                  size="sm"
                                  className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                  disabled={receivable.status === 'LATE'}
                                >
                                  <AlertCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDelete(receivable.id)}
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

export default withAuth(ReceivablesPage);
