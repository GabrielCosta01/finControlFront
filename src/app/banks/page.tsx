'use client';
import React, { useState, useEffect } from 'react';
import { Bank, Category, Expense, ExtraIncome } from '@/api/entities/all';

interface BankData {
  id: string;
  name: string;
  description: string;
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryData {
  id: string;
  description: string;
  type: 'EXPENSE' | 'INCOME';
}

interface ExpenseData {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  category_id?: string;
  bank_id?: string;
}

interface ExtraIncomeData {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'PENDING' | 'RECEIVED';
  category_id?: string;
  bank_id?: string;
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Plus, Building2, ArrowUpCircle, ArrowDownCircle, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import BankTransactionDialog from '@/components/Banks/BankTransactionDialog';

const formatDate = (dateString?: string) => {
  if (!dateString) return "Data não disponível";
  
  try {
    const date = new Date(dateString);
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return "Data inválida";
    }
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Data inválida";
  }
};

export default function Banks() {
  const [banks, setBanks] = useState<BankData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [extraIncomes, setExtraIncomes] = useState<ExtraIncomeData[]>([]);
  const [newBank, setNewBank] = useState({ name: "", balance: "" });
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [currentBank, setCurrentBank] = useState<BankData | null>(null);
  const [transactionType, setTransactionType] = useState<'DEPOSIT' | 'WITHDRAWAL' | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [banksData, categoriesData, expensesData, extraIncomesData] = await Promise.all([
      Bank.list(),
      Category.list(),
      Expense.list(),
      ExtraIncome.list()
    ]);
    
    console.log("Dados dos bancos:", banksData);
    setBanks(banksData);
    setCategories(categoriesData);
    setExpenses(expensesData.filter((e: ExpenseData) => e.bank_id));
    setExtraIncomes(extraIncomesData.filter((i: ExtraIncomeData) => i.bank_id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBank.name.trim() || !newBank.balance) return;

    await Bank.create({
      name: newBank.name.trim(),
      initialBalance: parseFloat(newBank.balance)
    });

    setNewBank({ name: "", balance: "" });
    loadData();
  };

  const openTransactionDialog = (bank: BankData, type: 'DEPOSIT' | 'WITHDRAWAL') => {
    setCurrentBank(bank);
    setTransactionType(type);
    setTransactionDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50">
      <div className="container mx-auto px-4 py-8 max-w-[1400px]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Bancos</h1>
            <p className="mt-1 text-gray-500">Gerencie suas contas bancárias e movimentações financeiras</p>
          </div>
          <Button
            onClick={loadData}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 transition-colors duration-200 shadow-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Formulário de Novo Banco */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200/80 rounded-lg overflow-hidden">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/80">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-500" />
                  Novo Banco
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Adicione uma nova conta bancária ao seu controle financeiro
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Banco
                      </label>
                      <Input
                        id="bankName"
                        value={newBank.name}
                        onChange={(e) => setNewBank({ ...newBank, name: e.target.value })}
                        placeholder="Ex: Nubank, Itaú, Bradesco..."
                        className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="initialBalance" className="block text-sm font-medium text-gray-700 mb-1">
                        Saldo Inicial
                      </label>
                      <Input
                        id="initialBalance"
                        type="number"
                        step="0.01"
                        value={newBank.balance}
                        onChange={(e) => setNewBank({ ...newBank, balance: e.target.value })}
                        placeholder="R$ 0,00"
                        className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-md"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-200 shadow-sm hover:shadow rounded-md"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Banco
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Card de Estatísticas */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200/80 rounded-lg overflow-hidden">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/80">
                <CardTitle className="text-lg font-semibold">Resumo Geral</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 p-6">
                <div className="space-y-1 bg-blue-50/50 p-4 rounded-lg border border-blue-100/50">
                  <p className="text-sm text-gray-600">Total em Bancos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                      .format(banks.reduce((total, bank) => total + bank.currentBalance, 0))}
                  </p>
                </div>
                <div className="space-y-1 bg-gray-50/50 p-4 rounded-lg border border-gray-100/50">
                  <p className="text-sm text-gray-600">Quantidade</p>
                  <p className="text-2xl font-bold text-gray-900">{banks.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Bancos */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banks.map((bank) => (
                <Card 
                  key={bank.id} 
                  className="group bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200/80 rounded-lg overflow-hidden"
                >
                  <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/80 pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                        {bank.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {bank.totalIncome > 0 && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-100/50 flex items-center gap-1 transition-colors duration-200 hover:bg-green-100/50">
                            <TrendingUp className="w-3 h-3" />
                            +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bank.totalIncome)}
                          </span>
                        )}
                        {bank.totalExpense > 0 && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-100/50 flex items-center gap-1 transition-colors duration-200 hover:bg-red-100/50">
                            <TrendingDown className="w-3 h-3" />
                            -{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bank.totalExpense)}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                        .format(bank.currentBalance)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Atualizado em {formatDate(bank.updatedAt || bank.createdAt)}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2 pt-0 border-t border-gray-100">
                    <Button 
                      onClick={() => openTransactionDialog(bank, "DEPOSIT")}
                      variant="ghost"
                      className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50/80 transition-colors duration-200"
                    >
                      <ArrowUpCircle className="w-4 h-4 mr-2" />
                      Depositar
                    </Button>
                    <Button 
                      onClick={() => openTransactionDialog(bank, "WITHDRAWAL")}
                      variant="ghost"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50/80 transition-colors duration-200"
                    >
                      <ArrowDownCircle className="w-4 h-4 mr-2" />
                      Sacar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {banks.length === 0 && (
                <Card className="md:col-span-2 bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200/80 rounded-lg overflow-hidden">
                  <CardContent className="text-center py-12">
                    <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum banco cadastrado</h3>
                    <p className="text-sm text-gray-500">
                      Comece adicionando seu primeiro banco usando o formulário ao lado
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {currentBank && transactionType && (
        <BankTransactionDialog
          open={transactionDialogOpen}
          bank={currentBank}
          type={transactionType}
          categories={categories}
          onClose={() => {
            setTransactionDialogOpen(false);
            setCurrentBank(null);
            setTransactionType(null);
          }}
          onTransactionComplete={loadData}
        />
      )}
    </div>
  );
}