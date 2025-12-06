import React, { useContext, useMemo } from "react";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";

// Recharts Components
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

    // ----------- CALCULATED METRICS -----------
    const { totalProducts, totalOrders, pendingOrders, totalRevenue } =
        useMemo(() => {
            const totalProds = products?.length || 0;
            const totalOrds = orders.length;

            const pendingOrds = orders.filter(
                (order) => (order.status || "").toLowerCase() === "processing"
            ).length;

            let revenue = 0;

            orders.forEach((order) => {
                const status = (order.status || "").toLowerCase();
                if (["delivered", "completed"].includes(status)) {
                    const amt = parseFloat(order.amount);
                    if (!isNaN(amt)) revenue += amt;
                }
            });

            return {
                totalProducts: totalProds,
                totalOrders: totalOrds,
                pendingOrders: pendingOrds,
                totalRevenue: revenue,
            };
        }, [products, orders]);

    // ----------- CHART DATA -----------

    // Pie Chart – Order Status Breakdown
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

    // 🚀 FIXED: Daily Revenue Chart (Instead of Monthly)
    const dailyRevenue = useMemo(() => {
        const revenueMap = {};

        orders.forEach((order) => {
            const status = (order.status || "").toLowerCase();
            if (!["delivered", "completed"].includes(status)) return;

            const date = new Date(order.date);
            // New Key: Day/Month/Year to get more data points
            const key = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

            revenueMap[key] = (revenueMap[key] || 0) + Number(order.amount || 0);
        });

        // Sort by date to ensure proper trend line direction
        return Object.keys(revenueMap)
            .sort((a, b) => {
                const partsA = a.split('/').map(Number); // [Day, Month, Year]
                const dateA = new Date(partsA[2], partsA[1] - 1, partsA[0]);
                
                const partsB = b.split('/').map(Number);
                const dateB = new Date(partsB[2], partsB[1] - 1, partsB[0]);
                
                return dateA - dateB;
            })
            .map((day) => ({
                day, // Changed from 'month' to 'day'
                revenue: revenueMap[day],
            }));
    }, [orders]);

    // Product Category Distribution
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

    // ----------- UI -----------

    return (
        <div className="space-y-10 pb-10">
            <h1 className="text-3xl font-bold text-gray-800">
                Welcome Back, {activeUserName || "Admin"}!
            </h1>
            <p className="text-gray-500 mb-6">
                Insightful overview of your store's performance.
            </p>

            {/* METRICS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-3xl font-extrabold mt-1">
                        {currency} {totalRevenue.toFixed(2)}
                    </p>
                </div>

                <div
                    className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500 cursor-pointer"
                    onClick={() => navigate("/admin/orders")}
                >
                    <p className="text-sm text-gray-500">Pending Orders</p>
                    <p className="text-3xl font-extrabold mt-1 text-yellow-600">
                        {pendingOrders}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <p className="text-sm text-gray-500">Total Products</p>
                    <p className="text-3xl font-extrabold mt-1">{totalProducts}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-3xl font-extrabold mt-1">{totalOrders}</p>
                </div>
            </div>

            {/* CHARTS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* PIE CHART – Order Status */}
                <div className="bg-white p-6 rounded-xl shadow-md col-span-1">
                    <h3 className="text-lg font-semibold mb-3">Order Status Breakdown</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={90}
                                dataKey="value"
                            >
                                {pieData.map((_, index) => (
                                    <Cell key={index} fill={pieColors[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* LINE CHART – Daily Revenue (Updated title and data) */}
                <div className="bg-white p-6 rounded-xl shadow-md col-span-2">
                    <h3 className="text-lg font-semibold mb-3">Daily Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        {/* 🌟 Use dailyRevenue data */}
                        <LineChart data={dailyRevenue}> 
                            <CartesianGrid strokeDasharray="3 3" />
                            {/* 🌟 Use dataKey="day" for the X-Axis */}
                            <XAxis dataKey="day" /> 
                            <YAxis tickFormatter={(value) => `${currency}${value}`} /> 
                            <Tooltip formatter={(value) => [`${currency}${value.toFixed(2)}`, 'Revenue']} />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* BAR CHART – Product Categories */}
                <div className="bg-white p-6 rounded-xl shadow-md col-span-3">
                    <h3 className="text-lg font-semibold mb-3">Products by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryChart}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis allowDecimals={false} />
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