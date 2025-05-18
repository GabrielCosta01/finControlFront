'use client';

import React, { useState, useEffect } from 'react';
import { Safe, Bank, Category, Transaction } from '@/api/entities/all';

interface SafeData {
  id: string;
  name: string;
  balance: number;
  currency: string;
  bank_id?: string;
  created_date: string;
  updated_date?: string;
}

interface BankData {
  id: string;
  name: string;
}

interface CategoryData {
  id: string;
  description: string;
  type: 'EXPENSE' | 'INCOME';
}

interface TransactionData {
  id: string;
  description: string;
  amount: number;
  transaction_date: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  category_id?: string;
  safe_id?: string;
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
  CardFooter,
} from "@/components/ui/card";
import { Plus, PiggyBank, ArrowUpCircle, ArrowDownCircle, History, RefreshCw } from "lucide-react";
import SafeTransactionDialog from '@/components/Safes/SafeTransactionDialog';
import TransactionHistory from '@/components/Transactions/TransactionHistory';

export default function Safes() {
  const [safes, setSafes] = useState<SafeData[]>([]);
  const [banks, setBanks] = useState<BankData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [newSafe, setNewSafe] = useState({
    name: "",
    balance: "",
    currency: "BRL",
    bank_id: "none"
  });
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [currentSafe, setCurrentSafe] = useState<SafeData | null>(null);
  const [transactionType, setTransactionType] = useState<'DEPOSIT' | 'WITHDRAWAL' | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [safesData, banksData, categoriesData, transactionsData] = await Promise.all([
      Safe.list(),
      Bank.list(),
      Category.list(),
      Transaction.list('-transaction_date')
    ]);
    
    setSafes(safesData);
    setBanks(banksData);
    setCategories(categoriesData);
    setTransactions(transactionsData.filter((t: TransactionData) => t.safe_id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSafe.name.trim() || !newSafe.balance) return;

    await Safe.create({
      name: newSafe.name.trim(),
      balance: parseFloat(newSafe.balance),
      currency: newSafe.currency,
      bank_id: newSafe.bank_id === "none" ? undefined : newSafe.bank_id
    });

    setNewSafe({
      name: "",
      balance: "",
      currency: "BRL",
      bank_id: "none"
    });
    loadData();
  };

  const openTransactionDialog = (safe: SafeData, type: 'DEPOSIT' | 'WITHDRAWAL') => {
    setCurrentSafe(safe);
    setTransactionType(type);
    setTransactionDialogOpen(true);
  };

  return (
    <div className="h-full w-full">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cofres</h1>
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
          {/* Formulário de Novo Cofre */}
          <div className="lg:col-span-4">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-500" />
                  Novo Cofre
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <Input
                      value={newSafe.name}
                      onChange={(e) => setNewSafe({ ...newSafe, name: e.target.value })}
                      placeholder="Nome do cofre"
                      className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={newSafe.balance}
                      onChange={(e) => setNewSafe({ ...newSafe, balance: e.target.value })}
                      placeholder="Saldo inicial"
                      className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <Select
                      value={newSafe.currency}
                      onValueChange={(value) => setNewSafe({ ...newSafe, currency: value })}
                    >
                      <SelectTrigger className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue placeholder="Moeda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">Real (BRL)</SelectItem>
                        <SelectItem value="USD">Dólar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={newSafe.bank_id}
                      onValueChange={(value) => setNewSafe({ ...newSafe, bank_id: value })}
                    >
                      <SelectTrigger className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue placeholder="Vincular a um banco (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum banco</SelectItem>
                        {banks.map((bank) => (
                          <SelectItem key={bank.id} value={bank.id}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 border-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Cofre
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Cofres */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {safes.map((safe) => (
                <Card key={safe.id} className="bg-white shadow-lg border-0">
                  <CardHeader className="border-b bg-gray-50/50 pb-4">
                    <CardTitle className="text-lg font-medium flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PiggyBank className="w-5 h-5 text-purple-500" />
                        {safe.name}
                      </div>
                      <span className="text-sm font-normal text-gray-500">
                        {safe.currency}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {new Intl.NumberFormat(safe.currency === 'BRL' ? 'pt-BR' : 'en-US', {
                        style: 'currency',
                        currency: safe.currency
                      }).format(safe.balance)}
                    </div>
                    {safe.bank_id && (
                      <p className="text-sm text-gray-500 mt-2">
                        Vinculado a: {banks.find(b => b.id === safe.bank_id)?.name}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Atualizado em {new Intl.DateTimeFormat('pt-BR', {
                        dateStyle: 'long',
                        timeStyle: 'short'
                      }).format(new Date(safe.updated_date || safe.created_date))}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2 pt-0 border-t">
                    <Button 
                      onClick={() => openTransactionDialog(safe, "DEPOSIT")}
                      variant="ghost"
                      className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <ArrowUpCircle className="w-4 h-4 mr-2" />
                      Depositar
                    </Button>
                    <Button 
                      onClick={() => openTransactionDialog(safe, "WITHDRAWAL")}
                      variant="ghost"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ArrowDownCircle className="w-4 h-4 mr-2" />
                      Sacar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {safes.length === 0 && (
                <Card className="md:col-span-2 bg-white shadow-lg border-0">
                  <CardContent className="text-center py-8">
                    <PiggyBank className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Nenhum cofre cadastrado</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Adicione um cofre usando o formulário ao lado
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {currentSafe && transactionType && (
        <SafeTransactionDialog
          open={transactionDialogOpen}
          safe={currentSafe}
          type={transactionType}
          categories={categories}
          onClose={() => {
            setTransactionDialogOpen(false);
            setCurrentSafe(null);
            setTransactionType(null);
          }}
          onTransactionComplete={loadData}
        />
      )}
    </div>
  );
}