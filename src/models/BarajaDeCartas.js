import { Carta } from './Carta';
import { BARAJA_CONFIG } from '../utils/constants';

export class BarajaDeCartas {
  constructor() {
    this.nombresCartas = ["as", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jota", "reina", "rey"];
    this.valoresCartas = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    this.palosCartas = ["corazon", "diamante", "trebol", "pica"];
    this.cartas = [];
    this.MIN_CARTAS = BARAJA_CONFIG.minCartas;
    
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.desplazoX = 0;
    this.desplazoY = 0;
    
    // No inicializar automáticamente - solo cuando se llame explícitamente
  }

  // Inicializar la baraja
  iniciar() {
    this.cartas = [];
    
    // Crear todas las cartas
    this.palosCartas.forEach(palo => {
      this.nombresCartas.forEach((nombre, index) => {
        const carta = new Carta(nombre, this.valoresCartas[index], palo);
        this.cartas.push(carta);
      });
    });
    
    // Barajar las cartas
    this.barajar();
  }

  // Barajar las cartas
  barajar() {
    for (let i = this.cartas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cartas[i], this.cartas[j]] = [this.cartas[j], this.cartas[i]];
    }
  }

  // Establecer coordenadas y rotación
  setCoordYRotacionYDesplazo(x, y, rot, desplX, desplY) {
    this.x = x;
    this.y = y;
    this.rotation = rot;
    this.desplazoX = desplX;
    this.desplazoY = desplY;
    
    // Actualizar posición de cada carta
    this.cartas.forEach((carta, index) => {
      carta.setCoordYRotacion(
        x - (index * desplX),
        y + (index * desplY),
        rot
      );
    });
  }

  // Robar una carta
  robarCarta() {
    if (this.cartas.length === 0) {
      return null;
    }
    return this.cartas.shift();
  }


  // Verificar si necesita nueva baraja
  necesitaNuevaBaraja() {
    return this.cartas.length < this.MIN_CARTAS;
  }

  // Obtener número de cartas restantes
  getCartasRestantes() {
    try {
      return this.cartas ? this.cartas.length : 0;
    } catch (error) {
      console.error('Error en getCartasRestantes:', error);
      return 0;
    }
  }

  // Reiniciar la baraja
  reiniciar() {
    this.iniciar();
  }
}
