// ── Datos de productos ──
  const products = [
    {
      id: 1,
      name: "Pelota de Goma Resistente",
      cat: "Juguetes",
      rating: 4.8,
      price: 12.99,
      oldPrice: 18.99,
      stock: 45,
      desc: "Pelota resistente ideal para perros de todas las razas. Material no tóxico y duradero.",
      featured: true,
      img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&q=80"
    },
    {
      id: 2,
      name: "Cuerda para Jugar",
      cat: "Juguetes",
      rating: 4.5,
      price: 8.99,
      oldPrice: null,
      stock: 60,
      desc: "Cuerda trenzada para juegos de tira y afloja. Limpia los dientes mientras juega.",
      featured: false,
      img: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=400&q=80"
    },
    {
      id: 3,
      name: "Croquetas Premium",
      cat: "Comida",
      rating: 4.9,
      price: 24.99,
      oldPrice: 29.99,
      stock: 30,
      desc: "Alimento balanceado con proteínas de alta calidad para perros adultos.",
      featured: true,
      img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80"
    },
    {
      id: 4,
      name: "Collar Ajustable",
      cat: "Accesorios",
      rating: 4.3,
      price: 15.50,
      oldPrice: null,
      stock: 25,
      desc: "Collar de nylon resistente con hebilla metálica. Disponible en varios colores.",
      featured: false,
      img: "https://images.unsplash.com/photo-1602584386319-fa8eb4361c2c?w=400&q=80"
    },
    {
      id: 5,
      name: "Shampoo para Mascotas",
      cat: "Higiene",
      rating: 4.6,
      price: 11.99,
      oldPrice: 14.99,
      stock: 50,
      desc: "Shampoo suave con aloe vera, ideal para pieles sensibles y pelo brillante.",
      featured: true,
      img: "https://images.unsplash.com/photo-1534361960057-19f4434a6f8e?w=400&q=80"
    },
    {
      id: 6,
      name: "Cama Ortopédica",
      cat: "Accesorios",
      rating: 4.7,
      price: 39.99,
      oldPrice: 55.00,
      stock: 15,
      desc: "Cama con espuma memory foam. Perfecta para perros con articulaciones sensibles.",
      featured: false,
      img: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400&q=80"
    },
    {
      id: 7,
      name: "Snacks Naturales",
      cat: "Comida",
      rating: 4.4,
      price: 6.99,
      oldPrice: null,
      stock: 80,
      desc: "Premios naturales sin conservantes artificiales. Perfectos para entrenamiento.",
      featured: false,
      img: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=400&q=80"
    },
    {
      id: 8,
      name: "Cepillo Deslanador",
      cat: "Higiene",
      rating: 4.5,
      price: 13.50,
      oldPrice: 17.00,
      stock: 35,
      desc: "Elimina el pelo muerto con facilidad. Reduce el derrame hasta un 90%.",
      featured: false,
      img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80"
    }
  ];

  let cart = [];
  let activeFilter = 'Todos';
  let liked = new Set();

  // ── Filtro activo ──
  function setFilter(f, btn) {
    activeFilter = f;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts();
  }

  // ── Estrellas ──
  function starsHTML(rating) {
    let s = '';
    for (let i = 1; i <= 5; i++) {
      s += `<span class="star${i > Math.round(rating) ? ' empty' : ''}">★</span>`;
    }
    return s + `<span class="rating-text">(${rating})</span>`;
  }

  // ── Renderizar productos ──
  function renderProducts() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => {
      const matchCat = activeFilter === 'Todos' || p.cat === activeFilter;
      const matchQ = p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      return matchCat && matchQ;
    });

    const grid = document.getElementById('grid');

    if (!filtered.length) {
      grid.innerHTML = '<div class="empty-state">😕 No se encontraron productos.</div>';
      return;
    }

    grid.innerHTML = filtered.map(p => `
      <div class="card">
        <div class="card-img">
          <img src="${p.img}" alt="${p.name}" loading="lazy" />
          ${p.featured ? '<span class="badge">Destacado</span>' : ''}
          <div class="heart${liked.has(p.id) ? ' liked' : ''}" onclick="toggleLike(${p.id}, this)" title="Agregar a favoritos">♥</div>
        </div>
        <div class="card-body">
          <div class="card-title">${p.name}</div>
          <div class="stars">${starsHTML(p.rating)}</div>
          <div class="card-desc">${p.desc}</div>
          <div class="price-row">
            <div>
              <div class="price">$${p.price.toFixed(2)}</div>
              ${p.oldPrice ? `<div class="old-price">$${p.oldPrice.toFixed(2)}</div>` : ''}
            </div>
            <div class="stock">Stock: ${p.stock}</div>
          </div>
          <button class="add-btn" onclick="addToCart(${p.id})">🛒 Agregar al carrito</button>
        </div>
      </div>
    `).join('');
  }

  // ── Favoritos ──
  function toggleLike(id, el) {
    if (liked.has(id)) {
      liked.delete(id);
      el.classList.remove('liked');
    } else {
      liked.add(id);
      el.classList.add('liked');
    }
  }

  // ── Agregar al carrito ──
  function addToCart(id) {
    const p = products.find(x => x.id === id);
    const existing = cart.find(x => x.id === id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ ...p, qty: 1 });
    }
    renderCart();
  }

  // ── Eliminar del carrito ──
  function removeFromCart(id) {
    cart = cart.filter(x => x.id !== id);
    renderCart();
  }

  // ── Renderizar carrito ──
  function renderCart() {
    const el = document.getElementById('cartContent');
    if (!cart.length) {
      el.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
      return;
    }
    const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
    el.innerHTML = `
      <div class="cart-items">
        ${cart.map(x => `
          <div class="cart-item">
            <div>
              <div class="cart-item-name">${x.name}</div>
              <div class="cart-item-qty">Cantidad: ${x.qty}</div>
            </div>
            <div style="display:flex; align-items:center;">
              <div class="cart-item-price">$${(x.price * x.qty).toFixed(2)}</div>
              <span class="cart-remove" onclick="removeFromCart(${x.id})" title="Eliminar">✕</span>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="cart-total">
        <span>Total</span>
        <span>$${total.toFixed(2)}</span>
      </div>
      <button class="checkout-btn" onclick="alert('¡Gracias por tu compra! 🐾')">Finalizar compra</button>
    `;
  }

