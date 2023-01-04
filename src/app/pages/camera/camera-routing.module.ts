import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { CameraPage } from './camera.page'
import { PDFGenerator } from '@awesome-cordova-plugins/pdf-generator/ngx'

const routes: Routes = [
  {
    path: '',
    component: CameraPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, PDFGenerator],
})
export class CameraPageRoutingModule {}
