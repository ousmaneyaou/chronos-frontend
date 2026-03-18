import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { cartApi, userApi } from "../services/api";
import { toast } from "react-toastify";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("chronos_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Charger le panier quand l'utilisateur change
  const loadCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      return;
    }
    setCartLoading(true);
    try {
      const res = await cartApi.getCart(user.id);
      setCart(res.data || []);
    } catch {
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Sauvegarder user dans localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("chronos_user", JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem("chronos_user");
  };

  // Ajouter au panier
  const addToCart = async (watchId, quantity = 1) => {
    if (!user) {
      toast.error("Veuillez créer un compte");
      return false;
    }
    try {
      await cartApi.addItem(user.id, { watchId, quantity });
      await loadCart();
      toast.success("Ajouté au panier");
      return true;
    } catch (e) {
      toast.error(e.response?.data?.message || "Erreur panier");
      return false;
    }
  };

  // Mettre à jour quantité
  const updateCartItem = async (itemId, quantity) => {
    if (!user) return;
    try {
      await cartApi.updateItem(itemId, user.id, { quantity });
      await loadCart();
    } catch (e) {
      toast.error("Erreur mise à jour");
    }
  };

  // Retirer du panier
  const removeFromCart = async (itemId) => {
    if (!user) return;
    try {
      await cartApi.removeItem(itemId, user.id);
      await loadCart();
      toast.success("Retiré du panier");
    } catch {
      toast.error("Erreur");
    }
  };

  // Total panier
  const cartTotal = cart.reduce(
    (sum, item) => sum + parseFloat(item.subtotal || 0),
    0,
  );
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        cart,
        cartLoading,
        cartTotal,
        cartCount,
        addToCart,
        updateCartItem,
        removeFromCart,
        loadCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
