'use client';
import React, { useState, useEffect } from 'react';
import { Bank, Category, Transaction } from '@/api/entities/all';

interface BankData {
  id: string;
  name: string;
  balance: number;
  created_date: string;
  updated_date?: string;
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
} from "@/components/ui/card";
import { Plus, Building2, ArrowUpCircle, ArrowDownCircle, History, RefreshCw } from "lucide-react";
import BankTransactionDialog from '@/components/Banks/BankTransactionDialog';
import TransactionHistory from '@/components/Transactions/TransactionHistory';

export default function Banks() {
  const [banks, setBanks] = useState<BankData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [newBank, setNewBank] = useState({ name: "", balance: "" });
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [currentBank, setCurrentBank] = useState<BankData | null>(null);
  const [transactionType, setTransactionType] = useState<'DEPOSIT' | 'WITHDRAWAL' | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [banksData, categoriesData, transactionsData] = await Promise.all([
      Bank.list(),
      Category.list(),
      Transaction.list('-transaction_date')
    ]);
    
    setBanks(banksData);
    setCategories(categoriesData);
    setTransactions(transactionsData.filter((t: TransactionData) => t.bank_id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBank.name.trim() || !newBank.balance) return;

    await Bank.create({
      name: newBank.name.trim(),
      balance: parseFloat(newBank.balance)
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
    <div className="h-full w-full">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bancos</h1>
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
          {/* Formulário de Novo Banco */}
          <div className="lg:col-span-4">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-500" />
                  Novo Banco
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <Input
                      value={newBank.name}
                      onChange={(e) => setNewBank({ ...newBank, name: e.target.value })}
                      placeholder="Nome do banco"
                      className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={newBank.balance}
                      onChange={(e) => setNewBank({ ...newBank, balance: e.target.value })}
                      placeholder="Saldo inicial"
                      className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 border-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Banco
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Bancos */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banks.map((bank) => (
                <Card key={bank.id} className="bg-white shadow-lg border-0">
                  <CardHeader className="border-b bg-gray-50/50 pb-4">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-500" />
                      {bank.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                        .format(bank.balance)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Atualizado em {new Intl.DateTimeFormat('pt-BR', {
                        dateStyle: 'long',
                        timeStyle: 'short'
                      }).format(new Date(bank.updated_date || bank.created_date))}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2 pt-0 border-t">
                    <Button 
                      onClick={() => openTransactionDialog(bank, "DEPOSIT")}
                      variant="ghost"
                      className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <ArrowUpCircle className="w-4 h-4 mr-2" />
                      Depositar
                    </Button>
                    <Button 
                      onClick={() => openTransactionDialog(bank, "WITHDRAWAL")}
                      variant="ghost"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ArrowDownCircle className="w-4 h-4 mr-2" />
                      Sacar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {banks.length === 0 && (
                <Card className="md:col-span-2 bg-white shadow-lg border-0">
                  <CardContent className="text-center py-8">
                    <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Nenhum banco cadastrado</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Adicione um banco usando o formulário ao lado
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