import React from 'react';
import { X, Share2, Trash2 } from 'lucide-react';
import { OrderItem, CustomerInfo } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  customerInfo: CustomerInfo;
  onShare: () => void;
  onClearCart: () => void;
}

export function OrderModal({ isOpen, onClose, orderItems, customerInfo, onShare, onClearCart }: OrderModalProps) {
  if (!isOpen) return null;

  const totalKg = orderItems.reduce((sum, item) => sum + item.quantityKg, 0);

  const groupedItems = orderItems.reduce((acc, item) => {
    if (!acc[item.categoryName]) {
      acc[item.categoryName] = { items: [], totalKg: 0 };
    }
    acc[item.categoryName].items.push(item);
    acc[item.categoryName].totalKg += item.quantityKg;
    return acc;
  }, {} as Record<string, { items: OrderItem[], totalKg: number }>);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6"
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-modal-title"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-zinc-100">
            <h2 id="order-modal-title" className="text-xl font-bold text-zinc-900">Resumo do Pedido</h2>
            <button
              onClick={onClose}
              aria-label="Fechar resumo do pedido"
              className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8">
            {/* Customer Info */}
            <section>
              <h3 className="text-sm font-bold text-zinc-600 uppercase tracking-wider mb-3">
                Dados do Cliente
              </h3>
              <div className="bg-zinc-50 rounded-2xl p-5 space-y-2 text-sm text-zinc-700 border border-zinc-100">
                <p><span className="font-medium text-zinc-900">Nome:</span> {customerInfo.name || 'Não informado'}</p>
                <p><span className="font-medium text-zinc-900">Telefone:</span> {customerInfo.phone || 'Não informado'}</p>
                {customerInfo.pickupInStore ? (
                  <p><span className="font-medium text-red-600">Opção:</span> Retirar no Local</p>
                ) : (
                  <>
                    <p><span className="font-medium text-zinc-900">Endereço:</span> {customerInfo.address || 'Não informado'}</p>
                    <p><span className="font-medium text-zinc-900">Data de Entrega:</span> {customerInfo.deliveryDate || 'Não informada'}</p>
                  </>
                )}
                {customerInfo.notes && (
                  <p><span className="font-medium text-zinc-900">Observações:</span> {customerInfo.notes}</p>
                )}
              </div>
            </section>

            {/* Order Items */}
            <section>
              <h3 className="text-sm font-bold text-zinc-600 uppercase tracking-wider mb-3">
                Itens do Pedido
              </h3>
              {orderItems.length === 0 ? (
                <p className="text-zinc-500 text-sm italic bg-zinc-50 p-4 rounded-2xl text-center border border-zinc-100">Nenhum item adicionado ao pedido.</p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedItems).map(([categoryName, { items, totalKg }]) => (
                    <div key={categoryName} className="space-y-3">
                      <div className="flex justify-between items-center bg-zinc-50 px-4 py-2.5 rounded-xl border border-zinc-100">
                        <h4 className="font-semibold text-zinc-800">{categoryName}</h4>
                        <span className="text-sm font-bold text-red-600">{totalKg.toFixed(2).replace('.', ',')} kg</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-1">
                        {items.map((item) => (
                          <div key={item.cutId} className="flex flex-col bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2 gap-2">
                              <p className="font-bold text-zinc-900 leading-tight">{item.cutName}</p>
                              <p className="font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg text-sm whitespace-nowrap">
                                {item.quantityKg.toString().replace('.', ',')} kg
                              </p>
                            </div>
                            {item.observations && (
                              <p className="text-xs text-zinc-500 italic bg-zinc-50 p-2.5 rounded-xl mt-auto border border-zinc-100">
                                Obs: {item.observations}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="p-5 sm:p-6 border-t border-zinc-100 bg-zinc-50">
            <div className="flex justify-between items-center mb-5">
              <span className="text-zinc-500 font-medium">Peso Total Estimado:</span>
              <span className={`text-2xl font-bold ${totalKg > 0 && totalKg < 20 ? 'text-red-600' : 'text-zinc-900'}`}>{totalKg.toFixed(2).replace('.', ',')} kg</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClearCart}
                disabled={orderItems.length === 0}
                className="flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 disabled:border-zinc-200 disabled:text-zinc-500 disabled:bg-zinc-50 disabled:cursor-not-allowed py-3.5 px-4 rounded-xl font-medium transition-colors sm:w-1/3"
              >
                <Trash2 className="w-5 h-5" aria-hidden="true" />
                Limpar
              </button>
              <button
                onClick={onShare}
                disabled={orderItems.length === 0 || totalKg < 20 || !customerInfo.name.trim() || !customerInfo.phone.trim() || (!customerInfo.pickupInStore && !customerInfo.address.trim())}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed text-white py-3.5 px-4 rounded-xl font-medium transition-colors"
              >
                <Share2 className="w-5 h-5" aria-hidden="true" />
                Compartilhar Pedido
              </button>
            </div>
            {(orderItems.length === 0 || totalKg < 20 || !customerInfo.name.trim() || !customerInfo.phone.trim() || (!customerInfo.pickupInStore && !customerInfo.address.trim())) && (
              <p className="text-xs font-medium text-red-500 text-center mt-3 bg-red-50 py-2 px-3 rounded-lg">
                {orderItems.length === 0
                  ? "Adicione itens ao pedido."
                  : totalKg < 20 
                    ? `O pedido mínimo é de 20 kg (Faltam ${(20 - totalKg).toFixed(2).replace('.', ',')} kg).`
                    : customerInfo.pickupInStore 
                      ? "Preencha o nome e telefone do cliente para enviar o pedido."
                      : "Preencha o nome, telefone e endereço do cliente para enviar o pedido."}
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
