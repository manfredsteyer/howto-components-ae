import {
  Component,
  OnInit,
  Input,
  HostBinding,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  ElementRef
} from "@angular/core";

let howtoTabCounter = 0;

@Component({
  template: "<slot></slot>",
  encapsulation: ViewEncapsulation.ShadowDom
})
export class TabComponent implements OnInit, OnChanges {
  @HostBinding("id")
  id: string;

  // NOTE: The need to distinguish b/w attributes and properties
  // is somehow confusing. As an Angular dev I'm not used to this.
  @HostBinding("attr.role")
  role = "tab";

  @HostBinding("attr.aria-selected")
  ariaSelected = "false";

  @HostBinding("attr.tabindex")
  tabIndex = -1;

  @Input()
  set selected(value: boolean) {
    // NOTE: Seems like, we need to do this manually.
    // HostBinding('attr.xxx') does not help here b/c
    // this is about creating/ removing an attribute

    // NOTE: AE seems to sync attributes with properties,
    // Hence, this triggers this setter one more time.
    // In the howto example the property sets the attribute
    // like here. However, here it seems to cause a cycle.

    // Just an Idea: If we had sth like
    // @Passthrough() set selected(...) that creates a property
    // with the same name in the AE wrapper just delegating
    // to this one here, this could solve the issue. Other than
    // @Input it would not sync with attributes
    // Plus, we could also use it to expose specific methods
    // via the AE wrapper

    // HACK: To break this cycle, I'm using this here
    // It's dirty as hell. Perhaps I'm missing a simple solution here.
    // Father forgive me! ;-)

    if (typeof value === "string") return;

    // On the other side, the goal is to provide a property
    // returning true if attribute selected exists
    // and false otherwise.
    if (value) {
      this.element.nativeElement.setAttribute("selected", "true");
    } else {
      this.element.nativeElement.removeAttribute("selected");
    }

    // NOTE: Seems like, we don't have sth like attributeChangedCallback
    // in Angular. A @HostBinding to attr.xyz does not help here
    this.ariaSelected = "" + this.selected;
    this.tabIndex = this.selected ? 0 : -1;
  }

  get selected(): boolean {
    return this.element.nativeElement.hasAttribute("selected");
  }

  constructor(private element: ElementRef<HTMLElement>) {}

  ngOnInit() {
    if (!this.id) this.id = `howto-tab-generated-${howtoTabCounter++}`;

    this.element.nativeElement.setAttribute("selected", "test del me!");

    // TODO: Do we need this?
    // this._upgradeProperty('selected');
  }

  ngOnChanges(changes: SimpleChanges): void {}
}
