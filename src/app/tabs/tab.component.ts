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

  _selected: boolean;

  @Input()
  set selected(value: boolean) {
    this._selected = value;
    // Idea: Would be cool to expose a method as an element's method
    // e. g. select()

    this.ariaSelected = "" + this.selected;
    this.tabIndex = this.selected ? 0 : -1;
  }

  get selected(): boolean {
    return this._selected;
  }

  constructor(private element: ElementRef<HTMLElement>) {}

  ngOnInit() {
    if (!this.id) this.id = `howto-tab-generated-${howtoTabCounter++}`;


    // TODO: Do we need this?
    // this._upgradeProperty('selected');
  }

  ngOnChanges(changes: SimpleChanges): void {}
}
