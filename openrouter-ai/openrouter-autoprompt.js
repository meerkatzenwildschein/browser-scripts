// ==UserScript==
// @name         OpenRouter Search Engine Prefill (Robust)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Füllt das OpenRouter-Chatfeld intelligent und robust aus
// @author       User
// @match        https://openrouter.ai/chat*
// @grant        none
// @run-at       document-end
// ==/UserScript==
(function() {
    'use strict';

    // 1. Parameter aus der URL lesen
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (!query) return;

    const decodedQuery = decodeURIComponent(query);

    // 2. Element-Sucher mit Fallbacks (von extrem stabil bis allgemein)
    function findComposerTextarea() {
        // Prio 1: Test-ID (Goldstandard, ändert sich fast nie)
        let el = document.querySelector('textarea[data-testid="composer-input"]');
        if (el) return el;

        // Prio 2: Datadog-Privacy-Attribut (aus Ihrem HTML)
        el = document.querySelector('textarea[data-dd-privacy="hidden"]');
        if (el) return el;

        // Prio 3: Über den Platzhalter-Text suchen
        el = Array.from(document.querySelectorAll('textarea')).find(t => 
            t.placeholder && t.placeholder.toLowerCase().includes('ask')
        );
        if (el) return el;

        // Prio 4: Das allererste Textfeld auf der Seite als absolute Notlösung
        return document.querySelector('textarea');
    }

    // 3. Spezial-Trick, um den React/Vue-Zustand im Hintergrund zu aktualisieren
    function setInputValueWithReactBypass(textarea, value) {
        try {
            // Wir holen uns den originalen Prototyp-Setter von HTML-Textareas
            const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
            valueSetter.call(textarea, value);
            
            // Simuliert echte Benutzereingaben für das Framework
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (e) {
            // Fallback, falls die Browser-Sicherheit den Prototyp-Zugriff blockiert
            textarea.value = value;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    // 4. Intervall-Prüfung (bricht nach 5 Sekunden ab, um Ressourcen zu sparen)
    let attempts = 0;
    const maxAttempts = 50; // 50 * 100ms = 5 Sekunden

    const checkExist = setInterval(function() {
        const textarea = findComposerTextarea();
        attempts++;

        if (textarea) {
            clearInterval(checkExist);
            
            // Text sicher einfügen
            setInputValueWithReactBypass(textarea, decodedQuery);

            // Fokus setzen und Cursor ans Ende bewegen
            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
            
            // Event senden, damit das Textfeld automatisch seine Höhe anpasst (Auto-Resizing)
            textarea.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
            
        } else if (attempts >= maxAttempts) {
            clearInterval(checkExist);
            console.warn("OpenRouter Prefill: Das Chat-Textfeld konnte nicht gefunden werden.");
        }
    }, 100);
})();
