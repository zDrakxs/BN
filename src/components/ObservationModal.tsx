import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cutName: string;
  initialObservation: string;
  onSave: (observation: string) => void;
}

export function ObservationModal({ isOpen, onClose, cutName, initialObservation, onSave }: ObservationModalProps) {
  const [observation, setObservation] = useState(initialObservation);

  useEffect(() => {
    if (isOpen) {
      setObservation(initialObservation);
    }
  }, [isOpen, initialObservation]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(observation);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="observation-modal-title"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-zinc-100">
            <h3 id="observation-modal-title" className="font-bold text-zinc-900 truncate pr-4">
              Observações: {cutName}
            </h3>
            <button
              onClick={onClose}
              aria-label="Fechar modal de observação"
              className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <div className="p-5">
            <label htmlFor="observation" className="sr-only">Observações para {cutName}</label>
            <textarea
              id="observation"
              autoFocus
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Ex: Peça inteira, bife fino, moída duas vezes..."
              className="w-full h-28 px-4 py-3 text-sm rounded-2xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none resize-none"
            />
          </div>

          <div className="p-5 pt-0 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
            >
              <Check className="w-4 h-4" aria-hidden="true" />
              Salvar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
