import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";
import API_BASE_URL from "../services/api";

const BASE_URL = API_BASE_URL;

export const ShopContext = createContext();

function ShopContextProvider({ children }) {
  const navigate = useNavigate();

  const currency = "$";
  const delivery_fee = 10;

  /* AUTH STATE */
  const [userToken, setUserToken] = useState(localStorage.getItem("token"));
  const [activeUserId, setActiveUserId] = useState(localStorage.getItem("userId"));
  const [activeUserName, setActiveUserName] = useState(localStorage.getItem("userName"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  
  const isAdmin = isLoggedIn && userRole === 'admin';

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]); 

  const isFirstCartLoad = useRef(true);

  const fetchUsers = useCallback(async () => {
    if (!userToken || !isAdmin) return;
    try {
      const response = await fetch(`${BASE_URL}/api/user/list`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`}
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        console.error("Failed to fetch users:", data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [userToken, isAdmin]);

  /* ---------------- FETCH ORDERS ---------------- */
/* ---------------- UPDATED FETCH ORDERS ---------------- */
const fetchOrders = useCallback(async () => {
  if (!userToken) return;
  
  try {
    // Check if the user is admin. Note: isAdmin is calculated from userRole
    const endpoint = isAdmin 
      ? `${BASE_URL}/api/orders/all`   // This matches your router.get("/all"...)
      : `${BASE_URL}/api/orders/my-orders`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    const data = await response.json();
    
    if (data.success) {
      // This will now populate 'orders' with EVERYTHING if you're admin
      setOrders(data.orders || []);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
}, [userToken, isAdmin]);

  useEffect(() => {
    fetchOrders();
    if (isAdmin) fetchUsers(); 
  }, [fetchOrders, fetchUsers, isAdmin]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/products`); 
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);



 /* ---------------- REFINED LOAD USER DATA ---------------- */
useEffect(() => {
  if (!userToken) return;

  const loadUserData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/me`, { 
        headers: { Authorization: `Bearer ${userToken}` }
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(data.cart || {});
        
        // ONLY set orders here if NOT an admin. 
        // Admin orders are handled by the fetchOrders master call.
        if (!isAdmin) {
          setOrders(data.orders || []);
        }
      }
    } catch (err) {
      console.error("Failed to load user data", err);
    } finally {
      isFirstCartLoad.current = false;
    }
  };

  loadUserData();
}, [userToken, isAdmin]); // Added isAdmin

  const loginWithAPI = async (email, password) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("userName", data.user.name);
    localStorage.setItem("userRole", data.user.role);

    setUserToken(data.token);
    setActiveUserId(data.user.id);
    setActiveUserName(data.user.name);
    setUserRole(data.user.role);
    setIsLoggedIn(true);

    navigate("/");
  };

  const logoutUser = () => {
    localStorage.clear();
    setUserToken(null);
    setActiveUserId(null);
    setActiveUserName("");
    setUserRole("");
    setIsLoggedIn(false);
    setCartItems({});
    setOrders([]);
    setUsers([]);
    isFirstCartLoad.current = true;
    navigate("/");
  };

  const saveNewUser = async (email, name, password) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      return data;
    } catch (err) {
      console.error("Sign up error:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (!isLoggedIn || !userToken || isFirstCartLoad.current) return;

    const persistCart = async () => {
      try {
        await fetch(`${BASE_URL}/api/users/cart`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`
          },
          body: JSON.stringify({ cart: cartItems })
        });
      } catch (err) {
        console.error("Cart sync failed", err);
      }
    };
    persistCart();
  }, [cartItems, isLoggedIn, userToken]);

  const addToCart = (productId, flavor, quantity = 1) => {
    if (!isLoggedIn) {
      toast.warn("Please login first");
      navigate("/login");
      return;
    }
    setCartItems(prev => {
      const updated = structuredClone(prev || {});
      if (!updated[productId]) updated[productId] = {};
      updated[productId][flavor] = (updated[productId][flavor] || 0) + quantity;
      confetti({ particleCount: 150, spread: 120 });
      return updated;
    });
  };

  const updateQuantity = (productId, flavor, quantity) => {
    setCartItems(prev => {
      const updated = structuredClone(prev || {});
      if (quantity <= 0) {
        delete updated[productId]?.[flavor];
        if (Object.keys(updated[productId] || {}).length === 0) delete updated[productId];
      } else {
        if (!updated[productId]) updated[productId] = {};
        updated[productId][flavor] = quantity;
      }
      return updated;
    });
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce(
      (sum, flavors) => sum + Object.values(flavors).reduce((a, b) => a + b, 0),
      0
    );
  };

  const getCartAmount = () => {
    let total = 0;
    if (!Array.isArray(products)) return 0;

    for (const id in cartItems) {
      const product = products.find(p => p._id === id);
      if (!product) continue;
      
      const price = product.onSale ? Number(product.offerPrice) : Number(product.price);
      for (const flavor in cartItems[id]) {
        const qty = cartItems[id][flavor];
        total += price * qty;
      }
    }
    return total;
  };

  /* ---------------- ORDER ACTIONS ---------------- */
  const placeOrder = async (deliveryData, paymentMethod, upiId = "") => {
    try {
      const orderItems = [];
      for (const productId in cartItems) {
        for (const flavor in cartItems[productId]) {
          if (cartItems[productId][flavor] > 0) {
            const itemInfo = products.find((p) => p._id === productId);
            if (itemInfo) {
              orderItems.push({
                product: productId,
                name: itemInfo.name,
                flavor: flavor,
                price: itemInfo.onSale ? itemInfo.offerPrice : itemInfo.price,
                quantity: cartItems[productId][flavor]
              });
            }
          }
        }
      }

      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          items: orderItems,
          amount: getCartAmount() + delivery_fee,
          payment: paymentMethod,
          upiId: upiId,
          deliveryData: deliveryData
        })
      });

      const data = await response.json();
      if (response.ok) {
        setCartItems({});
        toast.success("Order Placed!");
        navigate('/orders');
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Frontend Fetch Error:", err);
      toast.error("Could not connect to server");
    }
  };

  const addProduct = async (productData) => {
      if (!userToken) {
          toast.error("Not authorized");
          return false;
      }
      try {
          const response = await fetch(`${BASE_URL}/api/products/add`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${userToken}` 
              },
              body: JSON.stringify(productData)
          });
          const data = await response.json();
          if (data.success) {
              await fetchProducts(); 
              return true;
          } else {
              toast.error(data.message);
              return false;
          }
      } catch (error) {
          console.error("Add Product Error:", error);
          toast.error("Failed to add product");
          return false;
      }
  };

  const cancelOrder = async (orderId) => {
    if (!userToken) {
      toast.error("Please login to cancel orders");
      return false;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/orders/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ orderId })
      });
      const data = await response.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: 'Cancelled' } : order
          )
        );
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error("Cancel Order Error:", error);
      toast.error("Failed to cancel order");
      return false;
    }
  };

  const updateProduct = async (productId, updatedData) => {
    if (!userToken || !isAdmin) {
        toast.error("Not authorized");
        return false;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}` 
            },
            body: JSON.stringify(updatedData)
        });

        const data = await response.json();

        if (data.success) {
            await fetchProducts(); 
            toast.success("Product updated successfully");
            return true;
        } else {
            toast.error(data.message || "Update failed");
            return false;
        }
    } catch (error) {
        console.error("Update Product Error:", error);
        toast.error("Failed to connect to server");
        return false;
    }
};

