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

  // ---------------- METRICS ----------------
  const { totalProducts, totalOrders, pendingOrders, totalRevenue } = useMemo(() => {
    const totalProds = products?.length || 0;
    const totalOrds = orders.length;

    const pendingOrds = orders.filter(o => o.status === "Pending").length;

    let revenue = 0;
    orders.forEach((o) => {
      if (["Delivered", "Paid"].includes(o.status)) {
        const amt = parseFloat(o.amount);
        if (!isNaN(amt)) revenue += amt;
      }
    });

    return { totalProducts: totalProds, totalOrders: totalOrds, pendingOrders: pendingOrds, totalRevenue: revenue };
  }, [products, orders]);

  // ---------------- PIE DATA ----------------
  const pieData = useMemo(() => {
    const statusCounts = { Pending: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
    orders.forEach((o) => {
      if (statusCounts[o.status] !== undefined) statusCounts[o.status]++;
    });
    return Object.keys(statusCounts).map(name => ({ name, value: statusCounts[name] }));
  }, [orders]);

  const pieColors = ["#f59e0b", "#3b82f6", "#22c55e", "#ef4444"];

  // ---------------- DAILY REVENUE (FIXED NaN) ----------------
  const dailyRevenue = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      if (!["Delivered", "Paid"].includes(o.status)) return;
      
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

  const topProductsData = useMemo(() => {
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const name = item.name || "Unknown Product";
        productSales[name] = (productSales[name] || 0) + item.quantity;
      });
    });

    return Object.entries(productSales)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Get top 5
  }, [orders]);

  const categoryChart = useMemo(() => {
    const catMap = {};
    products.forEach((p) => {
      const cat = p.category || "Uncategorized";
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    return Object.keys(catMap).map((cat) => ({ category: cat, count: catMap[cat] }));
  }, [products]);

  return (
    <div className="px-3 sm:px-0 space-y-8 pb-10">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome Back, {activeUserName || "Admin"}!
          </h1>
          <p className="text-sm text-gray-500">Store Performance Metrics</p>
        </div>
        <button onClick={() => fetchOrders()} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard title="Total Revenue" value={`${currency}${totalRevenue.toFixed(2)}`} color="border-green-500" />
        <MetricCard title="Pending Orders" value={pendingOrders} color="border-yellow-500" onClick={() => navigate("/admin/orders")} />
        <MetricCard title="Total Products" value={totalProducts} color="border-blue-500" />
        <MetricCard title="Total Orders" value={totalOrders} color="border-purple-500" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold mb-6">Daily Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyRevenue}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => [`${currency}${Number(v).toFixed(2)}`, "Revenue"]} />
            <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="font-semibold mb-4 text-gray-700">Order Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} outerRadius={80} dataKey="value" innerRadius={55} paddingAngle={5}>
                {pieData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 lg:col-span-2">
          <h3 className="font-semibold mb-4 text-gray-700">Top 5 Selling Products (Quantity)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
              <Tooltip cursor={{fill: '#f3f4f6'}} />
              <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 lg:col-span-3">
          <h3 className="font-semibold mb-4 text-gray-700">Inventory by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryChart}>
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}


const MetricCard = ({ title, value, color, onClick }) => (
  <div onClick={onClick} className={`bg-white p-5 rounded-xl shadow-sm border border-gray-100 border-l-4 ${color} ${onClick ? 'cursor-pointer hover:shadow-md transition' : ''}`}>
    <p className="text-sm text-gray-500 font-medium">{title}</p>
    <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
  </div>
);

export default Dashboard;