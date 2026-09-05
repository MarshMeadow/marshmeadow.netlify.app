(function() {
    'use strict';

    var PAGE_SOLVED_KEY = 'meadowPuzzleSolved';
    var LINKS_SOLVED_KEY = 'meadowPuzzleLinksSolved';
    var SOLVED_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

    var overlay = null;
    var currentAnswer = null;
    var pendingHref = '';
    var pendingTarget = '';
    var pageMode = false;

    var descEl = null;
    var questionEl = null;
    var inputEl = null;
    var msgEl = null;
    var cancelEl = null;

    function isPageSolved() {
        var solved = localStorage.getItem(PAGE_SOLVED_KEY);
        if (!solved) return false;
        var ts = parseInt(solved, 10);
        return !isNaN(ts) && (Date.now() - ts) < SOLVED_TTL_MS;
    }

    function setPageSolved() {
        localStorage.setItem(PAGE_SOLVED_KEY, Date.now().toString());
    }

    function isLinksSolved() {
        return sessionStorage.getItem(LINKS_SOLVED_KEY) === '1';
    }

    function setLinksSolved() {
        sessionStorage.setItem(LINKS_SOLVED_KEY, '1');
    }

    function openLink(href, target) {
        if (!href) return;
        if (target === '_blank' || target === 'blank') {
            window.open(href, '_blank');
        } else {
            window.location.href = href;
        }
    }

    function createOverlay() {
        if (overlay) return overlay;

        var el = document.createElement('div');
        el.id = 'meadow-puzzle-overlay';
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'true');
        el.innerHTML = [
            '<style>',
            '#meadow-puzzle-overlay {',
            '    position: fixed;',
            '    top: 0;',
            '    left: 0;',
            '    width: 100%;',
            '    height: 100%;',
            '    background: rgba(0, 0, 0, 0.9);',
            '    z-index: 100000;',
            '    display: none;',
            '    justify-content: center;',
            '    align-items: center;',
            '    pointer-events: all;',
            '    animation: puzzleFadeIn 0.3s ease;',
            '}',
            '#meadow-puzzle-overlay.active {',
            '    display: flex;',
            '}',
            '@keyframes puzzleFadeIn {',
            '    from { opacity: 0; }',
            '    to { opacity: 1; }',
            '}',
            '.meadow-puzzle-box {',
            '    background: var(--card-bg, #21262d);',
            '    color: var(--text-primary, #c9d1d9);',
            '    padding: 30px;',
            '    border-radius: 16px;',
            '    text-align: center;',
            '    box-shadow: 0 10px 40px rgba(0,0,0,0.5);',
            '    width: 90%;',
            '    max-width: 420px;',
            '    border: 2px solid var(--link-border, #30363d);',
            '    animation: puzzleSlideIn 0.3s ease;',
            '}',
            '@keyframes puzzleSlideIn {',
            '    from { opacity: 0; transform: translateY(-15px); }',
            '    to { opacity: 1; transform: translateY(0); }',
            '}',
            '.meadow-puzzle-box h3 {',
            '    margin: 0 0 10px;',
            '    font-size: 1.4rem;',
            '    font-family: "Space Grotesk", sans-serif;',
            '}',
            '.meadow-puzzle-box p {',
            '    margin: 0 0 20px;',
            '    font-size: 0.95rem;',
            '    color: var(--text-secondary, #8b949e);',
            '    line-height: 1.5;',
            '}',
            '.meadow-puzzle-box p a {',
            '    color: #667eea;',
            '    text-decoration: underline;',
            '}',
            '.meadow-puzzle-question {',
            '    font-size: 1.4rem;',
            '    font-weight: 700;',
            '    margin-bottom: 15px;',
            '    color: var(--text-primary, #c9d1d9);',
            '}',
            '.meadow-puzzle-input {',
            '    width: 100%;',
            '    padding: 12px;',
            '    border-radius: 10px;',
            '    border: 2px solid var(--link-border, #30363d);',
            '    background: var(--link-bg, #161b22);',
            '    color: var(--text-primary, #c9d1d9);',
            '    font-size: 1.1rem;',
            '    text-align: center;',
            '    margin-bottom: 15px;',
            '    outline: none;',
            '}',
            '.meadow-puzzle-input:focus {',
            '    border-color: #667eea;',
            '    box-shadow: 0 0 15px rgba(102,126,234,0.3);',
            '}',
            '.meadow-puzzle-actions {',
            '    display: flex;',
            '    gap: 10px;',
            '    justify-content: center;',
            '}',
            '.meadow-puzzle-actions button {',
            '    padding: 12px 22px;',
            '    border: none;',
            '    border-radius: 10px;',
            '    cursor: pointer;',
            '    font-size: 1rem;',
            '    font-weight: 600;',
            '    transition: transform 0.2s ease, box-shadow 0.2s ease;',
            '}',
            '.meadow-puzzle-submit {',
            '    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
            '    color: white;',
            '}',
            '.meadow-puzzle-submit:hover {',
            '    transform: translateY(-2px);',
            '    box-shadow: 0 6px 15px rgba(102,126,234,0.4);',
            '}',
            '.meadow-puzzle-cancel {',
            '    background: var(--link-bg, #161b22);',
            '    color: var(--text-primary, #c9d1d9);',
            '    border: 2px solid var(--link-border, #30363d);',
            '}',
            '.meadow-puzzle-cancel:hover {',
            '    border-color: #667eea;',
            '    color: #667eea;',
            '}',
            '.meadow-puzzle-message {',
            '    min-height: 22px;',
            '    font-size: 0.9rem;',
            '    margin-top: 12px;',
            '    color: #ff5f56;',
            '}',
            '</style>',
            '<div class="meadow-puzzle-box">',
            '    <h3>Quick Puzzle</h3>',
            '    <p id="meadowPuzzleDescription"></p>',
            '    <div class="meadow-puzzle-question" id="meadowPuzzleQuestion"></div>',
            '    <input type="text" class="meadow-puzzle-input" id="meadowPuzzleInput" autocomplete="off" inputmode="numeric" placeholder="Your answer">',
            '    <div class="meadow-puzzle-actions">',
            '        <button class="meadow-puzzle-submit" id="meadowPuzzleSubmit" type="button">Submit</button>',
            '        <button class="meadow-puzzle-cancel" id="meadowPuzzleCancel" type="button">Cancel</button>',
            '    </div>',
            '    <div class="meadow-puzzle-message" id="meadowPuzzleMessage"></div>',
            '</div>'
        ].join('\n');

        document.body.appendChild(el);
        overlay = el;

        descEl = el.querySelector('#meadowPuzzleDescription');
        questionEl = el.querySelector('#meadowPuzzleQuestion');
        inputEl = el.querySelector('#meadowPuzzleInput');
        msgEl = el.querySelector('#meadowPuzzleMessage');

        var submit = el.querySelector('#meadowPuzzleSubmit');
        var cancel = el.querySelector('#meadowPuzzleCancel');
        cancelEl = cancel;

        submit.addEventListener('click', checkAnswer);

        inputEl.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });

        cancel.addEventListener('click', hideOverlay);

        return overlay;
    }

    function generatePuzzle() {
        var a = Math.floor(Math.random() * 9) + 2;
        var b = Math.floor(Math.random() * 9) + 2;
        currentAnswer = a + b;
        if (questionEl) {
            questionEl.textContent = 'What is ' + a + ' + ' + b + '?';
        }
        if (inputEl) {
            inputEl.value = '';
            inputEl.focus();
        }
        if (msgEl) msgEl.textContent = '';
    }

    function setDescription(html) {
        createOverlay();
        if (descEl) descEl.innerHTML = html;
    }

    function showOverlay(href, target, mode) {
        pageMode = (mode === 'page');
        pendingHref = href || '';
        pendingTarget = target || '_self';
        createOverlay();

        if (cancelEl) cancelEl.style.display = pageMode ? 'none' : '';

        if (pageMode) {
            setDescription(
                '<strong>Notice:</strong> This is a personal bio page about Meadow. ' +
                'Please solve this quick puzzle to continue. By entering, you agree not to abuse, ' +
                'copy, or redistribute any content on this page. ' +
                '<a href="notice.html" target="_blank">Read full notice/disclaimer</a>.'
            );
        } else {
            setDescription('Prove you are human before visiting this personal account.');
        }

        generatePuzzle();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideOverlay() {
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
        pendingHref = '';
        pendingTarget = '';
        pageMode = false;
    }

    function checkAnswer() {
        var value = inputEl ? inputEl.value.trim() : '';
        if (parseInt(value, 10) === currentAnswer) {
            if (pageMode) {
                setPageSolved();
            } else {
                setLinksSolved();
            }
            hideOverlay();
            if (!pageMode && pendingHref) {
                openLink(pendingHref, pendingTarget);
            }
        } else {
            if (msgEl) msgEl.textContent = 'Not quite. Try again!';
            if (inputEl) {
                inputEl.value = '';
                inputEl.focus();
            }
        }
    }

    function protectLinks() {
        var selectors = ['[data-personal] a', 'a[data-protected]', 'a[href*="github.com"]'];
        selectors.forEach(function(selector) {
            var links = document.querySelectorAll(selector);
            links.forEach(function(link) {
                if (!link.hasAttribute('data-protected')) {
                    link.setAttribute('data-protected', 'true');
                }
            });
        });

        // Auto-protect any external social/contact or donation links
        document.querySelectorAll('a[href^="http"]').forEach(function(link) {
            try {
                if (link.hostname && link.hostname !== location.hostname) {
                    if (!link.hasAttribute('data-protected')) {
                        link.setAttribute('data-protected', 'true');
                    }
                }
            } catch (e) {}
        });

        document.addEventListener('click', function(e) {
            var link = e.target.closest('[data-protected]');
            if (!link) return;

            var href = link.getAttribute('data-href') || link.getAttribute('href');
            var target = link.getAttribute('data-target') || link.getAttribute('target') || '_self';

            if (!href || href === '#' || href === 'javascript:void(0)' || href.indexOf('javascript:') === 0) return;

            if (isLinksSolved()) {
                return; // allow default navigation
            }

            e.preventDefault();
            e.stopPropagation();
            showOverlay(href, target, 'link');
        }, true);
    }

    function initPagePuzzle() {
        if (!document.body.hasAttribute('data-page-puzzle')) return;
        if (isPageSolved()) return;
        showOverlay(null, null, 'page');
    }

    function init() {
        protectLinks();
        initPagePuzzle();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
