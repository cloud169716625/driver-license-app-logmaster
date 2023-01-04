import { Component, OnInit } from '@angular/core'
import jsPDF from 'jspdf'
import { AlertController } from '@ionic/angular'
import { Platform } from '@ionic/angular'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { PhotoService } from '../../services/photo.service'
import { File } from '@ionic-native/file/ngx'
import { FileOpener } from '@ionic-native/file-opener/ngx'
import { Filesystem } from '@capacitor/filesystem'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx'
import { DomSanitizer } from '@angular/platform-browser'
import { HTTP } from '@ionic-native/http/ngx'
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'safe' })
@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {
  userImg: any = ''
  options = {
    documentSize: 'A4',
    type: 'base64',
  }
  fileDirectory = ''
  userId1 = localStorage.getItem('userId')
  driverId = '624f4b56ab4f5170570cdba3'
  userId2 = '321'
  docType1 = 'DRIVER_MEDICAL'
  docType2 = 'DRIVER_TRAINING'
  endpoint = 'https://logmaster-accreditation-dev.herokuapp.com'
  pdfLink: any

  normalNativeUrl = ''
  encodeNativeUrl = ''
  decodeNativeUrl = ''
  downloadDocUrl = ''
  fileData: any

  constructor(
    public platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public photoService: PhotoService,
    public file: File,
    private fileOpener: FileOpener,
    private alertController: AlertController,
    private httpClient: HttpClient,
    private transfer: FileTransfer,
    private sanitizer: DomSanitizer,
    private nativeHTTP: HTTP,
    private domSanitizer: DomSanitizer,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault()
      splashScreen.hide()
    })
    this.fileDirectory = this.file.externalApplicationStorageDirectory
    this.userImg = 'assets/imgs/logo.png'
    console.log('fileDirctory', this.fileDirectory)
  }

  fileTransfer: FileTransferObject = this.transfer.create()

  // open pef function
  fileOpen(url) {
    this.fileOpener
      .open(url, 'application/pdf')
      .then((success) => {
        console.log('File Opened Succesfully' + JSON.stringify(success))
      })
      .catch((error) =>
        console.log('Cannot Open File ' + JSON.stringify(error)),
      )
  }

  // download document from server
  async downloadFile(fileUrl, fileName) {
    let response
    await this.nativeHTTP
      .downloadFile(fileUrl, {}, {}, this.fileDirectory + fileName)
      .then((res) => {
        // prints 200
        console.log('success block...', res)
        response = res
      })
      .catch((err) => {
        // prints 403
        console.log('error block ... ', err.status)
        // prints Permission denied
        console.log('error block ... ', err.error)
      })
    return response
  }

  // check file exited
  async checkFile(url, fileName) {
    let response
    await this.file
      .checkFile(url, fileName)
      .then((success) => {
        response = JSON.stringify(success)
        console.log('PDF file exsit : ' + JSON.stringify(success))
      })
      .catch((error) =>
        console.log('Cannot find Pdf file : ' + JSON.stringify(error)),
      )

    return response
  }

  async openCamera() {
    this.photoService.getPictureFromCamera().then(
      (imgData) => {
        this.userImg = `data:image/jpeg;base64,${imgData}`

        var doc = new jsPDF()
        var width = doc.internal.pageSize.getWidth()
        var height = doc.internal.pageSize.getHeight()
        doc.addImage(this.userImg, 'JPEG', 0, 0, width, height)
        let pdfOutput = doc.output()
        let buffer = new ArrayBuffer(pdfOutput.length)
        let array = new Uint8Array(buffer)
        for (var i = 0; i < pdfOutput.length; i++) {
          array[i] = pdfOutput.charCodeAt(i)
        }

        this.file
          .checkDir(this.fileDirectory, 'temp')
          .then((_) => {
            this.file
              .writeFile(
                this.fileDirectory + 'temp/',
                this.userId1 + '.pdf',
                buffer,
              )
              .then((success) => {
                this.normalNativeUrl = success.nativeURL
                this.fileOpen(success.nativeURL)
                this.pdfLink = this.domSanitizer.bypassSecurityTrustResourceUrl(
                  success.nativeURL,
                )
              })
              .catch((error) =>
                console.log('Cannot Create File ' + JSON.stringify(error)),
              )
              .then(() => {
                this.checkFile(
                  this.fileDirectory + 'temp/',
                  this.userId1 + '.pdf',
                ).then((res) => {
                  console.log('check file', res)
                })
              })
          })
          .catch((error) => {
            this.file.createDir(this.fileDirectory, 'temp', false).then((_) => {
              this.file
                .writeFile(
                  this.fileDirectory + 'temp/',
                  this.userId1 + '.pdf',
                  buffer,
                )
                .then((success) => {
                  console.log(
                    'File created Succesfully' + JSON.stringify(success),
                  )
                  this.normalNativeUrl = success.nativeURL
                  this.fileOpen(success.nativeURL)
                  this.pdfLink = this.domSanitizer.bypassSecurityTrustResourceUrl(
                    success.nativeURL,
                  )
                })
                .catch((error) =>
                  console.log('Cannot Create File ' + JSON.stringify(error)),
                )
                .then(() => {
                  this.checkFile(
                    this.fileDirectory + 'temp/',
                    this.userId1 + '.pdf',
                  ).then((res) => {
                    console.log('check file', res)
                  })
                })
            })
          })
      },
      (error) => {
        console.log('camera error', error)
      },
    )
  }

  async encodePdf() {
    const contents = await Filesystem.readFile({
      path: this.normalNativeUrl,
    })

    console.log('contents------>', contents)

    this.file
      .writeFile(
        this.fileDirectory + 'temp/',
        this.userId1 + 'encode.pdf',
        this.userId1 + contents.data,
      )
      .then((success) => {
        console.log('File created Succesfully' + JSON.stringify(success))
        this.encodeNativeUrl = success.nativeURL
      })
      .catch((error) =>
        console.log('Cannot Create File ' + JSON.stringify(error)),
      )
      .then(() => {
        this.checkFile(
          this.fileDirectory + 'temp/',
          this.userId1 + '.pdf',
        ).then((res) => {
          console.log('check file', res)
        })
      })
  }

  async openEncodePdf() {
    const contents = await Filesystem.readFile({
      path: this.encodeNativeUrl,
    })

    const b64Data = atob(contents.data)
    console.log('b64Data', b64Data)
    if (this.userId1 === b64Data.split('JVBERi0x')[0]) {
      this.photoService
        .base64ToBlob(
          b64Data.slice(this.userId1.length, b64Data.length),
          'application/pdf',
        )
        .then((blob) => {
          this.file
            .writeFile(
              this.fileDirectory + 'temp/',
              `${this.userId1}decode.pdf`,
              typeof blob !== 'undefined' && blob,
            )
            .then((response) => {
              console.log('this is encoded pdf save result', response)
              this.fileOpen((response as any).nativeURL)
            })
            .catch((err) => {
              console.log('this is encoded pdf save result(erroir)', err)
            })
        })
    } else {
      this.alertController
        .create({
          header: 'Notification',
          message: `This isn't your driver license. So you can't see it.`,
          buttons: ['OK'],
        })
        .then((res) => {
          res.present()
        })
    }
  }

  async openErrorPdf() {
    const contents = await Filesystem.readFile({
      path: this.encodeNativeUrl,
    })

    const b64Data = atob(contents.data)
    if (this.userId2 === b64Data.split('JVBERi0x')[0]) {
      this.photoService
        .base64ToBlob(
          b64Data.slice(this.userId2.length, b64Data.length),
          'application/pdf',
        )
        .then((blob) => {
          this.file
            .writeFile(
              this.fileDirectory + 'temp/',
              `${this.userId2}decode.pdf`,
              typeof blob !== 'undefined' && blob,
            )
            .then((response) => {
              console.log('this is encoded pdf save result', response)
              this.fileOpen(response.nativeURL)
            })
            .catch((err) => {
              console.log('this is encoded pdf save result(erroir)', err)
            })
        })
    } else {
      this.alertController
        .create({
          header: 'Notification',
          message: `This isn't your driver license. So you can't see it.`,
          buttons: ['OK'],
        })
        .then((res) => {
          res.present()
        })
    }
  }

  async uploadPDF() {
    const contents = await Filesystem.readFile({
      path: this.normalNativeUrl,
    }) // get base64 data from pdf url

    const data = {
      driverId: this.driverId,
      isBase64: true,
      mimetype: 'application/pdf',
      file: contents.data,
    }

    const fileType = 'DRIVER_MEDICAL'

    this.photoService.UploadDoc(fileType, data).then((res) => {
      console.log('res', res)
      if (res !== undefined) {
        Filesystem.deleteFile({
          path: this.normalNativeUrl,
        })
      }
    })
  }

  async driverMedicalDownload() {
    var headers = new HttpHeaders()
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token'),
    )
    headers = headers.set('Content-Type', 'application/json')

    await this.httpClient
      .get(
        `${this.endpoint}/user-document/admin/driver/${this.driverId}/documentType/${this.docType1}`,
        { headers: headers },
      )
      .subscribe(
        (data) => {
          this.downloadFile(
            (data as any).data[0].document,
            'download-driver-medical.pdf',
          ).then((response) => {
            this.fileOpen((response as any).nativeURL)
          })

          this.pdfLink = this.sanitizer.bypassSecurityTrustResourceUrl(
            'http://docs.google.com/gview?embedded=true&url=' +
              (data as any).data[0].document,
          )
        },
        (error) => {
          console.log('Response error----->', error['message'])
        },
      )
  }

  async driverTrainDownload() {
    var headers = new HttpHeaders()
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token'),
    )
    headers = headers.set('Content-Type', 'application/json')

    await this.httpClient
      .get(
        `${this.endpoint}/user-document/admin/driver/${this.driverId}/documentType/${this.docType2}`,
        { headers: headers },
      )
      .subscribe(
        (data) => {
          this.downloadFile(
            (data as any).data[0].document,
            'download-driver-train.pdf',
          ).then((response) => {
            this.fileOpen((response as any).nativeURL)
          })

          this.pdfLink = this.sanitizer.bypassSecurityTrustResourceUrl(
            'http://docs.google.com/gview?embedded=true&url=' +
              (data as any).data[0].document,
          )
        },
        (error) => {
          console.log('Response error----->', error['message'])
        },
      )
  }

  ngOnInit() {}
}
