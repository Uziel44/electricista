/* ==========================================================================
   ELECTRICISTA · JavaScript único
   1. Datos de contacto en un solo lugar (WhatsApp y teléfono)
   2. Menú del celular
   3. Formulario: arma un mensaje de WhatsApp (no hay servidor)
   4. Botón flotante de WhatsApp y año del footer
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
     3. FORMULARIO -> WHATSAPP
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
        error.textContent = 'Casi listo: te falta completar ' + faltan.join(' y ') + '.';
        return;
      }

      var lineas = ['Hola, ¿cómo andás? Quisiera pedir un presupuesto.', ''];
      lineas.push('Nombre: ' + nombre);
      lineas.push('Teléfono: ' + telefono);
      if (form.trabajo.value) lineas.push('Necesito: ' + form.trabajo.value);
      if (form.zona.value.trim()) lineas.push('Zona: ' + form.zona.value.trim());
      if (form.mensaje.value.trim()) lineas.push('Detalle: ' + form.mensaje.value.trim());

      var url = enlaceWhatsApp(lineas.join('\n'));
      if (url.length > 2000) {
        error.textContent = 'El mensaje quedó muy largo para WhatsApp. Acortá un poco el detalle.';
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
     4. BOTÓN FLOTANTE Y AÑO
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
