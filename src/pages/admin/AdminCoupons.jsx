import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import API_BASE_URL from '../../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiCopy } from 'react-icons/fi';

function AdminCoupons() {
  const { userToken, isAdmin } = useContext(ShopContext);
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', discountPercent: '', maxUses: '', expiresAt: '' });

  const fetchCoupons = async () => {
    const res = await fetch(`${API_BASE_URL}/api/coupons`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const data = await res.json();
    if (data.success) setCoupons(data.coupons);
  };

  useEffect(() => { if (isAdmin) fetchCoupons(); }, [isAdmin]);

  if (!isAdmin) return <div className="p-6 text-center text-red-600 font-bold">Access Denied</div>;

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/api/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        code: form.code,
        discountPercent: Number(form.discountPercent),
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        expiresAt: form.expiresAt || null
      })
    });
    const data = await res.json();
    if (data.success) {
      toast.success('Coupon created!');
      setShowForm(false);
      setForm({ code: '', discountPercent: '', maxUses: '', expiresAt: '' });
      fetchCoupons();
    } else toast.error(data.message);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    const res = await fetch(`${API_BASE_URL}/api/coupons/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (res.ok) { toast.success('Deleted'); fetchCoupons(); }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-800">COUPONS</h1>
            <p className="text-sm text-gray-500">Create and manage discount codes</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-green-700 transition-all">
            <FiPlus /> New Coupon
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="CODE (e.g. SUMMER20)" className="p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-100 text-sm font-bold" />
              <input required type="number" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} placeholder="Discount %" min="1" max="100" className="p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-100 text-sm" />
              <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="Max uses (leave empty = unlimited)" className="p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-100 text-sm" />
              <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-100 text-sm" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-700 transition-all">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Code</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Discount</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Uses</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Expires</th>
                <th className="px-6 py-4 text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-700 text-sm bg-green-50 px-2 py-1 rounded-lg">{c.code}</span>
                    <button onClick={() => { navigator.clipboard.writeText(c.code); toast.success('Copied!'); }} className="ml-2 text-gray-400 hover:text-gray-600"><FiCopy size={14} /></button>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">-{c.discountPercent}%</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ' / ∞'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleDelete(c._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><FiTrash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400 italic">No coupons yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminCoupons;
