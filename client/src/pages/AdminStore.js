import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AdminSidebar from '../components/AdminSidebar';

function AdminStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [showQuickUpdate, setShowQuickUpdate] = useState(false);
  const [quickUpdateData, setQuickUpdateData] = useState({ quantity: '', price: '' });
  const [selectedProductForQuickUpdate, setSelectedProductForQuickUpdate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'groceries',
    description: '',
    quantity: '',
    price: '',
    unit: 'piece',
    minStock: '5'
  });

  const categories = [
    { value: 'groceries', label: '🛒 Groceries', icon: '🛒' },
    { value: 'electronics', label: '📱 Electronics', icon: '📱' },
    { value: 'clothing', label: '👕 Clothing', icon: '👕' },
    { value: 'household', label: '🏠 Household', icon: '🏠' },
    { value: 'books', label: '📚 Books', icon: '📚' },
    { value: 'sports', label: '⚽ Sports', icon: '⚽' },
    { value: 'beauty', label: '💄 Beauty', icon: '💄' },
    { value: 'other', label: '📦 Other', icon: '📦' }
  ];

  const units = [
    { value: 'piece', label: 'Piece' },
    { value: 'kg', label: 'Kilogram' },
    { value: 'liter', label: 'Liter' },
    { value: 'pack', label: 'Pack' },
    { value: 'box', label: 'Box' },
    { value: 'bottle', label: 'Bottle' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      let response;
      if (lowStockOnly) {
        response = await api.get('/admin/products/low-stock');
      } else if (selectedCategory !== 'all') {
        response = await api.get(`/admin/products/category/${selectedCategory}`);
      } else {
        response = await api.get('/products');
      }
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, formData);
        alert('Product updated successfully!');
      } else {
        await api.post('/admin/products', formData);
        alert('Product added successfully!');
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      alert('Error saving product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || '',
      quantity: product.quantity,
      price: product.price,
      unit: product.unit || 'piece',
      minStock: product.minStock || '5'
    });
    setShowAddForm(true);
  };

  const handleQuickUpdate = (product) => {
    setSelectedProductForQuickUpdate(product);
    setQuickUpdateData({
      quantity: product.quantity,
      price: product.price
    });
    setShowQuickUpdate(true);
  };

  const handleQuickUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/products/${selectedProductForQuickUpdate._id}/stock`, quickUpdateData);
      alert('Product updated successfully!');
      setShowQuickUpdate(false);
      setSelectedProductForQuickUpdate(null);
      fetchProducts();
    } catch (error) {
      alert('Error updating product');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${productId}`);
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'groceries',
      description: '',
      quantity: '',
      price: '',
      unit: 'piece',
      minStock: '5'
    });
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : '📦';
  };

  const getStockStatus = (quantity, minStock) => {
    if (quantity <= 0) return { status: 'out', color: '#dc3545', text: 'Out of Stock' };
    if (quantity <= minStock) return { status: 'low', color: '#ffc107', text: 'Low Stock' };
    return { status: 'good', color: '#28a745', text: 'In Stock' };
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#f7fafd'
      }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '2rem', 
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          color: 'white',
          fontSize: '1.2rem'
        }}>
          Loading store management... ⏳
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafd' }}>
      <AdminSidebar />
      <div style={{
        marginLeft: '80px',
        padding: '2rem',
        maxWidth: '1400px',
        marginRight: 'auto',
        marginLeft: '100px',
        transition: 'margin-left 0.3s',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 2px 12px rgba(102,126,234,0.07)',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛒</div>
          <h1 style={{ 
            margin: 0,
            fontSize: '2.2rem',
            color: '#222',
            fontWeight: 700,
            letterSpacing: '-1px',
          }}>
            Store Management
          </h1>
          <p style={{ margin: 0, color: '#888', fontSize: '1.1rem' }}>
            Manage products, inventory, and store operations
          </p>
        </div>
        {/* Prominent Add Product Button */}
        <div className="card" style={{ 
          padding: '2rem',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 1rem 0', color: '#333', fontSize: '1.5rem' }}>
            Add New Product to Store
          </h2>
          <p style={{ margin: '0 0 1.5rem 0', color: '#666' }}>
            Create new products with categories, pricing, and stock management
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto',
              boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)';
            }}
          >
            ➕ Add New Product
          </button>
        </div>

        {/* Controls */}
        <div className="card" style={{ 
          padding: '1.5rem',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                fetchProducts();
              }}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                minWidth: '150px'
              }}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(e) => {
                  setLowStockOnly(e.target.checked);
                  fetchProducts();
                }}
              />
              Show Low Stock Only
            </label>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="card animate-fade-in" style={{ 
            padding: '2rem',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, color: '#333' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={resetForm}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ✕ Cancel
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                    Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  >
                    {units.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                    Min Stock Level
                  </label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        )}

        {/* Quick Update Modal */}
        {showQuickUpdate && selectedProductForQuickUpdate && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{
              padding: '2rem',
              background: 'white',
              borderRadius: '12px',
              maxWidth: '400px',
              width: '90%'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>
                Quick Update: {selectedProductForQuickUpdate.name}
              </h3>
              <form onSubmit={handleQuickUpdateSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quickUpdateData.quantity}
                    onChange={(e) => setQuickUpdateData({ ...quickUpdateData, quantity: e.target.value })}
                    required
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={quickUpdateData.price}
                    onChange={(e) => setQuickUpdateData({ ...quickUpdateData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuickUpdate(false);
                      setSelectedProductForQuickUpdate(null);
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="card" style={{ 
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee' }}>
            <h2 style={{ margin: 0, color: '#333' }}>
              Available Products ({products.length})
            </h2>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
              Click edit to modify product details or quick update for stock/price changes
            </p>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Product</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #eee' }}>Stock</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #eee' }}>Price</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #eee' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const stockStatus = getStockStatus(product.quantity, product.minStock);
                  return (
                    <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#333' }}>{product.name}</div>
                          {product.description && (
                            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                              {product.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          padding: '0.25rem 0.75rem',
                          background: '#e9ecef',
                          borderRadius: '20px',
                          fontSize: '0.9rem'
                        }}>
                          {getCategoryIcon(product.category)} {product.category}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div>
                          <div style={{ 
                            fontWeight: '600', 
                            color: stockStatus.color,
                            marginBottom: '0.25rem'
                          }}>
                            {product.quantity} {product.unit}
                          </div>
                          <div style={{ 
                            fontSize: '0.8rem', 
                            color: stockStatus.color,
                            fontWeight: '500'
                          }}>
                            {stockStatus.text}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontWeight: '600', color: '#333' }}>
                          Rs. {product.price}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          per {product.unit}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleEdit(product)}
                            style={{
                              padding: '0.5rem',
                              background: '#007bff',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                            }}
                            title="Edit Product (Full Form)"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleQuickUpdate(product)}
                            style={{
                              padding: '0.5rem',
                              background: '#ffc107',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                            }}
                            title="Quick Update (Stock & Price)"
                          >
                            ⚡
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            style={{
                              padding: '0.5rem',
                              background: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                            }}
                            title="Delete Product"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {products.length === 0 && (
              <div style={{ 
                padding: '3rem', 
                textAlign: 'center', 
                color: '#666',
                fontSize: '1.1rem'
              }}>
                No products found. {lowStockOnly ? 'All products have sufficient stock.' : 'Add your first product!'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminStore;
