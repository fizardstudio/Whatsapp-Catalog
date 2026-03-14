import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  note?: string;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: Product, note?: string) => void;
  removeItem: (productId: string, note?: string) => void;
  updateItemNote: (productId: string, note: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product, note) => {
    set((state) => {
      // Find item with same product ID AND same note
      const existingItem = state.items.find(item => 
        item.product.id === product.id && item.note === note
      );
      
      if (existingItem) {
        return {
          items: state.items.map(item => 
            item.product.id === product.id && item.note === note
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        };
      }
      return { items: [...state.items, { product, quantity: 1, note }] };
    });
  },
  removeItem: (productId, note) => {
    set((state) => {
      const existingItem = state.items.find(item => 
        item.product.id === productId && item.note === note
      );
      
      if (existingItem && existingItem.quantity > 1) {
        return {
          items: state.items.map(item => 
            item.product.id === productId && item.note === note
              ? { ...item, quantity: item.quantity - 1 } 
              : item
          )
        };
      }
      // Remove entirely if quantity is 1
      return { 
        items: state.items.filter(item => 
          !(item.product.id === productId && item.note === note)
        ) 
      };
    });
  },
  updateItemNote: (productId, note) => {
    set((state) => ({
      items: state.items.map(item => 
        item.product.id === productId 
          ? { ...item, note } 
          : item
      )
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
  getTotalPrice: () => get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0),
}));