const deleteProduct = async (id) => {
    if (!userToken || !isAdmin) {
        toast.error("Not authorized");
        return false;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userToken}` 
            }
        });

        const data = await response.json();

        if (data.success) {
            setProducts(prev => prev.filter(item => item._id !== id));
            return true;
        } else {
            toast.error(data.message || "Failed to delete");
            return false;
        }
    } catch (error) {
        console.error("Delete Error:", error);
        toast.error("Server error");
        return false;
    }
};


const updateOrderStatus = async (orderId, newStatus) => {
    const token = userToken || localStorage.getItem("token");

    if (!token || !isAdmin) {
        toast.error("Session expired or Not Authorized");
        return false;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/orders/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ orderId, status: newStatus })
        });

        const data = await response.json();
        if (data.success) {
            toast.success("Order status updated!");
            return true;
        } else {
            toast.error(data.message);
            return false;
        }
    } catch (error) {
        console.error("Update Status Error:", error);
        toast.error("Failed to update status");
        return false;
    }
};

useEffect(() => {
    fetchProducts();
    if (isLoggedIn && userRole === 'admin') {
        fetchOrders(); 
    }
}, [isLoggedIn, userRole]);

const deleteUser = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/api/user/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const data = await response.json();
        if (data.success) {
            setUsers(prev => prev.filter(user => user._id !== id));
            toast.success("User removed");
        }
    } catch (error) {
        toast.error("Delete failed");
    }
};

const updateRole = async (userId, newRole) => {
    try {
        const response = await fetch(`${BASE_URL}/api/user/update-role/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ role: newRole })
        });

        const data = await response.json();
        if (data.success) {
            toast.success(data.message);
            fetchUsers(); 
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.error("Role Update Error:", error);
        toast.error("Failed to update role");
    }
};


const getCartItemsArray = () => {
    const orderItems = [];
    for (const productId in cartItems) {
      for (const flavor in cartItems[productId]) {
        if (cartItems[productId][flavor] > 0) {
          const itemInfo = products.find((p) => p._id === productId);
          if (itemInfo) {
            orderItems.push({
              product: productId,
              name: itemInfo.name,
              flavor: flavor,
              price: itemInfo.onSale ? itemInfo.offerPrice : itemInfo.price,
              quantity: cartItems[productId][flavor]
            });
          }
        }
      }
    }
    return orderItems;
  };


  return (
    <ShopContext.Provider
      value={{
        backendUrl: BASE_URL, // ADD THIS
        userToken,            // ADD THIS
        getCartItemsArray,    // ADD THIS
        deleteUser,
        updateRole,
        products,
        users,        
        fetchUsers,  
        currency,
        delivery_fee,
        cartItems,
        orders,
        isLoggedIn,
        userRole,
        activeUserName,
        loginWithAPI,
        logoutUser,
        addToCart,
        addProduct,
        cancelOrder,
        updateQuantity,
        getCartCount,
        getCartAmount,
        navigate,
        saveNewUser,
        isAdmin,
        placeOrder,
        fetchOrders,
        updateProduct,
        deleteProduct,
        updateOrderStatus
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export default ShopContextProvider;