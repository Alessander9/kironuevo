const fs = require("fs");
const path = require("path");

const root = __dirname;
const sourcePath = path.join(root, "ropa-perro.html");
const outputDir = path.join(root, "ropa");

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const extractCatalog = () => {
  const source = fs.readFileSync(sourcePath, "utf8");
  const match = source.match(/const catalog = \[(.*?)\n\s*];\s*\n\s*const catalogGrid/s);

  if (!match) {
    throw new Error("No se encontró el array `catalog` en ropa-perro.html.");
  }

  return eval(`[${match[1]}]`); // The array is trusted, local site data.
};

const toPageImage = (src) => {
  if (src.startsWith("../")) return src;
  if (src.startsWith("./")) return src.replace("./", "../");
  if (src.startsWith("img/")) return `../${src}`;
  return src;
};

const isCatProduct = (item) => /gatito/i.test(item.name) || /ropa gato/i.test(item.image);

const iconSwatches = [
  { color: "#0ea5e9", soft: "rgba(14, 165, 233, 0.16)", border: "rgba(14, 165, 233, 0.22)" },
  { color: "#f97316", soft: "rgba(249, 115, 22, 0.16)", border: "rgba(249, 115, 22, 0.22)" },
  { color: "#10b981", soft: "rgba(16, 185, 129, 0.16)", border: "rgba(16, 185, 129, 0.22)" },
  { color: "#8b5cf6", soft: "rgba(139, 92, 246, 0.16)", border: "rgba(139, 92, 246, 0.22)" },
  { color: "#ec4899", soft: "rgba(236, 72, 153, 0.16)", border: "rgba(236, 72, 153, 0.22)" }
];

const pickSwatch = (index) => iconSwatches[index % iconSwatches.length];

const buildChips = (chips, accent) => {
  const palette = [
    {
      bg: `linear-gradient(135deg, rgba(${accent} / 0.16), rgba(${accent} / 0.08))`,
      border: `rgba(${accent} / 0.24)`,
      color: `rgb(${accent})`,
      icon: "pets"
    },
    {
      bg: "linear-gradient(135deg, rgba(255, 122, 26, 0.18), rgba(255, 122, 26, 0.1))",
      border: "rgba(255, 122, 26, 0.24)",
      color: "#9a3412",
      icon: "eco"
    },
    {
      bg: "linear-gradient(135deg, rgba(9, 34, 144, 0.14), rgba(9, 34, 144, 0.08))",
      border: "rgba(9, 34, 144, 0.22)",
      color: "#1e3a8a",
      icon: "shield"
    }
  ];

  return chips
    .map((chip, index) => {
      const style = palette[index % palette.length];
      return `
        <span class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-[0_12px_20px_-18px_rgba(15,23,42,0.35)]"
          style="border-color: ${style.border}; background: ${style.bg}; color: ${style.color};">
          <span class="material-symbols-rounded text-sm" aria-hidden="true" style="color: ${style.color};">${style.icon}</span>
          ${escapeHtml(chip)}
        </span>`;
    })
    .join("");
};

const buildStatCard = (icon, label, value, toneIndex = 0) => {
  const swatch = pickSwatch(toneIndex);

  return `
  <div class="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:border-[rgba(0,76,151,0.2)]">
    <div class="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl shadow-[0_18px_28px_-20px_rgba(15,23,42,0.5)]"
      style="background: linear-gradient(135deg, ${swatch.soft}, rgba(255,255,255,0.95)); color: ${swatch.color}; border: 1px solid ${swatch.border};">
      <span class="material-symbols-rounded text-[1.35rem]" aria-hidden="true" style="color: ${swatch.color};">${icon}</span>
    </div>
    <span class="block text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-slate-500">${escapeHtml(label)}</span>
    <strong class="mt-1 block text-sm font-bold text-slate-900">${escapeHtml(value)}</strong>
  </div>
`;
};

