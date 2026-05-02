// toggle de tema claro / oscuro independiente del SO
// guarda la preferencia en localStorage y vence cualquier dark mode automatico

(function () {
    'use strict';

    const STORAGE_KEY = 'familymed-admin-theme';

    function getSavedTheme() {
        return localStorage.getItem(STORAGE_KEY) || 'light';
    }

    // aplica el tema con maxima fuerza posible
    function applyTheme(theme) {
        const root = document.documentElement;
        const body = document.body;

        // atributo data-theme (lo que usa nuestro CSS)
        root.setAttribute('data-theme', theme);
        if (body) body.setAttribute('data-theme', theme);

        // Bootstrap 5 dark mode
        root.setAttribute('data-bs-theme', theme);

        // color-scheme inline en el html para vencer al SO
        root.style.colorScheme = theme + ' only';
        if (body) body.style.colorScheme = theme + ' only';

        // clase dark-mode de adminLTE / jazzmin
        if (body) {
            if (theme === 'dark') {
                body.classList.add('dark-mode');
            } else {
                body.classList.remove('dark-mode');
            }
        }

        // meta tag color-scheme (el navegador lo respeta para los controles nativos)
        let meta = document.querySelector('meta[name="color-scheme"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'color-scheme';
            document.head.appendChild(meta);
        }
        meta.content = theme + ' only';

        localStorage.setItem(STORAGE_KEY, theme);
        updateButton(theme);
    }

    function updateButton(theme) {
        const btn = document.getElementById('udes-theme-toggle');
        if (!btn) return;
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        btn.title = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    }

    function toggleTheme() {
        applyTheme(getSavedTheme() === 'light' ? 'dark' : 'light');
    }

    function injectButton() {
        if (document.getElementById('udes-theme-toggle')) return true;

        const navbar = document.querySelector('.navbar-nav.ml-auto')
            || document.querySelector('.navbar-nav.ms-auto')
            || document.querySelector('.main-header .navbar-nav:last-child');

        if (!navbar) return false;

        const li = document.createElement('li');
        li.className = 'nav-item';

        const btn = document.createElement('a');
        btn.id = 'udes-theme-toggle';
        btn.className = 'nav-link';
        btn.href = 'javascript:void(0);';
        btn.style.cursor = 'pointer';
        btn.innerHTML = '<i class="fas fa-moon"></i>';
        btn.addEventListener('click', toggleTheme);

        li.appendChild(btn);
        navbar.insertBefore(li, navbar.firstChild);

        updateButton(getSavedTheme());
        return true;
    }

    // aplica el tema lo antes posible (incluso antes del DOMContentLoaded)
    // para reducir el flash inicial cuando el SO esta en oscuro
    applyTheme(getSavedTheme());

    function init() {
        applyTheme(getSavedTheme());
        if (!injectButton()) {
            setTimeout(injectButton, 150);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
