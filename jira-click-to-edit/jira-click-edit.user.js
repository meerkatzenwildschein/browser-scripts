// ==UserScript==
// @name         Jira Click-to-Edit ONLY via Pen Icon (with Save/Cancel fix)
// @namespace    http://tampermonkey.net/
// @version      0.7
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
            const isPenIcon = event.target.closest('span.overlay-icon, .icon-edit, .aui-icon-small, .aui-iconfont-edit');
            const isSaveButton = event.target.closest('button[type="submit"], .submit, .save-options, [data-testid="comment-save-button"]');
            const isCancelButton = event.target.closest('.cancel, button.cancel, [data-testid="comment-cancel-button"]');

            // NEU: Tabs ("Visuell"/"Text") und die Formatierungs-Toolbar oben erlauben
            const isToolbarOrTabs = event.target.closest(
                '.wiki-edit-toolbar, .aui-toolbar, .aui-toolbar2, .editor-toggle-tabs, .wiki-edit-tabs, .editor-toggle-button, ' +
                'li[data-mode="wysiwyg"], li[data-mode="source"], ' +
                '[data-testid="ak-editor-main-toolbar"], [data-testid="editor-floating-toolbar"], [data-testid="editor-toolbar"]'
            );

            // NEU: Der eigentliche Textbereich / Textarea zum Schreiben erlauben
            const isEditableArea = event.target.closest('textarea, .textarea, rich-editor, [contenteditable="true"], .rte-container');

            // NEU: Wenn das Feld bereits aktiv editiert wird (Klasse "active" vorhanden), blockieren wir keine Klicks mehr
            const isAlreadyActive = editable.classList.contains('active');

            // Wenn es keines der erlaubten Elemente ist und das Feld noch nicht aktiv editiert wird: Blockieren!
            if (!isPenIcon && !isSaveButton && !isCancelButton && !isToolbarOrTabs && !isEditableArea && !isAlreadyActive) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }
        }
    }, true); // Capturing-Phase fängt Klicks frühzeitig ab

    // Doppelklicks im Textbereich blockieren, AUßER wenn man bereits aktiv editiert oder in den Editor klickt
    document.body.addEventListener('dblclick', function(event) {
        const editable = event.target.closest('h1.editable-field, div.editable-field, span.editable-field');
        if (editable) {
            const isToolbarOrTabs = event.target.closest(
                '.wiki-edit-toolbar, .aui-toolbar, .aui-toolbar2, .editor-toggle-tabs, .wiki-edit-tabs, .editor-toggle-button, ' +
                'li[data-mode="wysiwyg"], li[data-mode="source"], ' +
                '[data-testid="ak-editor-main-toolbar"], [data-testid="editor-floating-toolbar"], [data-testid="editor-toolbar"]'
            );
            const isEditableArea = event.target.closest('textarea, .textarea, rich-editor, [contenteditable="true"], .rte-container');
            const isAlreadyActive = editable.classList.contains('active');

            // Doppelklick nur blockieren, wenn das Feld inaktiv ist und nicht auf Editor-Elemente geklickt wurde
            if (!isToolbarOrTabs && !isEditableArea && !isAlreadyActive) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }
        }
    }, true);
})();