const buildSectionCard = (icon, title, copy, toneIndex = 0) => {
  const swatch = pickSwatch(toneIndex);

  return `
  <article class="group relative overflow-hidden rounded-[1.5rem] border border-slate-200 p-5 shadow-[0_20px_42px_-34px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_56px_-34px_rgba(15,23,42,0.42)]"
    style="background:
      linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.88)),
      radial-gradient(circle at top left, rgba(var(--detail-accent-rgb),0.16), transparent 32%),
      radial-gradient(circle at bottom right, rgba(255,122,26,0.14), transparent 34%);">
    <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[rgba(var(--detail-accent-rgb),0.95)] via-[rgba(255,122,26,0.95)] to-[rgba(9,34,144,0.9)]"></div>
    <div class="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[rgba(var(--detail-accent-rgb),0.12)] blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
      style="background: linear-gradient(135deg, ${swatch.soft}, rgba(255,255,255,0.95)); color: ${swatch.color}; border: 1px solid ${swatch.border};">
      <span class="material-symbols-rounded text-[1.4rem]" aria-hidden="true" style="color: ${swatch.color};">${icon}</span>
    </div>
    <h3 class="text-base font-extrabold text-slate-900">${escapeHtml(title)}</h3>
    <p class="mt-2 text-sm leading-6 text-slate-600">${escapeHtml(copy)}</p>
    <div class="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] transition-colors duration-300"
      style="background: linear-gradient(135deg, rgba(var(--detail-accent-rgb),0.08), rgba(255,122,26,0.08)); color: rgb(var(--detail-accent-rgb));">
      <span class="material-symbols-rounded text-sm" aria-hidden="true" style="color: ${swatch.color};">arrow_forward</span>
      Más detalle
    </div>
  </article>
`;
};

const buildInfoCard = (icon, kicker, title, copy, toneIndex = 0) => {
  const swatch = pickSwatch(toneIndex);

  return `
  <article class="group relative overflow-hidden rounded-[1.5rem] border border-slate-200 p-5 shadow-[0_20px_42px_-34px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_58px_-36px_rgba(15,23,42,0.42)]"
    style="background:
      linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9)),
      radial-gradient(circle at top left, rgba(var(--detail-accent-rgb),0.16), transparent 32%),
      radial-gradient(circle at bottom right, rgba(255,122,26,0.14), transparent 34%);">
    <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[rgba(var(--detail-accent-rgb),0.95)] via-[rgba(255,122,26,0.95)] to-[rgba(9,34,144,0.9)]"></div>
    <div class="flex items-start justify-between gap-4">
      <div class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-[0_18px_28px_-20px_rgba(15,23,42,0.5)] transition-transform duration-300 group-hover:scale-110"
        style="background: linear-gradient(135deg, ${swatch.soft}, rgba(255,255,255,0.95)); color: ${swatch.color}; border: 1px solid ${swatch.border};">
        <span class="material-symbols-rounded text-[1.35rem]" aria-hidden="true" style="color: ${swatch.color};">${icon}</span>
      </div>
      <span class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] transition-colors duration-300"
        style="background: linear-gradient(135deg, rgba(var(--detail-accent-rgb),0.14), rgba(255,122,26,0.12)); color: rgb(var(--detail-accent-rgb));">
        <span class="material-symbols-rounded text-[0.9rem]" aria-hidden="true" style="color: ${swatch.color};">star</span>
        ${escapeHtml(kicker)}
      </span>
    </div>
    <h3 class="mt-4 text-base font-extrabold text-slate-900">${escapeHtml(title)}</h3>
    <p class="mt-2 text-sm leading-6 text-slate-600">${escapeHtml(copy)}</p>
  </article>
`;
};

const buildSectionHeader = (kicker, icon, title, copy, toneIndex = 0) => {
  const swatch = pickSwatch(toneIndex);

  return `
  <div class="max-w-3xl">
    <span class="ropa-section-kicker">
      <span class="material-symbols-rounded text-[0.95rem]" aria-hidden="true" style="color: ${swatch.color};">${icon}</span>
      ${escapeHtml(kicker)}
    </span>
    <h2 class="mt-3 flex flex-wrap items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
      <span class="inline-flex h-8 w-8 items-center justify-center rounded-xl" style="background: linear-gradient(135deg, ${swatch.soft}, rgba(255,255,255,0.95)); color: ${swatch.color}; border: 1px solid ${swatch.border};">
        <span class="material-symbols-rounded text-[1rem]" aria-hidden="true" style="color: ${swatch.color};">${icon}</span>
      </span>
      <span>${escapeHtml(title)}</span>
    </h2>
    ${copy ? `<p class="mt-3 text-base leading-7 text-slate-600">${escapeHtml(copy)}</p>` : ""}
  </div>
`;
};

