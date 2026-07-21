// ==UserScript==
// @name         Jira Click-to-Edit ONLY via Pen Icon
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Editieren nur über das Stift-Icon. Toolbar und Menüs bleiben bedienbar. Textlinks öffnen in einem neuen Tab.
// @author       You
// @include      /^https:\/\/jira\..*\/browse\/.*$/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /*
     * Toolbar, Tabs, Dropdown-Menüs und Editor-Popups.
     * Jira hängt geöffnete Menüs teilweise außerhalb der Toolbar
     * direkt unter document.body ein.
     */
    const EDITOR_UI_SELECTOR = [
        // Editor-Toolbar
        '.wiki-edit-toolbar',
        '.aui-toolbar',
        '.aui-toolbar2',
        '.editor-toggle-tabs',
        '.wiki-edit-tabs',
        '.editor-toggle-button',

        // Visuell-/Text-Tabs
        'li[data-mode="wysiwyg"]',
        'li[data-mode="source"]',

        // Jira-/AUI-Dropdowns und Popup-Elemente
        '.aui-dropdown',
        '.aui-dropdown2',
        '.aui-dropdown2-section',
        '.aui-dropdown2-in-memory',
        '.aui-inline-dialog',
        '.aui-dialog',
        '.aui-dialog2',
        '.aui-layer',

        // Standardrollen für Menüs und Auswahllisten
        '[role="menu"]',
        '[role="menuitem"]',
        '[role="listbox"]',
        '[role="option"]',

        // Neuere Jira-Editor-Komponenten
        '[data-testid="ak-editor-main-toolbar"]',
        '[data-testid="editor-floating-toolbar"]',
        '[data-testid="editor-toolbar"]',
        '[data-testid*="dropdown-menu"]',
        '[data-testid*="select-menu"]',
        '[data-testid*="editor-popup"]'
    ].join(', ');

    const EDITABLE_SELECTOR =
        'h1.editable-field, div.editable-field, span.editable-field';

    const EDITABLE_AREA_SELECTOR = [
        'textarea',
        '.textarea',
        'rich-editor',
        '[contenteditable="true"]',
        '.rte-container'
    ].join(', ');

    /**
     * Prüft, ob der Klick zu einer Toolbar, einem Menü,
     * einem Editor-Tab oder einem Editor-Popup gehört.
     */
    function isEditorUiElement(target) {
        return target instanceof Element &&
            target.closest(EDITOR_UI_SELECTOR) !== null;
    }

    /**
     * Jira verwendet häufig Links als Schaltflächen.
     *
     * Beispiele:
     *   href="#"
     *   href="javascript:void(0)"
     *   role="button"
     *   role="menuitem"
     *
     * Solche Links dürfen nicht mit window.open() geöffnet werden.
     */
    function isActionLink(link) {
        if (!link) {
            return false;
        }

        const href = (link.getAttribute('href') || '').trim().toLowerCase();
        const role = (link.getAttribute('role') || '').trim().toLowerCase();

        return (
            href === '' ||
            href === '#' ||
            href.startsWith('#') ||
            href.startsWith('javascript:') ||
            role === 'button' ||
            role === 'menuitem' ||
            link.hasAttribute('aria-haspopup') ||
            link.hasAttribute('data-aui-trigger') ||
            link.classList.contains('aui-button')
        );
    }

    document.body.addEventListener('click', function(event) {
        const target = event.target;

        if (!(target instanceof Element)) {
            return;
        }

        /*
         * Toolbar, Dropdown-Menü und Editor-Popup:
         *
         * Nichts verhindern und das Ereignis vollständig an Jira
         * weitergeben. Insbesondere kein window.open() ausführen.
         */
        if (isEditorUiElement(target)) {
            return;
        }

        const editable = target.closest(EDITABLE_SELECTOR);

        if (!editable) {
            return;
        }

        const link = target.closest('a[href]');

        if (link) {
            /*
             * Jira-Aktionslinks unverändert weitergeben.
             * Diese Links steuern beispielsweise Menüs oder Dialoge.
             */
            if (isActionLink(link)) {
                return;
            }

            /*
             * Ein normaler Link im angezeigten Textbereich wird
             * ausdrücklich in einem neuen Tab geöffnet.
             */
            window.open(link.href, '_blank', 'noopener,noreferrer');

            // Standardnavigation und Start des Inline-Editors verhindern.
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            return;
        }

        const isPenIcon = target.closest(
            'span.overlay-icon, .icon-edit, ' +
            '.aui-icon-small, .aui-iconfont-edit'
        );

        const isSaveButton = target.closest(
            'button[type="submit"], .submit, .save-options, ' +
            '[data-testid="comment-save-button"]'
        );

        const isCancelButton = target.closest(
            '.cancel, button.cancel, ' +
            '[data-testid="comment-cancel-button"]'
        );

        const isEditableArea = target.closest(EDITABLE_AREA_SELECTOR);
        const isAlreadyActive = editable.classList.contains('active');

        /*
         * Klick auf ein inaktives Textfeld blockieren.
         * Alle notwendigen Editor-Bedienelemente bleiben erlaubt.
         */
        if (
            !isPenIcon &&
            !isSaveButton &&
            !isCancelButton &&
            !isEditableArea &&
            !isAlreadyActive
        ) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    }, true);

    document.body.addEventListener('dblclick', function(event) {
        const target = event.target;

        if (!(target instanceof Element)) {
            return;
        }

        /*
         * Doppelklicks auf Toolbar, Menüs und Popup-Elemente
         * unverändert Jira überlassen.
         */
        if (isEditorUiElement(target)) {
            return;
        }

        const editable = target.closest(EDITABLE_SELECTOR);

        if (!editable) {
            return;
        }

        const link = target.closest('a[href]');

        /*
         * Jira-Aktionslinks nicht blockieren.
         */
        if (link && isActionLink(link)) {
            return;
        }

        /*
         * Bei normalen Textlinks verhindern, dass durch den
         * Doppelklick zusätzlich der Inline-Editor geöffnet wird.
         */
        if (link) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            return;
        }

        const isEditableArea = target.closest(EDITABLE_AREA_SELECTOR);
        const isAlreadyActive = editable.classList.contains('active');

        if (!isEditableArea && !isAlreadyActive) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    }, true);
})();
