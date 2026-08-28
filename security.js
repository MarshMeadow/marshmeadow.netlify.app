(function() {
    'use strict';

    // Disable right-click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, true);

    // Disable common dev-tools and copy shortcuts
    document.addEventListener('keydown', function(e) {
        var k = e.keyCode || e.which;
        var ctrl = e.ctrlKey || e.metaKey;
        var sh = e.shiftKey;

        // F12
        if (k === 123) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Ctrl+U, Ctrl+S, Ctrl+P, Ctrl+C, Ctrl+A, Ctrl+F
        if (ctrl && (k === 85 || k === 83 || k === 80 || k === 67 || k === 65 || k === 70)) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Ctrl+Shift+I/J/C
        if (ctrl && sh && (k === 73 || k === 74 || k === 67)) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    // Disable copy
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, true);

    // Disable drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, true);

    // Disable text selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, true);
})();
