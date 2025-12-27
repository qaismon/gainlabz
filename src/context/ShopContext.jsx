import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { product_images } from "../assets/assets";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";


const BASE_URL = "https://gain-labz-backend.onrender.com";

export const ShopContext = createContext();

function ShopContextProvider(props) {
    const navigate = useNavigate();

    const currency = "$";
    const delivery_fee = 10;

    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    const [activeUserId, setActiveUserId] = useState(localStorage.getItem("userId") || null);
    const [activeUserEmail, setActiveUserEmail] = useState(localStorage.getItem("userEmail") || "");
    const [activeUserName, setActiveUserName] = useState(localStorage.getItem("userName") || "");
    const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");
    const [userToken, setUserToken] = useState(localStorage.getItem("token") || "");
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

    const [defaultAddress, setDefaultAddress] = useState(null);

    const [cartItems, setCartItems] = useState({});
    const [orders, setOrders] = useState([]);

    const safeClone = (obj) => {
        if (typeof structuredClone === 'function') return structuredClone(obj);
        return JSON.parse(JSON.stringify(obj));
    };

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/products`);
            if (!response.ok) throw new Error('Failed to fetch products');

            const rawProducts = await response.json();

            const processedProducts = rawProducts.map(product => {
                const imageURLs = (product.image || []).map(imgData => {
                    if (typeof imgData === 'string' && imgData.startsWith('data:image')) {
                        return imgData;
                    } else {
                        return product_images[imgData];
                    }
                });
                return { ...product, image: imageURLs.filter(url => url) };
            });

            setProducts(processedProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }, []);

    const fetchUserData = useCallback(async (userId) => {
        if (!userId) return;
        try {
            const response = await fetch(`${BASE_URL}/users/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch user data');

            const userData = await response.json();
            setCartItems(userData.cart || {});
            setOrders(userData.orders || []);
            setDefaultAddress(userData.defaultAddress || null);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }, []);

    const fetchAdminData = useCallback(async (userId) => {
        try {
            const response = await fetch(`${BASE_URL}/users`);
            if (!response.ok) throw new Error('Failed to fetch all user data.');

            const allUsers = await response.json();
            let allOrders = [];

            allUsers.forEach(user => {
                if (Array.isArray(user.orders)) {
                    allOrders = allOrders.concat(user.orders);
                }
            });

            const activeAdmin = allUsers.find(user => String(user.id) === String(userId));

            setOrders(allOrders);
            setCartItems(activeAdmin?.cart || {});
        } catch (error) {
            console.error("Error fetching admin data:", error);
        }
    }, []);

    const fetchAllUsers = useCallback(async () => {
        if (userRole !== 'admin') {
            toast.error("Unauthorized access to user list.");
            return [];
        }
        try {
            const response = await fetch(`${BASE_URL}/users`);
            if (!response.ok) throw new Error('Failed to fetch user list');

            const allUsers = await response.json();
            return allUsers.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                orderCount: user.orders ? user.orders.length : 0
            }));
        } catch (error) {
            console.error("Error fetching user list:", error);
            toast.error("Failed to load user list.");
            return [];
        }
    }, [userRole]);

    const syncUserData = useCallback(async (dataToSync) => {
        if (!activeUserId) return;

        try {
            await fetch(`${BASE_URL}/users/${activeUserId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSync),
            });
        } catch (error) {
            console.error("Error syncing data:", error);
            toast.error("Could not save changes to account.");
        }
    }, [activeUserId]);

    const updateDefaultAddress = useCallback(async (addressData) => {
        if (!activeUserId) {
            toast.warn("Please log in to save your address.");
            return false;
        }
        try {
            setDefaultAddress(addressData);

            const res = await fetch(`${BASE_URL}/users/${activeUserId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ defaultAddress: addressData }),
            });

            if (!res.ok) throw new Error('Failed to save address');

            await fetchUserData(activeUserId);

            toast.success("Default address saved!");
            return true;
        } catch (error) {
            console.error("Error saving default address:", error);
            await fetchUserData(activeUserId);
            toast.error("Failed to save default address.");
            return false;
        }
    }, [activeUserId, fetchUserData]);

    useEffect(() => {
        fetchProducts();
        const storedUserId = localStorage.getItem("userId");
        const storedUserRole = localStorage.getItem("userRole");

        if (storedUserId) {
            setActiveUserId(storedUserId);

            if (storedUserRole === 'admin') {
                fetchAdminData(storedUserId);
            } else {
                fetchUserData(storedUserId);
            }
        }
    }, [fetchProducts, fetchUserData, fetchAdminData]);

    useEffect(() => {
        if (isLoggedIn && activeUserId) {
            syncUserData({ cart: cartItems });
        }
    }, [cartItems, isLoggedIn, activeUserId, syncUserData]);

    const saveNewUser = async (email, name, password) => {
        const newUserEntry = { name, email, password, cart: {}, orders: [], role: 'user', defaultAddress: null };
        try {
            const response = await fetch(`${BASE_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUserEntry),
            });
            if (!response.ok) throw new Error('Failed to create new user account.');
            return await response.json();
        } catch (error) {
            console.error("Signup error:", error);
            toast.error("Signup failed. Please try again.");
            return null;
        }
    };

    const loginUser = (token, userId, email, name, role, cartData, ordersData) => {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", name);
        localStorage.setItem("userRole", role);

        setUserToken(token);
        setActiveUserId(userId);
        setActiveUserEmail(email);
        setActiveUserName(name);
        setUserRole(role);
        setIsLoggedIn(true);

        setCartItems(cartData || {});
        setOrders(ordersData || []);

        fetchUserData(userId);
    };

    const logoutUser = () => {
        localStorage.clear();

        setUserToken("");
        setActiveUserId(null);
        setActiveUserEmail("");
        setActiveUserName("");
        setUserRole("");
        setIsLoggedIn(false);
        setCartItems({});
        setOrders([]);
        setDefaultAddress(null);

        toast.info("Logged out successfully.");
        navigate('/');
    };

    const updateOrderStatus = async (userId, orderId, newStatus) => {
        if (userRole !== 'admin') {
            toast.error("Unauthorized. Only administrators can update order status.");
            return false;
        }

        try {
            const userResponse = await fetch(`${BASE_URL}/users/${userId}`);
            if (!userResponse.ok) throw new Error('User not found.');
            const userData = await userResponse.json();

            const updatedOrders = (userData.orders || []).map(order => {
                if (String(order.id) === String(orderId)) {
                    return { ...order, status: newStatus };
                }
                return order;
            });

            const patchResponse = await fetch(`${BASE_URL}/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orders: updatedOrders }),
            });

            if (!patchResponse.ok) throw new Error('Failed to update order status on server.');

            await fetchAdminData(activeUserId);

            toast.success(`Order #${orderId} status updated to ${newStatus}.`);
            return true;
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Failed to update order status.");
            return false;
        }
    };

    function addToCart(itemId, flavor, quantity = 1) {
        if (!isLoggedIn) {
            toast.warn("Please log in to add items to your cart.");
            navigate('/login');
            return false;
        }

        const qty = Math.max(1, Number(quantity) || 0);
        if (qty <= 0) return false;

        const productInfo = products.find(product => String(product.id) === String(itemId));

        if (!productInfo) {
            toast.error("Product not found.");
            return false;
        }
        
        const availableStock = Number(productInfo.stock) || 0;
        const currentCartQuantity = Number(cartItems[itemId]?.[flavor]) || 0;
        
        const newTotalQuantity = currentCartQuantity + qty;

        if (newTotalQuantity > availableStock) {
            if (availableStock === 0) {
                toast.error(`${productInfo.name} is currently out of stock.`);
            } else {
                toast.error(`Only ${availableStock} units of ${productInfo.name} are available in stock.`);
            }
            return false;
        }

        setCartItems(prevCart => {
            const cartData = safeClone(prevCart || {});
            if (!cartData[itemId]) cartData[itemId] = {};

            cartData[itemId][flavor] = newTotalQuantity;

            confetti({
                particleCount: 200,
                spread: 150,
                startVelocity: 60,
                origin: { y: 0.8 }
            });
            return cartData;
        });

        return true;
    }


    const updateQuantity = (itemId, flavor, quantity) => {
        setCartItems(prevCart => {
            const cartData = safeClone(prevCart || {});

            if (!cartData[itemId]) cartData[itemId] = {};

            const qty = Number(quantity) || 0;

            if (qty <= 0) {
                delete cartData[itemId][flavor];
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            } else {
                cartData[itemId][flavor] = qty;
            }

            return cartData;
        });
    };


    const clearCart = () => {
        setCartItems({});
        if (activeUserId) {
            syncUserData({ cart: {} });
        }
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            for (const quantity of Object.values(cartItems[itemId])) {
                totalCount += Number(quantity) || 0;
            }
        }
        return totalCount;
    }

    // --- UPDATED FEATURE: Use Offer Price for Cart Total Calculation ---
    function getCartAmount() {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const itemInfo = products.find((product) => String(product.id) === String(itemId));
            if (!itemInfo) continue;

            // Determine the price to use: offerPrice if on sale, otherwise regular price
            const itemPrice = (
                itemInfo.onSale && 
                itemInfo.offerPrice !== undefined && 
                itemInfo.offerPrice !== null
            )
                ? Number(itemInfo.offerPrice) 
                : Number(itemInfo.price);

            for (const quantity of Object.values(cartItems[itemId])) {
                const qty = Number(quantity) || 0;
                totalAmount += (itemPrice || 0) * qty; // Use the determined itemPrice
            }
        }
        return totalAmount;
    }
    // ------------------------------------------------------------------

    const addOrder = async (orderData) => {
        if (!activeUserId) {
            toast.error("User not logged in. Cannot save order.");
            return false;
        }

        try {
            const response = await fetch(`${BASE_URL}/users/${activeUserId}`);
            if (!response.ok) throw new Error('Failed to fetch user data for order placement');
            const userData = await response.json();

            const updatedOrders = [orderData, ...(userData.orders || [])];

            const stockUpdatePromises = orderData.items.map(async (item) => {
                const productId = item.id;
                const quantitySold = Number(item.quantity) || 0;

                const productRes = await fetch(`${BASE_URL}/products/${productId}`);
                if (!productRes.ok) return;
                const product = await productRes.json();
                
                const currentStock = Number(product.stock) || 0;
                const newStock = Math.max(0, currentStock - quantitySold);

                await fetch(`${BASE_URL}/products/${productId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ stock: newStock }),
                });
            });

            await Promise.all(stockUpdatePromises);
            
            const patchResponse = await fetch(`${BASE_URL}/users/${activeUserId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orders: updatedOrders, cart: {} }),
            });

            if (!patchResponse.ok) throw new Error('Failed to save order on server');

            setOrders(updatedOrders);
            setCartItems({});
            
            toast.success("Order placed successfully! Stock updated.");
            return true;
        } catch (error) {
            console.error("Error adding order or reducing stock:", error);
            toast.error("Failed to save order or update stock.");
            return false;
        }
    };

    const cancelOrder = async (orderId) => {
        if (!activeUserId) {
            toast.error("Not logged in.");
            return false;
        }

        try {
            const userResponse = await fetch(`${BASE_URL}/users/${activeUserId}`);
            if (!userResponse.ok) throw new Error("Failed to fetch user");

            const userData = await userResponse.json();
            
            const orderToCancel = (userData.orders || []).find(order => String(order.id) === String(orderId));

            if (!orderToCancel || orderToCancel.status === 'Cancelled') {
                if (orderToCancel?.status === 'Cancelled') { // Use optional chaining for safety
                    toast.warn("Order is already cancelled.");
                } else {
                    toast.error("Order not found.");
                }
                return false;
            }

            const updatedOrders = (userData.orders || []).map(order => {
                if (String(order.id) === String(orderId)) {
                    return { ...order, status: "Cancelled" };
                }
                return order;
            });

            const stockUpdatePromises = orderToCancel.items.map(async (item) => {
                const productId = item.id;
                const quantityToRestore = Number(item.quantity) || 0;

                const productRes = await fetch(`${BASE_URL}/products/${productId}`);
                if (!productRes.ok) return;
                const product = await productRes.json();
                
                const currentStock = Number(product.stock) || 0;
                const newStock = currentStock + quantityToRestore;

                await fetch(`${BASE_URL}/products/${productId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ stock: newStock }),
                });
            });

            await Promise.all(stockUpdatePromises);

            const patchResponse = await fetch(`${BASE_URL}/users/${activeUserId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orders: updatedOrders })
            });

            if (!patchResponse.ok) throw new Error("Failed to update order status");

            setOrders(updatedOrders);
            
            await fetchProducts(); 

            toast.success("Order cancelled and stock restored successfully!");
            return true;

        } catch (error) {
            console.error("Cancel order or stock restoration error:", error);
            toast.error("Failed to cancel order or restore stock.");
            return false;
        }
    };

    const deleteProduct = async (productId) => {
        try {
            const response = await fetch(`${BASE_URL}/products/${productId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete product");

            setProducts(prev => prev.filter(p => String(p.id) !== String(productId)));

            toast.success("Product deleted successfully!");
            return true;

        } catch (error) {
            console.error("Delete product error:", error);
            toast.error("Failed to delete product.");
            return false;
        }
    };

    const updateProduct = async (productId, productObj) => {
        try {
            const response = await fetch(`${BASE_URL}/products/${productId}`, { 
                method: 'PATCH', 
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(productObj), 
            });

            if (!response.ok) {
                throw new Error(`Failed to update product: ${response.statusText}`);
            }

            const updatedProduct = await response.json();
            
            setProducts(prevProducts => 
                prevProducts.map(product => 
                    product.id === productId ? updatedProduct : product
                )
            );
            toast.success(`Product ${productId} updated locally.`);
            return true;
            
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Could not save changes to server.");
            return false;
        }
    };

    const makeId = (prefix = 'P') => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`;

    const addProduct = async (productObj) => {
        try {
            const id = productObj.id || makeId('prod_');
            const productToSend = { ...productObj, id };

            const res = await fetch(`${BASE_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productToSend),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(`Server returned ${res.status}: ${text}`);
            }

            const created = await res.json();

            setProducts(prev => [created, ...prev]);

            toast.success("Product added successfully!");
            return true;
        } catch (err) {
            console.error("addProduct error:", err);
            toast.error("Failed to add product. See console for details.");
            return false;
        }
    };

    const isAdmin = userRole === 'admin';

    const makeUserAdmin = async (userId) => {
        const token = userToken; 
        
        if (!token) {
            toast.error("Admin session token is missing. Please re-login.");
            throw new Error("Authentication token missing.");
        }
        
        if (userRole !== 'admin') {
            toast.error("Access Denied. Only Admins can promote users.");
            throw new Error("Unauthorized: User is not an admin.");
        }
        
        try {
            const response = await fetch(`${BASE_URL}/users/${userId}`, { 
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ role: 'admin' }), 
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => response.statusText);
                throw new Error(`Failed to update user role: ${errorText}`);
            }

            toast.success("User successfully promoted to Admin!");
            return response.json(); 
        } catch (error) {
            console.error("Error making user admin:", error);
            throw error;
        }
    };

    const value = {
        products, currency, delivery_fee, search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, getCartCount, updateQuantity, getCartAmount, // <-- getCartAmount updated
        orders, addOrder, clearCart,
        userToken, isLoggedIn, loginUser, logoutUser, navigate,
        activeUserId, activeUserEmail, activeUserName, saveNewUser,
        userRole, updateOrderStatus,
        fetchAllUsers,
        defaultAddress,
        updateDefaultAddress,
        fetchUserData, cancelOrder, deleteProduct, updateProduct,
        addProduct, isAdmin, fetchProducts, makeUserAdmin
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;