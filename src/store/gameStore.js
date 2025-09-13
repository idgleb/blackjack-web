import { create } from 'zustand';
import { BarajaDeCartas } from '../models/BarajaDeCartas';
import { Jugador } from '../models/Jugador';
import { Carta } from '../models/Carta';
import soundManager from '../utils/soundManager';

// Función para cargar estado desde localStorage
const cargarEstadoInicial = () => {
  try {
    const estadoGuardado = localStorage.getItem('blackjack-game-state');
    if (estadoGuardado) {
      const estado = JSON.parse(estadoGuardado);
      console.log('Cargando estado:', { cartasRestantes: estado.cartasRestantes?.length || 0 });
      
      // Recrear jugador con el balance, apuesto y cartas guardados
      const jugador = new Jugador("Jugador", false);
      jugador.balanceJugador = estado.balanceJugador || 3000;
      jugador.apuestoJugador = estado.apuestoJugador || 0;
      
      // Restaurar cartas del jugador si existen
      if (estado.cartasJugador && Array.isArray(estado.cartasJugador)) {
        jugador.cartasQueTiene = estado.cartasJugador.map(cartaData => {
          // Crear nueva instancia de Carta con los datos guardados
          const carta = new Carta(cartaData.nombre, cartaData.valor, cartaData.palo);
          carta.abierta = cartaData.abierta;
          carta.x = cartaData.x || 0;
          carta.y = cartaData.y || 0;
          carta.rotation = cartaData.rotation || 0;
          return carta;
        });
      }
      
      // Recrear crupier con cartas guardadas
      const crupier = new Jugador("Crupier", true);
      if (estado.cartasCrupier && Array.isArray(estado.cartasCrupier)) {
        crupier.cartasQueTiene = estado.cartasCrupier.map(cartaData => {
          // Crear nueva instancia de Carta con los datos guardados
          const carta = new Carta(cartaData.nombre, cartaData.valor, cartaData.palo);
          carta.abierta = cartaData.abierta;
          carta.x = cartaData.x || 0;
          carta.y = cartaData.y || 0;
          carta.rotation = cartaData.rotation || 0;
          return carta;
        });
      }
      
      // Recrear baraja con cartas restantes
      const baraja = new BarajaDeCartas();
      if (estado.cartasRestantes && Array.isArray(estado.cartasRestantes)) {
        baraja.cartas = estado.cartasRestantes.map(cartaData => {
          // Crear nueva instancia de Carta con los datos guardados
          const carta = new Carta(cartaData.nombre, cartaData.valor, cartaData.palo);
          carta.abierta = cartaData.abierta;
          carta.x = cartaData.x || 0;
          carta.y = cartaData.y || 0;
          carta.rotation = cartaData.rotation || 0;
          return carta;
        });
      }
      // No inicializar la baraja aquí - mantener el estado actual
      
      return {
        jugador,
        crupier,
        baraja,
        fichasEnApuesta: estado.fichasEnApuesta || [],
        mensaje: estado.mensaje || "",
        colorMensaje: estado.colorMensaje || "",
        isJuegoActivo: estado.isJuegoActivo || false,
        isTurnoCrupier: estado.isTurnoCrupier || false,
        isRepartirPrincipal: estado.isRepartirPrincipal || false
      };
    }
  } catch (error) {
    console.warn('Error al cargar estado guardado:', error);
  }
  
  // Si no hay estado guardado o hay error, usar valores por defecto
  const barajaInicial = new BarajaDeCartas();
  barajaInicial.iniciar(); // Inicializar solo para el estado por defecto
  
  return {
    jugador: new Jugador("Jugador", false),
    crupier: new Jugador("Crupier", true),
    baraja: barajaInicial,
    fichasEnApuesta: [],
    mensaje: "",
    colorMensaje: "",
    isJuegoActivo: false,
    isTurnoCrupier: false,
    isRepartirPrincipal: false
  };
};

// Cargar estado inicial
const estadoInicial = cargarEstadoInicial();

