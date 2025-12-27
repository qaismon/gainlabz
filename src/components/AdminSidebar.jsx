// src/components/AdminSidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, LayoutDashboard, PlusCircle, List, Tag, ShoppingCart, Users } from "lucide-react";

function AdminSidebar() {
  const [open, setOpen] = useState(false);

  // Helper for active link styling
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 text-sm sm:text-base ${
      isActive
        ? "bg-green-600 text-white shadow-md"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <>
      {/* 1. MOBILE FLOATING TOGGLE BUTTON 
          - Hidden on desktop (lg:hidden)
          - Absolute/Fixed on mobile so it doesn't take up a "bar" space
      */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-40 bg-gray-900 text-white p-3 rounded-full shadow-xl border border-gray-700 active:scale-95 transition-transform"
        >
          <Menu size={24} />
        </button>
      )}

      {/* 2. OVERLAY 
          - Dims the background when sidebar is open on mobile
      */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 3. SIDEBAR 
          - Mobile: Fixed position, slides in from left
          - Desktop: Static position, stays visible as part of the flex layout
      */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out border-r border-gray-800
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center font-bold text-white">
              G
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Admin</h2>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* SIDEBAR NAVIGATION LINKS */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-75px)]">
          <NavLink to="/admin" end className={linkClasses} onClick={() => setOpen(false)}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/add-product" className={linkClasses} onClick={() => setOpen(false)}>
            <PlusCircle size={20} />
            <span>Add Product</span>
          </NavLink>

          <NavLink to="/admin/list-products" className={linkClasses} onClick={() => setOpen(false)}>
            <List size={20} />
            <span>List Products</span>
          </NavLink>

          <NavLink to="/admin/offers" className={linkClasses} onClick={() => setOpen(false)}>
            <Tag size={20} />
            <span>Manage Offers</span>
          </NavLink>

          <NavLink to="/admin/orders" className={linkClasses} onClick={() => setOpen(false)}>
            <ShoppingCart size={20} />
            <span>Order Management</span>
          </NavLink>

          <NavLink to="/admin/users" className={linkClasses} onClick={() => setOpen(false)}>
            <Users size={20} />
            <span>Users</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default AdminSidebar;