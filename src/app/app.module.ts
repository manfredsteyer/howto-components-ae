import { BrowserModule } from "@angular/platform-browser";
import { NgModule, DoBootstrap } from "@angular/core";

import { TabsModule } from "./tabs/tabs.module";

@NgModule({
  imports: [BrowserModule, TabsModule],
  declarations: [],
  providers: [],
  bootstrap: []
})
export class AppModule implements DoBootstrap {
  ngDoBootstrap() {}
}
