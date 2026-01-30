import React, { useContext, useMemo, useEffect } from "react";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, PieChart, Pie, Cell, Tooltip, XAxis, YAxis,
  CartesianGrid, BarChart, Bar, Legend, ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const { products, orders: contextOrders, activeUserName, currency, fetchOrders } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const orders = useMemo(() => contextOrders || [], [contextOrders]);

  // ---------------- METRICS (FIXED REVENUE LOGIC) ----------------
  const { totalProducts, totalOrders, pendingOrders, totalRevenue } = useMemo(() => {
    const totalProds = products?.length || 0;
    const totalOrds = orders.length;

    // Filter for orders that haven't been processed yet
    const pendingOrds = orders.filter(o => o.status === "Pending").length;

    let revenue = 0;
    orders.forEach((o) => {
      // FIX: Previously, this only counted "Delivered" orders.
      // Now it counts all active orders except "Cancelled" ones.
      if (o.status !== "Cancelled") {
        const amt = parseFloat(o.amount);
        if (!isNaN(amt)) revenue += amt;
      }
    });

    return { totalProducts: totalProds, totalOrders: totalOrds, pendingOrders: pendingOrds, totalRevenue: revenue };
  }, [products, orders]);

  // ---------------- PIE DATA (STATUS DISTRIBUTION) ----------------
  const pieData = useMemo(() => {
    const statusCounts = { Pending: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
    orders.forEach((o) => {
      if (statusCounts[o.status] !== undefined) statusCounts[o.status]++;
    });
    return Object.keys(statusCounts).map(name => ({ name, value: statusCounts[name] }));
  }, [orders]);

  const pieColors = ["#f59e0b", "#3b82f6", "#22c55e", "#ef4444"];

  // ---------------- DAILY REVENUE TREND ----------------
  const dailyRevenue = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      // Exclude cancelled orders from revenue charts
      if (o.status === "Cancelled") return;
      
      const dateSource = o.createdAt || o.date;
      if (!dateSource) return;

      const d = new Date(dateSource);
      if (isNaN(d.getTime())) return;

      const key = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      map[key] = (map[key] || 0) + Number(o.amount || 0);
    });

    return Object.keys(map)
      .sort((a, b) => {
        const [da, ma, ya] = a.split("/").map(Number);
        const [db, mb, yb] = b.split("/").map(Number);
        return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
      })
      .map((day) => ({ day, revenue: map[day] }));
  }, [orders]);

  // ---------------- TOP PRODUCTS (ADDED FLATTENING) ----------------
  const topProductsData = useMemo(() => {
    const productSales = {};
    orders.forEach(order => {
      // Apply flattening here to handle [[item1, item2]] scenarios
      const safeItems = Array.isArray(order.items) ? order.items.flat() : [];
      
      safeItems.forEach(item => {
        const name = item.name || "Unknown Product";
        const qty = Number(item.quantity) || 0;
        productSales[name] = (productSales[name] || 0) + qty;
      });
    });

    return Object.entries(productSales)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Show top 5
  }, [orders]);

  // ---------------- CATEGORY DATA ----------------
  const categoryChart = useMemo(() => {
    const catMap = {};
    const safeProducts = Array.isArray(products) ? products.flat() : [];
    
    safeProducts.forEach((p) => {
      const cat = p.category || "Uncategorized";
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    return Object.keys(catMap).map((cat) => ({ category: cat, count: catMap[cat] }));
  }, [products]);

  return (
    <div className="px-3 sm:px-0 space-y-8 pb-10 text-left">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome Back, {activeUserName || "Admin"}!
          </h1>
          <p className="text-sm text-gray-500">Live Store Performance Insights</p>
        </div>
        <button 
          onClick={() => fetchOrders()} 
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition shadow-sm active:scale-95"
        >
          Refresh Data
        </button>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard title="Total Revenue" value={`${currency}${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`} color="border-green-500" />
        <MetricCard title="Pending Orders" value={pendingOrders} color="border-yellow-500" onClick={() => navigate("/admin/orders")} />
        <MetricCard title="Total Products" value={totalProducts} color="border-blue-500" onClick={() => navigate("/admin/list-products")} />
        <MetricCard title="Total Orders" value={totalOrders} color="border-purple-500" onClick={() => navigate("/admin/orders")} />
      </div>

      {/* TREND CHART */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold mb-6 text-gray-700">Daily Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyRevenue}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(v) => [`${currency}${Number(v).toFixed(2)}`, "Revenue"]} 
            />
            <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* BOTTOM GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="font-semibold mb-4 text-gray-700">Order Fulfillment Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} outerRadius={80} dataKey="value" innerRadius={60} paddingAngle={5}>
                {pieData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART - TOP PRODUCTS */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 lg:col-span-2">
          <h3 className="font-semibold mb-4 text-gray-700">Top 5 Selling Products (Quantity)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10, fontWeight: 'bold' }} />
              <Tooltip cursor={{fill: '#f9fafb'}} />
              <Bar dataKey="sales" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* INVENTORY CHART */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 lg:col-span-3">
          <h3 className="font-semibold mb-4 text-gray-700">Inventory Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryChart}>
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Reusable Metric Card Component
const MetricCard = ({ title, value, color, onClick }) => (
  <div 
    onClick={onClick} 
    className={`bg-white p-5 rounded-xl shadow-sm border border-gray-100 border-l-4 ${color} ${onClick ? 'cursor-pointer hover:shadow-md transition-all active:scale-95' : ''}`}
  >
    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{title}</p>
    <p className="text-2xl font-black mt-1 text-gray-900">{value}</p>
  </div>
);

export default Dashboard;