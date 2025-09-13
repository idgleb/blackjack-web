import { CART_CUBIERTA_PNG } from '../utils/constants';

export class Carta {
  constructor(nombre, valor, palo) {
    this.nombre = nombre;
    this.valor = valor;
    this.palo = palo;
    this.abierta = false;
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
  }

  // Método para verificar si la carta está abierta
  isAbierta() {
    try {
      return this.abierta || false;
    } catch (error) {
      console.error('Error en isAbierta:', error);
      return false;
    }
  }

  // Método para voltear la carta
  voltear() {
    this.abierta = !this.abierta;
  }

  // Método para establecer coordenadas y rotación
  setCoordYRotacion(x, y, rot) {
    this.x = x;
    this.y = y;
    this.rotation = rot;
  }

  // Getters para las coordenadas
  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getRotacion() {
    return this.rotation;
  }

  // Método para obtener el nombre de la imagen de la carta
  getImagenNombre() {
    if (this.abierta) {
      return `${this.palo}${this.nombre}`;
    }
    return CART_CUBIERTA_PNG;
  }

  // Método para obtener el valor ajustado (para el As)
  getValorAjustado(puntosActuales) {
    if (this.valor === 11 && (puntosActuales + this.valor) > 21) {
      return 1;
    }
    return this.valor;
  }
}
