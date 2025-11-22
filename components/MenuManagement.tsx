import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Plus, Edit2, Trash2, Image as ImageIcon, Save } from 'lucide-react';
import { INITIAL_MENU_ITEMS, CATEGORIES } from '../constants';

const MenuManagement: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Empty form state
  const [formData, setFormData] = useState<Partial<MenuItem>>({
      name: '', category: 'Main Course', price: 0
  });

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure?')) {
        setItems(items.filter(i => i.id !== id));
    }
  };

  const startEdit = (item: MenuItem) => {
      setIsEditing(item.id);
      setFormData(item);
  };

  const cancelEdit = () => {
      setIsEditing(null);
      setFormData({ name: '', category: 'Main Course', price: 0 });
  };

  const handleSave = () => {
      if (isEditing) {
          setItems(items.map(i => i.id === isEditing ? { ...i, ...formData } as MenuItem : i));
      } else {
          const newItem: MenuItem = {
              ...formData as MenuItem,
              id: Date.now().toString(),
              image: 'https://picsum.photos/200/300'
          };
          setItems([newItem, ...items]);
      }
      cancelEdit();
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
        <button 
            onClick={() => { setIsEditing(''); setFormData({category: 'Breakfast', price: 0}); }}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-700 transition"
        >
            <Plus size={18} />
            <span>Add New Item</span>
        </button>
      </div>

      {/* Edit/Create Form Overlay */}
      {(isEditing !== null) && (
          <div className="mb-8 bg-white p-6 rounded-xl border border-orange-200 shadow-lg animate-fade-in">
              <h3 className="font-bold text-lg mb-4">{isEditing === '' ? 'Create Item' : 'Edit Item'}</h3>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm text-gray-600">Name</label>
                      <input 
                        className="w-full border p-2 rounded" 
                        value={formData.name || ''} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                  </div>
                  <div>
                      <label className="block text-sm text-gray-600">Category</label>
                      <select 
                        className="w-full border p-2 rounded"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                      >
                          {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm text-gray-600">Price (LKR)</label>
                      <input 
                        type="number"
                        className="w-full border p-2 rounded" 
                        value={formData.price || 0} 
                        onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      />
                  </div>
                  <div>
                      <label className="block text-sm text-gray-600">Description</label>
                      <input 
                        className="w-full border p-2 rounded" 
                        value={formData.description || ''} 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                      />
                  </div>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                  <button onClick={cancelEdit} className="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
                  <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded flex items-center space-x-2">
                      <Save size={16} /> <span>Save Item</span>
                  </button>
              </div>
          </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
                <tr>
                    <th className="p-4 text-sm font-semibold text-gray-600">Item</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Category</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Price</th>
                    <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                        <td className="p-4 flex items-center space-x-3">
                            <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-medium text-gray-800">{item.name}</span>
                        </td>
                        <td className="p-4 text-gray-600">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{item.category}</span>
                        </td>
                        <td className="p-4 font-mono text-gray-700">LKR {item.price}</td>
                        <td className="p-4 text-right space-x-2">
                            <button onClick={() => startEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuManagement;