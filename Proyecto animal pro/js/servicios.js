/**
 * PRO ANIMAL - Lógica Definitiva
 * Maneja: Catálogo inyectado, Búsqueda en tiempo real, Filtros por categoría y Favoritos.
 */

const serviciosData = {
    '1': { id: '1', titulo: 'Baño y Peluquería', imagen: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80', desc: 'Cuidado completo, corte de uñas y estética.', precio: 50000, precioTexto: '$50.000', cat: 'Estética', popular: true },
    '2': { id: '2', titulo: 'Consulta Veterinaria', imagen: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80', desc: 'Revisión médica y limpieza general.', precio: 80000, precioTexto: '$80.000', cat: 'Salud', popular: true },
    '3': { id: '3', titulo: 'Guardería Canina', imagen: 'https://images.unsplash.com/photo-1601758177266-bc599de87707?auto=format&fit=crop&w=600&q=80', desc: 'Cuidado diario en ambiente seguro.', precio: 40000, precioTexto: '$40.000', cat: 'Cuidado', popular: false },
    '4': { id: '4', titulo: 'Entrenamiento Canino', imagen: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80', desc: 'Obediencia básica y avanzada.', precio: 120000, precioTexto: '$120.000', cat: 'Entrenamiento', popular: true },
    '5': { id: '5', titulo: 'Hotel para Mascotas', imagen: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80', desc: 'Alojamiento cómodo y seguro.', precio: 70000, precioTexto: '$70.000', cat: 'Hospedaje', popular: false },
    '6': { id: '6', titulo: 'Paseo de Perros', imagen: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80', desc: 'Servicio profesional para mantener a tu perro activo.', precio: 25000, precioTexto: '$25.000', cat: 'Actividad', popular: true },
    '7': { id: '7', titulo: 'Peluquería Premium', imagen: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80', desc: 'Corte de pelo especializado según la raza.', precio: 90000, precioTexto: '$90.000', cat: 'Estética', popular: false },
    '8': { id: '8', titulo: 'Chequeo Veterinario Completo', imagen: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80', desc: 'Examen completo con vacunas y laboratorio.', precio: 150000, precioTexto: '$150.000', cat: 'Salud', popular: true }
};

// Variables de control
const urlParams = new URLSearchParams(window.location.search);
const currentId = urlParams.get('id');
let filtroActual = 'todos'; 

// --- RENDERIZADO ---
function renderizarCatalogo(lista = Object.values(serviciosData)) {
    const contenedor = document.getElementById('lista-servicios');
    if (!contenedor) return;
    contenedor.innerHTML = '';

    if (lista.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; padding:20px; color:gray;">No hay resultados para esta búsqueda.</p>';
        return;
    }

    lista.forEach(s => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <img src="${s.imagen}" alt="${s.titulo}">
            <div class="service-info">
                <h3>${s.titulo}</h3>
                <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                <p>${s.desc}</p>
                <small style="color: #f28b2a; font-weight: bold;">${s.precioTexto}</small>
            </div>
            <button class="btn-ver-mas" onclick="verDetalle('${s.id}')">Ver más</button>
        `;
        contenedor.appendChild(card);
    });
}

// --- FILTROS Y BÚSQUEDA ---
function aplicarFiltros() {
    const texto = document.getElementById('input-busqueda').value.toLowerCase();
    let resultados = Object.values(serviciosData);

    // 1. Filtrar por búsqueda de texto
    resultados = resultados.filter(s => 
        s.titulo.toLowerCase().includes(texto) || s.desc.toLowerCase().includes(texto)
    );

    // 2. Filtrar por botón seleccionado
    if (filtroActual === 'precio') {
        resultados.sort((a, b) => a.precio - b.precio);
    } else if (filtroActual === 'popular') {
        resultados = resultados.filter(s => s.popular);
    } else if (filtroActual === 'tipo') {
        resultados.sort((a, b) => a.cat.localeCompare(b.cat));
    }

    renderizarCatalogo(resultados);
}

function configurarEventos() {
    // Buscador
    const buscador = document.getElementById('input-busqueda');
    if (buscador) buscador.addEventListener('input', aplicarFiltros);

    // Botones de filtro (Chips)
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            // Mapeo de texto del botón a lógica
            const tipo = chip.innerText.toLowerCase();
            if (tipo === 'tipo') filtroActual = 'tipo';
            else if (tipo === 'precio') filtroActual = 'precio';
            else if (tipo === 'popular') filtroActual = 'popular';
            else filtroActual = 'todos';

            aplicarFiltros();
        });
    });
}

// --- FAVORITOS (LOCALSTORAGE) ---
function getFavs() { return JSON.parse(localStorage.getItem('proanimal_favs')) || []; }
function saveFavs(f) { localStorage.setItem('proanimal_favs', JSON.stringify(f)); }

function renderFavs() {
    const container = document.getElementById('favorites-container');
    if (!container) return;
    const favs = getFavs();
    container.innerHTML = favs.length === 0 ? '<p style="text-align:center; font-size:0.8rem; color:gray;">Sin favoritos.</p>' : '';
    favs.forEach(f => {
        const div = document.createElement('div');
        div.className = 'favorite-card';
        div.innerHTML = `<img src="${f.imagen}"> <div class="service-info"><h4>${f.titulo}</h4></div> <button class="btn-eliminar" onclick="removeFav('${f.id}')">Eliminar</button>`;
        container.appendChild(div);
    });
}

function removeFav(id) {
    saveFavs(getFavs().filter(f => f.id !== id));
    renderFavs();
    if(currentId === id) updateBtnStyle();
}

function updateBtnStyle() {
    const btn = document.getElementById('btn-favorito');
    if (!btn) return;
    const isF = getFavs().some(f => f.id === currentId);
    btn.innerHTML = isF ? '<i class="fas fa-heart"></i> En Favoritos' : '<i class="far fa-heart"></i> Añadir a Favoritos';
    btn.style.background = isF ? '#d32f2f' : '#e57373';
}

function toggleFavorito() {
    let favs = getFavs();
    const idx = favs.findIndex(f => f.id === currentId);
    if (idx >= 0) favs.splice(idx, 1);
    else if (serviciosData[currentId]) favs.push(serviciosData[currentId]);
    saveFavs(favs);
    updateBtnStyle();
    renderFavs();
}

// --- REDIRECCIÓN Y CARGA ---
function verDetalle(id) { window.location.href = `./detalle_servicios.html?id=${id}`; }

document.addEventListener('DOMContentLoaded', () => {
    // Pantalla Lista
    if (document.getElementById('lista-servicios')) {
        renderizarCatalogo();
        renderFavs();
        configurarEventos();
    }
    // Pantalla Detalle
    if (document.getElementById('detalle-titulo') && serviciosData[currentId]) {
        const s = serviciosData[currentId];
        document.getElementById('detalle-titulo').innerText = s.titulo;
        document.getElementById('detalle-img').src = s.imagen;
        document.getElementById('detalle-desc').innerText = s.desc;
        document.getElementById('detalle-precio').innerText = s.precioTexto;
        document.getElementById('detalle-cat').innerText = s.cat;
        updateBtnStyle();
    }
});