// ==UserScript==
// @name         Mammouth AI Autoprompt
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Füllt das Suchfeld bei Mammouth AI automatisch aus, wenn ein Parameter in der URL übergeben wird.
// @author       Du
// @match        https://mammouth.ai/app/a/default*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        // Suchparameter aus der URL auslesen
        const urlParams = new URLSearchParams(window.location.search);
        const promptText = urlParams.get('prompt');

        if (promptText) {
            // Intervall, um darauf zu warten, dass das Eingabefeld geladen ist
            const checkExist = setInterval(() => {
                // Suchen des Texteingabefelds (Textarea)
                const textarea = document.querySelector('textarea');

                if (textarea) {
                    clearInterval(checkExist);

                    // Text einfügen
                    textarea.value = decodeURIComponent(promptText);
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));

                    // Optional: Direkt absenden (Enter-Taste simulieren)
                    setTimeout(() => {
                        const sendButton = textarea.closest('form')?.querySelector('button[type="submit"]') || document.querySelector('button[aria-label="Send message"]');
                        if (sendButton) {
                            sendButton.click();
                        }
                    }, 500);
                }
            }, 100); // Überprüft alle 100ms
        }
    });
})();

