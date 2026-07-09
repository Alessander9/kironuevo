# Kirocorp

<p align="center">
  <img src="./assets/img/kiroheader.jpg" alt="Kirocorp portada" width="100%">
</p>

<p align="center">
  <strong>🐶 Snacks premium | 👕 Ropa para mascotas | 💬 Venta directa por WhatsApp</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-Site%20Shell-E34F26?logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-Design%20System-1572B6?logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-UI%20Logic-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-CDN%20Utilities-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/WhatsApp-Lead%20Channel-25D366?logo=whatsapp&logoColor=white" alt="WhatsApp">
  <img src="https://img.shields.io/badge/Deployment-Static%20Hosting-6B7280" alt="Static">
</p>

## Portada

<table>
  <tr>
    <td width="50%" valign="top">

### Bienvenido a Kirocorp

Sitio web estático multipágina pensado para vender rápido, mostrar catálogo con estilo y llevar al usuario directo a WhatsApp.

**En esta portada encontrarás:**

- 🧩 estructura clara del proyecto
- 🖼️ imágenes destacadas del sitio
- 🗺️ diagramas de navegación y automatización
- ⚙️ tecnología y componentes principales

    </td>
    <td width="50%" valign="top">

### Vista rápida

| Área | Ruta |
|---|---|
| Home | `index.html` |
| Snacks | `pages/productos/productos-snack.html` |
| Productos | `pages/productos/producto-*.html` |
| Ropa | `pages/ropa/ropa.html` y `pages/ropa/ropa-perro.html` |
| Fichas de ropa | `ropa/*.html` |
| Servicios | `pages/servicios/kiro*.html` |
| Trabajo | `pages/trabajo/trabajaconnosotros.html` |
| Docs | `docs/` |

    </td>
  </tr>
</table>

## Galería

<table>
  <tr>
    <td width="33%">
      <img src="./assets/img/kirologoqueda.jpg" alt="Logo Kirocorp" width="100%">
    </td>
    <td width="33%">
      <img src="./assets/img/kiro11.jpg" alt="Reclutamiento" width="100%">
    </td>
    <td width="33%">
      <img src="./assets/img/kiroteam3.png" alt="Equipo Kirocorp" width="100%">
    </td>
  </tr>
  <tr>
    <td align="center"><strong>Logo y marca</strong></td>
    <td align="center"><strong>Campaña visual</strong></td>
    <td align="center"><strong>Equipo y confianza</strong></td>
  </tr>
</table>

## Mapa Visual

```mermaid
flowchart TB
  U[Usuario] --> H[index.html]
  H --> P[Catálogo de snacks]
  H --> R[Catálogo de ropa]
  H --> S[Servicios]
  H --> T[Trabajo]
  H --> W[WhatsApp]

  P --> PP[pages/productos/*]
  R --> RP[pages/ropa/*]
  R --> RG[ropa/*.html]
  S --> SP[pages/servicios/*]
  T --> TR[pages/trabajo/*]

  H --- CSS[styles/style.css]
  H --- JS[scripts/script.js]
  H --- IMG[assets/img/]
```

```mermaid
sequenceDiagram
  participant U as Usuario
  participant S as Sitio
  participant W as WhatsApp

  U->>S: Navega el catálogo
  U->>S: Clic en comprar
  S->>W: Abre enlace wa.me con texto listo
  W-->>U: Chat preparado para enviar
```

## Resumen

Kirocorp es una experiencia web comercial pensada para vender y convertir rápido. El sitio mezcla catálogo, storytelling y contacto directo por WhatsApp.

### Qué ofrece

- 🐶 Snacks naturales premium para mascotas.
- 👕 Ropita para perros y gatitos.
- 🩺 Servicios de marca como entrenamiento, spa, vet y más.
- 💬 Contacto inmediato vía WhatsApp.
- 📄 Catálogo PDF descargable.

## Estructura

```text
kironuevo/
├── index.html
├── pages/
│   ├── productos/
│   ├── servicios/
│   ├── ropa/
│   └── trabajo/
├── ropa/
├── assets/
│   └── img/
├── styles/
│   └── style.css
├── scripts/
│   └── script.js
├── docs/
└── generate-ropa-pages.js
```

