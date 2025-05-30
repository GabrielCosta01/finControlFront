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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Vault } from "@/api/entities/all";
import { PiggyBank, ArrowUpCircle, ArrowDownCircle, Loader2 } from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { ROUTES } from "@/api/apiRoutes";

interface SafeTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  safe: {
    id: string;
    name: string;
    balance: number;
    currency: string;
  };
  type: "DEPOSIT" | "WITHDRAWAL";
  categories: Array<{
    id: string;
    description: string;
  }>;
  onTransactionComplete: () => void;
}

export default function SafeTransactionDialog({
  open,
  onClose,
  safe,
  type,
  categories,
  onTransactionComplete
}: SafeTransactionDialogProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    setLoading(true);
    try {
      // Update safe balance
      const newBalance = type === "DEPOSIT" 
        ? safe.balance + parseFloat(amount)
        : safe.balance - parseFloat(amount);
      
      // Registramos a transação
      await axiosClient.post(ROUTES.TRANSACTIONS.BASE, {
        description,
        amount: parseFloat(amount),
        type,
        category_id: categoryId || undefined,
        safe_id: safe.id,
        transaction_date: new Date().toISOString()
      });

      // Atualizamos o saldo do cofre
      await Vault.update(safe.id, {
        name: safe.name,
        currency: safe.currency
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
  const dialogColor = type === "DEPOSIT" ? "text-green-700" : "text-red-700";
  const buttonColor = type === "DEPOSIT" 
    ? "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500" 
    : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-gray-800">
            <DialogIcon className={`h-5 w-5 ${dialogColor}`} />
            <span className="font-semibold">
              {dialogTitle} no cofre <span className="text-purple-700">{safe?.name}</span>
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">
              Descrição
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Depósito mensal"
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-700 font-medium">
              Valor
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 pl-7"
                required
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                {safe.currency === 'BRL' ? 'R$' : safe.currency === 'USD' ? '$' : '€'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-700 font-medium">
              Categoria (opcional)
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger 
                id="category"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              >
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Sem categoria</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-gray-200"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className={`${buttonColor} font-medium`}
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