const buildSectionPanel = (theme, content) => {
  const themes = {
    sky: "background: linear-gradient(135deg, rgba(0, 76, 151, 0.12), rgba(255, 255, 255, 0.96) 38%, rgba(255, 247, 239, 0.94));",
    sunset: "background: linear-gradient(135deg, rgba(255, 122, 26, 0.14), rgba(255, 255, 255, 0.96) 40%, rgba(0, 76, 151, 0.06));",
    indigo: "background: linear-gradient(135deg, rgba(9, 34, 144, 0.12), rgba(255, 255, 255, 0.96) 42%, rgba(255, 122, 26, 0.08));",
    mint: "background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(255, 255, 255, 0.96) 42%, rgba(0, 76, 151, 0.06));",
    blush: "background: linear-gradient(135deg, rgba(244, 114, 182, 0.1), rgba(255, 255, 255, 0.96) 42%, rgba(255, 122, 26, 0.08));",
    cream: "background: linear-gradient(135deg, rgba(255, 247, 239, 0.96), rgba(255, 255, 255, 0.98) 55%, rgba(0, 76, 151, 0.05));"
  };

  return `
    <section class="py-8 sm:py-12">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="relative overflow-hidden rounded-[2rem] border border-slate-200/70 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.28)]" style="${themes[theme] || themes.cream}">
          <div class="pointer-events-none absolute inset-0" style="background: radial-gradient(circle at top right, rgba(255,122,26,0.16), transparent 28%), radial-gradient(circle at bottom left, rgba(0,76,151,0.16), transparent 30%);"></div>
          <div class="relative p-5 sm:p-6 lg:p-8">
            ${content}
          </div>
        </div>
      </div>
    </section>`;
};

const buildSectionBlock = (theme, kicker, icon, title, copy, cardsHtml, gridClass, toneIndex = 0) =>
  buildSectionPanel(
    theme,
    `${buildSectionHeader(kicker, icon, title, copy, toneIndex)}<div class="mt-6 grid gap-4 ${gridClass}">${cardsHtml}</div>`
  );

const buildNavbar = (prefix) => `
  <nav class="sticky top-0 z-30 border-b border-white/10 backdrop-blur" style="background-color:#004C97;">
    <div class="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 md:h-16 md:flex-nowrap md:py-0 lg:px-8">
      <a href="${prefix}index.html" class="flex shrink-0 items-center gap-3 text-white">
        <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 p-1">
          <img src="${prefix}img/kirologoqueda.jpg" alt="KiroCorp" class="h-full w-full rounded-xl object-cover" width="40" height="40" />
        </span>
        <span class="text-base font-semibold tracking-tight sm:text-lg">KIROCORP</span>
      </a>
      <button id="menuBtn" type="button" aria-controls="menu" aria-expanded="false" aria-label="Abrir menú"
        class="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-white transition hover:bg-white/20 md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <ul id="menu"
        class="absolute left-0 right-0 top-full hidden flex-col gap-4 bg-black/85 px-6 py-4 text-white backdrop-blur md:static md:flex md:flex-row md:items-center md:gap-6 md:bg-transparent md:p-0">
        <li><a href="${prefix}index.html#productos" class="nav-link"><span class="material-symbols-rounded" aria-hidden="true">pet_supplies</span><span>Productos</span></a></li>
        <li><a href="${prefix}ropa.html" class="nav-link"><span class="material-symbols-rounded" aria-hidden="true">checkroom</span><span>Ropitas</span></a></li>
        <li><a href="${prefix}index.html#opiniones" class="nav-link"><span class="material-symbols-rounded" aria-hidden="true">forum</span><span>Testimonios</span></a></li>
        <li><a href="${prefix}index.html#tienda" class="nav-link"><span class="material-symbols-rounded" aria-hidden="true">call</span><span>Contacto</span></a></li>
        <li><a href="${prefix}trabajaconnosotros.html" class="nav-link"><span class="material-symbols-rounded" aria-hidden="true">badge</span><span>Trabaja con nosotros</span></a></li>
        <li class="md:hidden">
          <a href="https://wa.me/51916566758?text=Hola%20Kirocorp,%20quiero%20hacer%20un%20pedido%20con%20delivery%20GRATIS%20%F0%9F%A5%B0"
            class="btn btn-primary w-full">
            Comprar ahora
          </a>
        </li>
      </ul>
      <a href="https://wa.me/51916566758?text=Hola%20Kirocorp,%20quiero%20hacer%20un%20pedido%20con%20delivery%20GRATIS%20%F0%9F%A5%B0"
        class="btn btn-primary hidden md:inline-flex">
        Comprar ahora
      </a>
    </div>
  </nav>`;

