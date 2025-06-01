'use client';

import React, { useState, useEffect } from 'react';
import { Bank, Vault, Payable as Expense, ExtraIncome } from '@/api/entities/all';
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
import { withAuth } from '@/components/withAuth';

// Tipos
interface BankDto {
  id: string;
  name: string;
  description: string;
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  createdAt: string;
  updatedAt: string;
}

interface VaultDto {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  bankId?: string;
  bankName?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

enum BillStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  PAID_LATE = 'PAID_LATE'
}

interface DashboardBankData extends BankDto {}
interface DashboardVaultData extends VaultDto {}

interface DashboardExpenseData {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: BillStatus;
}

interface DashboardExtraIncomeData {
  amount: number;
  categoryId: string;
  description: string;
  date: string;
  id?: string;
  status?: 'PENDING' | 'RECEIVED';
}

function DashboardPage() {
  const [banks, setBanks] = useState<DashboardBankData[]>([]);
  const [vaults, setVaults] = useState<DashboardVaultData[]>([]);
  const [expenses, setExpenses] = useState<DashboardExpenseData[]>([]);
  const [extraIncomes, setExtraIncomes] = useState<DashboardExtraIncomeData[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Carrega os dados dos bancos primeiro
      const banksData = await Bank.list();
      setBanks(banksData);

      // Tenta carregar os outros dados
      try {
        const vaultsData = await Vault.list();
        setVaults(vaultsData);
      } catch (error) {
        console.error('Erro ao carregar cofres:', error);
        setVaults([]);
      }

      try {
        const billsData = await Expense.list();
        const processedExpenses = billsData.map(response => ({
          id: response.id,
          description: response.expense.description,
          amount: Number(response.expense.value) || 0,
          dueDate: response.dueDate,
          status: response.status
        }));
        setExpenses(processedExpenses);
      } catch (error) {
        console.error('Erro ao carregar despesas:', error);
        setExpenses([]);
      }

      try {
        const extraIncomesData = await ExtraIncome.list();
        const processedIncomes = extraIncomesData.map(income => ({
          ...income,
          description: income.description || '',
          status: 'PENDING' as const
        }));
        setExtraIncomes(processedIncomes);
      } catch (error) {
        console.error('Erro ao carregar rendas extras:', error);
        setExtraIncomes([]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setBanks([]);
      setVaults([]);
      setExpenses([]);
      setExtraIncomes([]);
    }
  };

  const totalBankBalance = banks.reduce((total, bank) => {
    return total + (Number(bank.currentBalance) || 0);
  }, 0);

  const totalVaultBalance = vaults.reduce((total, vault) => {
    if (vault.currency === 'BRL') {
      return total + (Number(vault.amount) || 0);
    }
    return total;
  }, 0);

  const totalBalance = totalBankBalance + totalVaultBalance;

  const totalExpenses = expenses
    .filter(p => p.status === BillStatus.PENDING)
    .reduce((total, p) => total + (Number(p.amount) || 0), 0);

  const totalExtraIncomes = extraIncomes
    .filter(r => r.status === 'PENDING')
    .reduce((total, r) => total + (Number(r.amount) || 0), 0);

  const projectedBalance = totalBalance - totalExpenses + totalExtraIncomes;

  const upcomingExpenses = expenses
    .filter(p => p.status === BillStatus.PENDING)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const upcomingExtraIncomes = extraIncomes
    .filter(r => r.status === 'PENDING')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
                        {format(new Date(expense.dueDate), "dd 'de' MMMM", { locale: ptBR })}
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
                          {format(new Date(expense.dueDate), "dd 'de' MMMM", { locale: ptBR })}
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

export default withAuth(DashboardPage); 