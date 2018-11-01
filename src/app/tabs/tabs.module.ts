import { TabsComponent } from "./tabs.component";
import { NgModule, Injector } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PanelComponent } from "./panel.component";
import { createCustomElement } from "@angular/elements";
import { TabComponent } from "./tab.component";

@NgModule({
  imports: [CommonModule],
  declarations: [PanelComponent, TabComponent, TabsComponent],
  entryComponents: [PanelComponent, TabComponent, TabsComponent]
})
export class TabsModule {
  constructor(injector: Injector) {
    customElements.define(
      "demo-panel",
      createCustomElement(PanelComponent, { injector })
    );

    customElements.define(
      "demo-tab",
      createCustomElement(TabComponent, { injector })
    );

    customElements.define(
      "demo-tabs",
      createCustomElement(TabsComponent, { injector })
    );
  }
}