const buildPage = (item) => {
  const slug = slugify(item.name);
  const pageImage = toPageImage(item.image);
  const prefix = "../";
  const catalogHref = `${prefix}ropa.html`;
  const waMessage = `Hola Kirocorp, quiero información sobre ${item.name} (${item.price}).`;
  const waLink = `https://wa.me/51916566758?text=${encodeURIComponent(waMessage)}`;
  const subject = isCatProduct(item) ? "gatito" : "perro";
  const subjectPlural = isCatProduct(item) ? "gatitos" : "perros";
  const title = `${item.name} | Ropita - Kirocorp`;
  const description = `${item.desc} Pensada para ${subjectPlural} que necesitan verse bien en paseo, foto y descanso, con compra directa por WhatsApp.`;
  const features = [
    { icon: item.icon, title: "Se lee de frente", copy: `La silueta de ${item.name} ayuda a que la prenda se entienda rápido en vitrina, foto y pantalla.` },
    { icon: "pets", title: "Movimiento cómodo", copy: `El corte acompaña a tu ${subject} para caminar, girar y descansar sin que la prenda se vea rígida.` },
    { icon: "workspace_premium", title: "Presencia de marca", copy: `La pieza no se siente genérica: tiene una lectura más cuidada y lista para vender.` },
    { icon: "local_shipping", title: "Pedido directo", copy: `Desde esta ficha puedes consultar talla, confirmar disponibilidad y cerrar la compra por WhatsApp.` }
  ];
  const usage = [
    { icon: "directions_walk", title: "Paseo corto", copy: `Sirve para salir a la calle con una prenda que ordena el look y no molesta al moverse.` },
    { icon: "photo_camera", title: "Foto y contenido", copy: `La forma y el color ayudan a que ${item.name} destaque sin pelear con el fondo ni con accesorios.` },
    { icon: "home", title: "Casa y descanso", copy: `También funciona cuando quieres una prenda linda para estar dentro de casa o para una salida rápida.` }
  ];
  const care = [
    { icon: "wash", title: "Lava suave", copy: "Lavado delicado o a mano para que la prenda mantenga mejor su forma." },
    { icon: "dry_cleaning", title: "Seca en sombra", copy: "El secado a la sombra ayuda a conservar color, textura y acabado." },
    { icon: "straighten", title: "Prueba antes de salir", copy: "Asegura pecho, cuello y largo para que quede cómoda desde el primer uso." }
  ];
  const details = [
    { icon: "straighten", kicker: "Ajuste", title: "Calce que no estorba", copy: `La prenda está pensada para que ${subjectPlural} puedan sentarse, caminar y descansar sin una sensación pesada.` },
    { icon: "texture", kicker: "Lectura", title: "Se ve clara en vitrina", copy: `La forma, el color y el nombre ayudan a que ${item.name} se entienda al primer vistazo.` },
    { icon: "event", kicker: "Uso real", title: "Más de una salida", copy: "Funciona para paseo, visita, foto o un día en casa según el look que quieras lograr." },
    { icon: "support_agent", kicker: "Compra", title: "Resuelve por chat", copy: `Si quieres confirmar medidas o stock, escríbenos por WhatsApp y lo cerramos contigo.` }
  ];
  const fitGuide = [
    { icon: "straighten", kicker: "Paso 1", title: "Mide pecho", copy: "Es la referencia más útil para escoger una talla que realmente le quede bien." },
    { icon: "fit_page", kicker: "Paso 2", title: "Revisa cuello", copy: "Deja un margen cómodo para que no apriete cuando gire o mire hacia arriba." },
    { icon: "horizontal_rule", kicker: "Paso 3", title: "Confirma largo", copy: "Así evitas que la prenda quede corta o invada la postura natural del cuerpo." }
  ];
  const lookIdeas = [
    { icon: "directions_walk", kicker: "Paseo", title: "Salida ordenada", copy: "Va bien con correas lisas y accesorios neutros cuando quieres una imagen limpia y directa." },
    { icon: "photo_camera", kicker: "Foto", title: "Toma protagonista", copy: `Sirve para que ${item.name} aparezca como centro de atención sin llenar la foto de elementos extra.` },
    { icon: "cottage", kicker: "Casa", title: "Momento tranquilo", copy: "También funciona cuando buscas una prenda cómoda para descansar o moverte dentro del hogar." }
  ];
  const trust = [
    { icon: "verified", title: "Chat directo", copy: "Respondemos por WhatsApp para confirmar detalles sin rodeos." },
    { icon: "local_shipping", title: "Entrega coordinada", copy: "Podemos ayudarte a coordinar pedido y entrega con una sola conversación." },
    { icon: "emoji_nature", title: "Lectura limpia", copy: "La ficha está armada para que la prenda se entienda rápido y se vea ordenada." },
    { icon: "pets", title: "Uso cómodo", copy: `Una opción para que tu ${subject} se vea bien y también esté cómodo.` }
  ];
  const detailSwatches = [pickSwatch(0), pickSwatch(1), pickSwatch(2), pickSwatch(3)];

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="icon" href="${prefix}img/kirologoqueda.jpg" type="image/jpeg" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:wght@400;600&display=swap" />
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: { display: ["Sora", "ui-sans-serif", "system-ui"] }
        }
      }
    };
  </script>
  <link rel="stylesheet" href="../style.css" />
  <style>
    .ropa-page {
      position: relative;
      overflow: hidden;
      background: #ffffff;
    }
    .ropa-page::before,
    .ropa-page::after {
      content: "";
      position: absolute;
      border-radius: 9999px;
      pointer-events: none;
      opacity: 0;
    }
    .ropa-page::before {
      width: 16rem;
      height: 16rem;
      right: -6rem;
      top: 9rem;
      background: transparent;
    }
    .ropa-page::after {
      width: 18rem;
      height: 18rem;
      left: -7rem;
      bottom: 10rem;
      background: transparent;
    }
    .ropa-shell { position: relative; z-index: 1; }
    .ropa-chip-bar { display: flex; flex-wrap: wrap; gap: 0.55rem; }
    .ropa-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.45rem 0.8rem;
      border-radius: 9999px;
      border: 1px solid rgba(var(--detail-accent-rgb) / 0.14);
      background: linear-gradient(135deg, rgba(var(--detail-accent-rgb) / 0.16), rgba(255, 122, 26, 0.12));
      color: rgb(var(--detail-accent-rgb));
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      box-shadow: 0 14px 24px -20px rgba(15, 23, 42, 0.32);
    }
    .ropa-chip .material-symbols-rounded { font-size: 0.9rem; }
    .ropa-page main .material-symbols-rounded {
      color: rgb(var(--detail-accent-rgb));
    }
    .ropa-page main .product-detail-list .material-symbols-rounded {
      color: #16a34a;
    }
    .ropa-section-kicker {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      width: fit-content;
      padding: 0.4rem 0.78rem;
      border-radius: 9999px;
      background: linear-gradient(135deg, rgba(var(--detail-accent-rgb) / 0.16), rgba(255, 122, 26, 0.12));
      border: 1px solid rgba(var(--detail-accent-rgb) / 0.18);
      color: rgb(var(--detail-accent-rgb));
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      box-shadow: 0 14px 24px -20px rgba(15, 23, 42, 0.3);
    }
  </style>
