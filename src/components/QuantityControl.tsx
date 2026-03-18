import React, { useState, useEffect, useRef } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuantityControlProps {
  quantity: number;
  cutName: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange: (val: number) => void;
  onReset: () => void;
}

export function QuantityControl({
  quantity,
  cutName,
  onIncrement,
  onDecrement,
  onChange,
  onReset
}: QuantityControlProps) {
  const [inputValue, setInputValue] = useState(quantity === 0 ? '' : quantity.toString());
  const [highlight, setHighlight] = useState<'increase' | 'decrease' | null>(null);
  const [deltaIndicator, setDeltaIndicator] = useState<{ type: 'increase' | 'decrease', value: number, id: number } | null>(null);
  const prevQuantityRef = useRef(quantity);

  useEffect(() => {
    if (quantity > prevQuantityRef.current) {
      setHighlight('increase');
      setDeltaIndicator({ type: 'increase', value: Number((quantity - prevQuantityRef.current).toFixed(2)), id: Date.now() + Math.random() });
    } else if (quantity < prevQuantityRef.current) {
      setHighlight('decrease');
      setDeltaIndicator({ type: 'decrease', value: Number((prevQuantityRef.current - quantity).toFixed(2)), id: Date.now() + Math.random() });
    }
    prevQuantityRef.current = quantity;

    const timer = setTimeout(() => {
      setHighlight(null);
      setDeltaIndicator(null);
    }, 600);
    return () => clearTimeout(timer);
  }, [quantity]);

  useEffect(() => {
    // Only update if the parsed value is different from the current input value
    // This prevents resetting "1." to "1" while typing
    const currentNum = parseFloat(inputValue);
    if (isNaN(currentNum) || currentNum !== quantity) {
      setInputValue(quantity === 0 ? '' : quantity.toString());
    }
  }, [quantity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Replace comma with dot for easier typing on some mobile keyboards
    const val = e.target.value.replace(',', '.');
    
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(val)) {
      setInputValue(val);
      const num = parseFloat(val);
      if (!isNaN(num)) {
        onChange(num);
      } else if (val === '') {
        onChange(0);
      }
    }
  };

  const handleBlur = () => {
    if (inputValue === '' || inputValue === '.') {
      setInputValue('');
      onChange(0);
    } else {
      const num = parseFloat(inputValue);
      setInputValue(num.toString());
      onChange(num);
    }
  };

  const getContainerClasses = () => {
    let base = "flex items-center rounded-2xl p-1.5 shrink-0 transition-all duration-300 ";
    if (highlight === 'increase') {
      return base + "bg-green-100 ring-2 ring-green-400";
    }
    if (highlight === 'decrease') {
      return base + "bg-red-100 ring-2 ring-red-400";
    }
    if (quantity > 0) {
      return base + "bg-white border border-zinc-200 shadow-sm ring-1 ring-zinc-100";
    }
    return base + "bg-zinc-100 shadow-inner border border-transparent";
  };

  return (
    <motion.div 
      className={getContainerClasses()}
      animate={{ scale: highlight ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {quantity > 0 && (
        <motion.button
          aria-label={`Remover ${cutName}`}
          whileTap={{ scale: 0.85 }}
          onClick={onReset}
          className="p-2.5 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors mr-1"
        >
          <Trash2 className="w-5 h-5" aria-hidden="true" />
        </motion.button>
      )}
      <motion.button
        aria-label={`Diminuir quantidade de ${cutName}`}
        whileTap={{ scale: 0.85 }}
        onClick={onDecrement}
        className="p-2.5 text-zinc-500 hover:text-red-600 hover:bg-zinc-200 rounded-xl transition-colors"
      >
        <Minus className="w-5 h-5" aria-hidden="true" />
      </motion.button>
      <div className="w-16 flex items-center justify-center relative">
        <AnimatePresence>
          {deltaIndicator && (
            <motion.div
              key={deltaIndicator.id}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -24, scale: 1 }}
              exit={{ opacity: 0, y: -32, scale: 0.8 }}
              className={`absolute pointer-events-none text-xs font-bold px-1.5 py-0.5 rounded-md shadow-sm z-10 ${
                deltaIndicator.type === 'increase' 
                  ? 'text-green-700 bg-green-100' 
                  : 'text-red-700 bg-red-100'
              }`}
            >
              <span className="sr-only">
                {deltaIndicator.type === 'increase' ? 'Adicionado' : 'Removido'} {deltaIndicator.value} kg
              </span>
              <span aria-hidden="true">
                {deltaIndicator.type === 'increase' ? '+' : '-'}{deltaIndicator.value}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <input
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full text-center font-bold bg-transparent outline-none pr-4 transition-colors ${quantity > 0 ? 'text-red-600 text-lg' : 'text-zinc-800 text-base'}`}
          placeholder="0"
          aria-label={`Quantidade de ${cutName} em kg`}
        />
        {inputValue && <span className={`absolute right-1 text-[11px] pointer-events-none font-semibold transition-colors ${quantity > 0 ? 'text-red-500' : 'text-zinc-500'}`}>kg</span>}
      </div>
      <motion.button
        aria-label={`Aumentar quantidade de ${cutName}`}
        whileTap={{ scale: 0.85 }}
        onClick={onIncrement}
        className="p-2.5 text-zinc-500 hover:text-green-600 hover:bg-zinc-200 rounded-xl transition-colors"
      >
        <Plus className="w-5 h-5" aria-hidden="true" />
      </motion.button>
    </motion.div>
  );
}
