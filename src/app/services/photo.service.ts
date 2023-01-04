import { Injectable } from '@angular/core'
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor(private camera: Camera, private httpClient: HttpClient) {}

  cameraOptions: CameraOptions = {
    quality: 20,
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
  }

  public async getPictureFromCamera() {
    const capturedPhoto = await this.camera.getPicture(this.cameraOptions)

    return capturedPhoto
  }

  public async base64ToBlob(b64Data, contentType) {
    const base64Response = await fetch(`data:${contentType};base64,${b64Data}`)
    const blob = await base64Response.blob()
    return blob
  }

  public async base64ToBinaryData(b64Data) {
    // console.log('get basse64  data', b64Data)
    // var binary_string = atob(b64Data)
    // var len = binary_string.length
    // var bytes = new Uint8Array(len)
    // for (var i = 0; i < len; i++) {
    //   bytes[i] = binary_string.charCodeAt(i)
    // }
    // return bytes.buffer

    var byteCharacters = atob(b64Data)
    var len = byteCharacters.length
    var bytes = new Uint8Array(len)
    for (var i = 0; i < len; i++) {
      bytes[i] = byteCharacters.charCodeAt(i)
    }
    return bytes
  }

  public async UploadDoc(fileType, data) {
    var headers = new HttpHeaders()
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token'),
    )
    headers = headers.set('Content-Type', 'application/json')
    console.log('token', localStorage.getItem('token'))

    return await this.httpClient
      .post(
        `https://logmaster-accreditation-dev.herokuapp.com/user-document/driver/upload/${fileType}`,
        data,
        { headers: headers },
      )
      .subscribe(
        (data) => {
          console.log('download file to sserver result', data)
          return data
        },
        (error) => {
          console.log('Response error----->', error['message'])
        },
      )
  }

  public async driverDocDownload(driverId, docType) {
    var headers = new HttpHeaders()
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token'),
    )
    headers = headers.set('Content-Type', 'multipart/form-data')

    return await this.httpClient
      .get(
        `https://logmaster-accreditation-dev.herokuapp.com/user-document/admin/driver/${driverId}/documentType/${docType}`,
        { headers: headers },
      )
      .subscribe(
        (data) => {
          console.log('upload file to sserver result', data)
          return data
        },
        (error) => {
          console.log('Response error----->', error['message'])
        },
      )
  }
}
