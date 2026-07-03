// ==UserScript==
// @name         Jira Click-to-Edit ONLY via Pen Icon (with Save/Cancel fix)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Deaktiviert Klicks/Doppelklicks im Textbereich. Editieren startet ausschließlich durch Klick auf das Stift-Icon. Speichern/Abbrechen funktionieren weiterhin.
// @author       You
// @include      /^https:\/\/jira\..*\/browse\/.*$/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.body.addEventListener('click', function(event) {
        // Befinden wir uns innerhalb eines editierbaren Feldes?
        const editable = event.target.closest('h1.editable-field, div.editable-field, span.editable-field');

        if (editable) {
            // Ausnahmen: Wann darf geklickt werden?
            const isPenIcon = event.target.closest('span.overlay-icon, .icon-edit, .aui-icon-small');
            const isSaveButton = event.target.closest('button[type="submit"], .submit, .save-options');
            const isCancelButton = event.target.closest('.cancel, button.cancel');

            // Wenn es weder das Stift-Icon, noch der Speichern- oder Abbrechen-Button ist: Blockieren!
            if (!isPenIcon && !isSaveButton && !isCancelButton) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }
        }
    }, true); // Capturing-Phase fängt Klicks frühzeitig ab

    // Doppelklicks im Textbereich komplett blockieren (da sie sonst auch den Editor triggern)
    document.body.addEventListener('dblclick', function(event) {
        const editable = event.target.closest('h1.editable-field, div.editable-field, span.editable-field');
        if (editable) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    }, true);
})();
