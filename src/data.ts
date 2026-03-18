import { Category } from './types';

export const beefCategories: Category[] = [
  {
    id: 'premium',
    name: 'Cortes Premium',
    cuts: [
      { id: 'picanha', name: 'Picanha', type: 'premium', imageUrl: 'https://images.unsplash.com/photo-1594046243098-0fceea9d451e?auto=format&fit=crop&q=80&w=800' },
      { id: 'file_mignon', name: 'Filé Mignon', type: 'premium', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800' },
      { id: 'contrafile', name: 'Contrafilé', type: 'premium', imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=800' },
      { id: 'alcatra', name: 'Alcatra', type: 'premium', imageUrl: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&q=80&w=800' },
      { id: 'maminha', name: 'Maminha', type: 'premium', imageUrl: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&q=80&w=800' },
      { id: 'fraldinha', name: 'Fraldinha', type: 'premium', imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=800' },
    ]
  },
  {
    id: 'traseiro',
    name: 'Cortes Traseiros',
    cuts: [
      { id: 'coxao_mole', name: 'Coxão Mole', type: 'tradicional', imageUrl: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&q=80&w=800' },
      { id: 'coxao_duro', name: 'Coxão Duro', type: 'tradicional', imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&q=80&w=800' },
      { id: 'patinho', name: 'Patinho', type: 'tradicional', imageUrl: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&q=80&w=800' },
      { id: 'lagarto', name: 'Lagarto', type: 'tradicional', imageUrl: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&q=80&w=800' },
      { id: 'musculo_traseiro', name: 'Músculo Traseiro', type: 'tradicional', imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&q=80&w=800' },
      { id: 'capa_file', name: 'Capa de Filé', type: 'tradicional', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800' },
    ]
  },
  {
    id: 'dianteiro',
    name: 'Cortes Dianteiros',
    cuts: [
      { id: 'acem', name: 'Acém', type: 'tradicional', imageUrl: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&q=80&w=800' },
      { id: 'paleta', name: 'Paleta', type: 'tradicional', imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&q=80&w=800' },
      { id: 'peito', name: 'Peito', type: 'tradicional', imageUrl: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&q=80&w=800' },
      { id: 'cupim', name: 'Cupim', type: 'tradicional', imageUrl: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&q=80&w=800' },
      { id: 'musculo_dianteiro', name: 'Músculo Dianteiro', type: 'tradicional', imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&q=80&w=800' },
    ]
  },
  {
    id: 'miudos',
    name: 'Miúdos e Ossos',
    cuts: [
      { id: 'figado', name: 'Fígado', type: 'miudo', imageUrl: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&q=80&w=800' },
      { id: 'coracao', name: 'Coração', type: 'miudo', imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&q=80&w=800' },
      { id: 'rim', name: 'Rim', type: 'miudo', imageUrl: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&q=80&w=800' },
      { id: 'lingua', name: 'Língua', type: 'miudo', imageUrl: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&q=80&w=800' },
      { id: 'rabada', name: 'Rabada', type: 'miudo', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800' },
      { id: 'bucho', name: 'Dobradinha (Bucho)', type: 'miudo', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800' },
      { id: 'mocoto', name: 'Mocotó', type: 'miudo', imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=800' },
      { id: 'tutano', name: 'Osso com Tutano', type: 'miudo', imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&q=80&w=800' },
    ]
  }
];
