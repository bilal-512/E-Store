import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navigation from '../components/Navigation';
import { FaShoppingCart, FaAppleAlt, FaMobileAlt, FaHome, FaBook, FaTshirt, FaFutbol, FaSpa, FaBoxOpen, FaClipboardList, FaMoneyBill, FaSearch } from 'react-icons/fa';

function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  const productCategories = [
    { value: 'all', label: 'All Products', icon: FaShoppingCart },
    { value: 'groceries', label: 'Groceries', icon: FaAppleAlt },
    { value: 'electronics', label: 'Electronics', icon: FaMobileAlt },
    { value: 'household', label: 'Household', icon: FaHome },
    { value: 'beauty', label: 'Beauty', icon: FaSpa },
    { value: 'books', label: 'Books', icon: FaBook },
    { value: 'sports', label: 'Sports', icon: FaFutbol },
    { value: 'clothing', label: 'Clothing', icon: FaTshirt }
  ];

  useEffect(() => {
    fetchProducts();
    fetchUserProfile();
    fetchOrderHistory();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await api.get('/orders');
      setOrderHistory(response.data);
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      setCart(cart.map(item => 
        item._id === product._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item._id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    try {
      const orderItems = cart.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      await api.post('/orders', {
        items: orderItems,
        totalAmount: getCartTotal()
      });

      alert('Order placed successfully!');
      setCart([]);
      setShowCart(false);
      fetchOrderHistory();
    } catch (error) {
      alert('Order failed. Please try again.');
    }
  };

  const getFilteredProducts = () => {
    let filtered = products;
    
    if (filter !== 'all') {
      filtered = filtered.filter(product => product.category === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getProductIcon = (category) => {
    const cat = productCategories.find(c => c.value === category);
    const Icon = cat ? cat.icon : FaBoxOpen;
    return <Icon style={{ fontSize: '1.5rem', color: 'var(--color-accent)' }} />;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'var(--color-background)'
      }}>
        <div style={{ 
          background: 'var(--color-surface)', 
          padding: '2rem', 
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--box-shadow)',
          color: 'var(--color-text)',
          fontSize: '1.2rem'
        }}>
          Loading store... ⏳
        </div>
      </div>
    );
  }

  const filteredProducts = getFilteredProducts();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      <Navigation />
      
      <div style={{ 
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div className="card animate-fade-in" style={{ 
          padding: '2rem',
          marginBottom: '2rem',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--box-shadow)',
          textAlign: 'center'
        }}>
          <FaShoppingCart style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-accent)' }} />
          <h1 style={{ 
            margin: 0,
            color: 'var(--color-primary)',
            fontSize: '2.5rem'
          }}>
            Society Store
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-text)', fontSize: '1.1rem' }}>
            Shop for products from your society store
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--box-shadow)',
            textAlign: 'center'
          }}>
            <FaClipboardList style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>Total Products</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-accent)' }}>
              {products.length}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--box-shadow)',
            textAlign: 'center'
          }}>
            <FaShoppingCart style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-text)' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>Cart Items</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-accent)' }}>
              {cart.length}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--box-shadow)',
            textAlign: 'center'
          }}>
            <FaMoneyBill style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>Cart Total</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-accent)' }}>
              Rs. {getCartTotal().toLocaleString()}
            </p>
          </div>
          
          <div className="card animate-fade-in" style={{ 
            padding: '1.5rem',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--box-shadow)',
            textAlign: 'center'
          }}>
            <FaBoxOpen style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>Orders</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-accent)' }}>
              {orderHistory.length}
            </p>
          </div>
        </div>

        {/* Search and Cart */}
        <div className="card" style={{ 
          padding: '1rem',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--box-shadow)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ position: 'relative' }}>
                <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text)', fontSize: '1.1rem' }} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.2rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
            
            <button
              onClick={() => setShowCart(true)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--color-accent)',
                color: 'var(--color-background)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              🛒 Cart ({cart.length})
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="card" style={{ 
          padding: '1rem',
          background: 'var(--color-surface)',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {productCategories.map((category) => (
              <button
                key={category.value}
                onClick={() => setFilter(category.value)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  background: filter === category.value 
                    ? 'var(--color-primary)'
                    : 'var(--color-surface)',
                  color: filter === category.value ? '#fff' : 'var(--color-text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {getProductIcon(category.value)} {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="card" style={{ 
          padding: '2rem',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--box-shadow)'
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}>Available Products</h2>
          
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
              <p>No products found for the selected filter.</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {filteredProducts.map((product) => (
                <div key={product._id} style={{ 
                  padding: '1.5rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  background: 'var(--color-surface)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  ':hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 'var(--box-shadow)'
                  }
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div style={{ 
                      fontSize: '3rem',
                      marginBottom: '0.5rem'
                    }}>
                      {getProductIcon(product.category || 'other')}
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                      {product.name}
                    </div>
                    <div style={{ color: 'var(--color-text)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      Category: {product.category || 'General'}
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: '1rem',
                    background: 'var(--color-surface)',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '600', color: 'var(--color-text)' }}>Price:</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                        Rs. {product.price.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--color-text)' }}>Stock:</span>
                      <span style={{ 
                        color: product.quantity > 0 ? 'var(--color-accent)' : 'var(--color-error)',
                        fontWeight: '600'
                      }}>
                        {product.quantity > 0 ? `${product.quantity} available` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.quantity <= 0}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: product.quantity > 0 
                        ? 'var(--color-accent)'
                        : 'var(--color-surface)',
                      color: 'var(--color-background)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: product.quantity > 0 ? 'pointer' : 'not-allowed',
                      opacity: product.quantity > 0 ? 1 : 0.6
                    }}
                  >
                    {product.quantity > 0 ? '🛒 Add to Cart' : '🚫 Out of Stock'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shopping Cart Modal */}
      {showCart && (
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
          <div className="card animate-fade-in" style={{
            padding: '2rem',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderRadius: 'var(--border-radius)',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text)', textAlign: 'center' }}>
              🛒 Shopping Cart
            </h2>
            
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
                <p>Your cart is empty.</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  {cart.map((item) => (
                    <div key={item._id} style={{ 
                      padding: '1rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600' }}>{item.name}</div>
                        <div style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>
                          Rs. {item.price.toLocaleString()} each
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              background: 'var(--color-error)',
                              color: 'var(--color-background)',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            -
                          </button>
                          <span style={{ minWidth: '2rem', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              background: 'var(--color-accent)',
                              color: 'var(--color-background)',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            +
                          </button>
                        </div>
                        
                        <div style={{ fontWeight: '600', minWidth: '4rem', textAlign: 'right' }}>
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item._id)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: 'var(--color-error)',
                            color: 'var(--color-background)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{ 
                  padding: '1rem',
                  background: 'var(--color-surface)',
                  borderRadius: '8px',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>Total:</span>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-accent)' }}>
                      Rs. {getCartTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={handleCheckout}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'var(--color-accent)',
                      color: 'var(--color-background)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    💳 Checkout
                  </button>
                  
                  <button
                    onClick={() => setShowCart(false)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'var(--color-surface)',
                      color: 'var(--color-text)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Store;