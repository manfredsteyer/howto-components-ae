import { Component, OnInit, ViewEncapsulation, HostListener, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { TabComponent } from './tab.component';
import { PanelComponent } from './panel.component';

// NOTE: `HTMLElement & TabComponent` looks unusual but perhaps 
// I just need to get used to it
type TabElement = HTMLElement & TabComponent;
type PanelElement = HTMLElement & PanelComponent;

const KEYCODE = {
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    HOME: 36,
    END: 35,
};

@Component({
    template: `
        <style>
        :host {
            display: flex;
            flex-wrap: wrap;
        }
        ::slotted(demo-panel) {
            flex-basis: 100%;
        }
        </style>
        <slot #tabSlot name="tab" (slotchange)="slotChange($event)"></slot>
        <slot #panelSlot name="panel" (slotchange)="slotChange($event)"></slot>
    `,
    encapsulation: ViewEncapsulation.ShadowDom
})
export class TabsComponent implements OnInit {

    @HostBinding('attr.role') role: string;
    @HostBinding('attr.aria-controls') ariaControls: string;
    @HostBinding('attr.aria-labelledby') ariaLabelledby: string;

    @ViewChild('tabSlot') tabSlot: ElementRef<HTMLSlotElement>;
    @ViewChild('panelSlot') panelSlot: ElementRef<HTMLSlotElement>;



    constructor() { }

    ngOnInit() {
        if (!this.role) this.role = 'tablist';
    }


    // NOTE: Taken from the howto sample.
    @HostListener('keydown', ['$event'])
    onKeyDown($event) {
        // If the keypress did not originate from a tab element itself,
        // it was a keypress inside the a panel or on empty space. Nothing to do.
        
        // NOTE: I guess, instanceof would not work, b/c we have an AE wrapper here
        // Somehow it would be nice to make this possible w/o calling getAttribute
        // but by using a property
        if ($event.target.getAttribute('role') !== 'tab') return;

        // Don’t handle modifier shortcuts typically used by assistive technology.
        if ($event.altKey) return;

        // The switch-case will determine which tab should be marked as active
        // depending on the key that was pressed.
        let newTab;
        switch ($event.keyCode) {
            case KEYCODE.LEFT:
            case KEYCODE.UP:
                newTab = this.prevTab();
                break;

            case KEYCODE.RIGHT:
            case KEYCODE.DOWN:
                newTab = this.nextTab();
                break;

            case KEYCODE.HOME:
                newTab = this.firstTab();
                break;

            case KEYCODE.END:
                newTab = this.lastTab();
                break;
            // Any other key press is ignored and passed back to the browser.
            default:
                return;

        }

        // The browser might have some native functionality bound to the arrow
        // keys, home or end. The element calls `preventDefault()` to prevent the
        // browser from taking any actions.
        $event.preventDefault();

        // Select the new tab, that has been determined in the switch-case.
        this.selectTab(newTab);
    }

    // NOTE: Taken from the howto sample. Hence, full of DOM access.
    @HostListener('click', ['$event'])
    onClick($event) {
        // If the click was not targeted on a tab element itself,
        // it was a click inside the a panel or on empty space. Nothing to do.
        if ($event.target.getAttribute('role') !== 'tab')
            return;
        // If it was on a tab element, though, select that tab.
        this.selectTab($event.target);

    }

    slotChange($event) {
        this.linkPanels();
    }

    // NOTE: Taken from the howto sample. Hence, full of DOM access.
    // The next lines are quite DOM-like as we can not query
    // @ContentChildren projected into slots
    // Is there a way to write this in a more Angular-like style?
    linkPanels() {
        const tabs = this.allTabs();

        tabs.forEach(tab => {
            const panel = tab.nextElementSibling;
            if (panel.tagName.toLowerCase() !== 'demo-panel') {
                console.error(`Tab #${tab.id} is not a` +
                    `sibling of a <demo-panel>`);
                return;
            }

            
            // Is there a better solution than using setAttribute?
            tab.setAttribute('aria-controls', panel.id);
            panel.setAttribute('aria-labelledby', tab.id);

        });

        const selectedTab =
            tabs.find(tab => tab.selected) || tabs[0];

        // Next, switch to the selected tab. `selectTab()` takes care of
        // marking all other tabs as deselected and hiding all other panels.
        this.selectTab(selectedTab);

    }

    // NOTE: Taken from the howto sample. Hence, full of DOM access.
    selectTab(newTab: TabElement) {
        // Deselect all tabs and hide all panels.
        this.reset();

        // Get the panel that the `newTab` is associated with.
        const newPanel = this.panelForTab(newTab);
        // If that panel doesn’t exist, abort.
        if (!newPanel)
            throw new Error(`Panel does not exist!`);

        newTab.selected = true;
        newPanel.hidden = false;
        newTab.focus();
    }


    /**
     * `_panelForTab()` returns the panel that the given tab controls.
     */
    panelForTab(tab: TabElement) {
        const panelId = tab.getAttribute('aria-controls') as string;
        return this.allPanels().find(p => p.id == panelId);
        
    }

    /**
     * `_prevTab()` returns the tab that comes before the currently selected
     * one, wrapping around when reaching the first one.
     */
    prevTab() {
        const tabs = this.allTabs();
        // Use `findIndex()` to find the index of the currently
        // selected element and subtracts one to get the index of the previous
        // element.
        let newIdx =
            tabs.findIndex(tab => tab.selected) - 1;
        // Add `tabs.length` to make sure the index is a positive number
        // and get the modulus to wrap around if necessary.
        return tabs[(newIdx + tabs.length) % tabs.length];
    }

    /**
     * `_firstTab()` returns the first tab.
     */
    firstTab() {
        const tabs = this.allTabs();
        return tabs[0];
    }

    /**
     * `_lastTab()` returns the last tab.
     */
    lastTab() {
        const tabs = this.allTabs();
        return tabs[tabs.length - 1];
    }

    /**
     * `_nextTab()` gets the tab that comes after the currently selected one,
     * wrapping around when reaching the last tab.
     */
    nextTab() {
        const tabs = this.allTabs();
        let newIdx = tabs.findIndex(tab => tab.selected) + 1;
        return tabs[newIdx % tabs.length];
    }

    // NOTE: Taken from the howto sample. Hence, full of DOM access.
    reset() {
        const tabs = this.allTabs();
        const panels = this.allPanels();

        tabs.forEach(tab => tab.selected = false);
        panels.forEach(panel => panel.hidden = true);
    }

    allTabs() {
        return this.tabSlot.nativeElement.assignedElements() as Array<TabElement>;
    }

    allPanels() {
        return this.panelSlot.nativeElement.assignedElements() as Array<PanelElement>;
    }


}