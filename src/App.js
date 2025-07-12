import React, { useState, useEffect } from 'react';
import './App.css';

const sampleProducts = [
  {
    id: 1,
    name: 'iPhone 14',
    brand: 'Apple',
    image: '/assets/iphone14.webp',
    price: '$999',
    features: ['6.1" OLED', 'A16 Bionic', '128GB Storage'],
    category: 'mobile',
  },
  {
    id: 2,
    name: 'Galaxy S23 Ultra',
    brand: 'Samsung',
    image: '/assets/galaxys23ultra.webp',
    price: '$1199',
    features: ['6.8" AMOLED', 'Snapdragon 8 Gen 2', '256GB Storage'],
    category: 'mobile',
  },
  {
    id: 3,
    name: 'Pixel 7 Pro',
    brand: 'Google',
    image: '/assets/pixel7pro.webp',
    price: '$899',
    features: ['6.7" OLED', 'Google Tensor G2', '128GB Storage'],
    category: 'mobile',
  },
  {
    id: 4,
    name: 'MacBook Air M2',
    brand: 'Apple',
    image: '/assets/macbookairm2.webp',
    price: '$1199',
    features: ['13.6" Retina', 'M2 Chip', '256GB SSD'],
    category: 'laptop',
  },
  {
    id: 5,
    name: 'Dell XPS 13',
    brand: 'Dell',
    image: '/assets/dellxps13.webp',
    price: '$999',
    features: ['13.4" FHD+', 'Intel i7 12th Gen', '512GB SSD'],
    category: 'laptop',
  },
  {
    id: 6,
    name: 'HP Spectre x360',
    brand: 'HP',
    image: '/assets/hpspectrex360.jpg',
    price: '$1099',
    features: ['14" Touch Display', 'Intel Evo i7', '16GB RAM'],
    category: 'laptop',
  },
  {
    id: 7,
    name: 'Sony WF-1000XM5',
    brand: 'Sony',
    image: '/assets/sonywf1000xm5.jpg',
    price: '$279',
    features: ['ANC', 'LDAC Support', '8hr Battery'],
    category: 'earbuds',
  },
  {
    id: 8,
    name: 'AirPods 4',
    brand: 'Apple',
    image: '/assets/airpods4.jpg',
    price: '$249',
    features: ['ANC', 'MagSafe Case', 'H2 Chip'],
    category: 'earbuds',
  },
  {
    id: 9,
    name: 'Galaxy Buds2 Pro',
    brand: 'Samsung',
    image: '/assets/galaxybuds2pro.webp',
    price: '$229',
    features: ['24-bit Hi-Fi Audio', 'ANC', 'Wireless Charging'],
    category: 'earbuds',
  }
];

function App() {
  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('compareList');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [compareCategory, setCompareCategory] = useState('all');

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const toggleCompare = (product) => {
    if (compareCategory === 'all' || compareCategory === product.category || compareList.length === 0) {
      if (compareList.length === 0) setCompareCategory(product.category);

      setCompareList(prev => {
        const exists = prev.find(p => p.id === product.id);
        const updated = exists ? prev.filter(p => p.id !== product.id) : [...prev, product].slice(0, 3);
        if (updated.length === 0) setCompareCategory('all');
        return updated;
      });
    } else {
      alert(`Only ${compareCategory} products can be compared at a time.`);
    }
  };

  const clearCompare = () => {
    setCompareList([]);
    setCompareCategory('all');
  };

  const filteredProducts = sampleProducts.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const textMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && textMatch;
  });

  const getHighlightedClass = (attr, value) => {
    const allValues = compareList.map(p => p[attr]);
    const isDifferent = new Set(allValues).size > 1;
    return isDifferent ? 'highlight-diff' : '';
  };

  return (
    <div className={`App ${theme}`}>
      <header className="header">
        <h1>Product Comparison Tool</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </header>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Search products"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
          aria-label="Select category"
        >
          <option value="all">All</option>
          <option value="mobile">Mobiles</option>
          <option value="laptop">Laptops</option>
          <option value="earbuds">Earbuds</option>
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card" tabIndex="0">
            <div className="productImage">
              <img
                src={product.image}
                alt={product.name}
                style={{ maxWidth: '100%', maxHeight: '50%', objectFit: 'contain', display: 'block', margin: '0 auto' }}
              />
            </div>
            <h3>{product.name}</h3>
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Price:</strong> {product.price}</p>
            <ul>
              {product.features.map((feat, i) => <li key={i}>{feat}</li>)}
            </ul>
            <button
              className={compareList.find(p => p.id === product.id) ? 'selected' : ''}
              onClick={() => toggleCompare(product)}
              aria-pressed={!!compareList.find(p => p.id === product.id)}
            >
              {compareList.find(p => p.id === product.id) ? 'Remove' : 'Add to Compare'}
            </button>
          </div>
        ))}
      </div>

      {compareList.length >= 2 && (
        <div className="compare-view">
          <h2>Compare Products</h2>
          <div className="compare-table">
            {compareList.map(product => (
              <div key={product.id} className="compare-card">
                <div className="compareProductImage">
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ maxWidth: '100%', maxHeight: '140px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
                  />
                </div>
                <h3>{product.name}</h3>
                <p className={getHighlightedClass('brand', product.brand)}>
                  <strong>Brand:</strong> {product.brand}
                </p>
                <p className={getHighlightedClass('price', product.price)}>
                  <strong>Price:</strong> {product.price}
                </p>
                <ul>
                  {product.features.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
                <button onClick={() => toggleCompare(product)}>Remove</button>
              </div>
            ))}
          </div>
          <button onClick={clearCompare} className="clear-btn">Clear All</button>
        </div>
      )}
    </div>
  );
}

export default App;