</head>
<body class="bg-white text-zinc-900 font-display min-h-screen flex flex-col selection:bg-[var(--brand-orange)] selection:text-white">
  ${buildNavbar("../")}

  <main class="ropa-page flex-grow">
    <section class="py-8 sm:py-12 md:py-16">
      <div class="ropa-shell mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="product-detail-card" data-detail-card style="--detail-accent-rgb: ${item.accent};">
          <div class="product-detail-grid lg:grid-cols-[1.02fr_0.98fr]">
            <div class="product-detail-visual" data-product-media>
              <div class="product-detail-image-shell">
                <span class="product-detail-chip" style="background: linear-gradient(135deg, rgba(${item.accent} / 0.16), rgba(255,255,255,0.96)); color: rgb(${item.accent}); border: 1px solid rgba(${item.accent} / 0.22);">
                  <span class="material-symbols-rounded" style="color: rgb(${item.accent});">${escapeHtml(item.icon)}</span>${escapeHtml(item.badge)}
                </span>
                <img src="${pageImage}" alt="${escapeHtml(item.name)}" class="product-detail-image" style="aspect-ratio: 4 / 5; object-fit: contain; background: #fff; padding: 1rem;" />
              </div>
              <div class="product-detail-facts">
                <article class="product-detail-fact" data-product-stat>
                  <span class="product-detail-fact-icon material-symbols-rounded" style="color: ${detailSwatches[0].color}; background: linear-gradient(135deg, ${detailSwatches[0].soft}, rgba(255,255,255,0.96)); border: 1px solid ${detailSwatches[0].border};">checkroom</span>
                  <div class="product-detail-fact-text"><span class="product-detail-fact-label">Visual</span><span class="product-detail-fact-value">${escapeHtml(item.visual)}</span></div>
                </article>
                <article class="product-detail-fact" data-product-stat>
                  <span class="product-detail-fact-icon material-symbols-rounded" style="color: ${detailSwatches[1].color}; background: linear-gradient(135deg, ${detailSwatches[1].soft}, rgba(255,255,255,0.96)); border: 1px solid ${detailSwatches[1].border};">pets</span>
                  <div class="product-detail-fact-text"><span class="product-detail-fact-label">Ideal para</span><span class="product-detail-fact-value">${escapeHtml(item.tag)}</span></div>
                </article>
                <article class="product-detail-fact" data-product-stat>
                  <span class="product-detail-fact-icon material-symbols-rounded" style="color: ${detailSwatches[2].color}; background: linear-gradient(135deg, ${detailSwatches[2].soft}, rgba(255,255,255,0.96)); border: 1px solid ${detailSwatches[2].border};">workspace_premium</span>
                  <div class="product-detail-fact-text"><span class="product-detail-fact-label">Badge</span><span class="product-detail-fact-value">${escapeHtml(item.badge)}</span></div>
                </article>
                <article class="product-detail-fact" data-product-stat>
                  <span class="product-detail-fact-icon material-symbols-rounded" style="color: ${detailSwatches[3].color}; background: linear-gradient(135deg, ${detailSwatches[3].soft}, rgba(255,255,255,0.96)); border: 1px solid ${detailSwatches[3].border};">local_shipping</span>
                  <div class="product-detail-fact-text"><span class="product-detail-fact-label">Precio</span><span class="product-detail-fact-value">${escapeHtml(item.price)}</span></div>
                </article>
              </div>
            </div>
            <div class="product-detail-content" data-product-content>
              <span class="product-detail-tag" style="background: linear-gradient(135deg, rgba(${item.accent} / 0.14), rgba(255,255,255,0.95)); border-color: rgba(${item.accent} / 0.24); color: rgb(${item.accent});"><span class="material-symbols-rounded" style="color: rgb(${item.accent});">${escapeHtml(item.icon)}</span>${escapeHtml(item.tag)}</span>
              <h1 class="product-detail-title">${escapeHtml(item.name)}</h1>
              <p class="product-detail-price"><small>Desde</small><strong>${escapeHtml(item.price)}</strong></p>
              <div class="ropa-chip-bar">${buildChips(item.chips, item.accent)}</div>
              <p class="product-detail-copy">${escapeHtml(item.desc)} La idea es que se lea rápido, se vea mejor en foto y se sienta lista para uso real.</p>
              <ul class="product-detail-list">
                <li><span class="material-symbols-rounded" style="color: ${detailSwatches[0].color};">verified</span> Ajuste pensado para que tu ${subject} camine y descanse con naturalidad.</li>
                <li><span class="material-symbols-rounded" style="color: ${detailSwatches[1].color};">verified</span> La prenda se entiende rápido en foto, catálogo y conversación de venta.</li>
                <li><span class="material-symbols-rounded" style="color: ${detailSwatches[2].color};">verified</span> Funciona en salida, visita o en casa según el ritmo del día.</li>
                <li><span class="material-symbols-rounded" style="color: ${detailSwatches[3].color};">verified</span> WhatsApp directo para validar talla, disponibilidad y entrega.</li>
              </ul>
              <div class="product-detail-note">
                <strong>Recomendación Kirocorp</strong>
                Si quieres una pieza fácil de mover en vitrina y fácil de explicar en venta, esta ficha funciona muy bien.
              </div>
              <div class="product-detail-actions">
                <a href="${waLink}" class="product-detail-cta"><span class="material-symbols-rounded" style="color: #ffffff;">shopping_cart_checkout</span>Comprar por WhatsApp</a>
                <a href="${catalogHref}" class="product-detail-secondary"><span class="material-symbols-rounded" style="color: rgb(${item.accent});">grid_view</span>Ver más ropitas</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${buildSectionBlock("sky", "Ficha clara", "badge", "Lo esencial para decidir sin vueltas", `Tomamos el nombre, la forma y el uso de ${item.name} para explicarla con más contexto y menos relleno.`, details.map((block, index) => buildInfoCard(block.icon, block.kicker, block.title, block.copy, index)).join(""), "md:grid-cols-2 xl:grid-cols-4", 0)}

    ${buildSectionBlock("sunset", "Lo que convence", "star", "Detalles que se notan sin explicar demasiado", `La idea es que ${item.name} no dependa de una frase genérica para lucir bien: la prenda habla sola.`, features.map((feature, index) => buildSectionCard(feature.icon, feature.title, feature.copy, index + 1)).join(""), "md:grid-cols-4", 1)}

    ${buildSectionBlock("indigo", "Cuándo usarla", "schedule", `Momentos donde ${item.name} encaja mejor`, "", usage.map((block, index) => buildSectionCard(block.icon, block.title, block.copy, index + 2)).join(""), "md:grid-cols-3", 2)}

    ${buildSectionBlock("mint", "Guía de talla", "straighten", "Tres medidas para no fallar", "Así reduces cambios y eliges una talla que realmente acompañe el cuerpo.", fitGuide.map((block, index) => buildInfoCard(block.icon, block.kicker, block.title, block.copy, index + 1)).join(""), "md:grid-cols-3", 2)}

    ${buildSectionBlock("blush", "Cuidado rápido", "cleaning_services", "Mantén el acabado bonito por más tiempo", "", care.map((block, index) => buildSectionCard(block.icon, block.title, block.copy, index + 3)).join(""), "md:grid-cols-3", 4)}

    ${buildSectionBlock("cream", "Ideas de uso", "auto_awesome", "Formas reales de llevarla", "Pensamos este bloque para que no quede en frase bonita: aquí se entiende cómo usarla de verdad.", lookIdeas.map((block, index) => buildInfoCard(block.icon, block.kicker, block.title, block.copy, index + 2)).join(""), "md:grid-cols-3", 0)}

    <section class="py-8 sm:py-12 pb-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="relative overflow-hidden rounded-[2rem] border border-slate-200/70 shadow-[0_28px_60px_-40px_rgba(15,23,42,0.28)]" style="background: linear-gradient(135deg, rgba(0, 76, 151, 0.12), rgba(255, 255, 255, 0.97) 42%, rgba(255, 122, 26, 0.1));">
          <div class="pointer-events-none absolute inset-0" style="background: radial-gradient(circle at top right, rgba(255,122,26,0.16), transparent 28%), radial-gradient(circle at bottom left, rgba(0,76,151,0.16), transparent 30%);"></div>
          <div class="relative p-5 sm:p-6 lg:p-8">
            ${buildSectionHeader("Compra segura", "workspace_premium", "Ficha lista para cerrar pedido", "Nombre, precio, talla y contacto quedan en primer plano para que la decisión sea más rápida.", 3)}
            <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              ${trust.map((block, index) => buildSectionCard(block.icon, block.title, block.copy, index + 1)).join("")}
            </div>
            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="${waLink}" class="product-detail-cta"><span class="material-symbols-rounded" style="color: #ffffff;">chat</span>Consultar por WhatsApp</a>
              <a href="${catalogHref}" class="product-detail-secondary"><span class="material-symbols-rounded" style="color: rgb(0, 76, 151);">arrow_back</span>Volver al catálogo</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="bg-black text-zinc-200">
    <div class="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <img src="${prefix}img/kirologoqueda.jpg" alt="KiroCorp" class="h-11 w-11 rounded-xl bg-white object-cover" />
          <span class="text-lg font-semibold">Kirocorp</span>
        </div>
        <p class="text-sm text-zinc-400">Fichas con talla, precio y compra directa listas para catálogo y WhatsApp.</p>
      </div>
      <div>
        <h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Contacto</h3>
        <ul class="space-y-2 text-sm">
          <li><a class="transition hover:text-white" href="tel:+51916566758">WhatsApp: +51 916 566 758</a></li>
          <li><a class="transition hover:text-white" href="mailto:hola@kirocorp.pe">Correo: hola@kirocorp.pe</a></li>
          <li><span>Envíos a todo el Perú</span></li>
        </ul>
      </div>
      <div>
        <h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Síguenos</h3>
        <div class="flex items-center gap-4">
          <a class="social-link" aria-label="WhatsApp" href="https://wa.me/51916566758"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.06.02C5.61.02.38 5.25.38 11.7c0 2.06.54 4.06 1.57 5.82L0 24l6.64-1.9a11.68 11.68 0 0 0 5.4 1.37h.01c6.44 0 11.67-5.23 11.67-11.67a11.62 11.62 0 0 0-3.2-8.32Z"/></svg></a>
          <a class="social-link" aria-label="Instagram" href="#"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.37.06 2.63.35 3.61 1.33.98.97 1.26 2.24 1.32 3.61.06 1.26.07 1.64.07 4.83s-.01 3.57-.07 4.83c-.06 1.37-.34 2.64-1.32 3.61-.98.98-2.24 1.27-3.61 1.33-1.27.06-1.65.07-4.85.07s-3.57-.01-4.84-.07c-1.37-.06-2.64-.35-3.61-1.33-.98-.97-1.26-2.24-1.32-3.61C2.16 15.57 2.16 15.19 2.16 12s0-3.57.06-4.83c.06-1.37.34-2.64 1.32-3.61.97-.98 2.24-1.27 3.61-1.33C8.43 2.17 8.81 2.16 12 2.16Z"/></svg></a>
        </div>
        <p class="mt-6 text-xs text-zinc-500">© <span id="year"></span> KiroCorp. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>

  <div class="floating-wa-wrapper">
    <div class="floating-wa-popup" id="waPopup">
      <button class="floating-wa-popup-close" id="waPopupClose" aria-label="Cerrar">×</button>
      <p>¿Quieres revisar ${escapeHtml(item.name)} con detalle? Escríbenos y te ayudamos con talla, stock y entrega.</p>
    </div>
    <a href="${waLink}" class="floating-whatsapp" aria-label="Hablar por WhatsApp" id="waBtn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.06.02C5.61.02.38 5.25.38 11.7c0 2.06.54 4.06 1.57 5.82L0 24l6.64-1.9a11.68 11.68 0 0 0 5.4 1.37h.01c6.44 0 11.67-5.23 11.67-11.67a11.62 11.62 0 0 0-3.2-8.32ZM12.07 21.3a9.58 9.58 0 0 1-4.88-1.34l-.35-.21-3.94 1.13 1.13-3.84-.23-.39a9.55 9.55 0 0 1-1.45-5.03c0-5.3 4.31-9.61 9.62-9.61 2.57 0 4.98 1 6.8 2.81a9.58 9.58 0 0 1 2.82 6.81c0 5.3-4.31 9.61-9.62 9.61Zm5.5-7.19c-.3-.15-1.77-.87-2.05-.97-.28-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.12 4.52.72.31 1.28.49 1.71.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.08-.13-.27-.2-.57-.35Z"/></svg>
    </a>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script src="../script.js"></script>
</body>
</html>`;
};

const catalog = extractCatalog().map((item) => ({ ...item, slug: slugify(item.name) }));

fs.mkdirSync(outputDir, { recursive: true });

for (const item of catalog) {
  const filePath = path.join(outputDir, `${item.slug}.html`);
  fs.writeFileSync(filePath, buildPage(item), "utf8");
}

console.log(`Generadas ${catalog.length} subpáginas en ${outputDir}`);
