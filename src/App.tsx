import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Beef, MapPin, Calendar, Phone, User, FileText, MessageCircle, Search, CheckCircle2, Share2, Trash2, Filter, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { beefCategories } from './data';
import { OrderItem, CustomerInfo, CutType } from './types';
import { OrderModal } from './components/OrderModal';
import { ObservationModal } from './components/ObservationModal';
import { CutCard } from './components/CutCard';

export default function App() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => {
    const saved = localStorage.getItem('bnCarnes_customerInfo');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing customer info from local storage', e);
      }
    }
    return {
      name: '',
      phone: '',
      address: '',
      deliveryDate: '',
      notes: '',
      pickupInStore: false,
    };
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('bnCarnes_orderItems');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing order items from local storage', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('bnCarnes_customerInfo', JSON.stringify(customerInfo));
  }, [customerInfo]);

  useEffect(() => {
    localStorage.setItem('bnCarnes_orderItems', JSON.stringify(orderItems));
  }, [orderItems]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<CutType | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<{ message: string; id: number } | null>(null);
  const [observationModalData, setObservationModalData] = useState<{ isOpen: boolean; cutId: string; cutName: string; initialObservation: string }>({
    isOpen: false,
    cutId: '',
    cutName: '',
    initialObservation: ''
  });

  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCustomerInfo(prev => ({ ...prev, [name]: checked }));
    } else {
      setCustomerInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const showToast = useCallback((message: string) => {
    setToastMessage({ message, id: Date.now() });
  }, []);

  const handleQuantityChange = useCallback((cutId: string, cutName: string, categoryName: string, delta: number) => {
    setOrderItems(prev => {
      const existingItem = prev.find(item => item.cutId === cutId);
      if (existingItem) {
        const newQuantity = Math.max(0, existingItem.quantityKg + delta);
        if (newQuantity === 0) {
          return prev.filter(item => item.cutId !== cutId);
        }
        if (delta > 0) {
          showToast(`+${delta}kg de ${cutName} adicionado`);
        }
        return prev.map(item => item.cutId === cutId ? { ...item, quantityKg: Number(newQuantity.toFixed(2)) } : item);
      } else {
        if (delta > 0) {
          showToast(`+${delta}kg de ${cutName} adicionado`);
          return [...prev, { cutId, cutName, categoryName, quantityKg: delta, observations: '' }];
        }
        return prev;
      }
    });
  }, [showToast]);

  const handleSetQuantity = useCallback((cutId: string, cutName: string, categoryName: string, quantity: number) => {
    setOrderItems(prev => {
      if (quantity <= 0) {
        return prev.filter(item => item.cutId !== cutId);
      }
      const existingItem = prev.find(item => item.cutId === cutId);
      if (existingItem) {
        return prev.map(item => item.cutId === cutId ? { ...item, quantityKg: quantity } : item);
      } else {
        return [...prev, { cutId, cutName, categoryName, quantityKg: quantity, observations: '' }];
      }
    });
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleObservationChange = useCallback((cutId: string, observations: string) => {
    setOrderItems(prev => prev.map(item => item.cutId === cutId ? { ...item, observations } : item));
  }, []);

  const openObservationModal = useCallback((cutId: string, cutName: string, initialObservation: string) => {
    setObservationModalData({
      isOpen: true,
      cutId,
      cutName,
      initialObservation
    });
  }, []);

  const getQuantity = (cutId: string) => {
    return orderItems.find(item => item.cutId === cutId)?.quantityKg || 0;
  };

  const getObservations = (cutId: string) => {
    return orderItems.find(item => item.cutId === cutId)?.observations || '';
  };

  const totalItems = orderItems.reduce((sum, item) => sum + item.quantityKg, 0);

  const generateOrderMessage = () => {
    let message = `*NOVO PEDIDO - BN CARNES (PEDIDOS)*\n\n`;
    message += `*DADOS DO CLIENTE*\n`;
    message += `Nome: ${customerInfo.name}\n`;
    message += `Telefone: ${customerInfo.phone}\n`;
    
    if (customerInfo.pickupInStore) {
      message += `Opção: *RETIRAR NO LOCAL*\n`;
    } else {
      message += `Endereço: ${customerInfo.address}\n`;
      message += `Data de Entrega: ${customerInfo.deliveryDate}\n`;
    }
    
    if (customerInfo.notes) message += `Observações: ${customerInfo.notes}\n`;
    
    message += `\n*ITENS DO PEDIDO*\n`;
    orderItems.forEach(item => {
      message += `- ${item.cutName} (${item.categoryName}): *${item.quantityKg} kg*\n`;
      if (item.observations) message += `  _Obs: ${item.observations}_\n`;
    });

    message += `\n*Peso Total Estimado:* ${totalItems.toFixed(2).replace('.', ',')} kg\n`;
    return encodeURIComponent(message);
  };

  const handleClearCart = () => {
    setIsClearConfirmOpen(true);
  };

  const confirmClearCart = () => {
    setOrderItems([]);
    setIsClearConfirmOpen(false);
    setIsModalOpen(false);
    showToast('Carrinho limpo');
  };

  const handleShareOrder = async () => {
    const message = decodeURIComponent(generateOrderMessage());
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pedido BN Carnes',
          text: message,
        });
        setIsModalOpen(false);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          // Fallback to WhatsApp if native share fails
          const encodedMessage = generateOrderMessage();
          window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
          setIsModalOpen(false);
        }
      }
    } else {
      // Fallback for browsers that don't support native sharing
      const encodedMessage = generateOrderMessage();
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
      setIsModalOpen(false);
    }
  };

  const hasResults = beefCategories.some(category => 
    category.cuts.some(cut => {
      const matchesFilter = activeFilter === 'todos' || cut.type === activeFilter;
      const matchesSearch = cut.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
  );

  const filterOptions = [
    { id: 'todos', label: 'Todos os Cortes' },
    { id: 'premium', label: '🌟 Linha Premium' },
    { id: 'tradicional', label: '🥩 Tradicionais' },
    { id: 'miudo', label: '🦴 Miúdos e Ossos' },
  ];

  const activeFilterOption = filterOptions.find(f => f.id === activeFilter) || filterOptions[0];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-24 selection:bg-red-200">
      {/* Header */}
      <header className="bg-zinc-950 text-white sticky top-0 z-40 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="BN Carnes Logo" className="w-12 h-12 rounded-xl shadow-lg shadow-red-900/20" referrerPolicy="no-referrer" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight leading-none mb-1 text-white">BN Carnes</h1>
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">(Pedidos)</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Customer Info Form */}
        <section className="bg-white rounded-3xl shadow-sm border border-zinc-200/60 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-zinc-100 pb-5">
            <h2 className="text-xl font-semibold text-zinc-800 flex items-center gap-2.5">
              <User className="w-5 h-5 text-red-600" />
              Informações do Cliente
            </h2>
            <label className="flex items-center gap-3 cursor-pointer group bg-zinc-50 px-4 py-2 rounded-full border border-zinc-200 hover:bg-zinc-100 transition-colors">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name="pickupInStore"
                  checked={customerInfo.pickupInStore}
                  onChange={handleCustomerInfoChange}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-zinc-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
              </div>
              <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">Retirar no Local</span>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-zinc-700 flex items-center gap-1.5">
                <User className="w-4 h-4 text-zinc-500" aria-hidden="true" /> Nome / Razão Social <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleCustomerInfoChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none"
                placeholder="Ex: Mercado Central"
                aria-required="true"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-zinc-700 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-zinc-500" aria-hidden="true" /> Telefone / WhatsApp <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleCustomerInfoChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none"
                placeholder="(00) 00000-0000"
                aria-required="true"
              />
            </div>
            <div className={`space-y-2 md:col-span-2 transition-all duration-300 ${customerInfo.pickupInStore ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
              <label htmlFor="address" className="text-sm font-medium text-zinc-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-zinc-500" aria-hidden="true" /> Endereço de Entrega {!customerInfo.pickupInStore && <span className="text-red-500" aria-hidden="true">*</span>}
              </label>
              <input
                id="address"
                type="text"
                name="address"
                value={customerInfo.address}
                onChange={handleCustomerInfoChange}
                disabled={customerInfo.pickupInStore}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none disabled:bg-zinc-100 disabled:text-zinc-500"
                placeholder="Rua, Número, Bairro, Cidade"
                aria-required={!customerInfo.pickupInStore}
              />
            </div>
            <div className={`space-y-2 transition-all duration-300 ${customerInfo.pickupInStore ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
              <label htmlFor="deliveryDate" className="text-sm font-medium text-zinc-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-zinc-500" aria-hidden="true" /> Data Desejada
              </label>
              <input
                id="deliveryDate"
                type="date"
                name="deliveryDate"
                value={customerInfo.deliveryDate}
                onChange={handleCustomerInfoChange}
                disabled={customerInfo.pickupInStore}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none disabled:bg-zinc-100 disabled:text-zinc-500"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="notes" className="text-sm font-medium text-zinc-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-zinc-500" aria-hidden="true" /> Observações Gerais
              </label>
              <textarea
                id="notes"
                name="notes"
                value={customerInfo.notes}
                onChange={handleCustomerInfoChange}
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none resize-none"
                placeholder="Instruções de entrega, horários, etc."
              />
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <div className="space-y-6">
          <div className="relative group">
            <label htmlFor="search" className="sr-only">Buscar cortes de carne</label>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" aria-hidden="true" />
            </div>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cortes de carne..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-zinc-200 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none text-zinc-800 placeholder:text-zinc-500"
            />
          </div>
          
          {/* Desktop Filters */}
          <div 
            className="hidden sm:flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x"
            role="group"
            aria-label="Filtros de categorias"
          >
            <button
              onClick={() => setActiveFilter('todos')}
              aria-pressed={activeFilter === 'todos'}
              className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all snap-start ${activeFilter === 'todos' ? 'bg-zinc-900 text-white shadow-md' : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300'}`}
            >
              Todos os Cortes
            </button>
            <button
              onClick={() => setActiveFilter('premium')}
              aria-pressed={activeFilter === 'premium'}
              className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all snap-start ${activeFilter === 'premium' ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300'}`}
            >
              🌟 Linha Premium
            </button>
            <button
              onClick={() => setActiveFilter('tradicional')}
              aria-pressed={activeFilter === 'tradicional'}
              className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all snap-start ${activeFilter === 'tradicional' ? 'bg-red-600 text-white shadow-md' : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300'}`}
            >
              🥩 Tradicionais
            </button>
            <button
              onClick={() => setActiveFilter('miudo')}
              aria-pressed={activeFilter === 'miudo'}
              className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all snap-start ${activeFilter === 'miudo' ? 'bg-zinc-600 text-white shadow-md' : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300'}`}
            >
              🦴 Miúdos e Ossos
            </button>
          </div>

          {/* Mobile Filters Dropdown */}
          <div className="sm:hidden relative">
            <button
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              aria-expanded={isFilterMenuOpen}
              aria-haspopup="listbox"
              aria-controls="mobile-filter-menu"
              className="w-full flex items-center justify-between px-5 py-3.5 bg-white border border-zinc-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Filter className="w-4 h-4 text-zinc-500" aria-hidden="true" />
                <span className="font-medium text-zinc-800">{activeFilterOption.label}</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isFilterMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>

            <AnimatePresence>
              {isFilterMenuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-30"
                    onClick={() => setIsFilterMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <motion.div
                    id="mobile-filter-menu"
                    role="listbox"
                    aria-label="Opções de filtro"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden z-40 origin-top"
                  >
                    <div className="flex flex-col py-1.5">
                      {filterOptions.map((option) => (
                        <button
                          key={option.id}
                          role="option"
                          aria-selected={activeFilter === option.id}
                          onClick={() => {
                            setActiveFilter(option.id as CutType | 'todos');
                            setIsFilterMenuOpen(false);
                          }}
                          className={`flex items-center justify-between px-5 py-3.5 text-left transition-colors ${activeFilter === option.id ? 'bg-red-50 text-red-700' : 'text-zinc-700 hover:bg-zinc-50'}`}
                        >
                          <span className="font-medium">{option.label}</span>
                          {activeFilter === option.id && <Check className="w-4 h-4 text-red-600" aria-hidden="true" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Product Categories */}
        <div className="space-y-10">
          {!hasResults ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-16 bg-white rounded-3xl border border-zinc-200 border-dashed shadow-sm"
            >
              <Search className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-zinc-900 mb-1">Nenhum corte encontrado</h3>
              <p className="text-zinc-500">Tente buscar por outro nome ou alterar os filtros.</p>
              {(searchQuery || activeFilter !== 'todos') && (
                <button 
                  onClick={() => { setSearchQuery(''); setActiveFilter('todos'); }}
                  className="mt-4 text-red-600 font-medium hover:text-red-700 hover:underline transition-colors"
                >
                  Limpar filtros e busca
                </button>
              )}
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {beefCategories.map((category) => {
                const filteredCuts = category.cuts.filter(cut => {
                  const matchesFilter = activeFilter === 'todos' || cut.type === activeFilter;
                  const matchesSearch = cut.name.toLowerCase().includes(searchQuery.toLowerCase());
                  return matchesFilter && matchesSearch;
                });
                
                if (filteredCuts.length === 0) return null;

                return (
                  <motion.section
                    key={category.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-3">
                      {category.name}
                      <span className="text-sm font-medium bg-zinc-100 text-zinc-500 px-3 py-1 rounded-full">{filteredCuts.length}</span>
                    </h3>
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <AnimatePresence mode="popLayout">
                        {filteredCuts.map((cut) => {
                          const quantity = getQuantity(cut.id);
                          
                          return (
                            <CutCard
                              key={cut.id}
                              cut={cut}
                              categoryName={category.name}
                              quantity={quantity}
                              observations={getObservations(cut.id)}
                              onQuantityChange={handleQuantityChange}
                              onSetQuantity={handleSetQuantity}
                              onOpenObservationModal={openObservationModal}
                            />
                          );
                        })}
                      </AnimatePresence>
                    </motion.div>
                  </motion.section>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Floating Action Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] p-4 z-40"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-zinc-500 font-medium">Total Estimado</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-900">{totalItems.toFixed(2).replace('.', ',')} <span className="text-base font-medium text-zinc-500">kg</span></span>
              {totalItems > 0 && totalItems < 20 && (
                <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-md whitespace-nowrap ml-1">Mín. 20kg</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {orderItems.length > 0 && (
              <button
                onClick={handleClearCart}
                aria-label="Limpar carrinho"
                className="p-3 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5" aria-hidden="true" />
              </button>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={totalItems === 0}
              aria-label={orderItems.length > 0 ? `Revisar Pedido com ${orderItems.length} itens` : 'Revisar Pedido'}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-200 disabled:text-zinc-500 text-white px-6 sm:px-8 py-3.5 rounded-xl font-medium transition-all shadow-sm disabled:shadow-none"
            >
              <ShoppingCart className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline" aria-hidden="true">Revisar Pedido</span>
              <span className="sm:hidden" aria-hidden="true">Revisar</span>
              {orderItems.length > 0 && (
                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full ml-1" aria-hidden="true">
                  {orderItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {isModalOpen && (
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          orderItems={orderItems}
          customerInfo={customerInfo}
          onShare={handleShareOrder}
          onClearCart={handleClearCart}
        />
      )}

      {observationModalData.isOpen && (
        <ObservationModal
          isOpen={observationModalData.isOpen}
          onClose={() => setObservationModalData(prev => ({ ...prev, isOpen: false }))}
          cutName={observationModalData.cutName}
          initialObservation={observationModalData.initialObservation}
          onSave={(obs) => handleObservationChange(observationModalData.cutId, obs)}
        />
      )}

      {/* Clear Cart Confirmation Modal */}
      <AnimatePresence>
        {isClearConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="clear-cart-title"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden p-6"
            >
              <h3 id="clear-cart-title" className="text-xl font-bold text-zinc-900 mb-2">Limpar Carrinho</h3>
              <p className="text-zinc-600 mb-6">Tem certeza que deseja remover todos os itens do seu pedido?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsClearConfirmOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmClearCart}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
                >
                  Sim, limpar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key={toastMessage.id}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-green-400" aria-hidden="true" />
            <span className="text-sm font-medium">{toastMessage.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
