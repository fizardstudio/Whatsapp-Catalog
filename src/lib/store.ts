import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find(item => item.product.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    });
  },
  removeItem: (productId) => {
    set((state) => {
      const existingItem = state.items.find(item => item.product.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return {
          items: state.items.map(item => 
            item.product.id === productId 
              ? { ...item, quantity: item.quantity - 1 } 
              : item
          )
        };
      }
      return { items: state.items.filter(item => item.product.id !== productId) };
    });
  },
  clearCart: () => set({ items: [] }),
  getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
  getTotalPrice: () => get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0),
}));
