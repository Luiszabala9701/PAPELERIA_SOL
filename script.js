// Configuración global
const configuracion = {
    totalStickers: 1000,
    stickersPorPagina: 98,
    rutaCarpetaStickers: './stickers/'
};

// Variables globales
let paginaActual = 1;
let stickersActuales = [];
let todosLosStickers = [];

// Elementos del DOM
const galeriaStickers = document.getElementById('galeria-stickers');
const textoCargando = document.getElementById('texto-cargando');
const botonAnterior = document.getElementById('boton-anterior');
const botonSiguiente = document.getElementById('boton-siguiente');
const informacionPagina = document.getElementById('informacion-pagina');
const campoBusqueda = document.getElementById('buscador');
const botonBuscar = document.getElementById('boton-buscar');
const botonResetear = document.getElementById('boton-resetear');
const inputPagina = document.getElementById('input-pagina');
const botonIrPagina = document.getElementById('boton-ir-pagina');

// Función para generar el array de todos los stickers
function generarListaStickers() {
    todosLosStickers = [];
    for (let i = 1; i <= configuracion.totalStickers; i++) {
        todosLosStickers.push({
            numero: i,
            ruta: `${configuracion.rutaCarpetaStickers}${i}.png`
        });
    }
    stickersActuales = [...todosLosStickers];
}

// Función para crear una tarjeta de sticker
function crearTarjetaSticker(sticker) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-sticker';
    tarjeta.setAttribute('data-numero', sticker.numero);
    
    const contenedorImagen = document.createElement('div');
    contenedorImagen.className = 'contenedor-imagen';
    
    const imagen = document.createElement('img');
    imagen.className = 'imagen-sticker';
    imagen.src = sticker.ruta;
    imagen.alt = `Sticker ${sticker.numero}`;
    imagen.loading = 'lazy'; // Carga diferida para mejor rendimiento
    
    // Manejo de error de carga de imagen
    imagen.onerror = function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" dy=".3em" fill="%23999"%3ENo disponible%3C/text%3E%3C/svg%3E';
    };
    
    const numeroSticker = document.createElement('p');
    numeroSticker.className = 'numero-sticker';
    numeroSticker.textContent = `#${sticker.numero}`;
    
    contenedorImagen.appendChild(imagen);
    tarjeta.appendChild(contenedorImagen);
    tarjeta.appendChild(numeroSticker);
    
    // Evento click para ampliar (opcional)
    tarjeta.addEventListener('click', () => {
        ampliarSticker(sticker);
    });
    
    return tarjeta;
}

// Función para ampliar un sticker (modal simple)
function ampliarSticker(sticker) {
    const existe = document.getElementById('modal-sticker');
    if (existe) {
        existe.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'modal-sticker';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        cursor: pointer;
    `;
    
    const contenedor = document.createElement('div');
    contenedor.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        max-width: 90%;
        max-height: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        position: relative;
    `;
    
    // Contenedor de imagen con marca de agua
    const contenedorImagen = document.createElement('div');
    contenedorImagen.style.cssText = `
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Múltiples marcas de agua
    const posicionesMarcas = [
        { top: '5%', left: '70%' },
        { top: '20%', left: '75%' },
        { top: '35%', left: '80%' }
    ];
    
    posicionesMarcas.forEach((posicion, index) => {
        const marcaAgua = document.createElement('div');
        marcaAgua.textContent = 'Papelería de Sol • Papelería de Sol • Papelería de Sol';
        marcaAgua.style.cssText = `
            position: absolute;
            top: ${posicion.top};
            left: ${posicion.left};
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 1.5rem;
            font-weight: bold;
            color: rgba(152, 183, 255, 0.2);
            white-space: nowrap;
            pointer-events: none;
            z-index: 2;
            user-select: none;
            width: 200%;
        `;
        contenedorImagen.appendChild(marcaAgua);
    });
    
    const imagen = document.createElement('img');
    imagen.src = sticker.ruta;
    imagen.alt = `Sticker ${sticker.numero}`;
    imagen.style.cssText = `
        max-width: 100%;
        max-height: 70vh;
        object-fit: contain;
        user-select: none;
        -webkit-user-drag: none;
        -webkit-touch-callout: none;
        pointer-events: none;
    `;
    
    const texto = document.createElement('h2');
    texto.textContent = `Sticker #${sticker.numero}`;
    texto.style.cssText = `
        color: #98b7ff;
        margin: 0;
        user-select: none;
    `;
    
    contenedorImagen.appendChild(imagen);
    contenedor.appendChild(texto);
    contenedor.appendChild(contenedorImagen);
    modal.appendChild(contenedor);
    
    // Protección contra clic derecho en el modal
    modal.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
    
    // Protección contra arrastrar
    modal.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
    });
    
    // Protección contra selección
    modal.addEventListener('selectstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });
    
    modal.addEventListener('click', () => {
        modal.remove();
    });
    
    document.body.appendChild(modal);
}