### Carpetas clave

- `pages/productos/`: landing y fichas de snacks.
- `pages/servicios/`: páginas de servicios Kiro.
- `pages/ropa/`: catálogo de ropa fuente.
- `ropa/`: páginas generadas para cada prenda.
- `assets/img/`: imágenes del sitio.
- `styles/`: sistema visual.
- `scripts/`: lógica compartida.
- `docs/`: documentación.

## Tecnología

### Stack

- **HTML5** para todas las páginas.
- **CSS3** en [`styles/style.css`](./styles/style.css).
- **JavaScript vanilla** en [`scripts/script.js`](./scripts/script.js).
- **Tailwind CSS por CDN** para utilidades rápidas.
- **Google Fonts** para `Sora` y `Material Symbols Rounded`.

### Infraestructura

- Sitio preparado para hosting estático.
- Sin backend visible.
- Sin `package.json` ni bundler.
- Automatización puntual con Node.js.

### Diagrama de capas

```mermaid
flowchart LR
  U[Usuario] --> H[HTML]
  H --> C[CSS global]
  H --> J[JS global]
  H --> T[Tailwind CDN]
  H --> F[Google Fonts]
  H --> A[Assets locales]
  A --> I[Imágenes]
  A --> P[PDFs]
```

## Componentes

### `styles/style.css`

- Variables de marca.
- Navegación.
- Hero y secciones.
- Cards y helpers visuales.

### `scripts/script.js`

- Año automático en `#year`.
- Menú móvil.
- Observers para animaciones.
- Sombra en nav al hacer scroll.
- Popup de WhatsApp.
- Slider de beneficios.

### `generate-ropa-pages.js`

- Lee el catálogo desde `pages/ropa/ropa-perro.html`.
- Genera fichas individuales en `ropa/`.
- Normaliza slugs.
- Escapa contenido HTML.

## Automatización

```mermaid
flowchart TD
  A[Actualizar catálogo en pages/ropa/ropa-perro.html] --> B[Ejecutar generate-ropa-pages.js]
  B --> C[Crear / actualizar ropa/*.html]
  C --> D[Publicar sitio]
```

### Nota importante

Si cambias la estructura del array `catalog`, el generador puede romperse.
Conviene revisar siempre:

- nombres de campos,
- formato del bloque,
- y rutas de imágenes.

## SEO y conversión

### Conversión

- CTA visible a WhatsApp.
- Mensajes prellenados.
- Botones de compra rápidos.
- PDF descargable.

### SEO

- `title` por página.
- `meta description`.
- `og:*` en páginas clave.
- `twitter:*` en varias páginas.
- JSON-LD en colecciones.

### Piezas visuales destacadas

| Recurso | Uso |
|---|---|
| [`assets/img/kirologoqueda.jpg`](./assets/img/kirologoqueda.jpg) | Logo principal |
| [`assets/img/kiroheader.jpg`](./assets/img/kiroheader.jpg) | Imagen hero |
| [`assets/img/kiro11.jpg`](./assets/img/kiro11.jpg) | Reclutamiento |
| [`assets/img/kiroteam3.png`](./assets/img/kiroteam3.png) | Imagen de equipo |

## Mantenimiento

### Buenas prácticas

- Mantener la paleta de marca.
- Reutilizar `Sora` y `Material Symbols Rounded`.
- Verificar enlaces de WhatsApp al publicar.
- No duplicar lógica que ya exista en `scripts/script.js`.
- Revisar rutas si se mueve alguna página.

### Riesgos conocidos

- Mucha duplicación HTML.
- Páginas pesadas por cantidad de imágenes.
- Dependencia de CDN.
- Generación de ropa sensible a cambios estructurales.

### Checklist corto

- Confirmar navegación entre páginas.
- Verificar imágenes y banners.
- Revisar menú móvil.
- Probar fichas de productos.
- Probar descarga del PDF.

## Referencias

- [`docs/contexto.md`](./docs/contexto.md)
- [`docs/estructura-proyecto.md`](./docs/estructura-proyecto.md)
- [`styles/style.css`](./styles/style.css)
- [`scripts/script.js`](./scripts/script.js)
- [`generate-ropa-pages.js`](./generate-ropa-pages.js)
