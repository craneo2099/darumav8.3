import { Component, OnInit } from '@angular/core';

interface Carta {
  id: number;
  imagen: string;
  color: string;
  revelada: boolean;
  encontrada: boolean;
}

@Component({
  selector: 'app-juega',
  templateUrl: './juega.page.html',
  styleUrls: ['./juega.page.scss'],
  standalone: false
})
export class JuegaPage implements OnInit {

  public rutaImagenes = "../../../assets/imgs/colores/";
  
  cartas: Carta[] = [];
  primeraCarta: Carta | null = null;
  segundaCarta: Carta | null = null;
  bloqueado: boolean = false;
  movimientos: number = 0;
  parejasEncontradas: number = 0;
  juegoCompletado: boolean = false;

  darumas = [
    { imagen: 'Darumas_rojo_1.webp', color: 'rojodaruma' },
    { imagen: 'Darumas_azul_1.webp', color: 'azuldaruma' },
    { imagen: 'Darumas_verde_1.webp', color: 'verdedaruma' }
  ];

  constructor() { }

  ngOnInit() {
    this.iniciarJuego();
  }

  iniciarJuego() {
    const cartasDuplicadas: Carta[] = [];
    let id = 0;

    this.darumas.forEach(daruma => {
      cartasDuplicadas.push({
        id: id++,
        imagen: daruma.imagen,
        color: daruma.color,
        revelada: false,
        encontrada: false
      });
      cartasDuplicadas.push({
        id: id++,
        imagen: daruma.imagen,
        color: daruma.color,
        revelada: false,
        encontrada: false
      });
    });

    this.cartas = this.mezclar(cartasDuplicadas);
    this.movimientos = 0;
    this.parejasEncontradas = 0;
    this.juegoCompletado = false;
    this.primeraCarta = null;
    this.segundaCarta = null;
    this.bloqueado = false;
  }

  mezclar(array: Carta[]): Carta[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  voltearCarta(carta: Carta) {
    if (this.bloqueado || carta.encontrada || carta.revelada) {
      return;
    }

    carta.revelada = true;

    if (!this.primeraCarta) {
      this.primeraCarta = carta;
    } else {
      this.segundaCarta = carta;
      this.movimientos++;
      this.bloqueado = true;
      this.verificarPareja();
    }
  }

  verificarPareja() {
    if (this.primeraCarta && this.segundaCarta) {
      if (this.primeraCarta.imagen === this.segundaCarta.imagen) {
        this.primeraCarta.encontrada = true;
        this.segundaCarta.encontrada = true;
        this.parejasEncontradas++;
        
        if (this.parejasEncontradas === 3) {
          this.juegoCompletado = true;
        }

        this.resetCartas();
      } else {
        setTimeout(() => {
          this.primeraCarta!.revelada = false;
          this.segundaCarta!.revelada = false;
          this.resetCartas();
        }, 1000);
      }
    }
  }

  resetCartas() {
    this.primeraCarta = null;
    this.segundaCarta = null;
    this.bloqueado = false;
  }
}
