import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-colores',
  templateUrl: './colores.page.html',
  styleUrls: ['./colores.page.scss'],
  standalone: false
})
export class ColoresPage implements OnInit {

  public darumasubi = "../../../assets/imgs/colores/";

  

  constructor() { }

  ngOnInit() {
  }

  imagenes: {url: string, alt: string, color: string, titulo: string, simboliza: string}[] = [ 
    {url: this.darumasubi+'Darumas_azul_2.webp', 
    alt: 'Darumas_azul_2.webp', color: "azuldaruma", titulo: "Azul", simboliza: "Inteligencia y frescura"},
    {url: this.darumasubi+'Darumas_blanco_2.webp', 
    alt: 'Darumas_blanco_2.webp', color: "blancodaruma", titulo: "Blanco", simboliza: "Pureza y paz"},
    {url: this.darumasubi+'Darumas_dorado_2.webp', 
    alt: 'Darumas_dorado_2.webp', color: "doradodaruma", titulo: "Dorado", simboliza: "Riqueza y abundancia"},
    {url: this.darumasubi+'Darumas_lila_2.webp', 
    alt: 'Darumas_lila_2.webp', color: "liladaruma", titulo: "Violeta", simboliza: "Sofisticación, misterio y espiritualidad"},
    {url: this.darumasubi+'Darumas_naranja_2.webp', 
    alt: 'Darumas_naranja_2.webp', color: "naranjadaruma", titulo: "Naranja", simboliza: "Vitalidad y entusiasmo"},
    {url: this.darumasubi+'Darumas_negro_2.webp',
     alt: 'Darumas_negro_2.webp', color: "black", titulo: "Negro", simboliza: "Elegancia y prestigio"},
    {url: this.darumasubi+'Darumas_rojo_2.webp', 
    alt: 'Darumas_rojo_2.webp', color: "rojodaruma", titulo: "Rojo", simboliza: "Pasión y poder"},
    {url: this.darumasubi+'Darumas_rosa_2.webp', 
    alt: 'Darumas_rosa_2.webp', color: "rosadaruma", titulo: "Rosa", simboliza: "Amor y amistad"},
    {url: this.darumasubi+'Darumas_verde_2.webp', 
    alt: 'Darumas_verde_2.webp', color: "verdedaruma", titulo: "Verde", simboliza: "Progreso y bienestar"}
  ];

  slideOpts = {
    pagination: true,
    slidesPerView: 1,
    spaceBetween: 10
  };

}
