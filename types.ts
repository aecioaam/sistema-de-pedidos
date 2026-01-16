
export interface ProductOption {
  name: string;
  price?: number; // Preço opcional se for diferente do preço base
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  is_active?: boolean;
  options?: ProductOption[];
}

export interface Category {
  id: string;
  name: string;
  order?: number;
}

export interface Neighborhood {
  id: string;
  name: string;
  fee: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedOption?: ProductOption;
}

export type PaymentMethod = 'pix' | 'dinheiro' | 'cartao';
export type OrderType = 'entrega' | 'retirada';

export interface OrderDetails {
  customerName: string;
  type: OrderType;
  neighborhoodId?: string;
  street?: string;
  number?: string;
  reference?: string;
  address?: string;
  paymentMethod: PaymentMethod;
  changeFor?: number;
  customMessage?: string;
}

export type OrderStatus = 'pendente' | 'producao' | 'entrega' | 'concluido' | 'cancelado';

export interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone?: string;
  neighborhood?: string;
  street?: string;
  number?: string;
  reference?: string;
  items: CartItem[];
  total_value: number;
  payment_method: string;
  change_for?: number;
  delivery_type: OrderType;
  status: OrderStatus;
  custom_message?: string;
}

export interface StoreSettings {
  id: string;
  is_open: boolean;
  closed_message: string;
  whatsapp_number: string;
}
