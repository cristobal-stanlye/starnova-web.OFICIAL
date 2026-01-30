// ===== VARIABLES GLOBALES Y DATOS INICIALES =====
let systems = [];
let purchaseRequests = [];
let uploadedFiles = [];
let selectedSystemForPurchase = null;

// Datos de ejemplo iniciales
const initialSystems = [
    {
        id: 1,
        name: 'E-commerce Pro',
        description: 'Tienda online completa con gestión de inventario, pagos y envíos.',
        price: 299,
        icon: 'shopping-cart',
        features: ['Pasarela de pagos', 'Gestión de stock', 'Panel de cliente']
    },
    {
        id: 2,
        name: 'Business Analytics',
        description: 'Plataforma de análisis de datos con dashboards interactivos.',
        price: 199,
        icon: 'chart-line',
        features: ['Reportes en PDF', 'Gráficos dinámicos', 'Conexión a bases de datos']
    }
];

// ===== NAVEGACIÓN Y VISTAS =====
function showPage(pageId) {
    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Mostrar la página seleccionada
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
    }

    // Actualizar menú de navegación
    updateNavigation(pageId);
    
    // Cargar datos específicos si es necesario
    if (pageId === 'catalogo') renderCatalog();
    if (pageId === 'admin') loadAdminDashboard();
}

function updateNavigation(activeId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick')?.includes(`'${activeId}'`)) {
            link.classList.add('active');
        }
    });
}

// ===== GESTIÓN DEL CATÁLOGO =====
function renderCatalog() {
    const container = document.getElementById('systems-container');
    const emptyState = document.getElementById('no-systems');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (systems.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    systems.forEach(system => {
        const card = createSystemCard(system);
        container.appendChild(card);
    });
    
    // También actualizar la vista de compra
    renderPurchaseOptions();
}

function createSystemCard(system) {
    const card = document.createElement('div');
    card.className = 'system-card';
    card.innerHTML = `
        <div class="system-img"><i class="fas fa-${system.icon}"></i></div>
        <div class="system-content">
            <h3>${system.name}</h3>
            <p>${system.description}</p>
            <div class="system-price">$${system.price}/mes</div>
            <ul class="features-list">
                ${system.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
            </ul>
            <button class="btn" style="width: 100%;" onclick="selectSystemForPurchase(${system.id})">Comprar</button>
        </div>
    `;
    return card;
}

// ===== PROCESO DE COMPRA =====
function selectSystemForPurchase(systemId) {
    selectedSystemForPurchase = systems.find(s => s.id === systemId);
    showPage('comprar');
    showClientSection('informacion-compra');
    
    const summary = document.getElementById('selected-system-info');
    summary.innerHTML = `
        <h3>Resumen: ${selectedSystemForPurchase.name}</h3>
        <p><strong>Precio:</strong> $${selectedSystemForPurchase.price}/mes</p>
    `;
}

function enviarSolicitudCompra() {
    const nombre = document.getElementById('compra-nombre').value;
    const email = document.getElementById('compra-email').value;

    if (!nombre || !email || !selectedSystemForPurchase) {
        alert('Por favor complete los campos obligatorios y seleccione un sistema.');
        return;
    }

    const nuevaSolicitud = {
        id: Date.now(),
        cliente: nombre,
        email: email,
        sistema: selectedSystemForPurchase.name,
        precio: selectedSystemForPurchase.price,
        fecha: new Date().toLocaleDateString(),
        estado: 'Pendiente'
    };

    purchaseRequests.push(nuevaSolicitud);
    alert('¡Solicitud enviada con éxito! Te contactaremos pronto.');
    showClientSection('seguimiento');
    renderPurchaseRequests();
}

// ===== PANEL DE ADMINISTRACIÓN =====
function loginAdmin() {
    const email = document.getElementById('admin-email').value;
    const pass = document.getElementById('admin-password').value;

    if (email === 'admin@starnova.com' && pass === 'admin123') {
        showPage('admin');
    } else {
        alert('Credenciales incorrectas');
    }
}

function loadAdminDashboard() {
    renderAdminRequests();
    renderAdminSystems();
    updateAdminStats();
}

function updateAdminStats() {
    document.getElementById('stat-systems').textContent = systems.length;
    document.getElementById('stat-compras').textContent = purchaseRequests.length;
    const ingresos = purchaseRequests.reduce((acc, curr) => acc + curr.price, 0);
    document.getElementById('stat-ingresos').textContent = `$${ingresos}`;
}

// ===== UTILIDADES =====
function initializeData() {
    // Cargar datos de localStorage si existen o usar los iniciales
    const savedSystems = localStorage.getItem('starnova_systems');
    systems = savedSystems ? JSON.parse(savedSystems) : [...initialSystems];
}

// Inicializar al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    showPage('inicio');
});