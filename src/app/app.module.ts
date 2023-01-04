import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouteReuseStrategy } from '@angular/router'

import { IonicModule, IonicRouteStrategy } from '@ionic/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { Camera } from '@ionic-native/camera/ngx'
import { HttpClientModule } from '@angular/common/http'
import { Base64 } from '@ionic-native/base64/ngx'
import { Device } from '@awesome-cordova-plugins/device/ngx'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    Base64,
    Device,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
