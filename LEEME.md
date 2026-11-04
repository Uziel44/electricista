# Electricista · plantilla de sitio web

Web de una sola página para un electricista (hogares, comercios, industrias).
HTML, CSS y JavaScript puros: sin frameworks, sin build y sin dependencias.
Se abre con doble clic en `index.html` o se publica en GitHub Pages.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Toda la estructura y los textos |
| `css/style.css` | Todos los estilos, con las variables de color arriba de todo |
| `js/main.js` | Contacto, menú, tablero interactivo y formulario |
| `img/favicon.svg` | Ícono de la pestaña |

## Idea de diseño

El color sale del código real de los cables: **celeste** (neutro) para las acciones y
«instalar», **marrón** (fase) para «reparar» y la franja **verde-amarillo** (tierra) para
«medir y certificar» y los divisores. El tablero del hero es lo único que se mueve; el
resto de la página está quieto a propósito.

## Antes de publicar: reemplazá los datos de ejemplo

Todo lo que dice **COMPLETAR** o usa el número `5491100000000` es de ejemplo.

1. **Nombre del negocio.** Buscá `Electricista Pro` en `index.html` (aparece en el header,
   el footer, los datos para Google y el aria-label del logo) y reemplazalo.
2. **WhatsApp y teléfono.** Se cambian **una sola vez**, arriba de `js/main.js`
   (`WHATSAPP`, `TELEFONO`, `TELEFONO_VISIBLE`). Todos los botones salen de ahí.
   Además, el teléfono del bloque de datos para Google (`telephone`) en `index.html`.
3. **Matrícula.** Completá el número en el footer. Si no tenés matrícula, sacá
   «matriculado» del título y de la descripción: no publiques algo que no sea cierto.
4. **Zonas.** Reemplazá la lista de la sección «Dónde trabajamos» por las que cubrís.
5. **Horarios y urgencias.** Confirmá que de verdad atendés urgencias y en qué horario
   (barra de arriba, sección de urgencias, preguntas frecuentes y contacto).
6. **Promesas.** «Presupuesto sin cargo», «garantía por escrito», «materiales con sello
   IRAM» y «reglamentación AEA 90364» tienen que ser ciertos para tu forma de trabajar.
7. **Preguntas frecuentes.** Ajustá las respuestas (factura, tiempos, visita).
8. **Dominio y compartir.** Cambiá `https://www.ejemplo.com.ar/` (canonical, Open Graph y
   datos para Google) y agregá una imagen `img/share-preview.jpg` de 1200 x 630.
9. **Opiniones.** Hay un bloque comentado en `index.html`. Descomentalo cuando tengas
   opiniones **reales** de clientes, con su permiso. No inventes testimonios.
10. **Fotos de trabajos.** La plantilla no trae fotos. Cuando tengas las tuyas (tableros,
    obras, antes y después), sumá una sección de galería: es lo que más confianza genera.

## Cómo agregar un servicio

En `index.html`, copiá un bloque `<article class="servicio servicio--instalar">…</article>`
y cambiá el título, el texto y el mensaje de WhatsApp (`data-wa`). El color de la barra lateral
lo define la segunda clase: `servicio--instalar` (celeste), `servicio--reparar` (marrón),
`servicio--certificar` (verde-amarillo) o `servicio--nuevo` (grafito).

## Cómo funciona el formulario

No hay servidor: al enviar se abre WhatsApp con el mensaje armado. Valida nombre y teléfono, y
no guarda ningún dato. Si más adelante querés recibir los pedidos por mail, hace falta
sumar un servicio de formularios o un backend.

## Cómo publicarla (GitHub Pages)

1. Repo → Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
2. Para un dominio propio, agregá un archivo `CNAME` con el dominio y cargá los registros
   DNS que indica GitHub.

## Pendientes que conviene sumar

- `robots.txt` y `sitemap.xml` cuando tengas el dominio definitivo.
- Google Tag Manager o Analytics, si querés medir visitas y clics en WhatsApp.