const useGameStore = create((set, get) => ({
  // Estado del juego
  jugador1: estadoInicial.jugador,
  crupier: estadoInicial.crupier,
  baraja: estadoInicial.baraja,
  
  // Estado de las fichas
  fichasEnApuesta: estadoInicial.fichasEnApuesta,
  
  // Flags del juego
  isMas: false,
  isTurnoCrupier: estadoInicial.isTurnoCrupier,
  isRepartirPrincipal: estadoInicial.isRepartirPrincipal,
  isDoblar: false,
  isJuegoActivo: estadoInicial.isJuegoActivo,
  
  // Mensaje y resultado
  mensaje: estadoInicial.mensaje,
  colorMensaje: estadoInicial.colorMensaje,
  
  // Función para guardar estado en localStorage
  guardarEstado: () => {
    try {
      const { jugador1, crupier, baraja, fichasEnApuesta, mensaje, colorMensaje, isJuegoActivo, isTurnoCrupier, isRepartirPrincipal } = get();
      const estado = {
        balanceJugador: jugador1?.balanceJugador || 3000,
        apuestoJugador: jugador1?.apuestoJugador || 0,
        cartasJugador: jugador1?.cartasQueTiene || [],
        cartasCrupier: crupier?.cartasQueTiene || [],
        cartasRestantes: baraja?.cartas || [],
        fichasEnApuesta: fichasEnApuesta || [],
        mensaje: mensaje || "",
        colorMensaje: colorMensaje || "",
        isJuegoActivo: isJuegoActivo || false,
        isTurnoCrupier: isTurnoCrupier || false,
        isRepartirPrincipal: isRepartirPrincipal || false
      };
      console.log('Guardando estado:', { cartasRestantes: estado.cartasRestantes.length });
      localStorage.setItem('blackjack-game-state', JSON.stringify(estado));
    } catch (error) {
      console.warn('Error al guardar estado:', error);
    }
  },

  // Acciones del juego
  iniciarJuego: () => {
    try {
      // No reiniciar la baraja - mantener su estado actual
      set({ isJuegoActivo: true });
    } catch (error) {
      console.error('Error al iniciar juego:', error);
    }
  },
  
  // Agregar apuesta
  agregarApuesta: (cantidad, tipo) => {
    const { jugador1, fichasEnApuesta } = get();
    const resultado = jugador1.addApuesto(cantidad);
    
    if (resultado === "true") {
      set({ 
        fichasEnApuesta: [...fichasEnApuesta, { cantidad, tipo }],
        jugador1: jugador1
      });
      get().guardarEstado();
      return true;
    } else {
      // Mostrar mensaje de error
      set({ 
        mensaje: resultado,
        colorMensaje: "#710001" // colorPierdes
      });
      // Limpiar mensaje después de 2 segundos
      setTimeout(() => {
        set({ mensaje: "", colorMensaje: "" });
      }, 2000);
    }
    return resultado;
  },
  
  // Quitar última ficha
  quitarUltimaFicha: () => {
    const { jugador1, fichasEnApuesta } = get();
    if (fichasEnApuesta.length > 0) {
      const ultimaFicha = fichasEnApuesta[fichasEnApuesta.length - 1];
      jugador1.balanceJugador += ultimaFicha.cantidad;
      jugador1.apuestoJugador -= ultimaFicha.cantidad;
      
      set({ 
        fichasEnApuesta: fichasEnApuesta.slice(0, -1),
        jugador1: jugador1 // Mantener la instancia
      });
      get().guardarEstado();
    }
  },
  
  // Quitar todas las fichas
  quitarTodasLasFichas: () => {
    const { jugador1 } = get();
    jugador1.balanceJugador += jugador1.apuestoJugador;
    jugador1.apuestoJugador = 0;
    
    set({ 
      fichasEnApuesta: [],
      jugador1: jugador1
    });
    get().guardarEstado();
  },
  
  // Repartir cartas
  repartirCartas: async () => {
    const { jugador1, crupier, baraja } = get();
    set({ isRepartirPrincipal: true });
    get().guardarEstado();
    
    const jugadores = [jugador1, crupier];
    const cantidadCartasPorJugador = 2;
    
    // Repartir cartas una por una con delay
    for (let i = 0; i < cantidadCartasPorJugador; i++) {
      for (let jugador of jugadores) {
        const carta = baraja.robarCarta();
        if (carta) {
          // Voltear la carta excepto la segunda del crupier
          // Verificamos el length ANTES de agregar la carta
          const esSegundaCartaCrupier = jugador.isCrupier && jugador.cartasQueTiene.length === 1;
          
          if (!esSegundaCartaCrupier) {
            carta.voltear();
          }
          
          // Agregar carta al jugador
          jugador.agregarCarta(carta);
          
          // Actualizar estado para mostrar la carta
    set({ 
      jugador1: jugador1,
      crupier: crupier
    });
    get().guardarEstado();
          
          // Esperar antes de repartir la siguiente carta (400ms animación + 100ms extra)
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }
    
    set({ 
      jugador1: jugador1,
      crupier: crupier,
      isRepartirPrincipal: false
    });
    get().guardarEstado();
    
    // Verificar blackjack
    return get().verificarBlackjack();
  },
  
  // Pedir carta
  pedirCarta: async () => {
    const { jugador1, baraja } = get();
    set({ isMas: true });
    get().guardarEstado();
    
    const carta = baraja.robarCarta();
    if (carta) {
      jugador1.agregarCarta(carta);
      carta.voltear();
      
      set({ 
        jugador1: jugador1
      });
      
      // Esperar para la animación de la carta
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ isMas: false });
      get().guardarEstado();
      
      // Verificar si se pasó de 21
      if (jugador1.sumaPuntos() > 21) {
        get().finalizarJuego(0, `Pierdes -$${jugador1.apuestoJugador}`);
        return false;
      } else if (jugador1.sumaPuntos() === 21) {
        get().turnoCrupier();
        return false;
      }
    }
    return true;
  },
  
  // Plantarse
  plantarse: () => {
    get().turnoCrupier();
  },
  
  // Doblar apuesta
  doblar: async () => {
    const { jugador1, baraja } = get();
    const resultado = jugador1.addApuesto(jugador1.apuestoJugador);
    
    if (resultado === "true") {
      set({ isDoblar: true });
      
      // Duplicar las fichas visualmente
      const { fichasEnApuesta } = get();
      set({ fichasEnApuesta: [...fichasEnApuesta, ...fichasEnApuesta] });
      
      // Pedir una carta
      const carta = baraja.robarCarta();
      if (carta) {
        jugador1.agregarCarta(carta);
        carta.voltear();
        
        set({ 
          jugador1: jugador1
        });
        
        // Esperar para la animación
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set({ isDoblar: false });
        
        if (jugador1.sumaPuntos() > 21) {
          get().finalizarJuego(0, `Pierdes -$${jugador1.apuestoJugador}`);
        } else {
          get().turnoCrupier();
        }
      }
      return true;
    }
    return resultado;
  },
  
  // Turno del crupier
  turnoCrupier: async () => {
    const { crupier, jugador1, baraja } = get();
    set({ isTurnoCrupier: true });
    get().guardarEstado();
    
    // Voltear la carta oculta del crupier
    if (crupier.cartasQueTiene.length >= 2 && !crupier.cartasQueTiene[1].isAbierta()) {
      crupier.cartasQueTiene[1].voltear();
      set({ crupier: crupier });
      get().guardarEstado();
      
      // Esperar para ver la animación de voltear
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    // El crupier pide cartas hasta llegar a 17
    while (crupier.sumaPuntos() < 17) {
      const carta = baraja.robarCarta();
      if (carta) {
        crupier.agregarCarta(carta);
        carta.voltear();
        set({ crupier: crupier });
        get().guardarEstado();
        
        // Esperar un poco entre cartas para la animación (500ms para coincidir con el repartir)
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    }
    
    // Determinar el ganador
    const puntosCrupier = crupier.sumaPuntos();
    const puntosJugador = jugador1.sumaPuntos();
    
    if (puntosCrupier > 21) {
      get().finalizarJuego(2, `Ganas +$${jugador1.apuestoJugador * 2}`);
    } else if (puntosCrupier > puntosJugador) {
      get().finalizarJuego(0, `Pierdes -$${jugador1.apuestoJugador}`);
    } else if (puntosCrupier === puntosJugador) {
      get().finalizarJuego(1, "Empate");
    } else {
      get().finalizarJuego(2, `Ganas +$${jugador1.apuestoJugador * 2}`);
    }
  },
  
  // Verificar blackjack
  verificarBlackjack: () => {
    const { jugador1, crupier } = get();
    
    if (jugador1.tieneBlackjack() && crupier.tieneBlackjack()) {
      get().finalizarJuego(1, "Empate");
      return true;
    } else if (jugador1.tieneBlackjack()) {
      get().finalizarJuego(2.5, `BlackJack! Ganas +$${jugador1.apuestoJugador * 2.5}`);
      return true;
    }
    return false;
  },
  
  // Finalizar juego
  finalizarJuego: async (coeficiente, mensaje) => {
    const { jugador1, crupier } = get();
    
    // Voltear la carta oculta del crupier si aún no está volteada
    if (crupier.cartasQueTiene.length >= 2 && !crupier.cartasQueTiene[1].isAbierta()) {
      crupier.cartasQueTiene[1].voltear();
      set({ crupier: crupier });
      
      // Esperar un momento para ver la animación antes de mostrar el resultado
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Actualizar balance
    jugador1.balanceJugador += jugador1.apuestoJugador * coeficiente;
    
    // Reproducir sonido del resultado
    if (!soundManager.initialized) soundManager.init();
    soundManager.playResultado(coeficiente);
    
    // Mostrar mensaje con colores del proyecto Kotlin
    let color = "";
    if (coeficiente < 1) color = "#710001"; // colorPierdes
    else if (coeficiente > 1) color = "#007100"; // colorGanas  
    else color = "#002f40"; // colorEmpate
    
    set({ 
      mensaje,
      colorMensaje: color,
      jugador1: jugador1
    });
    get().guardarEstado();
    
    // Limpiar después de un delay
    setTimeout(() => {
      get().prepararNuevaRonda();
      
      // Si el jugador se quedó sin dinero, mostrar mensaje adicional
      const { jugador1 } = get();
      if (jugador1.balanceJugador < jugador1.APUESTO_MIN) {
        set({ 
          mensaje: "¡Te quedaste sin dinero!", 
          colorMensaje: "#710001" // colorPierdes
        });
      }
    }, 3000);
  },
  
  // Preparar nueva ronda
  prepararNuevaRonda: () => {
    const { jugador1, crupier, baraja } = get();
    
    jugador1.apuestoJugador = 0;
    jugador1.limpiarCartas();
    crupier.limpiarCartas();
    
    // Verificar si necesita nueva baraja
    if (baraja.necesitaNuevaBaraja()) {
      baraja.reiniciar();
      if (!soundManager.initialized) soundManager.init();
      soundManager.playNuevaBaraja();
      set({ mensaje: "Nueva baraja!", colorMensaje: "#431500" }); // colorComun
      get().guardarEstado(); // Guardar después de reiniciar la baraja
    }
    
    // Si el jugador se quedó sin dinero, no limpiar el mensaje inmediatamente
    const nuevoMensaje = jugador1.balanceJugador < jugador1.APUESTO_MIN ? get().mensaje : "";
    const nuevoColorMensaje = jugador1.balanceJugador < jugador1.APUESTO_MIN ? get().colorMensaje : "";
    
    set({
      jugador1: jugador1,
      crupier: crupier,
      fichasEnApuesta: [],
      isMas: false,
      isTurnoCrupier: false,
      isRepartirPrincipal: false,
      isDoblar: false,
      mensaje: nuevoMensaje,
      colorMensaje: nuevoColorMensaje
    });
    get().guardarEstado();
  },
  
  // Reiniciar juego completo (incluyendo baraja)
  reiniciarJuegoCompleto: () => {
    // Limpiar las instancias actuales antes de crear nuevas
    const { jugador1: jugadorActual, crupier: crupierActual } = get();
    if (jugadorActual) jugadorActual.limpiarCartas();
    if (crupierActual) crupierActual.limpiarCartas();
    
    // Crear nuevas instancias manteniendo las referencias de clase
    const nuevoJugador = new Jugador("Jugador", false);
    const nuevoCrupier = new Jugador("Crupier", true);
    const nuevaBaraja = new BarajaDeCartas();
    nuevaBaraja.iniciar(); // Asegurar que la baraja esté completa
    
    // Asegurar que el balance se restaure
    nuevoJugador.balanceJugador = 3000;
    nuevoJugador.apuestoJugador = 0;
    nuevoJugador.cartasQueTiene = [];
    
    nuevoCrupier.apuestoJugador = 0;
    nuevoCrupier.cartasQueTiene = [];
    
    // Limpiar localStorage completamente
    localStorage.removeItem('balance');
    localStorage.removeItem('blackjack-game-state');
    
    set({
      jugador1: nuevoJugador,
      crupier: nuevoCrupier,
      baraja: nuevaBaraja,
      fichasEnApuesta: [],
      isMas: false,
      isTurnoCrupier: false,
      isRepartirPrincipal: false,
      isDoblar: false,
      isJuegoActivo: true,
      mensaje: "¡Juego reiniciado! Balance: $3000",
      colorMensaje: "#007100" // colorGanas
    });
    get().guardarEstado();
    
    // Limpiar el mensaje después de un tiempo
    setTimeout(() => {
      set({ mensaje: "", colorMensaje: "" });
    }, 2000);
  },

  // Reiniciar solo la ronda actual (mantener baraja)
  reiniciarJuego: () => {
    // Limpiar las instancias actuales antes de crear nuevas
    const { jugador1: jugadorActual, crupier: crupierActual, baraja: barajaActual } = get();
    if (jugadorActual) jugadorActual.limpiarCartas();
    if (crupierActual) crupierActual.limpiarCartas();
    
    // Crear nuevas instancias manteniendo las referencias de clase
    const nuevoJugador = new Jugador("Jugador", false);
    const nuevoCrupier = new Jugador("Crupier", true);
    
    // Mantener la baraja actual (no crear una nueva)
    const barajaExistente = barajaActual || new BarajaDeCartas();
    
    // Asegurar que el balance se restaure
    nuevoJugador.balanceJugador = 3000;
    nuevoJugador.apuestoJugador = 0;
    nuevoJugador.cartasQueTiene = [];
    
    nuevoCrupier.apuestoJugador = 0;
    nuevoCrupier.cartasQueTiene = [];
    
    // Limpiar solo el balance del localStorage, mantener el estado del juego
    localStorage.removeItem('balance');
    
    set({
      jugador1: nuevoJugador,
      crupier: nuevoCrupier,
      baraja: barajaExistente, // Usar la baraja existente
      fichasEnApuesta: [],
      isMas: false,
      isTurnoCrupier: false,
      isRepartirPrincipal: false,
      isDoblar: false,
      isJuegoActivo: true,
      mensaje: "¡Juego reiniciado! Balance: $3000",
      colorMensaje: "#007100" // colorGanas
    });
    get().guardarEstado();
    
    // Limpiar el mensaje después de un tiempo
    setTimeout(() => {
      set({ mensaje: "", colorMensaje: "" });
    }, 2000);
  },
  
  // Guardar balance en localStorage
  guardarBalance: () => {
    const { jugador1 } = get();
    localStorage.setItem('balance', jugador1.balanceJugador.toString());
  },
  
  // Cargar balance de localStorage
  cargarBalance: () => {
    const balanceGuardado = localStorage.getItem('balance');
    const { jugador1 } = get();
    if (balanceGuardado && parseFloat(balanceGuardado) > 0) {
      jugador1.balanceJugador = parseFloat(balanceGuardado);
    } else {
      // Si no hay balance guardado o es 0, usar el balance por defecto
      jugador1.balanceJugador = 3000;
    }
      set({ jugador1: jugador1 });
      get().guardarEstado();
  }
}));

// Guardar el estado inicial si es la primera vez
if (!localStorage.getItem('blackjack-game-state')) {
  // Solo guardar si no hay estado previo
  setTimeout(() => {
    const { guardarEstado } = useGameStore.getState();
    guardarEstado();
  }, 100);
}

export default useGameStore;
