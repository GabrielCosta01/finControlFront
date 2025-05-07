'use client';
import React, { useState, useEffect } from 'react';
import { Bank, Category, Transaction } from '@/api/entities/all';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Plus, Building2, ArrowUpCircle, ArrowDownCircle, History } from "lucide-react";
import BankTransactionDialog from '@/components/Banks/BankTransactionDialog';
import TransactionHistory from '@/components/Transactions/TransactionHistory';

export default function Banks() {
  const [banks, setBanks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newBank, setNewBank] = useState({ name: "", balance: "" });
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [currentBank, setCurrentBank] = useState(null);
  const [transactionType, setTransactionType] = useState(null);

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
    setTransactions(transactionsData.filter(t => t.bank_id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newBank.name.trim() || !newBank.balance) return;

    await Bank.create({
      name: newBank.name.trim(),
      balance: parseFloat(newBank.balance)
    });

    setNewBank({ name: "", balance: "" });
    loadData();
  };

  const openTransactionDialog = (bank, type) => {
    setCurrentBank(bank);
    setTransactionType(type);
    setTransactionDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Bancos</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Novo Banco</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Input
                  value={newBank.name}
                  onChange={(e) => setNewBank({ ...newBank, name: e.target.value })}
                  placeholder="Nome do banco"
                  maxLength={100}
                />
              </div>
              <div>
                <Input
                  type="number"
                  step="0.01"
                  value={newBank.balance}
                  onChange={(e) => setNewBank({ ...newBank, balance: e.target.value })}
                  placeholder="Saldo inicial"
                />
              </div>
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Banco
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {banks.map((bank) => (
          <Card key={bank.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                {bank.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                  .format(bank.balance)}
              </div>
              <p className="text-xs text-gray-500">
                Criado em {new Intl.DateTimeFormat('pt-BR').format(new Date(bank.created_date))}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 pt-0">
              <Button 
                onClick={() => openTransactionDialog(bank, "DEPOSIT")}
                variant="outline" 
                className="flex-1"
              >
                <ArrowUpCircle className="w-4 h-4 mr-2 text-green-500" />
                Depositar
              </Button>
              <Button 
                onClick={() => openTransactionDialog(bank, "WITHDRAWAL")}
                variant="outline" 
                className="flex-1"
              >
                <ArrowDownCircle className="w-4 h-4 mr-2 text-red-500" />
                Sacar
              </Button>
            </CardFooter>
          </Card>
        ))}
        {banks.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="text-center text-gray-500 py-6">
              Nenhum banco cadastrado
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Transações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionHistory 
            transactions={transactions} 
            categories={categories}
            banks={banks}
            safes={[]}
          />
        </CardContent>
      </Card>

      {currentBank && (
        <BankTransactionDialog
          open={transactionDialogOpen}
          onClose={() => setTransactionDialogOpen(false)}
          bank={currentBank}
          type={transactionType}
          categories={categories}
          onTransactionComplete={loadData}
        />
      )}
    </div>
  );
}