'use client';

import React, { useState, useEffect } from 'react';
import { Bank, Safe, Payable, Receivable, Transaction } from '@/api/entities/all';
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
}

interface ReceivableData {
  id: string;
  description: string;
  amount_total: number;
  due_date: string;
  status: 'PENDING' | 'RECEIVED' | 'LATE';
}

interface TransactionData {
  id: string;
  description: string;
  amount: number;
  transaction_date: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
}

export default function Dashboard() {
  const [banks, setBanks] = useState<BankData[]>([]);
  const [safes, setSafes] = useState<SafeData[]>([]);
  const [payables, setPayables] = useState<PayableData[]>([]);
  const [receivables, setReceivables] = useState<ReceivableData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [banksData, safesData, payablesData, receivablesData, transactionsData] = await Promise.all([
      Bank.list(),
      Safe.list(),
      Payable.list(),
      Receivable.list(),
      Transaction.list('-transaction_date')
    ]);
    
    setBanks(banksData);
    setSafes(safesData);
    setPayables(payablesData);
    setReceivables(receivablesData);
    setTransactions(transactionsData);
  };

  const totalBankBalance = banks.reduce((total, bank) => total + bank.balance, 0);
  const totalSafeBalance = safes.reduce((total, safe) => {
    if (safe.currency === 'BRL') return total + safe.balance;
    return total;
  }, 0);
  const totalBalance = totalBankBalance + totalSafeBalance;

  const totalPayables = payables
    .filter(p => p.status === 'PENDING')
    .reduce((total, p) => total + p.amount_total, 0);

  const totalReceivables = receivables
    .filter(r => r.status === 'PENDING')
    .reduce((total, r) => total + r.amount_total, 0);

  const projectedBalance = totalBalance - totalPayables + totalReceivables;

  const recentTransactions = transactions.slice(0, 5);
  const upcomingPayables = payables
    .filter(p => p.status === 'PENDING')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);
  const upcomingReceivables = receivables
    .filter(r => r.status === 'PENDING')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1400px]">
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
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalBalance)}
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
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalPayables)}
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
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalReceivables)}
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
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(projectedBalance)}
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
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(bank.balance)}
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
            {safes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum cofre cadastrado
              </div>
            ) : (
              <div className="space-y-4">
                {safes.map(safe => (
                  <div key={safe.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <PiggyBank className="w-5 h-5 text-purple-500" />
                      <div>
                        <span className="font-medium">{safe.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({safe.currency})</span>
                      </div>
                    </div>
                    <span className="font-bold">
                      {new Intl.NumberFormat(safe.currency === 'BRL' ? 'pt-BR' : 'en-US', {
                        style: 'currency',
                        currency: safe.currency
                      }).format(safe.balance)}
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
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma transação recente
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
                  {recentTransactions.map(transaction => (
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
            )}
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="border-b bg-gray-50/50">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <ArrowDownCircle className="w-5 h-5 text-red-500" />
                Próximos Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {upcomingPayables.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum pagamento pendente
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
                    {upcomingPayables.map(payable => (
                      <TableRow key={payable.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <ArrowDownCircle className="w-4 h-4 text-red-500" />
                            {payable.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(payable.due_date), "dd 'de' MMMM", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-red-600 font-medium text-right">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(payable.amount_total)}
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
                Próximos Recebimentos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {upcomingReceivables.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum recebimento pendente
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
                    {upcomingReceivables.map(receivable => (
                      <TableRow key={receivable.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <ArrowUpCircle className="w-4 h-4 text-green-500" />
                            {receivable.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(receivable.due_date), "dd 'de' MMMM", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-green-600 font-medium text-right">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(receivable.amount_total)}
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
    </div>
  );
} 