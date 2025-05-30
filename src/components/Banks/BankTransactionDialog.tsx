import React, { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Bank, Expense, ExtraIncome } from "@/api/entities/all";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Loader2, Building2 } from "lucide-react";

interface BankTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  bank: {
    id: string;
    name: string;
    currentBalance: number;
  };
  type: "DEPOSIT" | "WITHDRAWAL";
  categories: Array<{
    id: string;
    description: string;
  }>;
  onTransactionComplete: () => void;
}

export default function BankTransactionDialog({
  open,
  onClose,
  bank,
  type,
  categories,
  onTransactionComplete
}: BankTransactionDialogProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    setLoading(true);
    try {
      // Create transaction record based on type
      if (type === "WITHDRAWAL") {
        await Expense.create({
          name: description.trim(),
          value: parseFloat(amount),
          categoryId: categoryId || categories[0].id,
          bankId: bank.id,
          expenseDate: new Date().toISOString().slice(0, 10)
        });
      } else {
        await ExtraIncome.create({
          description: description.trim(),
          amount: parseFloat(amount),
          categoryId: categoryId || categories[0].id,
          date: new Date().toISOString().slice(0, 10)
        });
      }

      // Update bank balance
      const newBalance = type === "DEPOSIT" 
        ? bank.currentBalance + parseFloat(amount)
        : bank.currentBalance - parseFloat(amount);
      
      await Bank.update(bank.id, {
        balance: newBalance
      });

      onTransactionComplete();
      onClose();

    } catch (error) {
      console.error("Error processing transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const DialogIcon = type === "DEPOSIT" ? ArrowUpCircle : ArrowDownCircle;
  const dialogTitle = type === "DEPOSIT" ? "Depositar" : "Sacar";
  const dialogColor = type === "DEPOSIT" ? "text-green-600" : "text-red-600";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg border border-gray-200/80">
        <DialogHeader className="space-y-3 border-b border-gray-100 pb-4 bg-gradient-to-br from-white to-gray-50/80">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <DialogIcon className={`h-5 w-5 ${dialogColor} transition-transform duration-200 hover:scale-110`} />
            {dialogTitle}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-gray-600">
            <Building2 className="h-4 w-4" />
            {bank?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Descrição
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Descreva ${type === "DEPOSIT" ? "o depósito" : "o saque"}`}
                className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-md"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                Valor
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  R$
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="pl-8 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                Categoria
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger 
                  id="category" 
                  className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-md bg-white"
                >
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                  <SelectItem value="" className="text-gray-500 hover:bg-gray-50 transition-colors duration-200">
                    Sem categoria
                  </SelectItem>
                  {categories.map(category => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      {category.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 border-t border-gray-100 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border-gray-200 hover:border-gray-300 transition-colors duration-200"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className={`flex-1 ${
                type === "DEPOSIT" 
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" 
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              } text-white transition-all duration-200 shadow-sm hover:shadow rounded-md`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  {type === "DEPOSIT" ? "Depositar" : "Sacar"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}