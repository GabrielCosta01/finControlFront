"use client";

import React, { useState, useEffect } from 'react';
import { Bank, Vault, Payable, Receivable, Transaction, Category } from '@/api/entities/all';
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
  AlertCircle,
  FileText,
  Calendar
} from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { withAuth } from '@/components/withAuth';

interface BankData {
  id: string;
  name: string;
  description: string;
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

interface VaultData {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  bankId: string | null;
  bankName: string | null;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

interface PayableData {
  id: string;
  description: string;
  amount_total: number;
  due_date: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  category_id?: string;
}

interface ReceivableData {
  id: string;
  description: string;
  amount_total: number;
  due_date: string;
  status: 'PENDING' | 'RECEIVED' | 'LATE';
  category_id?: string;
}

interface TransactionData {
  id: string;
  description: string;
  amount: number;
  transaction_date: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  category_id?: string;
}

interface CategoryData {
  id: string;
  description: string;
  type: 'EXPENSE' | 'INCOME';
}

function FinancialReportPage() {
  const [banks, setBanks] = useState<BankData[]>([]);
  const [vaults, setVaults] = useState<VaultData[]>([]);
  const [payables, setPayables] = useState<PayableData[]>([]);
  const [receivables, setReceivables] = useState<ReceivableData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [startDate, setStartDate] = useState(
    format(new Date().setDate(1), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [banksData, vaultsData, payablesData, receivablesData, transactionsData, categoriesData] = await Promise.all([
        Bank.list(),
        Vault.list(),
        Payable.list(),
        Receivable.list(),
        Transaction.list(),
        Category.list()
      ]);
      
      // Processamento dos dados dos bancos
      const processedBanks = banksData.map(bank => ({
        ...bank,
        balance: Number(bank.currentBalance) || 0
      }));

      // Processamento dos dados dos cofres
      const processedVaults = vaultsData.map(vault => ({
        ...vault,
        balance: Number(vault.amount) || 0
      }));

      // Processamento dos dados das contas a pagar
      const processedPayables = payablesData.map(payable => ({
        ...payable,
        amount_total: Number(payable.amount_total) || 0
      }));

      // Processamento dos dados das contas a receber
      const processedReceivables = receivablesData.map(receivable => ({
        ...receivable,
        amount_total: Number(receivable.amount_total) || 0
      }));

      // Processamento dos dados das transações
      const processedTransactions = transactionsData.map(transaction => ({
        ...transaction,
        amount: Number(transaction.amount) || 0
      }));
      
      setBanks(processedBanks);
      setVaults(processedVaults);
      setPayables(processedPayables);
      setReceivables(processedReceivables);
      setTransactions(processedTransactions);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setBanks([]);
      setVaults([]);
      setPayables([]);
      setReceivables([]);
      setTransactions([]);
      setCategories([]);
    }
  };

  const totalBankBalance = banks.reduce((total, bank) => total + (Number(bank.currentBalance) || 0), 0);
  const totalVaultBalance = vaults.reduce((total, vault) => {
    if (vault.currency === 'BRL') {
      return total + (Number(vault.amount) || 0);
    }
    return total;
  }, 0);
  const totalBalance = totalBankBalance + totalVaultBalance;

  const filteredPayables = payables.filter(p => {
    const date = new Date(p.due_date);
    return date >= new Date(startDate) && date <= new Date(endDate);
  });

  const filteredReceivables = receivables.filter(r => {
    const date = new Date(r.due_date);
    return date >= new Date(startDate) && date <= new Date(endDate);
  });

  const filteredTransactions = transactions.filter(t => {
    const date = new Date(t.transaction_date);
    return date >= new Date(startDate) && date <= new Date(endDate);
  });

  const totalPayables = filteredPayables.reduce((total, p) => total + p.amount_total, 0);
  const totalReceivables = filteredReceivables.reduce((total, r) => total + r.amount_total, 0);
  const totalDeposits = filteredTransactions
    .filter(t => t.type === 'DEPOSIT')
    .reduce((total, t) => total + t.amount, 0);
  const totalWithdrawals = filteredTransactions
    .filter(t => t.type === 'WITHDRAWAL')
    .reduce((total, t) => total + t.amount, 0);

  const expensesByCategory = filteredTransactions
    .filter(t => t.type === 'WITHDRAWAL' && t.category_id)
    .reduce((acc, t) => {
      const category = categories.find(c => c.id === t.category_id);
      if (!category) return acc;
      
      if (!acc[category.description]) {
        acc[category.description] = 0;
      }
      acc[category.description] += t.amount;
      return acc;
    }, {} as Record<string, number>);

  const incomesByCategory = filteredTransactions
    .filter(t => t.type === 'DEPOSIT' && t.category_id)
    .reduce((acc, t) => {
      const category = categories.find(c => c.id === t.category_id);
      if (!category) return acc;
      
      if (!acc[category.description]) {
        acc[category.description] = 0;
      }
      acc[category.description] += t.amount;
      return acc;
    }, {} as Record<string, number>);

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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Relatório Financeiro</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">até</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
      <div className="grid gap-6 md:grid-cols-12 mb-8">
        <Card className="md:col-span-3 bg-white shadow-lg border-0">
          <CardHeader className="border-b bg-gray-50/50 pb-4">
            <CardTitle className="text-sm font-medium text-gray-500">
              Saldo Atual
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

        <Card className="md:col-span-3 bg-white shadow-lg border-0">
          <CardHeader className="border-b bg-gray-50/50 pb-4">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total de Saídas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-red-500">
                {formatCurrency(totalWithdrawals)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 bg-white shadow-lg border-0">
          <CardHeader className="border-b bg-gray-50/50 pb-4">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total de Entradas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold text-green-500">
                {formatCurrency(totalDeposits)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 bg-white shadow-lg border-0">
          <CardHeader className="border-b bg-gray-50/50 pb-4">
            <CardTitle className="text-sm font-medium text-gray-500">
              Resultado do Período
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-purple-500" />
              <span className={`text-2xl font-bold ${
                totalDeposits - totalWithdrawals >= 0 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`}>
                {formatCurrency(totalDeposits - totalWithdrawals)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análise por Categoria */}
      <div className="grid gap-6 md:grid-cols-12 mb-8">
        <Card className="md:col-span-6 bg-white shadow-lg border-0">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <ArrowDownCircle className="w-5 h-5 text-red-500" />
              Despesas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {Object.keys(expensesByCategory).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma despesa no período
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(expensesByCategory)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">{category}</span>
                      <span className="font-bold text-red-500">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-6 bg-white shadow-lg border-0">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5 text-green-500" />
              Receitas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {Object.keys(incomesByCategory).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma receita no período
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(incomesByCategory)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">{category}</span>
                      <span className="font-bold text-green-500">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transações do Período */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Transações do Período
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma transação no período
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {transaction.type === 'DEPOSIT' ? (
                            <ArrowUpCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <ArrowDownCircle className="w-4 h-4 text-red-500" />
                          )}
                          {transaction.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.category_id 
                          ? categories.find(c => c.id === transaction.category_id)?.description 
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {format(new Date(transaction.transaction_date), "dd 'de' MMMM", { locale: ptBR })}
                      </TableCell>
                      <TableCell className={
                        transaction.type === 'DEPOSIT' 
                          ? "text-green-600 font-medium text-right" 
                          : "text-red-600 font-medium text-right"
                      }>
                        {transaction.type === 'DEPOSIT' ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
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
  );
}

export default withAuth(FinancialReportPage); 