// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      {/* - flex-1 makes it fill the rest of the row on desktop
          - Removed pt-14 so content starts at the top on mobile
      */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;