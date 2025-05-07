'use client';
import React, { useState, useEffect } from 'react';
import { Safe, Bank, Category, Transaction } from '@/api/entities/all';
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
import { Plus, PiggyBank, ArrowUpCircle, ArrowDownCircle, History } from "lucide-react";
import SafeTransactionDialog from '@/components/Safes/SafeTransactionDialog';
import TransactionHistory from '@/components/Transactions/TransactionHistory';

export default function Safes() {
  const [safes, setSafes] = useState([]);
  const [banks, setBanks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newSafe, setNewSafe] = useState({
    name: "",
    balance: "",
    currency: "BRL",
    bank_id: ""
  });
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [currentSafe, setCurrentSafe] = useState(null);
  const [transactionType, setTransactionType] = useState(null);

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
    setTransactions(transactionsData.filter(t => t.safe_id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newSafe.name.trim() || !newSafe.balance) return;

    await Safe.create({
      name: newSafe.name.trim(),
      balance: parseFloat(newSafe.balance),
      currency: newSafe.currency,
      bank_id: newSafe.bank_id || undefined
    });

    setNewSafe({
      name: "",
      balance: "",
      currency: "BRL",
      bank_id: ""
    });
    loadData();
  };

  const openTransactionDialog = (safe, type) => {
    setCurrentSafe(safe);
    setTransactionType(type);
    setTransactionDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Cofres</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Novo Cofre</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Input
                  value={newSafe.name}
                  onChange={(e) => setNewSafe({ ...newSafe, name: e.target.value })}
                  placeholder="Nome do cofre"
                  maxLength={50}
                />
              </div>
              <div>
                <Input
                  type="number"
                  step="0.01"
                  value={newSafe.balance}
                  onChange={(e) => setNewSafe({ ...newSafe, balance: e.target.value })}
                  placeholder="Saldo inicial"
                />
              </div>
              <div>
                <Select
                  value={newSafe.currency}
                  onValueChange={(value) => setNewSafe({ ...newSafe, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Moeda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real (BRL)</SelectItem>
                    <SelectItem value="USD">Dólar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={newSafe.bank_id}
                  onValueChange={(value) => setNewSafe({ ...newSafe, bank_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Banco vinculado (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Nenhum</SelectItem>
                    {banks.map(bank => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Cofre
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {safes.map((safe) => (
          <Card key={safe.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-purple-600" />
                {safe.name}
              </CardTitle>
              <span className="text-sm font-medium text-gray-500">
                {safe.currency}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat(safe.currency === 'BRL' ? 'pt-BR' : 'en-US', {
                  style: 'currency',
                  currency: safe.currency
                }).format(safe.balance)}
              </div>
              {safe.bank_id && (
                <p className="text-sm text-gray-500 mt-1">
                  Vinculado a: {banks.find(b => b.id === safe.bank_id)?.name}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Criado em {new Intl.DateTimeFormat('pt-BR').format(new Date(safe.created_date))}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 pt-0">
              <Button 
                onClick={() => openTransactionDialog(safe, "DEPOSIT")}
                variant="outline" 
                className="flex-1"
              >
                <ArrowUpCircle className="w-4 h-4 mr-2 text-green-500" />
                Depositar
              </Button>
              <Button 
                onClick={() => openTransactionDialog(safe, "WITHDRAWAL")}
                variant="outline" 
                className="flex-1"
              >
                <ArrowDownCircle className="w-4 h-4 mr-2 text-red-500" />
                Sacar
              </Button>
            </CardFooter>
          </Card>
        ))}
        {safes.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="text-center text-gray-500 py-6">
              Nenhum cofre cadastrado
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
            safes={safes}
          />
        </CardContent>
      </Card>

      {currentSafe && (
        <SafeTransactionDialog
          open={transactionDialogOpen}
          onClose={() => setTransactionDialogOpen(false)}
          safe={currentSafe}
          type={transactionType}
          categories={categories}
          onTransactionComplete={loadData}
        />
      )}
    </div>
  );
}