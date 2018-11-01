import {
  Component,
  OnInit,
  HostBinding,
  ViewEncapsulation
} from "@angular/core";

let howtoPanelCounter = 0;

@Component({
  template: "<slot></slot>",
  encapsulation: ViewEncapsulation.ShadowDom
})
export class PanelComponent implements OnInit {
  @HostBinding("id")
  id: string;

  @HostBinding("attr.role")
  role: string;

  constructor() {}

  ngOnInit() {
    this.role = "tabpanel";

    if (!this.id) {
      this.id = `howto-panel-generated-${howtoPanelCounter++}`;
    }
  }
}
