(function () {
    const saved = localStorage.getItem('etroyl-theme') || localStorage.getItem('theme');
    const preferred = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', preferred);

    function updateThemeIcon(button, theme) {
        const sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"></path></svg>';
        const moon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z"></path></svg>';
        button.innerHTML = theme === 'light' ? moon : sun;
    }

    document.addEventListener('DOMContentLoaded', function () {
        const button = document.getElementById('theme-toggle');
        if (!button) return;

        updateThemeIcon(button, preferred);

        button.addEventListener('click', function () {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('etroyl-theme', next);
            localStorage.setItem('theme', next);
            updateThemeIcon(button, next);
        });
    });
})();
