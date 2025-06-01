'use client';
import React, { useState, useEffect } from 'react';
import { Bank, Category, Expense, ExtraIncome } from '@/api/entities/all';
import { BankDto, CategoryDetailResponseDto, ExpenseDetailResponseDto, ExtraIncomeDto } from '@/types';
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
import { Plus, Building2, ArrowUpCircle, ArrowDownCircle, RefreshCw, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import BankTransactionDialog from '@/components/Banks/BankTransactionDialog';
import { toast } from 'react-toastify';
import { withAuth } from '@/components/withAuth';

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

function BanksPage() {
  const [banks, setBanks] = useState<BankDto[]>([]);
  const [categories, setCategories] = useState<CategoryDetailResponseDto[]>([]);
  const [expenses, setExpenses] = useState<ExpenseDetailResponseDto[]>([]);
  const [extraIncomes, setExtraIncomes] = useState<ExtraIncomeDto[]>([]);
  const [newBank, setNewBank] = useState({ name: "", balance: "" });
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [currentBank, setCurrentBank] = useState<BankDto | null>(null);
  const [transactionType, setTransactionType] = useState<'DEPOSIT' | 'WITHDRAWAL' | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [banksData, categoriesData, expensesData, extraIncomesData] = await Promise.all([
        Bank.list(),
        Category.list(),
        Expense.list(),
        ExtraIncome.list()
      ]);
      
      console.log("Dados dos bancos:", banksData);
      setBanks(banksData);
      setCategories(categoriesData);
      setExpenses(expensesData);
      setExtraIncomes(extraIncomesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Não foi possível carregar os dados. Tente novamente mais tarde.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBank.name.trim() || !newBank.balance) return;

    try {
      await Bank.create({
        name: newBank.name.trim(),
        initialBalance: parseFloat(newBank.balance)
      });

      toast.success("Banco criado com sucesso!");
      setNewBank({ name: "", balance: "" });
      loadData();
    } catch (error) {
      console.error("Erro ao criar banco:", error);
      toast.error("Não foi possível criar o banco. Tente novamente mais tarde.");
    }
  };

  const openTransactionDialog = (bank: BankDto, type: 'DEPOSIT' | 'WITHDRAWAL') => {
    setCurrentBank(bank);
    setTransactionType(type);
    setTransactionDialogOpen(true);
  };

  const handleDelete = async (bank: BankDto) => {
    if (!confirm(`Tem certeza que deseja excluir o banco "${bank.name}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await Bank.delete(bank.id);
      toast.success("Banco excluído com sucesso!");
      loadData();
    } catch (error) {
      console.error("Erro ao excluir banco:", error);
      toast.error("Não foi possível excluir o banco. Tente novamente mais tarde.");
    }
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
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 bg-blue-50/50 p-4 rounded-lg border border-blue-100/50">
                    <p className="text-sm text-gray-600">Total em Bancos</p>
                    <p className="text-xl font-bold text-gray-900 break-words">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                        .format(banks.reduce((total, bank) => total + bank.currentBalance, 0))}
                    </p>
                  </div>
                  <div className="space-y-1 bg-gray-50/50 p-4 rounded-lg border border-gray-100/50">
                    <p className="text-sm text-gray-600">Quantidade</p>
                    <p className="text-xl font-bold text-gray-900">{banks.length}</p>
                  </div>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(bank)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardDescription className="text-sm text-gray-500 mt-1">
                      Última atualização: {formatDate(bank.updatedAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            Entradas
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                              .format(bank.totalIncome)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <TrendingDown className="w-4 h-4 text-red-500" />
                            Saídas
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                              .format(bank.totalExpense)}
                          </p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Saldo Atual</p>
                        <p className={`text-2xl font-bold ${bank.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                            .format(bank.currentBalance)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50/50 border-t border-gray-100 p-4">
                    <Button
                      onClick={() => openTransactionDialog(bank, 'DEPOSIT')}
                      className="flex-1 bg-gradient-to-r mr-2 from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all duration-200"
                    >
                      <ArrowUpCircle className="w-4 h-4 mr-2" />
                      Depositar
                    </Button>
                    <Button
                      onClick={() => openTransactionDialog(bank, 'WITHDRAWAL')}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-200"
                    >
                      <ArrowDownCircle className="w-4 h-4 mr-2" />
                      Sacar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {currentBank && transactionType && (
        <BankTransactionDialog
          open={transactionDialogOpen}
          onClose={() => {
            setTransactionDialogOpen(false);
            setCurrentBank(null);
            setTransactionType(null);
          }}
          bank={currentBank}
          type={transactionType}
          categories={categories}
          onTransactionComplete={loadData}
        />
      )}
    </div>
  );
}

export default withAuth(BanksPage);