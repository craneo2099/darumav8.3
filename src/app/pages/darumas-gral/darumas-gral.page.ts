import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform, AlertController, MenuController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications'; 
import { DarumaService } from 'src/app/providers/daruma-service/daruma.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-darumas-gral',
  templateUrl: './darumas-gral.page.html',
  styleUrls: ['./darumas-gral.page.scss'],
  standalone: false
})
export class DarumasGralPage implements OnInit {
  public userID: number;
  darumas: any[] = [];
  toki: string;
  public loader: any;
  public usuario;
  public noDarumaFlag: boolean = false;
  public darumasIncompletos: boolean = false;

  public url = "./../../../assets/imgs/colores/";

  constructor(
    public router: Router,
    public ds: DarumaService,
    public loadingCtrl: LoadingController,
    private plt: Platform,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController
  ) {
    
  }

async scheduleNotification(){
    if (this.darumasIncompletos == true) {
      const permResult = await LocalNotifications.requestPermissions();
      if (permResult.display === 'granted') {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: 100,
              title: 'Tienes Darumas activos',
              body: '¡Cumple tus propósitos!',
              sound: 'default',
              schedule: {
                repeats: true,
                every: 'day'
              }
            }
          ]
        });
        //console.log('Notificación programada para cada 24 horas');
      } else {
        console.log('Permiso de Notificaciones denegado');
      }
    }
  }

  async verficaNotiYBorra(): Promise<void> {
    try {
      const pending = await LocalNotifications.getPending();
      console.log('Notificaciones pendientes antes de cancelar:', pending.notifications.length);
      if (pending.notifications.length > 0) {
        const ids = pending.notifications.map(n => n.id);
        console.log('IDs a cancelar:', ids);
        await LocalNotifications.cancel({ notifications: ids.map(id => ({ id })) });
        console.log('Notificaciones canceladas');
      }
    } catch (e) {
      console.log('Error al verificar notificaciones:', e);
    }
  }

  async goToDetalle(qrcode, token){
    //peticion de daruma y mandarlo
    this.loader = await this.loadingCtrl.create();
    await this.loader.present();
    let daruma = {
      "daruma" : {"qrcode" : qrcode}
    }

    this.ds.getDarumasDetalle(daruma, token)
    .subscribe(detalle =>{
      detalle["result"].forEach(element => {
        // console.log("detalle1", element);
        let navigationExtras: NavigationExtras = {
          state: {
            daruma: element,
            token: this.toki
          }
        }
        this.router.navigate(['detalle-daruma'],navigationExtras);
      })
    }, error => {
      console.log("Error getDarumasDetalle", error);
    })
  }

  goToScanQr(){
    let navigationExtras: NavigationExtras = {
      state: {
        token: this.toki
      }
    }
    this.router.navigate(['add-daruma-qr'], navigationExtras);
    
  }

  async cargaDarumasLst(){
    this.loader = await this.loadingCtrl.create();
    await this.loader.present();
    this.darumasIncompletos = false;
    this.ds.getDarumas(this.toki).subscribe(daruma =>{
        if (daruma["result"].length == 0) {
          this.noDarumaFlag = true;
        }
        const darumasRaw = daruma["result"];
        //console.log('Darumas crudos:', darumasRaw);
        
        // Ordenar: activos primero (estado 6), luego completados (estado 8)
        // Dentro de cada grupo, más reciente primero
        const activos = darumasRaw.filter(d => d.estado == 6).sort((a, b) => {
          return new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime();
        });
        const completados = darumasRaw.filter(d => d.estado == 8).sort((a, b) => {
          return new Date(b.fechaCompletado).getTime() - new Date(a.fechaCompletado).getTime();
        });
        
        console.log('Activos:', activos.length, 'Completados:', completados.length);
        
        this.darumas = [...activos, ...completados];
        
        if (activos.length > 0) {
          this.darumasIncompletos = true;
          this.scheduleNotification();
        }
      }, error => {
        this.loader.dismiss();
        console.log("Error getDarumas", error);
        this.doAlertErrorCarga("¡Lo sentimos!", "Haz iniciado sesión en otro dispositivo.", 
        "Inicia sesión nuevamente y ¡Cumple tus metas!")
      }, () => {
        this.loader.dismiss();
      })
    // }).catch((e: any) => console.log('Error getToken', e));
  }

  async obtieneUsuario(){
    this.loader = await this.loadingCtrl.create();
    this.ds.getUser().then((user)=>{
      this.usuario = user
      console.log("usuario ", this.usuario);
      
    }).catch((e: any) => console.log('Error getUser', e));
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

  async doAlertErrorCarga(titulo, texto, mensaje) {
    let alert = this.alertCtrl.create({
      header: titulo,
      subHeader: texto,
      message: mensaje,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            //Borra Token y redirige a inicio
            this.ds.borraToken().then((token)=>{
              // console.log("tokenBorrado ");
              this.router.navigate(['inicio-login']);        
            }).catch((e: any) => console.log('Error borraToken', e));
          }
        }
      ]
    });

    (await alert).present();
  }

  async alertOfNotification(){
    await LocalNotifications.addListener('localNotificationReceived', (notification) => {
      this.doAlert(notification.title, "", notification.body);
    });
  }

  verificaToken() {
    //verificar si hay un token para inicio de sesión
    this.ds.getToken().then( (token)=>{
      
      if (token == null) {
        console.log("No Token");
        this.router.navigate(['inicio-login']);
      } else {
        console.log("hayTokenIni: ", token);
        this.toki = token
        this.darumas = [];
        this.menuCtrl.isEnabled().then(res =>{
          // this.verificaToken();
          if (res == false) {
             this.menuCtrl.enable(true)
           }
          this.cargaDarumasLst();
         }).catch((e: any) => console.log('Error menuCtrlDGral', e));
        
      }
    }).catch((e: any) => console.log('Error getToken', e));
  }

  

  goToFormDaruma() {
    this.router.navigate(['formulario-daruma']);
  }

  ionViewWillEnter(){
    this.obtieneUsuario();
    this.noDarumaFlag = false;
    this.darumasIncompletos = false;
    this.verficaNotiYBorra();
  }

  ionViewDidEnter(){
    this.verificaToken();
  }

  async ionViewDidLeave(){
    await this.loader.dismiss();
  }

  toggleMenu(){
    
    this.menuCtrl.toggle();
  }

  ngOnInit() {

  }

}
