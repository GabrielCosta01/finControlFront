'use client';
import React, { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { FaTachometerAlt, FaTags, FaWallet, FaPiggyBank, FaArrowDown, FaArrowUp, FaFileAlt, FaChartBar, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

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

interface LogoutItem extends MenuItemBase {
  action: () => void;
}

type MenuItemType = MenuItem | DividerItem | LogoutItem;

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const pathname = usePathname() || '';
  const { isAuthenticated, currentUser, logout } = useAuth();
  
  // Define the menu items
  const menuItems: MenuItemType[] = [
    { icon: <FaTachometerAlt />, label: 'Dashboard', path: '/dashboard', page: 'Dashboard' },
    { icon: <FaTags />, label: 'Categorias', path: '/categories', page: 'Categories' },
    { icon: <FaWallet />, label: 'Bancos', path: '/banks', page: 'Banks' },
    { icon: <FaPiggyBank />, label: 'Cofres', path: '/safes', page: 'Safes' },
    { icon: <FaArrowUp />, label: 'Rendas Extras', path: '/extra-income', page: 'ExtraIncome' },
    { divider: true },
    // { icon: <FaFileAlt />, label: 'Relatório Contas a Pagar', path: '/payables-report', page: 'PayablesReport' },
    // { icon: <FaFileAlt />, label: 'Relatório Contas a Receber', path: '/receivables-report', page: 'ReceivablesReport' },
    { icon: <FaChartBar />, label: 'Relatório Mensal', path: '/financial-report', page: 'FinancialReport' },
    { divider: true },
    { icon: <FaSignOutAlt />, label: 'Sair', action: logout },
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

  // Obter a primeira letra do nome para o avatar (ou "U" como fallback)
  const userInitial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
  const userName = currentUser?.name || 'Usuário';
  const userEmail = currentUser?.email || 'usuario@exemplo.com';

  // Log de diagnóstico para depuração
  console.log('ClientLayout render - currentUser:', currentUser);
  console.log('ClientLayout render - isAuthenticated:', isAuthenticated);

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
            ) : 'action' in item ? (
              <button
                key={idx}
                onClick={item.action}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors w-full text-left"
              >
                {item.icon}<span>{item.label}</span>
              </button>
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