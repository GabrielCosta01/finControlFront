'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Tag } from "lucide-react";
import { Category } from '@/api/entities/all';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState({
    description: '',
    type: 'EXPENSE', // EXPENSE ou INCOME
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await Category.list();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.description.trim()) return;

    try {
      await Category.create(newCategory);
      setNewCategory({
        description: '',
        type: 'EXPENSE',
      });
      await fetchCategories();
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await Category.delete(id);
      await fetchCategories();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    }
  };

  const handleTypeToggle = (id: string, currentType: string) => {
    const newType = currentType === 'EXPENSE' ? 'INCOME' : 'EXPENSE';
    
    Category.update(id, { type: newType })
      .then(() => fetchCategories())
      .catch(error => console.error("Erro ao alterar tipo:", error));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categorias</h1>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Categoria</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Nome da categoria"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={newCategory.type === 'EXPENSE' ? 'default' : 'outline'}
                  className={newCategory.type === 'EXPENSE' ? 'bg-red-600 hover:bg-red-700' : ''}
                  onClick={() => setNewCategory({ ...newCategory, type: 'EXPENSE' })}
                >
                  Despesa
                </Button>
                <Button
                  type="button"
                  variant={newCategory.type === 'INCOME' ? 'default' : 'outline'}
                  className={newCategory.type === 'INCOME' ? 'bg-green-600 hover:bg-green-700' : ''}
                  onClick={() => setNewCategory({ ...newCategory, type: 'INCOME' })}
                >
                  Receita
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Adicionar Categoria
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{category.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`px-2 text-xs ${
                        category.type === 'EXPENSE' 
                          ? 'text-red-600 border-red-200 bg-red-50 hover:bg-red-100' 
                          : 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100'
                      }`}
                      onClick={() => handleTypeToggle(category.id, category.type)}
                    >
                      {category.type === 'EXPENSE' ? 'Despesa' : 'Receita'}
                    </Button>
                    <Button
                      size="sm" 
                      variant="outline" 
                      className="px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(category.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
              
              {categories.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  Nenhuma categoria cadastrada
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
