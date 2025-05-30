'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Tag, Trash2, RefreshCw, Edit, Check, X } from "lucide-react";
import { Category } from '@/api/entities';
import { toast } from 'react-toastify';

interface CategoryType {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await Category.list();
      setCategories(categoriesData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      toast.error("Não foi possível carregar as categorias. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      toast.warning("Por favor, insira um nome para a categoria");
      return;
    }

    try {
      setLoading(true);
      await Category.create({
        name: newCategory.name.trim(),
        description: newCategory.description.trim() || newCategory.name.trim()
      });
      setNewCategory({
        name: '',
        description: ''
      });
      toast.success("Categoria criada com sucesso!");
      await fetchCategories();
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      toast.error("Não foi possível criar a categoria. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) {
      return;
    }
    
    try {
      setLoading(true);
      await Category.delete(id);
      toast.success("Categoria excluída com sucesso!");
      await fetchCategories();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      toast.error("Não foi possível excluir a categoria. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  const startEditing = (category: CategoryType) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditDescription(category.description || category.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const saveEditing = async () => {
    if (!editingId || !editName.trim()) {
      return;
    }

    try {
      setLoading(true);
      await Category.update(editingId, { 
        name: editName.trim(),
        description: editDescription.trim() || editName.trim()
      });
      toast.success("Categoria atualizada com sucesso!");
      setEditingId(null);
      await fetchCategories();
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      toast.error("Não foi possível atualizar a categoria. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchCategories}
              variant="outline"
              size="sm"
              disabled={loading}
              className="text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formulário de Nova Categoria */}
          <div className="lg:col-span-4">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-500" />
                  Nova Categoria
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nome da Categoria <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        placeholder="Ex: Alimentação"
                        disabled={loading}
                        className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Descrição <span className="text-gray-400">(opcional)</span>
                      </label>
                      <Input
                        id="description"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        placeholder="Ex: Gastos com supermercado e restaurantes"
                        disabled={loading}
                        className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 border-0"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Categoria
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Categorias */}
          <div className="lg:col-span-8">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Tag className="w-5 h-5 text-blue-500" />
                  Categorias Cadastradas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {loading && categories.length === 0 ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 mx-auto mb-2 text-blue-500 animate-spin" />
                    <p className="text-gray-500">Carregando categorias...</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {categories.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                        <Tag className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>Nenhuma categoria cadastrada</p>
                        <p className="text-sm text-gray-400">Adicione uma categoria usando o formulário ao lado</p>
                      </div>
                    ) : (
                      categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow transition-shadow"
                        >
                          {editingId === category.id ? (
                            <div className="flex-1 flex items-center gap-2">
                              <div className="flex-1 space-y-2">
                                <Input
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                  placeholder="Nome da categoria"
                                  autoFocus
                                />
                                <Input
                                  value={editDescription}
                                  onChange={(e) => setEditDescription(e.target.value)}
                                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                  placeholder="Descrição (opcional)"
                                />
                              </div>
                              <Button
                                onClick={saveEditing}
                                variant="ghost"
                                size="sm"
                                disabled={loading}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={cancelEditing}
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="flex flex-col gap-1">
                                <span className="font-medium text-gray-900">{category.name}</span>
                                {category.description && category.description !== category.name && (
                                  <span className="text-sm text-gray-500">{category.description}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() => startEditing(category)}
                                  variant="ghost"
                                  size="sm"
                                  disabled={loading}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDelete(category.id)}
                                  variant="ghost"
                                  size="sm"
                                  disabled={loading}
                                  className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
