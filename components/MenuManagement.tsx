import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Plus, Edit2, Trash2, Save, X, Image, Check, Ban } from 'lucide-react';
import { CATEGORIES } from '../constants';

interface MenuManagementProps {
    items: MenuItem[];
    onUpdateItems: (items: MenuItem[]) => void;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ items, onUpdateItems }) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Empty form state
  const [formData, setFormData] = useState<Partial<MenuItem>>({
      name: '', category: 'Main Course', price: 0, image: '', available: true
  });

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this item?')) {
        const newItems = items.filter(i => i.id !== id);
        onUpdateItems(newItems);
    }
  };

  const handleToggleAvailability = (item: MenuItem) => {
      const updatedItems = items.map(i => i.id === item.id ? { ...i, available: !i.available } : i);
      onUpdateItems(updatedItems);
  };

  const startEdit = (item: MenuItem) => {
      setIsEditing(item.id);
      setFormData(item);
  };

  const cancelEdit = () => {
      setIsEditing(null);
      setFormData({ name: '', category: 'Main Course', price: 0, image: '', available: true });
  };

  const handleSave = () => {
      if (!formData.name || !formData.price) return alert("Name and Price are required");

      const newItemData: MenuItem = {
          id: isEditing || Date.now().toString(),
          name: formData.name!,
          price: Number(formData.price),
          category: formData.category || 'Main Course',
          description: formData.description || '',
          image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60',
          isVegetarian: formData.isVegetarian || false,
          available: formData.available !== undefined ? formData.available : true
      };

      if (isEditing) {
          const updatedItems = items.map(i => i.id === isEditing ? newItemData : i);
          onUpdateItems(updatedItems);
      } else {
          onUpdateItems([newItemData, ...items]);
      }
      cancelEdit();
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-gray-50 pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">Menu Management</h1>
            <p className="text-sm md:text-base text-gray-500">Manage food items, prices, and availability</p>
        </div>
        <button 
            onClick={() => { setIsEditing(''); setFormData({category: 'Breakfast', price: 0, available: true}); }}
            className="w-full md:w-auto bg-orange-600 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-orange-700 transition shadow-lg shadow-orange-200 active:scale-95"
        >
            <Plus size={20} />
            <span>Add New Item</span>
        </button>
      </div>

      {/* Edit/Create Form Overlay */}
      {(isEditing !== null) && (
          <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-4">
            <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-2xl shadow-2xl relative animate-slide-up-mobile md:animate-fade-in max-h-[90vh] overflow-y-auto flex flex-col">
              <div className="sticky top-0 bg-white z-10 p-4 md:p-6 border-b flex justify-between items-center rounded-t-2xl">
                  <h3 className="font-bold text-xl text-gray-800 flex items-center gap-3">
                      {isEditing === '' ? <div className="bg-green-100 p-2 rounded-lg text-green-600"><Plus size={20} /></div> : <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Edit2 size={20} /></div>}
                      {isEditing === '' ? 'Add New Item' : 'Edit Item'}
                  </h3>
                  <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all">
                      <X size={24} />
                  </button>
              </div>

              <div className="p-4 md:p-8 space-y-6 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="col-span-1 md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2">Item Name</label>
                          <input 
                            className="w-full bg-gray-50 border border-gray-200 p-3 md:p-4 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium" 
                            value={formData.name || ''} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            placeholder="e.g. Chicken Kottu"
                            autoFocus
                          />
                      </div>
                      
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                          <div className="relative">
                            <select 
                                className="w-full bg-gray-50 border border-gray-200 p-3 md:p-4 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none appearance-none"
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <div className="absolute right-4 top-4 pointer-events-none text-gray-500">▼</div>
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Price (LKR)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3.5 md:top-4 text-gray-500 font-bold">LKR</span>
                            <input 
                                type="number"
                                className="w-full bg-gray-50 border border-gray-200 p-3 md:p-4 pl-14 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-mono font-bold" 
                                value={formData.price || ''} 
                                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                                placeholder="0.00"
                            />
                          </div>
                      </div>

                      <div className="col-span-1 md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                          <div className="relative">
                            <input 
                                className="w-full bg-gray-50 border border-gray-200 p-3 md:p-4 pl-10 md:pl-12 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm text-gray-600 truncate" 
                                value={formData.image || ''} 
                                onChange={e => setFormData({...formData, image: e.target.value})}
                                placeholder="https://images.unsplash.com/..."
                            />
                            <Image className="absolute left-3 md:left-4 top-3.5 md:top-4 text-gray-400" size={20} />
                          </div>
                      </div>

                      <div className="col-span-1 md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                          <textarea 
                            className="w-full bg-gray-50 border border-gray-200 p-3 md:p-4 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none h-24" 
                            value={formData.description || ''} 
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            placeholder="Short description of the food item"
                          />
                      </div>
                      
                      <div className="col-span-1 md:col-span-2 flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div 
                                onClick={() => setFormData({...formData, available: !formData.available})}
                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${formData.available ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-all duration-300 ${formData.available ? 'left-6' : 'left-0.5'}`}></div>
                            </div>
                            <span className="font-bold text-gray-700">Currently Available</span>
                      </div>
                  </div>
              </div>

              <div className="p-4 md:p-6 border-t flex space-x-3 bg-white pb-safe sticky bottom-0 z-10">
                  <button onClick={cancelEdit} className="flex-1 px-6 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors border border-gray-200">Cancel</button>
                  <button onClick={handleSave} className="flex-1 px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 flex items-center justify-center space-x-2 shadow-lg shadow-orange-200 transform active:scale-95 transition-all">
                      <Save size={18} /> <span>Save</span>
                  </button>
              </div>
            </div>
          </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px] md:min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="p-4 pl-6 text-sm font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Item Details</th>
                        <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Status</th>
                        <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Price</th>
                        <th className="p-4 text-sm font-bold text-gray-600 uppercase tracking-wider text-right pr-6 whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-gray-500">No items found. Add one to get started!</td>
                        </tr>
                    ) : (
                        items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 transition duration-150 group">
                                <td className="p-4 pl-6 flex items-center space-x-4">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gray-200 overflow-hidden shadow-sm shrink-0">
                                        <img src={item.image} alt={item.name} className={`w-full h-full object-cover transition-all ${!item.available ? 'grayscale opacity-50' : ''}`} />
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-800 block text-sm md:text-base">{item.name}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-100 uppercase tracking-wider whitespace-nowrap">{item.category}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <button 
                                        onClick={() => handleToggleAvailability(item)}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold border transition-all whitespace-nowrap ${
                                            item.available 
                                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                        }`}
                                    >
                                        {item.available ? <Check size={12} /> : <Ban size={12} />}
                                        {item.available ? 'In Stock' : 'Sold Out'}
                                    </button>
                                </td>
                                <td className="p-4 font-mono font-bold text-gray-700 text-sm md:text-base whitespace-nowrap">LKR {item.price}</td>
                                <td className="p-4 text-right space-x-2 pr-6 whitespace-nowrap">
                                    <button onClick={() => startEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Edit">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;