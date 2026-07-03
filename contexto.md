# Contexto del proyecto Kirocorp

## Resumen general

Este proyecto es un sitio web estático para la marca **Kirocorp**, orientado a:

- Venta de snacks naturales premium para mascotas.
- Catálogo de ropita para perros y gatitos.
- Promoción de servicios adicionales bajo la marca KiroCorp/Kiroservices.
- Captación de contacto y pedidos por WhatsApp.
- Publicación de material de marca, catálogo PDF y piezas promocionales.

La estructura actual está centrada en páginas HTML independientes con un CSS global, un archivo JS compartido y abundantes imágenes locales.

## Stack tecnológico

- **HTML5** para todas las páginas.
- **CSS3** en un archivo global principal: `style.css`.
- **JavaScript vanilla** en `script.js`.
- **Tailwind CSS vía CDN** en varias páginas.
- **Google Fonts**:
  - `Sora`
  - `Material Symbols Rounded`
- **Sin framework de frontend** tipo React/Vue/Angular.
- **Sin backend visible** en el repositorio.
- **Sitio orientado a hosting estático**.

## Arquitectura

La arquitectura es de tipo **multi-page static site**:

- Cada sección o producto importante tiene su propio `.html`.
- Hay páginas principales de navegación y páginas de detalle.
- El contenido visual depende mucho de imágenes locales en `img/`.
- El comportamiento interactivo común se centraliza en `script.js`.

### Páginas principales

- `index.html`: landing principal de Kirocorp.
- `ropa.html` y `ropa-perro.html`: catálogo/colección de ropa para mascotas.
- `productos-snack.html`: catálogo general de snacks.
- `trabajaconnosotros.html`: landing de reclutamiento.

### Páginas de servicios

- `kirocoach.html`: adiestramiento canino.
- `kirodent.html`: higiene dental para mascotas.
- `kiroflavor.html`: sazonador natural para mascotas.
- `kirohome.html`: hospedaje canino.
- `kiromemorial.html`: homenaje y acompañamiento para mascotas.
- `kirospa.html`: baño y grooming canino.
- `kirovet.html`: atención veterinaria a domicilio.

### Páginas de producto

- `producto-bofe-cordero.html`
- `producto-colageno.html`
- `producto-higado-cordero.html`
- `producto-higado-pollo.html`
- `producto-mollejas.html`
- `producto-orejas.html`

### Archivos auxiliares

- `generate-ropa-pages.js`: generador de páginas individuales para prendas.
- `KIROCORP - catalogo 2026.pdf`: catálogo descargable desde el sitio.
- `boleta-venta-4-20260411-170003.pdf` y `boleta-venta-4-20260411-170019.png`: material administrativo o de ejemplo.

## Reutilización y patrones

El proyecto reutiliza varios patrones visuales entre páginas:

- Barra de navegación con botón hamburguesa en móvil.
- CTA principal a WhatsApp.
- Uso de cards con bordes redondeados, sombras suaves y gradientes.
- Enfoque visual premium con colores de marca consistentes.
- Íconos de Material Symbols para reforzar mensajes.

## Branding y sistema visual

### Colores principales

Definidos en `style.css` y repetidos en páginas internas:

- Naranja de marca: `#ff7a1a`
- Naranja oscuro: `#e36200`
- Azul principal: `#092290`
- Azul secundario: `#004C97`
- Base crema/blanco: tonos muy claros

### Tipografía

- Familia principal: `Sora`
- Uso de `Material Symbols Rounded` para iconografía

### Estilo

- Hero visual con capas de gradientes y overlays.
- Tarjetas con glassmorphism ligero en varias secciones.
- Espaciado amplio y enfoque comercial.
- Diseño pensado para “premium / boutique”, no para look corporativo genérico.

## CSS global

`style.css` contiene estilos base y componentes compartidos:

- Variables de marca en `:root`.
- Base global de tipografía y comportamiento de scroll.
- Estilos de navegación:
  - `.nav-link`
  - `.site-nav`
  - `.site-nav-shell`
  - `.site-nav-toggle`
  - `.site-nav-menu`
- Hero principal:
  - `.site-hero`
  - `.site-hero-body`
- Barra de avisos:
  - `.notice-bar`
  - `.notice-track`
- Componentes de secciones:
  - `.section`
  - `.section-title`
  - `.section-subtitle`
  - `.feature-card`

También incluye la animación `marquee` para el ticker de anuncios.

## JavaScript global

`script.js` maneja comportamiento compartido y algunas mejoras de UX:

- Inserta el año actual en `#year`.
- Reemplazo de imágenes fallidas con un fallback accesible para elementos `img.product-image`.
- Menú móvil:
  - abre/cierra con `#menuBtn`
  - sincroniza estado con `#menu`
  - cierra al hacer click fuera o con `Escape`
