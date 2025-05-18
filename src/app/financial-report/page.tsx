import React, { useState, useEffect } from 'react';
import { Bank, Safe, Payable, Receivable, Transaction, Category } from '@/api/entities/all';
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

interface BankData {
  id: string;
  name: string;
  balance: number;
}

interface SafeData {
  id: string;
  name: string;
  balance: number;
  currency: string;
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

export default function FinancialReport() {
  const [banks, setBanks] = useState<BankData[]>([]);
  const [safes, setSafes] = useState<SafeData[]>([]);
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
    const [banksData, safesData, payablesData, receivablesData, transactionsData, categoriesData] = await Promise.all([
      Bank.list(),
      Safe.list(),
      Payable.list(),
      Receivable.list(),
      Transaction.list('-transaction_date'),
      Category.list()
    ]);
    
    setBanks(banksData);
    setSafes(safesData);
    setPayables(payablesData);
    setReceivables(receivablesData);
    setTransactions(transactionsData);
    setCategories(categoriesData);
  };

  const totalBankBalance = banks.reduce((total, bank) => total + bank.balance, 0);
  const totalSafeBalance = safes.reduce((total, safe) => {
    if (safe.currency === 'BRL') return total + safe.balance;
    return total;
  }, 0);
  const totalBalance = totalBankBalance + totalSafeBalance;

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
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalBalance)}
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
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalWithdrawals)}
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
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalDeposits)}
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
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalDeposits - totalWithdrawals)}
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
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(amount)}
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
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(amount)}
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
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(transaction.amount)}
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