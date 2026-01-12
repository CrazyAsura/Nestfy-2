import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../stores';
import { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  toggleCart, 
  setCartOpen,
  CartItem
} from '../stores/slices/cart.slice';
import { Product } from '../types/product';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector((state: RootState) => state.cart);

  const addItem = (product: Product) => dispatch(addToCart(product));
  const removeItem = (id: string) => dispatch(removeFromCart(id));
  const updateQty = (id: string, quantity: number) => dispatch(updateQuantity({ id, quantity }));
  const clear = () => dispatch(clearCart());
  const toggle = () => dispatch(toggleCart());
  const setOpen = (open: boolean) => dispatch(setCartOpen(open));

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);

  return {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQty,
    clearCart: clear,
    toggle,
    setOpen,
    totalItems,
    totalPrice,
  };
};