- Animaciones de entrada con `IntersectionObserver` para elementos `.reveal`.
- Sombra dinámica en la barra de navegación al hacer scroll.
- Reorganización responsive de layouts detallados con `[data-detail-card]`.
- Animaciones interactivas con `gsap` si la librería está presente:
  - intro de cards
  - efecto tilt en cards de producto
- Popup de WhatsApp con almacenamiento en `sessionStorage`.
- Slider de beneficios con paginación.

### Dependencias implícitas del JS

El archivo espera ciertos elementos en el HTML:

- `#year`
- `#menuBtn`
- `#menu`
- `[data-site-nav-shell]`
- `.reveal`
- `nav`
- `[data-detail-card]`
- `[data-product-card]`
- `[data-product-media]`
- `[data-product-content]`
- `[data-product-stat]`
- `#waPopup`
- `#waPopupClose`
- `[data-benefits-slider]`

## Generación de páginas de ropa

`generate-ropa-pages.js` es un script Node.js que:

- Lee el catálogo desde `ropa-perro.html`.
- Extrae un array `catalog` embebido en ese archivo.
- Genera páginas individuales dentro de `ropa/`.
- Normaliza nombres para slugs.
- Escapa HTML para contenido dinámico.
- Construye:
  - navbar
  - cards de información
  - secciones temáticas
  - enlaces de WhatsApp por producto

### Observaciones importantes

- El script depende de una estructura textual específica dentro de `ropa-perro.html`.
- Si se modifica el formato del array `catalog`, el generador puede romperse.
- El script usa `eval` sobre datos locales confiables; funcional, pero sensible a cambios estructurales.

## Estructura de assets

### Imágenes

El contenido visual se apoya casi por completo en `img/`:

- Logos y portadas.
- Fotos de productos snacks.
- Fotos de ropa.
- Testimonios.
- Carpeta `img/kiroservicios/` con piezas de servicios.
- Carpeta `img/productos/` con imágenes de snacks.
- Carpeta `img/ropa/` con catálogo visual de prendas.
- Carpeta `img/testimonios/` con fotos asociadas a clientes o mascotas.

### Archivos destacados

- `img/kirologoqueda.jpg`: logo o ícono principal.
- `img/kiroheader.jpg`: imagen hero principal.
- `img/kiro11.jpg`: imagen usada en la página de reclutamiento.

## Flujos de conversión

El sitio está orientado a conversión directa:

- Botones “Comprar ahora”.
- Enlaces `wa.me` prellenados con mensajes.
- Descarga del PDF de catálogo.
- CTA de contacto y compra en varias páginas.

El contacto central parece ser el número:

- `+51 916 566 758`

## SEO y metadatos

Varias páginas incluyen:

- `title` descriptivos por sección.
- `meta description`.
- `og:*` para redes sociales.
- `twitter:*` en algunas páginas.
- JSON-LD en páginas como `ropa.html`.

Esto sugiere intención de posicionamiento orgánico y compartibilidad social.

## Estado del proyecto

El repositorio no muestra:

- `package.json`
- `vite.config.*`
- build system
- tests automatizados
- backend

Por lo tanto, el sitio parece mantenerse de forma manual o semi-manual, con HTML/CSS/JS y generación puntual de páginas cuando se necesita.

## Riesgos y puntos a vigilar

- Hay bastante duplicación entre páginas HTML.
- El generador de ropa depende de una estructura interna frágil.
- Muchos assets locales pueden crecer rápido en peso.
- Se usa Tailwind por CDN, lo que simplifica, pero deja dependencias externas en runtime.
- `script.js` tiene varias ramas que asumen presencia de elementos específicos; conviene mantener consistencia de IDs y clases.

## Convenciones útiles para editar

- Mantener el estilo visual actual si se agregan páginas nuevas.
- Reutilizar la paleta de marca y la tipografía `Sora`.
- Preferir componentes HTML simples y consistentes.
- Si se agrega interactividad nueva, revisar compatibilidad con `script.js`.
- Si se modifica `ropa-perro.html`, verificar que el generador siga encontrando `const catalog = [...]`.

## Mapa rápido de intención por archivo

- `index.html`: presentación general y venta principal.
- `productos-snack.html`: catálogo de snacks.
- `producto-*.html`: fichas individuales de snacks.
- `ropa.html` / `ropa-perro.html`: catálogo de ropa.
- `ropa/*.html`: fichas generadas de prendas.
- `kiro*.html`: servicios secundarios de marca.
- `trabajaconnosotros.html`: reclutamiento.
- `style.css`: sistema visual y componentes comunes.
- `script.js`: interacciones compartidas.
- `generate-ropa-pages.js`: automatización de catálogo de ropa.

