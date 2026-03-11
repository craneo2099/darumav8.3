import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DarumaService } from 'src/app/providers/daruma-service/daruma.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false
})
export class MenuComponent implements OnInit {
  public rootPage: any;
  public pages: Array<{titulo: string, color: string,
    componente: any, icon: string}>;
  public selectedPath = '';
  
  constructor(public router: Router,
    public ds: DarumaService  
  ) { 
    
    this.pages = [
        {titulo: "Mis Darumas", color: "azul", componente: '/darumas-gral', icon: "home"},
        {titulo: 'Agregar Daruma', color: "azul", componente: '/add-daruma-qr', icon: 'qr-code-outline'},
        {titulo: 'Acerca de', color: "azul", componente: '/acerca', icon: 'information-circle'},
        {titulo: "Ajustes", color: "azul", componente: '/ajustes', icon: "settings"},
        {titulo: "Los Colores", color: "naranjadaruma", componente: '/colores', icon: "color-palette-outline"},
        // {titulo: "Juega", color: "azul", componente: '/juega', icon: "game-controller-outline"},
        {titulo: "Salir", color: "rosados", componente: '', icon: "log-out"}
    ]    
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event: any): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.selectedPath = event.url;
    });
  }

  siSale(titulo) {
    //Al salir borra Token
    if (titulo == "Salir") {
      this.ds.borraToken().then((token)=>{
        console.log("tokenBorrado ");
        this.router.navigate(['inicio-login']);     
      }).catch((e: any) => console.log('Error borraToken', e));      
    }
  }
}
