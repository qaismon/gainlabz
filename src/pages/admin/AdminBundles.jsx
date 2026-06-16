import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import API_BASE_URL from '../../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

function AdminBundles() {
  const { userToken, isAdmin, products } = useContext(ShopContext);
  const [bundles, setBundles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', discountPercent: 0, products: [{ product: '', quantity: 1 }] });

  const fetchBundles = async () => {
    const res = await fetch(`${API_BASE_URL}/api/bundles`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const data = await res.json();
    if (data.success) setBundles(data.bundles);
  };

  useEffect(() => { if (isAdmin) fetchBundles(); }, [isAdmin]);

  if (!isAdmin) return <div className="p-6 text-center text-red-600 font-bold">Access Denied</div>;

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/api/bundles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        discountPercent: Number(form.discountPercent),
        products: form.products.filter(p => p.product)
      })
    });
    const data = await res.json();
    if (data.success) {
      toast.success('Bundle created!');
      setShowForm(false);
      setForm({ name: '', description: '', discountPercent: 0, products: [{ product: '', quantity: 1 }] });
      fetchBundles();
    } else toast.error(data.message);
  };

  const handleToggleActive = async (bundle) => {
    const res = await fetch(`${API_BASE_URL}/api/bundles/${bundle._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({ isActive: !bundle.isActive })
    });
    const data = await res.json();
    if (data.success) { toast.success('Updated'); fetchBundles(); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bundle?')) return;
    await fetch(`${API_BASE_URL}/api/bundles/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${userToken}` } });
    toast.success('Deleted');
    fetchBundles();
  };

  const addProductRow = () => setForm({ ...form, products: [...form.products, { product: '', quantity: 1 }] });
  const removeProductRow = (i) => setForm({ ...form, products: form.products.filter((_, idx) => idx !== i) });
  const updateProductRow = (i, field, value) => {
    const updated = [...form.products];
    updated[i] = { ...updated[i], [field]: value };
    setForm({ ...form, products: updated });
  };

  const calcBundlePrice = (bundle) => {
    let total = 0;
    bundle.products.forEach(({ product, quantity }) => {
      if (product && product.price) total += Number(product.price) * quantity;
    });
    const discounted = total - (total * (bundle.discountPercent || 0)) / 100;
    return { original: total, discounted };
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-800">BUNDLES</h1>
            <p className="text-sm text-gray-500">Create product bundles / stacks</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-green-700 transition-all">
            <FiPlus /> New Bundle
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Bundle name" className="p-3 border border-gray-200 rounded-xl outline-none text-sm font-bold" />
              <input type="number" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} placeholder="Bundle discount %" className="p-3 border border-gray-200 rounded-xl outline-none text-sm" />
            </div>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full p-3 border border-gray-200 rounded-xl outline-none text-sm" rows={2} />

            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Products in Bundle</p>
            {form.products.map((p, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select value={p.product} onChange={(e) => updateProductRow(i, 'product', e.target.value)} className="flex-1 p-2.5 border border-gray-200 rounded-xl outline-none text-sm">
                  <option value="">Select a product</option>
                  {products.map((prod) => (
                    <option key={prod._id} value={prod._id}>{prod.name} (${prod.price})</option>
                  ))}
                </select>
                <input type="number" min="1" value={p.quantity} onChange={(e) => updateProductRow(i, 'quantity', Number(e.target.value))} className="w-20 p-2.5 border border-gray-200 rounded-xl outline-none text-sm text-center" />
                {form.products.length > 1 && (
                  <button type="button" onClick={() => removeProductRow(i)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl"><FiX /></button>
                )}
              </div>
            ))}
            <button type="button" onClick={addProductRow} className="text-sm text-green-600 font-bold hover:text-green-700">+ Add product</button>

            <div className="flex gap-2 pt-2">
              <button type="submit" className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-700">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {bundles.map((bundle) => {
            const { original, discounted } = calcBundlePrice(bundle);
            return (
              <div key={bundle._id} className={`bg-white p-6 rounded-2xl border shadow-sm ${bundle.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-800">{bundle.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bundle.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{bundle.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    {bundle.description && <p className="text-sm text-gray-500 mt-1">{bundle.description}</p>}

                    <div className="mt-3 space-y-1">
                      {bundle.products.map((p, i) => (
                        <div key={i} className="text-xs text-gray-600">×{p.quantity} {p.product?.name || 'Unknown'}</div>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      {bundle.discountPercent > 0 && <span className="text-sm text-gray-400 line-through">${original.toFixed(2)}</span>}
                      <span className="text-lg font-black text-green-600">${discounted.toFixed(2)}</span>
                      {bundle.discountPercent > 0 && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">-{bundle.discountPercent}%</span>}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleToggleActive(bundle)} className={`p-2 rounded-lg border transition-all ${bundle.isActive ? 'text-gray-400 border-gray-200 hover:bg-gray-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}>
                      {bundle.isActive ? <FiX size={16} /> : <FiCheck size={16} />}
                    </button>
                    <button onClick={() => handleDelete(bundle._id)} className="p-2 text-red-500 border border-red-100 rounded-lg hover:bg-red-50"><FiTrash2 size={16} /></button>
                  </div>
                </div>
              </div>
            );
          })}
          {bundles.length === 0 && <div className="text-center py-16 text-gray-400 italic">No bundles yet</div>}
        </div>
      </div>
    </div>
  );
}

export default AdminBundles;
