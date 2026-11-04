/* ==========================================================================
   ELECTRICISTA · JavaScript único
   1. Datos de contacto en un solo lugar (WhatsApp y teléfono)
   2. Menú del celular
   3. Tablero interactivo del hero
   4. Formulario: arma un mensaje de WhatsApp (no hay servidor)
   5. Botón flotante de WhatsApp y año del footer
   ========================================================================== */

(function () {
  'use strict';

  // ---- Configuración: cambiá estos datos y se actualiza toda la web ----
  var WHATSAPP = '5491100000000';            // código de país + número, sin "+" ni espacios
  var TELEFONO = '+5491100000000';           // para el enlace de llamada
  var TELEFONO_VISIBLE = '+54 9 11 0000-0000';
  // ----------------------------------------------------------------------

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var enlaceWhatsApp = function (texto) {
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
  };


  /* ------------------------------------------------------------------------
     1. CONTACTO
     [data-wa="mensaje"]  -> enlace a WhatsApp con ese mensaje
     [data-tel]           -> enlace de llamada
     [data-tel-texto]     -> muestra el teléfono tal como se escribe arriba
     ------------------------------------------------------------------------ */
  $$('[data-wa]').forEach(function (a) {
    a.href = enlaceWhatsApp(a.dataset.wa);
    a.target = '_blank';
    a.rel = 'noopener';
  });
  $$('[data-tel]').forEach(function (a) { a.href = 'tel:' + TELEFONO; });
  $$('[data-tel-texto]').forEach(function (el) { el.textContent = TELEFONO_VISIBLE; });


  /* ------------------------------------------------------------------------
     2. MENÚ DEL CELULAR
     ------------------------------------------------------------------------ */
  var burger = $('#burger');
  var nav = $('#nav');

  if (burger && nav) {
    var abrir = function (abierto) {
      nav.classList.toggle('is-open', abierto);
      burger.setAttribute('aria-expanded', String(abierto));
      burger.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    };
    burger.addEventListener('click', function () {
      abrir(burger.getAttribute('aria-expanded') !== 'true');
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { abrir(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { abrir(false); burger.focus(); }
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
      if (e.matches) abrir(false);
    });
  }


  /* ------------------------------------------------------------------------
     3. TABLERO INTERACTIVO
     Cada térmica es un botón. Con la general baja no hay tensión en ningún
     circuito, aunque las demás queden arriba (como en un tablero real).
     Al cargar, los circuitos se energizan de a uno: es el único movimiento
     que no depende de que la persona toque algo.
     ------------------------------------------------------------------------ */
  var tablero = $('#tablero');

  if (tablero) {
    var estado = $('#tablero-estado');
    var CIRCUITOS = ['luz', 'tomas', 'aire', 'cocina'];
    var llaves = { general: true, luz: true, tomas: true, aire: true, cocina: true };

    var dibujar = function () {
      $$('.termica', tablero).forEach(function (btn) {
        var activo = llaves[btn.dataset.circuito];
        btn.classList.toggle('is-on', activo);
        btn.setAttribute('aria-pressed', String(activo));
      });

      var conTension = 0;
      CIRCUITOS.forEach(function (c) {
        var energizado = llaves.general && llaves[c];
        var carga = $('[data-carga="' + c + '"]', tablero);
        if (carga) carga.classList.toggle('is-on', energizado);
        if (energizado) conTension++;
      });

      tablero.classList.toggle('is-corte', !llaves.general);
      tablero.classList.toggle('is-parcial', llaves.general && conTension > 0 && conTension < CIRCUITOS.length);

      if (!llaves.general) estado.textContent = 'Sin tensión: ya se puede trabajar seguro';
      else if (conTension === CIRCUITOS.length) estado.textContent = 'Todo energizado';
      else if (conTension === 0) estado.textContent = 'Ningún circuito con tensión';
      else estado.textContent = conTension + ' de ' + CIRCUITOS.length + ' circuitos con tensión';
    };

    tablero.addEventListener('click', function (e) {
      var btn = e.target.closest('.termica');
      if (!btn) return;
      llaves[btn.dataset.circuito] = !llaves[btn.dataset.circuito];
      dibujar();
    });

    if (!sinMovimiento) {
      // Arranca sin tensión y energiza en orden. Se avisa al lector de pantalla recién al final.
      var orden = ['general'].concat(CIRCUITOS);
      Object.keys(llaves).forEach(function (k) { llaves[k] = false; });
      estado.setAttribute('aria-live', 'off');
      dibujar();
      orden.forEach(function (c, i) {
        setTimeout(function () {
          llaves[c] = true;
          dibujar();
          if (i === orden.length - 1) estado.setAttribute('aria-live', 'polite');
        }, 450 + i * 260);
      });
    } else {
      dibujar();
    }
  }


  /* ------------------------------------------------------------------------
     4. FORMULARIO -> WHATSAPP
     ------------------------------------------------------------------------ */
  var form = $('#form');

  if (form) {
    var error = $('#form-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = form.nombre.value.trim();
      var telefono = form.telefono.value.trim();
      var faltan = [];

      if (!nombre) faltan.push('tu nombre');
      if (telefono.replace(/\D/g, '').length < 7 || !/^[0-9+()\-\s]+$/.test(telefono)) faltan.push('tu teléfono (solo números)');

      if (faltan.length) {
        error.textContent = 'Antes de enviar, completá ' + faltan.join(' y ') + '.';
        return;
      }

      var lineas = ['Hola, quiero pedir un presupuesto.', ''];
      lineas.push('Nombre: ' + nombre);
      lineas.push('Teléfono: ' + telefono);
      if (form.trabajo.value) lineas.push('Necesito: ' + form.trabajo.value);
      if (form.zona.value.trim()) lineas.push('Zona: ' + form.zona.value.trim());
      if (form.mensaje.value.trim()) lineas.push('Detalle: ' + form.mensaje.value.trim());

      var url = enlaceWhatsApp(lineas.join('\n'));
      if (url.length > 2000) {
        error.textContent = 'El mensaje es muy largo para WhatsApp. Acortá el detalle.';
        return;
      }

      error.textContent = '';
      var ventana = window.open(url, '_blank');
      if (ventana) ventana.opener = null;
      else window.location.href = url;
    });

    form.addEventListener('input', function () { error.textContent = ''; });
    form.telefono.addEventListener('input', function () {
      form.telefono.value = form.telefono.value.replace(/[^0-9+()\-\s]/g, '');
    });
  }


  /* ------------------------------------------------------------------------
     5. BOTÓN FLOTANTE Y AÑO
     El botón de WhatsApp se esconde cuando ya se ve el formulario o el footer.
     ------------------------------------------------------------------------ */
  var wa = $('#wa');
  var cercanos = [$('#contacto'), $('.site-footer')].filter(Boolean);
  if (wa && 'IntersectionObserver' in window) {
    var visibles = new Set();
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) visibles.add(en.target); else visibles.delete(en.target);
      });
      wa.classList.toggle('is-hidden', visibles.size > 0);
    });
    cercanos.forEach(function (el) { io.observe(el); });
  }

  var anio = $('#year');
  if (anio) anio.textContent = new Date().getFullYear();
})();
