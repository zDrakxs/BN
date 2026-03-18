import React, { memo } from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { Cut } from '../types';
import { QuantityControl } from './QuantityControl';

interface CutCardProps {
  cut: Cut;
  categoryName: string;
  quantity: number;
  observations: string;
  onQuantityChange: (cutId: string, cutName: string, categoryName: string, delta: number) => void;
  onSetQuantity: (cutId: string, cutName: string, categoryName: string, quantity: number) => void;
  onOpenObservationModal: (cutId: string, cutName: string, initialObservation: string) => void;
}

export const CutCard = memo(function CutCard({
  cut,
  categoryName,
  quantity,
  observations,
  onQuantityChange,
  onSetQuantity,
  onOpenObservationModal
}: CutCardProps) {
  const isSelected = quantity > 0;

  return (
    <motion.div
      layout
      role="article"
      aria-label={`Corte de carne: ${cut.name}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`bg-white border p-5 transition-all duration-300 ${isSelected ? 'rounded-3xl border-red-500 shadow-md shadow-red-500/20 ring-1 ring-red-500' : 'rounded-2xl border-zinc-200/80 shadow-sm'}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="font-bold text-zinc-900 leading-tight text-lg">{cut.name}</h4>
            {cut.type === 'premium' && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Premium</span>
            )}
            {cut.type === 'miudo' && (
              <span className="bg-zinc-100 text-zinc-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Miúdo</span>
            )}
          </div>
          {isSelected && observations && (
            <p className="text-sm text-zinc-500 mt-2 line-clamp-2 italic bg-zinc-50 p-3 rounded-xl border border-zinc-100">
              Obs: {observations}
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <QuantityControl
            quantity={quantity}
            cutName={cut.name}
            onIncrement={() => onQuantityChange(cut.id, cut.name, categoryName, 20)}
            onDecrement={() => onQuantityChange(cut.id, cut.name, categoryName, -20)}
            onChange={(val) => onSetQuantity(cut.id, cut.name, categoryName, val)}
            onReset={() => onSetQuantity(cut.id, cut.name, categoryName, 0)}
          />
        </div>
      </div>
      
      {isSelected && (
        <div className="mt-5 pt-4 border-t border-zinc-100">
          <button
            onClick={() => onOpenObservationModal(cut.id, cut.name, observations)}
            aria-label={`${observations ? 'Editar' : 'Adicionar'} observação para ${cut.name}`}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-zinc-600 hover:text-red-600 hover:bg-red-50 py-3 rounded-xl transition-colors"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            {observations ? 'Editar Observação' : 'Adicionar Observação'}
          </button>
        </div>
      )}
    </motion.div>
  );
});
