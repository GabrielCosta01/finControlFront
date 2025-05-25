'use client';
import React, { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { FaTachometerAlt, FaTags, FaWallet, FaPiggyBank, FaArrowDown, FaArrowUp, FaFileAlt, FaChartBar, FaBars, FaTimes } from 'react-icons/fa';

interface ClientLayoutProps {
  children: ReactNode;
}

// Definição de tipos para os itens do menu
interface MenuItemBase {
  icon?: React.ReactNode;
  label?: string;
}

interface MenuItem extends MenuItemBase {
  path: string;
  page: string;
}

interface DividerItem {
  divider: boolean;
}

type MenuItemType = MenuItem | DividerItem;

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const auth = useSelector((state: RootState) => state.auth);
  const [currentPage, setCurrentPage] = useState('');
  const pathname = usePathname() || '';

  // Define the menu items
  const menuItems: MenuItemType[] = [
    { icon: <FaTachometerAlt />, label: 'Dashboard', path: '/dashboard', page: 'Dashboard' },
    { icon: <FaTags />, label: 'Categorias', path: '/categories', page: 'Categories' },
    { icon: <FaWallet />, label: 'Bancos', path: '/banks', page: 'Banks' },
    { icon: <FaPiggyBank />, label: 'Cofres', path: '/safes', page: 'Safes' },
    { icon: <FaArrowDown />, label: 'Contas a Pagar', path: '/payables', page: 'Payables' },
    { icon: <FaArrowUp />, label: 'Contas a Receber', path: '/receivables', page: 'Receivables' },
    { divider: true },
    { icon: <FaFileAlt />, label: 'Relatório Contas a Pagar', path: '/payables-report', page: 'PayablesReport' },
    { icon: <FaFileAlt />, label: 'Relatório Contas a Receber', path: '/receivables-report', page: 'ReceivablesReport' },
    { icon: <FaChartBar />, label: 'Relatório Financeiro', path: '/financial-report', page: 'FinancialReport' },
  ];

  // Update current page based on pathname
  useEffect(() => {
    const currentItem = menuItems.find(item => 
      'path' in item && pathname.startsWith(item.path)
    );
    
    if (currentItem && 'page' in currentItem) {
      setCurrentPage(currentItem.page);
    }
  }, [pathname]);

  // Placeholder para informações do usuário
  const userInitial = 'U';
  const userName = 'Usuário';
  const userEmail = 'usuario@exemplo.com';

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">FinanceControl</h1>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><FaTimes size={24} /></button>
        </div>
        <div className="p-4 border-b flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-medium">{userInitial}</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{userName}</p>
            <p className="text-sm text-gray-500">{userEmail}</p>
          </div>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {menuItems.map((item, idx) => 
            'divider' in item && item.divider ? (
              <div key={idx} className="h-px bg-gray-200 my-4" />
            ) : (
              <Link 
                key={idx} 
                href={('path' in item) ? item.path : '#'}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ${
                  ('page' in item && currentPage === item.page) ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                {('icon' in item) && item.icon}<span>{('label' in item) && item.label}</span>
              </Link>
            )
          )}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 lg:hidden bg-white border-b px-4 py-3">
          <button onClick={() => setSidebarOpen(true)}><FaBars size={24} /></button>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
} 