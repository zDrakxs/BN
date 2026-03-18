export type CutType = 'premium' | 'tradicional' | 'miudo';

export interface Cut {
  id: string;
  name: string;
  type: CutType;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  cuts: Cut[];
}

export interface OrderItem {
  cutId: string;
  cutName: string;
  categoryName: string;
  quantityKg: number;
  observations: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  deliveryDate: string;
  notes: string;
  pickupInStore: boolean;
}
