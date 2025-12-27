import React, { useContext, useMemo } from "react";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";

// Recharts
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const { products, orders: contextOrders, activeUserName, currency } =
    useContext(ShopContext);

  const navigate = useNavigate();
  const orders = contextOrders || [];

  // ---------------- METRICS ----------------
  const { totalProducts, totalOrders, pendingOrders, totalRevenue } = useMemo(
    () => {
      const totalProds = products?.length || 0;
      const totalOrds = orders.length;

      const pendingOrds = orders.filter(
        (o) => (o.status || "").toLowerCase() === "processing"
      ).length;

      let revenue = 0;
      orders.forEach((o) => {
        const status = (o.status || "").toLowerCase();
        if (["delivered", "completed"].includes(status)) {
          const amt = parseFloat(o.amount);
          if (!isNaN(amt)) revenue += amt;
        }
      });

      return {
        totalProducts: totalProds,
        totalOrders: totalOrds,
        pendingOrders: pendingOrds,
        totalRevenue: revenue,
      };
    },
    [products, orders]
  );

  // ---------------- PIE DATA ----------------
  const pieData = useMemo(() => {
    const statusCounts = {
      delivered: 0,
      processing: 0,
      cancelled: 0,
    };

    orders.forEach((o) => {
      const s = (o.status || "").toLowerCase();
      if (statusCounts[s] !== undefined) statusCounts[s]++;
    });

    return [
      { name: "Delivered", value: statusCounts.delivered },
      { name: "Processing", value: statusCounts.processing },
      { name: "Cancelled", value: statusCounts.cancelled },
    ];
  }, [orders]);

  const pieColors = ["#22c55e", "#f59e0b", "#ef4444"];

  // ---------------- DAILY REVENUE ----------------
  const dailyRevenue = useMemo(() => {
    const map = {};

    orders.forEach((o) => {
      const status = (o.status || "").toLowerCase();
      if (!["delivered", "completed"].includes(status)) return;

      const d = new Date(o.date);
      const key = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      map[key] = (map[key] || 0) + Number(o.amount || 0);
    });

    return Object.keys(map)
      .sort((a, b) => {
        const pa = a.split("/").map(Number);
        const pb = b.split("/").map(Number);
        return new Date(pa[2], pa[1] - 1, pa[0]) - new Date(pb[2], pb[1] - 1, pb[0]);
      })
      .map((day) => ({ day, revenue: map[day] }));
  }, [orders]);

  // ---------------- CATEGORY CHART ----------------
  const categoryChart = useMemo(() => {
    const catMap = {};
    products.forEach((p) => {
      catMap[p.category] = (catMap[p.category] || 0) + 1;
    });

    return Object.keys(catMap).map((cat) => ({
      category: cat,
      count: catMap[cat],
    }));
  }, [products]);

  // ---------------- UI ----------------
  return (
    <div className="px-3 sm:px-0 space-y-8 pb-10">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Welcome Back, {activeUserName || "Admin"}!
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Insightful overview of your store's performance.
        </p>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl sm:text-3xl font-extrabold mt-1">
            {currency} {totalRevenue.toFixed(2)}
          </p>
        </div>

        <div
          className="bg-white p-5 rounded-xl shadow-md border-l-4 border-yellow-500 cursor-pointer"
          onClick={() => navigate("/admin/orders")}
        >
          <p className="text-sm text-gray-500">Pending Orders</p>
          <p className="text-2xl sm:text-3xl font-extrabold mt-1 text-yellow-600">
            {pendingOrders}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl sm:text-3xl font-extrabold mt-1">
            {totalProducts}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl sm:text-3xl font-extrabold mt-1">
            {totalOrders}
          </p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* PIE */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md lg:col-span-1">
          <h3 className="text-base sm:text-lg font-semibold mb-3">
            Order Status Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} outerRadius={85} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={pieColors[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md lg:col-span-2">
          <h3 className="text-base sm:text-lg font-semibold mb-3">
            Daily Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v) => [`${currency}${v.toFixed(2)}`, "Revenue"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md lg:col-span-3">
          <h3 className="text-base sm:text-lg font-semibold mb-3">
            Products by Category
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
