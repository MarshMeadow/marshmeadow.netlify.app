(function() {
    'use strict';

    // ==================== SEARCH INDEX ====================
    var PAGES = [
        { title: 'Bio / Home', desc: 'Main bio page with links and projects', url: 'index.html', keywords: 'home meadow n3k0 about profile' },
        { title: 'Repositories', desc: 'GitHub repos and organizations', url: 'repos.html', keywords: 'repos github projects code' },
        { title: 'Gallery', desc: 'Image gallery', url: 'gallery.html', keywords: 'photos images pictures art' },
        { title: 'Skills', desc: 'Skills and tools', url: 'skills.html', keywords: 'skills tools languages tech' },
        { title: 'Contact', desc: 'Contact and socials', url: 'contact.html', keywords: 'contact message socials email' },
        { title: 'Pronouns', desc: 'Pronouns page', url: 'pronouns.html', keywords: 'pronouns identity' },
        { title: 'Notice / Disclaimer', desc: 'Site notice and disclaimer', url: 'notice.html', keywords: 'notice disclaimer legal' },
        { title: 'Privacy', desc: 'Privacy policy', url: 'privacy.html', keywords: 'privacy data policy' },
        { title: 'Credits', desc: 'Site credits', url: 'credits.html', keywords: 'credits thanks attribution' },
        { title: 'Sitemap', desc: 'All pages on this site', url: 'sitemap.html', keywords: 'sitemap pages navigation' }
    ];

    var LINKS = [
        { title: 'GitHub', desc: 'Meadow\'s GitHub profile', url: 'https://github.com/MarshMeadow', keywords: 'github code repos profile' },
        { title: 'Ko-fi', desc: 'Support on Ko-fi', url: 'https://ko-fi.com/marshmeadow', keywords: 'kofi donate support tip' },
        { title: 'Patreon', desc: 'Support on Patreon', url: 'https://www.patreon.com/cw/marshmeadow_n3k0', keywords: 'patreon donate support' },
        { title: 'Telegram', desc: 'Telegram channel', url: 'https://t.me/+Kn4q7gvoqdg0OWVh', keywords: 'telegram chat message' },
        { title: 'Discord', desc: 'Discord profile', url: 'https://discord.com/users/nekos404', keywords: 'discord chat nekos404' },
        { title: 'Instagram', desc: 'Instagram profile', url: 'https://www.instagram.com/marshmeadow.n3k0/', keywords: 'instagram photos social' },
        { title: 'TikTok', desc: 'TikTok profile', url: 'https://www.tiktok.com/@Marshmeadow2772', keywords: 'tiktok videos social' },
        { title: 'Gaming YouTube', desc: 'Gaming channel', url: 'https://www.youtube.com/channel/UCEut9fHi6A1HbBdVnyEfU_w', keywords: 'youtube gaming videos streams' },
        { title: 'Twitch', desc: 'Twitch streams', url: 'https://www.twitch.tv/marshmeadow_n3k0', keywords: 'twitch stream live gaming' },
        { title: 'Reddit (nekos404)', desc: 'Reddit profile', url: 'https://www.reddit.com/user/nekos404/submitted/', keywords: 'reddit nekos404' },
        { title: 'Linktree', desc: 'All links in one place', url: 'https://linktr.ee/MarshMeadow', keywords: 'linktree links socials' },
        { title: 'HDO PRO', desc: 'HDO PRO on GitHub', url: 'https://github.com/HDO-PRO', keywords: 'hdo pro org github project' },
        { title: 'HDO PRO Site', desc: 'HDO PRO website', url: 'https://hdopro.netlify.app/', keywords: 'hdo pro website site' },
        { title: 'Nekomo App', desc: 'Nekomo App on GitHub', url: 'https://github.com/Nekomo-App', keywords: 'nekomo app org github' },
        { title: 'Nekomo App Site', desc: 'Nekomo App website', url: 'https://nekomoapp.netlify.app/', keywords: 'nekomo app website site' },
        { title: 'Neko\'s Index', desc: 'Neko\'s Index on GitHub', url: 'https://github.com/Neko-s-Index', keywords: 'neko index org github' },
        { title: 'Neko\'s Index Site', desc: 'N3K0\'s Index website', url: 'https://n3k0s-index.netlify.app/', keywords: 'neko index website site' },
        { title: 'ReSpotF-ck', desc: 'ReSpotF-ck on GitHub', url: 'https://github.com/ReSpotF-ck', keywords: 'respotfck org github project' },
        { title: 'ReSpotF-ck Site', desc: 'ReSpotF-ck website', url: 'https://respotfck.netlify.app/', keywords: 'respotfck website site' },
        { title: 'KamyRoll', desc: 'KamyRoll on GitHub', url: 'https://github.com/KamyRoll/KamyRoll', keywords: 'kamyroll github project anime' },
        { title: 'Dantotsu Updater', desc: 'Dantotsu updater site', url: 'https://dantotsu-app-updater.vercel.app/#/', keywords: 'dantotsu updater app site' },
        { title: 'Dantotsu Updater Repo', desc: 'Updater source on GitHub', url: 'https://github.com/MarshMeadow/dantotsu-updater-web', keywords: 'dantotsu updater github repo' },
        { title: 'FPA Site', desc: 'FancyExplore site', url: 'https://sites.google.com/view/fancyexplore/home', keywords: 'fpa fancyexplore site google' }
    ];

    var ACTIONS = [
        { title: 'Toggle Theme', desc: 'Switch dark / light mode', keywords: 'theme dark light mode', action: function() {
            if (typeof window.toggleTheme === 'function') window.toggleTheme();
        } },
        { title: 'Open Settings', desc: 'Open the settings menu', keywords: 'settings preferences options', action: function() {
            if (typeof window.toggleSettings === 'function') {
                if (!document.getElementById('settingsMenu').classList.contains('active')) window.toggleSettings();
            }
        } },
        { title: 'Open Guide', desc: 'Open the website guide', keywords: 'guide help shortcuts info', action: function() {
            if (typeof window.openGuide === 'function') window.openGuide();
            else if (typeof window.toggleGuide === 'function') window.toggleGuide();
        } },
        { title: 'Scroll to Top', desc: 'Jump back to the top of the page', keywords: 'top scroll up', action: function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } }
    ];

    // ==================== STATE ====================
    var overlay = null;
    var inputEl = null;
    var resultsEl = null;
    var activeIndex = -1;
    var currentResults = [];

    // ==================== STYLES + MARKUP ====================
    function build() {
        if (overlay) return;

        var style = document.createElement('style');
        style.textContent = [
            '.ms-search-btn {',
            '    background: var(--card-bg, rgba(30,30,40,0.95));',
            '    border: 2px solid var(--link-border, var(--border-color, #3a3a4e));',
            '    border-radius: 50%;',
            '    width: 50px;',
            '    height: 50px;',
            '    display: flex;',
            '    align-items: center;',
            '    justify-content: center;',
            '    cursor: pointer;',
            '    transition: all 0.3s ease;',
            '    box-shadow: 0 4px 12px var(--shadow-color, rgba(0,0,0,0.3));',
            '    color: var(--text-primary, #e0e0e0);',
            '    padding: 0;',
            '}',
            '.ms-search-btn:hover {',
            '    transform: scale(1.1);',
            '    border-color: #667eea;',
            '    box-shadow: 0 0 20px rgba(102,126,234,0.6);',
            '}',
            '.ms-search-btn svg { width: 22px; height: 22px; fill: currentColor; }',
            '#ms-search-overlay {',
            '    position: fixed;',
            '    inset: 0;',
            '    background: rgba(0, 0, 0, 0.65);',
            '    backdrop-filter: blur(4px);',
            '    -webkit-backdrop-filter: blur(4px);',
            '    z-index: 100001;',
            '    display: none;',
            '    justify-content: center;',
            '    align-items: flex-start;',
            '    padding: 12vh 16px 16px;',
            '    opacity: 0;',
            '    transition: opacity 0.2s ease;',
            '}',
            '#ms-search-overlay.active { display: flex; opacity: 1; }',
            '.ms-panel {',
            '    width: 100%;',
            '    max-width: 560px;',
            '    background: var(--card-bg, rgba(30,30,40,0.98));',
            '    border: 2px solid var(--link-border, var(--border-color, #3a3a4e));',
            '    border-radius: 18px;',
            '    box-shadow: 0 24px 70px rgba(0,0,0,0.5);',
            '    overflow: hidden;',
            '    transform: translateY(-14px) scale(0.98);',
            '    transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);',
            '}',
            '#ms-search-overlay.active .ms-panel { transform: translateY(0) scale(1); }',
            '.ms-input-row {',
            '    display: flex;',
            '    align-items: center;',
            '    gap: 10px;',
            '    padding: 14px 18px;',
            '    border-bottom: 1px solid var(--link-border, var(--border-color, #3a3a4e));',
            '}',
            '.ms-input-row svg { width: 20px; height: 20px; fill: var(--text-secondary, #a0a0a0); flex-shrink: 0; }',
            '.ms-input {',
            '    flex: 1;',
            '    background: transparent;',
            '    border: none;',
            '    outline: none;',
            '    color: var(--text-primary, #e0e0e0);',
            '    font-size: 1.05rem;',
            '    font-family: "Inter", sans-serif;',
            '}',
            '.ms-input::placeholder { color: var(--text-muted, #888); }',
            '.ms-kbd {',
            '    font-family: "JetBrains Mono", monospace;',
            '    font-size: 0.7rem;',
            '    color: var(--text-secondary, #a0a0a0);',
            '    border: 1px solid var(--link-border, var(--border-color, #3a3a4e));',
            '    border-radius: 5px;',
            '    padding: 2px 6px;',
            '    flex-shrink: 0;',
            '}',
            '.ms-results {',
            '    max-height: 50vh;',
            '    overflow-y: auto;',
            '    padding: 8px;',
            '    overscroll-behavior: contain;',
            '}',
            '.ms-group {',
            '    font-size: 0.7rem;',
            '    text-transform: uppercase;',
            '    letter-spacing: 0.08em;',
            '    color: var(--text-muted, #888);',
            '    padding: 10px 12px 4px;',
            '    font-weight: 600;',
            '}',
            '.ms-result {',
            '    display: flex;',
            '    align-items: center;',
            '    gap: 12px;',
            '    width: 100%;',
            '    padding: 10px 12px;',
            '    border-radius: 10px;',
            '    text-decoration: none;',
            '    color: var(--text-primary, #e0e0e0);',
            '    border: none;',
            '    background: transparent;',
            '    cursor: pointer;',
            '    text-align: left;',
            '    font-family: "Inter", sans-serif;',
            '    font-size: 0.95rem;',
            '    animation: msResultIn 0.25s ease backwards;',
            '}',
            '@keyframes msResultIn {',
            '    from { opacity: 0; transform: translateY(6px); }',
            '    to { opacity: 1; transform: translateY(0); }',
            '}',
            '.ms-result.active, .ms-result:hover {',
            '    background: rgba(102, 126, 234, 0.15);',
            '}',
            '.ms-result-icon {',
            '    width: 30px;',
            '    height: 30px;',
            '    border-radius: 8px;',
            '    background: rgba(102, 126, 234, 0.12);',
            '    display: flex;',
            '    align-items: center;',
            '    justify-content: center;',
            '    flex-shrink: 0;',
            '}',
            '.ms-result-icon svg { width: 16px; height: 16px; fill: #667eea; }',
            '.ms-result-text { display: flex; flex-direction: column; min-width: 0; }',
            '.ms-result-title { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
            '.ms-result-title b { color: #667eea; }',
            '.ms-result-desc {',
            '    font-size: 0.78rem;',
            '    color: var(--text-secondary, #a0a0a0);',
            '    white-space: nowrap;',
            '    overflow: hidden;',
            '    text-overflow: ellipsis;',
            '}',
            '.ms-empty {',
            '    padding: 30px 16px;',
            '    text-align: center;',
            '    color: var(--text-secondary, #a0a0a0);',
            '    font-size: 0.9rem;',
            '}',
            '.ms-footer {',
            '    display: flex;',
            '    gap: 14px;',
            '    padding: 10px 18px;',
            '    border-top: 1px solid var(--link-border, var(--border-color, #3a3a4e));',
            '    color: var(--text-muted, #888);',
            '    font-size: 0.72rem;',
            '}',
            '@media (max-width: 480px) {',
            '    #ms-search-overlay { padding: 8vh 10px 10px; }',
            '    .ms-search-btn { width: 45px; height: 45px; }',
            '    .ms-search-btn svg { width: 20px; height: 20px; }',
            '}'
        ].join('\n');
        document.head.appendChild(style);

        overlay = document.createElement('div');
        overlay.id = 'ms-search-overlay';
        overlay.innerHTML = [
            '<div class="ms-panel" role="dialog" aria-modal="true" aria-label="Site search">',
            '    <div class="ms-input-row">',
            '        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
            '        <input type="text" class="ms-input" id="msSearchInput" placeholder="Search pages, links, actions..." autocomplete="off" spellcheck="false">',
            '        <span class="ms-kbd">esc</span>',
            '    </div>',
            '    <div class="ms-results" id="msResults"></div>',
            '    <div class="ms-footer">',
            '        <span><span class="ms-kbd">↑↓</span> navigate</span>',
            '        <span><span class="ms-kbd">↵</span> open</span>',
            '        <span><span class="ms-kbd">ctrl+k</span> search</span>',
            '    </div>',
            '</div>'
        ].join('\n');
        document.body.appendChild(overlay);

        inputEl = overlay.querySelector('#msSearchInput');
        resultsEl = overlay.querySelector('#msResults');

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeSearch();
        });

        inputEl.addEventListener('input', renderResults);
        inputEl.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1); }
            else if (e.key === 'Enter') { e.preventDefault(); openResult(activeIndex >= 0 ? activeIndex : 0); }
            else if (e.key === 'Escape') { closeSearch(); }
        });
    }

    // ==================== MATCHING ====================
    function scoreItem(item, q) {
        var title = item.title.toLowerCase();
        var kw = (item.keywords || '').toLowerCase();
        var desc = (item.desc || '').toLowerCase();

        if (title === q) return 100;
        if (title.indexOf(q) === 0) return 80;
        if (title.indexOf(q) !== -1) return 60;
        if (kw.indexOf(q) !== -1) return 40;
        if (desc.indexOf(q) !== -1) return 30;

        // subsequence fallback ("rp" -> "Repositories")
        var qi = 0;
        for (var i = 0; i < title.length && qi < q.length; i++) {
            if (title[i] === q[qi]) qi++;
        }
        return qi === q.length ? 10 : 0;
    }

    function highlight(title, q) {
        var idx = title.toLowerCase().indexOf(q);
        if (idx === -1 || !q) return escapeHtml(title);
        return escapeHtml(title.slice(0, idx)) + '<b>' + escapeHtml(title.slice(idx, idx + q.length)) + '</b>' + escapeHtml(title.slice(idx + q.length));
    }

    function escapeHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    var ICONS = {
        page: '<svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>',
        link: '<svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>',
        action: '<svg viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>'
    };

    // ==================== RENDER ====================
    function renderResults() {
        var q = inputEl.value.trim().toLowerCase();
        currentResults = [];
        activeIndex = -1;

        var groups = [
            { name: 'Pages', items: PAGES, icon: 'page' },
            { name: 'Links', items: LINKS, icon: 'link' },
            { name: 'Actions', items: ACTIONS, icon: 'action' }
        ];

        var html = '';
        var delay = 0;
        groups.forEach(function(group) {
            var matched = group.items
                .map(function(item) { return { item: item, score: q ? scoreItem(item, q) : 1 }; })
                .filter(function(r) { return r.score > 0; })
                .sort(function(a, b) { return b.score - a.score; });

            if (!matched.length) return;

            html += '<div class="ms-group">' + group.name + '</div>';
            matched.forEach(function(r) {
                var idx = currentResults.length;
                currentResults.push(r.item);
                html += '<button class="ms-result" data-idx="' + idx + '" style="animation-delay: ' + (delay * 30) + 'ms">' +
                    '<span class="ms-result-icon">' + ICONS[group.icon] + '</span>' +
                    '<span class="ms-result-text">' +
                        '<span class="ms-result-title">' + highlight(r.item.title, q) + '</span>' +
                        '<span class="ms-result-desc">' + escapeHtml(r.item.desc || '') + '</span>' +
                    '</span>' +
                '</button>';
                delay++;
            });
        });

        resultsEl.innerHTML = html || '<div class="ms-empty">No results for "' + escapeHtml(q) + '"</div>';

        resultsEl.querySelectorAll('.ms-result').forEach(function(el) {
            el.addEventListener('click', function() {
                openResult(parseInt(el.getAttribute('data-idx'), 10));
            });
            el.addEventListener('mousemove', function() {
                setActive(parseInt(el.getAttribute('data-idx'), 10));
            });
        });
    }

    function setActive(idx) {
        activeIndex = idx;
        resultsEl.querySelectorAll('.ms-result').forEach(function(el) {
            el.classList.toggle('active', parseInt(el.getAttribute('data-idx'), 10) === idx);
        });
    }

    function moveActive(dir) {
        if (!currentResults.length) return;
        var next = activeIndex + dir;
        if (next < 0) next = currentResults.length - 1;
        if (next >= currentResults.length) next = 0;
        setActive(next);
        var el = resultsEl.querySelector('.ms-result[data-idx="' + next + '"]');
        if (el) el.scrollIntoView({ block: 'nearest' });
    }

    function openResult(idx) {
        var item = currentResults[idx];
        if (!item) return;
        closeSearch();
        if (item.action) {
            item.action();
        } else if (item.url) {
            if (item.url.indexOf('http') === 0) {
                window.open(item.url, '_blank');
            } else {
                window.location.href = item.url;
            }
        }
    }

    // ==================== OPEN / CLOSE ====================
    function openSearch() {
        build();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        inputEl.value = '';
        renderResults();
        setTimeout(function() { inputEl.focus(); }, 50);
    }

    function closeSearch() {
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function injectButton() {
        var container = document.querySelector('.settings-container');
        var btn = document.createElement('button');
        btn.className = 'ms-search-btn';
        btn.setAttribute('aria-label', 'Search');
        btn.setAttribute('title', 'Search (Ctrl+K)');
        btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>';
        btn.addEventListener('click', openSearch);

        if (container) {
            container.insertBefore(btn, container.firstChild);
        } else {
            btn.style.cssText += 'position: fixed; bottom: 20px; left: 20px; z-index: 1001;';
            document.body.appendChild(btn);
        }
    }

    // ==================== INIT ====================
    function init() {
        build();
        injectButton();

        document.addEventListener('keydown', function(e) {
            var t = e.target;
            var typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);

            if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
                e.preventDefault();
                openSearch();
            } else if (e.key === '/' && !typing) {
                e.preventDefault();
                openSearch();
            } else if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
                closeSearch();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
