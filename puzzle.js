(function() {
    'use strict';

    var SOLVED_KEY = 'meadowPuzzleSolved';
    var SOLVED_TTL_MS = 10 * 60 * 1000; // 10 minutes

    var overlay = null;
    var currentAnswer = null;
    var pendingHref = '';
    var pendingTarget = '';

    function isSolved() {
        var solved = sessionStorage.getItem(SOLVED_KEY);
        if (!solved) return false;
        var ts = parseInt(solved, 10);
        return !isNaN(ts) && (Date.now() - ts) < SOLVED_TTL_MS;
    }

    function setSolved() {
        sessionStorage.setItem(SOLVED_KEY, Date.now().toString());
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
            '    background: rgba(0, 0, 0, 0.85);',
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
            '    max-width: 340px;',
            '    border: 2px solid var(--link-border, #30363d);',
            '    animation: puzzleSlideIn 0.3s ease;',
            '}',
            '@keyframes puzzleSlideIn {',
            '    from { opacity: 0; transform: translateY(-15px); }',
            '    to { opacity: 1; transform: translateY(0); }',
            '}',
            '.meadow-puzzle-box h3 {',
            '    margin: 0 0 10px;',
            '    font-size: 1.3rem;',
            '    font-family: "Space Grotesk", sans-serif;',
            '}',
            '.meadow-puzzle-box p {',
            '    margin: 0 0 20px;',
            '    font-size: 0.95rem;',
            '    color: var(--text-secondary, #8b949e);',
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
            '    <p>Prove you are human before visiting this personal account.</p>',
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

        var input = el.querySelector('#meadowPuzzleInput');
        var submit = el.querySelector('#meadowPuzzleSubmit');
        var cancel = el.querySelector('#meadowPuzzleCancel');

        submit.addEventListener('click', checkAnswer);

        input.addEventListener('keydown', function(e) {
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
        var questionEl = overlay.querySelector('#meadowPuzzleQuestion');
        if (questionEl) {
            questionEl.textContent = 'What is ' + a + ' + ' + b + '?';
        }
        var input = overlay.querySelector('#meadowPuzzleInput');
        if (input) {
            input.value = '';
            input.focus();
        }
        var msg = overlay.querySelector('#meadowPuzzleMessage');
        if (msg) msg.textContent = '';
    }

    function showOverlay(href, target) {
        pendingHref = href;
        pendingTarget = target;
        createOverlay();
        generatePuzzle();
        overlay.classList.add('active');
    }

    function hideOverlay() {
        if (overlay) overlay.classList.remove('active');
        pendingHref = '';
        pendingTarget = '';
    }

    function checkAnswer() {
        var input = overlay.querySelector('#meadowPuzzleInput');
        var msg = overlay.querySelector('#meadowPuzzleMessage');
        if (!input) return;

        var value = input.value.trim();
        if (parseInt(value, 10) === currentAnswer) {
            setSolved();
            hideOverlay();
            openLink(pendingHref, pendingTarget);
        } else {
            if (msg) msg.textContent = 'Not quite. Try again!';
            input.value = '';
            input.focus();
        }
    }

    function protectLinks() {
        var selectors = ['[data-personal] a', 'a[data-protected]'];
        selectors.forEach(function(selector) {
            var links = document.querySelectorAll(selector);
            links.forEach(function(link) {
                if (!link.hasAttribute('data-protected')) {
                    link.setAttribute('data-protected', 'true');
                }
            });
        });

        document.addEventListener('click', function(e) {
            var link = e.target.closest('a[data-protected]');
            if (!link) return;

            var href = link.getAttribute('href');
            var target = link.getAttribute('target') || '_self';

            if (!href || href === '#' || href === 'javascript:void(0)' || href.indexOf('javascript:') === 0) return;

            if (isSolved()) {
                return; // allow default navigation
            }

            e.preventDefault();
            e.stopPropagation();
            showOverlay(href, target);
        }, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', protectLinks);
    } else {
        protectLinks();
    }
})();
