'use client';

import React, { useState, useEffect } from 'react';
import { Bank, Vault, Expense, ExtraIncome } from '@/api/entities/all';
import { Button } from "@/components/ui/button";
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
import { 
  Building2, 
  PiggyBank, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertCircle
} from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BankData {
  id: string;
  name: string;
  description: string;
  totalIncome: number;
  totalExpense: number;
  currentBalance: number | string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

interface VaultData {
  id: string;
  name: string;
  description: string;
  amount: number | string;
  currency: string;
  bankId: string | null;
  bankName: string | null;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

interface ExpenseData {
  id: string;
  description: string;
  amount: number | string;
  due_date: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
}

interface ExtraIncomeData {
  id: string;
  description: string;
  amount: number | string;
  date: string;
  status: 'PENDING' | 'RECEIVED';
}

export default function Dashboard() {
  const [banks, setBanks] = useState<BankData[]>([]);
  const [vaults, setVaults] = useState<VaultData[]>([]);
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [extraIncomes, setExtraIncomes] = useState<ExtraIncomeData[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [banksData, vaultsData, expensesData, extraIncomesData] = await Promise.all([
        Bank.list(),
        Vault.list(),
        Expense.list(),
        ExtraIncome.list()
      ]);
      
      // Processamento dos dados dos bancos usando currentBalance
      const processedBanks = banksData.map(bank => {
        const balance = typeof bank.currentBalance === 'string'
          ? parseFloat(bank.currentBalance.replace(/[^\d.-]/g, ''))
          : Number(bank.currentBalance);

        return {
          ...bank,
          balance: isNaN(balance) ? 0 : balance
        };
      });

      // Processamento dos dados dos cofres usando amount
      const processedVaults = vaultsData.map(vault => {
        const balance = typeof vault.amount === 'string'
          ? parseFloat(vault.amount.replace(/[^\d.-]/g, ''))
          : Number(vault.amount);

        return {
          ...vault,
          balance: isNaN(balance) ? 0 : balance
        };
      });

      // Processamento dos dados das despesas
      const processedExpenses = expensesData.map(expense => {
        const amount = typeof expense.amount === 'string'
          ? parseFloat(expense.amount.replace(/[^\d.-]/g, ''))
          : Number(expense.amount);

        return {
          ...expense,
          amount: isNaN(amount) ? 0 : amount
        };
      });

      // Processamento dos dados das rendas extras
      const processedExtraIncomes = extraIncomesData.map(income => {
        const amount = typeof income.amount === 'string'
          ? parseFloat(income.amount.replace(/[^\d.-]/g, ''))
          : Number(income.amount);

        return {
          ...income,
          amount: isNaN(amount) ? 0 : amount
        };
      });
      
      // Debug dos valores
      console.log('Bancos processados:', processedBanks);
      console.log('Cofres processados:', processedVaults);
      
      setBanks(processedBanks);
      setVaults(processedVaults);
      setExpenses(processedExpenses);
      setExtraIncomes(processedExtraIncomes);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setBanks([]);
      setVaults([]);
      setExpenses([]);
      setExtraIncomes([]);
    }
  };

  const totalBankBalance = banks.reduce((total, bank) => {
    const balance = typeof bank.currentBalance === 'string'
      ? parseFloat(bank.currentBalance.replace(/[^\d.-]/g, ''))
      : Number(bank.currentBalance);
    return total + (isNaN(balance) ? 0 : balance);
  }, 0);

  const totalVaultBalance = vaults.reduce((total, vault) => {
    if (vault.currency === 'BRL') {
      const balance = typeof vault.amount === 'string'
        ? parseFloat(vault.amount.replace(/[^\d.-]/g, ''))
        : Number(vault.amount);
      return total + (isNaN(balance) ? 0 : balance);
    }
    return total;
  }, 0);

  const totalBalance = totalBankBalance + totalVaultBalance;

  const totalExpenses = expenses
    .filter(p => p.status === 'PENDING')
    .reduce((total, p) => total + (Number(p.amount) || 0), 0);

  const totalExtraIncomes = extraIncomes
    .filter(r => r.status === 'PENDING')
    .reduce((total, r) => total + (Number(r.amount) || 0), 0);

  const projectedBalance = totalBalance - totalExpenses + totalExtraIncomes;

  const upcomingExpenses = expenses
    .filter(p => p.status === 'PENDING')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  const upcomingExtraIncomes = extraIncomes
    .filter(r => r.status === 'PENDING')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const formatCurrency = (value: number | string) => {
    const numericValue = typeof value === 'string'
      ? parseFloat(value.replace(/[^\d.-]/g, ''))
      : Number(value);

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(isNaN(numericValue) ? 0 : numericValue);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
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

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="border-b bg-gray-50/50 pb-4">
            <CardTitle className="text-sm font-medium text-gray-500">
              Saldo Total
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalBalance)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="border-b bg-gray-50/50 pb-4">
            <CardTitle className="text-sm font-medium text-gray-500">
              A Pagar
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-red-500">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="border-b bg-gray-50/50 pb-4">
            <CardTitle className="text-sm font-medium text-gray-500">
              A Receber
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold text-green-500">
                {formatCurrency(totalExtraIncomes)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="border-b bg-gray-50/50 pb-4">
            <CardTitle className="text-sm font-medium text-gray-500">
              Saldo Projetado
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold text-purple-500">
                {formatCurrency(projectedBalance)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bancos e Cofres */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              Bancos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {banks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum banco cadastrado
              </div>
            ) : (
              <div className="space-y-4">
                {banks.map(bank => (
                  <div key={bank.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">{bank.name}</span>
                    </div>
                    <span className="font-bold">
                      {formatCurrency(bank.currentBalance)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-purple-500" />
              Cofres
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {vaults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum cofre cadastrado
              </div>
            ) : (
              <div className="space-y-4">
                {vaults.map(vault => (
                  <div key={vault.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <PiggyBank className="w-5 h-5 text-purple-500" />
                      <div>
                        <span className="font-medium">{vault.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({vault.currency})</span>
                      </div>
                    </div>
                    <span className="font-bold">
                      {formatCurrency(vault.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Últimas Transações e Próximos Vencimentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5 text-blue-500" />
              Últimas Transações
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {upcomingExpenses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma despesa pendente
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingExpenses.map(expense => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <ArrowDownCircle className="w-4 h-4 text-red-500" />
                          {expense.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(expense.due_date), "dd 'de' MMMM", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-red-600 font-medium text-right">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="border-b bg-gray-50/50">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <ArrowDownCircle className="w-5 h-5 text-red-500" />
                Próximas Despesas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {upcomingExpenses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma despesa pendente
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingExpenses.map(expense => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <ArrowDownCircle className="w-4 h-4 text-red-500" />
                            {expense.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(expense.due_date), "dd 'de' MMMM", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-red-600 font-medium text-right">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="border-b bg-gray-50/50">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <ArrowUpCircle className="w-5 h-5 text-green-500" />
                Próximas Rendas Extras
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {upcomingExtraIncomes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma renda extra pendente
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingExtraIncomes.map(income => (
                      <TableRow key={income.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <ArrowUpCircle className="w-4 h-4 text-green-500" />
                            {income.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(income.date), "dd 'de' MMMM", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-green-600 font-medium text-right">
                          {formatCurrency(income.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
} 