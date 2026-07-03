# Estructura Propuesta del Proyecto

Este documento resume una organización más limpia para Kirocorp sin romper el sitio actual.

## Objetivo

- Separar contenido publicable, documentación y archivos auxiliares.
- Reducir duplicación.
- Hacer más fácil mantener páginas, imágenes y automatizaciones.

## Estado actual

- Las páginas HTML viven en la raíz.
- Las imágenes están agrupadas en `assets/img/`.
- Las fichas generadas de ropa viven en `ropa/`.
- `README.md` está en la raíz y la documentación de apoyo vive en `docs/`.
- `ropa.html` y `ropa-perro.html` son idénticos.

## Orden recomendado

```text
kironuevo/
├── index.html
├── pages/
│   ├── productos/
│   │   ├── productos-snack.html
│   │   └── producto-*.html
│   ├── servicios/
│   │   └── kiro*.html
│   ├── ropa/
│   │   ├── ropa.html
│   │   └── ropa-perro.html
│   └── trabajo/
│       └── trabajaconnosotros.html
├── ropa/
│   └── *.html
├── assets/
│   └── img/
│   └── pdf/
├── scripts/
│   ├── scripts/script.js
│   └── generate-ropa-pages.js
├── styles/
│   └── styles/style.css
└── docs/
    ├── contexto.md
    └── estructura-proyecto.md
```

## Orden mínimo seguro para empezar

Si no quieres mover todo de golpe, este es el orden más seguro:

1. Dejar `index.html` en la raíz como entrada principal.
2. Mover solo documentación a `docs/`.
3. Mantener `styles/style.css`, `scripts/script.js` y `generate-ropa-pages.js` en la raíz hasta que se actualicen todos los enlaces.
4. Marcar `ropa-perro.html` como fuente principal del catálogo de ropa y `ropa.html` como copia/alias o eliminar uno de los dos después de revisar referencias.

## Limpieza prioritaria

- Unificar `ropa.html` y `ropa-perro.html`.
- Separar documentación de archivos del sitio.
- Crear carpetas por dominio funcional cuando el sitio ya tenga una capa de rutas más estable.
- Revisar si `assets/img/` contiene archivos fuera de uso.

## Regla práctica

Antes de mover un archivo, confirmar:

- qué páginas lo enlazan,
- qué scripts lo leen,
- y si su ruta está incrustada en HTML o JS.

