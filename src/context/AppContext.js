import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { cartApi } from "../services/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUserState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("aurum_user"));
    } catch {
      return null;
    }
  });
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const setUser = (u) => {
    setUserState(u);
    if (u) {
      localStorage.setItem("aurum_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("aurum_user");
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setCartTotal(0);
  };

  const loadCart = useCallback(async () => {
    if (!user?.id) {
      setCart([]);
      setCartTotal(0);
      return;
    }
    try {
      const res = await cartApi.getCart(user.id);
      const items = res.data?.items || res.data || [];
      setCart(items);
      setCartTotal(items.reduce((sum, i) => sum + (i.subtotal || 0), 0));
    } catch {
      setCart([]);
      setCartTotal(0);
    }
  }, [user?.id]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const cartCount = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);

  return (
    <AppContext.Provider
      value={{ user, setUser, logout, cart, cartTotal, cartCount, loadCart }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
