// ── Autocompletado de ingredientes (compartido) ──────────────────
// Antes estaba duplicado en script.js y roulette.js; ahora vive acá.
import { t } from './translator/translator.js';

/**
 * Convierte un <input> en un autocompletado accesible (role="listbox").
 * Filtra y muestra sobre el nombre traducido, pero deja en el input la
 * clave en inglés (para que los filtros sigan funcionando).
 * @returns {{ hide: () => void }}
 */
export function createAutocomplete(inputEl, itemsList) {
  // El dropdown necesita que su padre tenga position: relative
  const wrapper = inputEl.parentElement;
  wrapper.style.position = 'relative';

  const dropdown = document.createElement('ul');
  dropdown.className = 'autocomplete-dropdown';
  dropdown.setAttribute('role', 'listbox');
  dropdown.hidden = true;
  wrapper.appendChild(dropdown);

  let activeIdx = -1;

  function render(query) {
    const q = query.toLowerCase().trim();
    if (!q) { hide(); return; }

    const matches = itemsList
      .filter(item => t(item).toLowerCase().includes(q) || item.toLowerCase().includes(q))
      .sort((a, b) => {
        // Primero los que empiezan con la query, luego los que la contienen
        const aT = t(a).toLowerCase();
        const bT = t(b).toLowerCase();
        const aS = (aT.startsWith(q) || a.toLowerCase().startsWith(q)) ? 0 : 1;
        const bS = (bT.startsWith(q) || b.toLowerCase().startsWith(q)) ? 0 : 1;
        return aS - bS || aT.localeCompare(bT);
      })
      .slice(0, 8);

    if (!matches.length) { hide(); return; }

    dropdown.innerHTML = '';
    activeIdx = -1;

    matches.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'autocomplete-item';
      li.setAttribute('role', 'option');
      li.dataset.value = item; // clave en inglés para filtrar

      // Highlight sobre el nombre traducido
      const display = t(item);
      const idx = display.toLowerCase().indexOf(q);
      if (idx !== -1) {
        li.appendChild(document.createTextNode(display.slice(0, idx)));
        const mark = document.createElement('mark');
        mark.className   = 'autocomplete-match';
        mark.textContent = display.slice(idx, idx + q.length);
        li.appendChild(mark);
        li.appendChild(document.createTextNode(display.slice(idx + q.length)));
      } else {
        li.textContent = display;
      }

      // mousedown en vez de click para que el blur del input no cierre el dropdown
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        inputEl.value = item; // siempre la clave inglesa para que los filtros funcionen
        hide();
        inputEl.dispatchEvent(new Event('autocomplete-select', { bubbles: true }));
      });

      dropdown.appendChild(li);
    });

    dropdown.hidden = false;
  }

  function setActive(idx) {
    const items = [...dropdown.querySelectorAll('.autocomplete-item')];
    items.forEach((li, i) => li.classList.toggle('active', i === idx));
    if (idx >= 0 && idx < items.length) inputEl.value = items[idx].dataset.value;
  }

  function hide() {
    dropdown.hidden = true;
    activeIdx = -1;
  }

  inputEl.addEventListener('input',  () => render(inputEl.value));
  inputEl.addEventListener('focus',  () => { if (inputEl.value) render(inputEl.value); });
  inputEl.addEventListener('blur',   () => setTimeout(hide, 160));
  inputEl.addEventListener('keydown', (e) => {
    const items = [...dropdown.querySelectorAll('.autocomplete-item')];
    if (dropdown.hidden || !items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = (activeIdx + 1) % items.length;
      setActive(activeIdx);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = (activeIdx - 1 + items.length) % items.length;
      setActive(activeIdx);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      hide();
    }
  });

  return { hide };
}
