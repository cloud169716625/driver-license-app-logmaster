import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { CameraPageRoutingModule } from './camera-routing.module'

import { CameraPage } from './camera.page'
import { Camera } from '@ionic-native/camera/ngx'
import { Platform } from '@ionic/angular'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { File } from '@ionic-native/file/ngx'
import { FileOpener } from '@ionic-native/file-opener/ngx'
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx'
import { FileTransfer } from '@ionic-native/file-transfer/ngx'
import { HTTP } from '@ionic-native/http/ngx'

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CameraPageRoutingModule],
  providers: [
    Camera,
    Platform,
    File,
    FileOpener,
    StatusBar,
    SplashScreen,
    FilePath,
    FileTransfer,
    HTTP,
  ],
  declarations: [CameraPage],
})
export class CameraPageModule {}
