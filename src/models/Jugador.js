import { DEFAULT_BALANCE } from '../utils/constants';
import { t } from '../utils/translations';

export class Jugador {
  constructor(nombre, isCrupier = false) {
    this.nombre = nombre;
    this.isCrupier = isCrupier;
    this.MIN_PUNTOS_PARA_DOBLAR = 10;
    this.MAX_PUNTOS_PARA_DOBLAR = 15;
    this.APUESTO_MIN = 100;
    this.APUESTO_MAX = 2000;
    this.balanceJugador = isCrupier ? 0 : DEFAULT_BALANCE;
    this.apuestoJugador = 0;
    this.cartasQueTiene = [];
  }

  // Método para agregar apuesta
  addApuesto(apuestoQuierePonel) {
    if (apuestoQuierePonel <= 0) {
      return "La apuesta no puede ser menor o igual que 0";
    }
    if (apuestoQuierePonel > this.balanceJugador) {
      return "No hay suficiente dinero";
    }
    if ((this.apuestoJugador + apuestoQuierePonel) > this.APUESTO_MAX) {
      return `${t('apuestaMaxima')} $${this.APUESTO_MAX}`;
    }
    this.balanceJugador -= apuestoQuierePonel;
    this.apuestoJugador += apuestoQuierePonel;
    return "true";
  }

  // Método para agregar carta
  agregarCarta(carta) {
    // Solo agregar si no está ya en el array (para evitar duplicados)
    if (!this.cartasQueTiene.includes(carta)) {
      this.cartasQueTiene.push(carta);
    }
  }

  // Método para calcular coordenadas de la próxima carta
  getXYProximaCarta(indice, anchoCarta) {
    let coordX, coordY;
    
    if (!this.isCrupier) {
      // Posición para el jugador (abajo) - 30% de la altura de la pantalla
      coordX = window.innerWidth * 0.20 + (indice * anchoCarta * 0.4);
      coordY = window.innerHeight * 0.6 - (indice * 30);
    } else {
      // Posición para el crupier (arriba)
      if (indice === 0) {
        coordX = window.innerWidth * 0.25;
      } else {
        coordX = window.innerWidth * 0.25 + (indice * anchoCarta * 0.4);
      }
      coordY = 100;
    }
    
    return { x: coordX, y: coordY };
  }

  // Método para sumar puntos
  sumaPuntos() {
    try {
      let puntos = 0;
      let ases = 0;
      
      // Verificar que haya cartas
      if (!this.cartasQueTiene || this.cartasQueTiene.length === 0) {
        return 0;
      }
      
      // Primero sumamos todo excepto los ases
      for (let carta of this.cartasQueTiene) {
        if (carta && carta.valor) {
          if (carta.valor === 11) {
            ases++;
          } else {
            puntos += carta.valor;
          }
        }
      }
      
      // Ahora agregamos los ases
      for (let i = 0; i < ases; i++) {
        if (puntos + 11 <= 21) {
          puntos += 11;
        } else {
          puntos += 1;
        }
      }
      
      return puntos;
    } catch (error) {
      console.error('Error en sumaPuntos:', error);
      return 0;
    }
  }

  // Método para limpiar las cartas
  limpiarCartas() {
    this.cartasQueTiene = [];
  }

  // Método para verificar si puede doblar
  puedeDoblar() {
    try {
      return this.cartasQueTiene && 
             this.cartasQueTiene.length === 2 && 
             this.sumaPuntos() >= this.MIN_PUNTOS_PARA_DOBLAR &&
             this.sumaPuntos() <= this.MAX_PUNTOS_PARA_DOBLAR &&
             this.balanceJugador >= this.apuestoJugador;
    } catch (error) {
      console.error('Error en puedeDoblar:', error);
      return false;
    }
  }

  // Método para verificar blackjack
  tieneBlackjack() {
    try {
      return this.cartasQueTiene && 
             this.cartasQueTiene.length === 2 && 
             this.sumaPuntos() === 21;
    } catch (error) {
      console.error('Error en tieneBlackjack:', error);
      return false;
    }
  }
}