// Función para renderizar stickers de la página actual
function renderizarStickers() {
    galeriaStickers.innerHTML = '';
    
    const totalPaginas = Math.ceil(stickersActuales.length / configuracion.stickersPorPagina);
    const inicio = (paginaActual - 1) * configuracion.stickersPorPagina;
    const fin = inicio + configuracion.stickersPorPagina;
    const stickersPagina = stickersActuales.slice(inicio, fin);
    
    if (stickersPagina.length === 0) {
        galeriaStickers.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: white; font-size: 1.2rem;">No se encontraron stickers</p>';
        return;
    }
    
    // Usar un fragmento para mejor rendimiento
    const fragmento = document.createDocumentFragment();
    
    stickersPagina.forEach(sticker => {
        const tarjeta = crearTarjetaSticker(sticker);
        fragmento.appendChild(tarjeta);
    });
    
    galeriaStickers.appendChild(fragmento);
    actualizarControlesPaginacion(totalPaginas);
    ocultarMensajeCarga();
}

// Función para actualizar los controles de paginación
function actualizarControlesPaginacion(totalPaginas) {
    informacionPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    botonAnterior.disabled = paginaActual === 1;
    botonSiguiente.disabled = paginaActual >= totalPaginas;
    inputPagina.max = totalPaginas;
    inputPagina.placeholder = `1-${totalPaginas}`;
}

// Función para ocultar mensaje de carga
function ocultarMensajeCarga() {
    if (textoCargando) {
        textoCargando.classList.add('oculto');
    }
}

// Función para buscar stickers
function buscarStickers() {
    const terminoBusqueda = campoBusqueda.value.trim();
    
    if (terminoBusqueda === '') {
        stickersActuales = [...todosLosStickers];
    } else {
        const numero = parseInt(terminoBusqueda);
        if (!isNaN(numero) && numero >= 1 && numero <= configuracion.totalStickers) {
            stickersActuales = todosLosStickers.filter(sticker => 
                sticker.numero === numero || sticker.numero.toString().includes(terminoBusqueda)
            );
        } else {
            stickersActuales = todosLosStickers.filter(sticker => 
                sticker.numero.toString().includes(terminoBusqueda)
            );
        }
    }
    
    paginaActual = 1;
    renderizarStickers();
}

// Función para resetear búsqueda
function resetearBusqueda() {
    campoBusqueda.value = '';
    stickersActuales = [...todosLosStickers];
    paginaActual = 1;
    renderizarStickers();
}

// Función para ir a una página específica
function irAPaginaEspecifica() {
    const totalPaginas = Math.ceil(stickersActuales.length / configuracion.stickersPorPagina);
    const paginaDeseada = parseInt(inputPagina.value);
    
    if (isNaN(paginaDeseada) || paginaDeseada < 1) {
        alert('Por favor ingresa un número de página válido');
        return;
    }
    
    if (paginaDeseada > totalPaginas) {
        alert(`La página debe estar entre 1 y ${totalPaginas}`);
        return;
    }
    
    paginaActual = paginaDeseada;
    renderizarStickers();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    inputPagina.value = '';
}

// Event listeners
botonAnterior.addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        renderizarStickers();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

botonSiguiente.addEventListener('click', () => {
    const totalPaginas = Math.ceil(stickersActuales.length / configuracion.stickersPorPagina);
    if (paginaActual < totalPaginas) {
        paginaActual++;
        renderizarStickers();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

botonBuscar.addEventListener('click', buscarStickers);

botonResetear.addEventListener('click', resetearBusqueda);

campoBusqueda.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarStickers();
    }
});

botonIrPagina.addEventListener('click', irAPaginaEspecifica);

inputPagina.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        irAPaginaEspecifica();
    }
});

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && !botonAnterior.disabled) {
        botonAnterior.click();
    } else if (e.key === 'ArrowRight' && !botonSiguiente.disabled) {
        botonSiguiente.click();
    }
});

// Protección de imágenes
function aplicarProteccionImagenes() {
    // Deshabilitar clic derecho en toda la galería
    galeriaStickers.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
    
    // Deshabilitar arrastrar imágenes
    galeriaStickers.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });
    
    // Deshabilitar selección de imágenes
    galeriaStickers.addEventListener('selectstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });
}

// Inicialización
function inicializar() {
    console.log('Inicializando catálogo de stickers...');
    generarListaStickers();
    renderizarStickers();
    aplicarProteccionImagenes();
    console.log(`Catálogo cargado con ${configuracion.totalStickers} stickers`);
}

// Cargar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}
