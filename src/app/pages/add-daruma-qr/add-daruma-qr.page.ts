import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { DarumaService } from 'src/app/providers/daruma-service/daruma.service';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerOptions, CapacitorBarcodeScannerTypeHintALLOption } from '@capacitor/barcode-scanner';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-add-daruma-qr',
  templateUrl: './add-daruma-qr.page.html',
  styleUrls: ['./add-daruma-qr.page.scss'],
  standalone: false
})
export class AddDarumaQrPage implements OnInit {
  public loader: any;
  public toki: any;
  public data: any;

  constructor(
    public router: Router,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public route: ActivatedRoute,
    public ds: DarumaService
  ) { 
    this.route.queryParams.subscribe(params => {
      this.data = this.router.getCurrentNavigation().extras.state;
      this.toki = this.data?.token;
    });
  }

  ionViewWillEnter(){
    this.scanQR();
  }

  async scanQR() {
    try {
      const options: CapacitorBarcodeScannerOptions = {
        hint: CapacitorBarcodeScannerTypeHintALLOption.ALL
      };
      
      const result = await CapacitorBarcodeScanner.scanBarcode(options);
      
      if (result && result.ScanResult) {
        const barcodeData = result.ScanResult;
        
        this.ds.isQrCodeRegistrado(barcodeData, this.toki)
        .subscribe(res => {
          if(res["result"] == true){
            let mensaje = "Codigo Aceptado"
            this.ds.isQrCodeAsignado(barcodeData, this.toki)
            .subscribe(res2 => {
              if(res2["result"] == false){
                let nuevoDaruma = {
                  "qrCode": barcodeData,
                  "token": this.toki,
                  "color": res2["message"]
                }
                this.storage.set("newDAruma", nuevoDaruma)
                this.presentToast(mensaje);
                this.goToFormDaruma();
              }else{
                let titulo = "¡Error!"
                let texto = "El codigo ya ha sido usado"
                this.doAlert("¡Atención!",texto, "")
                this.goToDarumasGral();
              }
            }, error => {
              console.log("Error isQrCodeAsignado",error);
            })
          }else{
            let titulo = "¡Error!"
            let texto = "El codigo es incorrecto"
            this.doAlert("¡Atención!",texto, "")
            this.goToDarumasGral();
          }
        }, error => {
          console.log("Error isQrCodeRegistrado",error);
        })
      } else {
        this.goToDarumasGral();
      }
    } catch(err) {
      console.log('Error scanner', err);
      this.doAlert("¡Error!", "No se pudo escanear el código QR", "");
      this.goToDarumasGral();
    }
  }

  ngOnInit() {
  }

  async doAlert(titulo, sub, mensaje) {
    let alert = await this.alertCtrl.create({
      header: titulo,
      subHeader: sub,
      message: mensaje,
      backdropDismiss: false,
      buttons: ['Ok']
    });
    await alert.present();
  }

  async presentToast(text:string) {
    let toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });

    await toast.present();
  }

  goToFormDaruma() {
    this.router.navigate(['formulario-daruma']);
  }

  goToDarumasGral() {
    this.router.navigate(['darumas-gral']);
  }
}
