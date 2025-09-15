import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import soundManager from '../utils/soundManager';
import Carta from './Carta';
import PanelFichas from './PanelFichas';
import BotonesApuesta from './BotonesApuesta';
import BotonesJuego from './BotonesJuego';
import InfoJuego from './InfoJuego';
import Mensaje from './Mensaje';

const MesaJuego = () => {
  const {
    jugador1,
    crupier,
    baraja,
    fichasEnApuesta,
    isMas,
    isTurnoCrupier,
    isRepartirPrincipal,
    isDoblar,
    mensaje,
    colorMensaje,
    iniciarJuego,
    agregarApuesta,
    quitarUltimaFicha,
    quitarTodasLasFichas,
    repartirCartas,
    pedirCarta,
    plantarse,
    doblar,
    cargarBalance,
    guardarBalance,
    reiniciarJuego
  } = useGameStore();

  const [anchoCarta, setAnchoCarta] = useState(120);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [animarGanancia, setAnimarGanancia] = useState(false);
  const [fichasCrupier, setFichasCrupier] = useState([]);
  const [mostrarGameOver, setMostrarGameOver] = useState(false);

  useEffect(() => {
    try {
      // Calcular tamaño de cartas según ventana
      const calcularAnchoCarta = () => {
        if (window.innerWidth <= window.innerHeight) {
          setAnchoCarta(window.innerWidth / 6);
        } else {
          setAnchoCarta(window.innerHeight / 8);
        }
      };
      
      calcularAnchoCarta();
      window.addEventListener('resize', calcularAnchoCarta);
      
      // Inicializar sonidos después de un pequeño delay
      const timeoutId = setTimeout(() => {
        try {
          soundManager.init();
          // La música se iniciará con la primera interacción del usuario
        } catch (error) {
          console.warn('Error al inicializar sonidos:', error);
        }
      }, 100);
      
      // Iniciar música con la primera interacción
      const handleFirstInteraction = () => {
        soundManager.playMusicaFondo();
        document.removeEventListener('click', handleFirstInteraction);
      };
      document.addEventListener('click', handleFirstInteraction);
      
      // Cargar balance guardado
      cargarBalance();
      
      // Inicializar el juego
      iniciarJuego();
      
      // Guardar balance al salir
      window.addEventListener('beforeunload', guardarBalance);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', calcularAnchoCarta);
        window.removeEventListener('beforeunload', guardarBalance);
        document.removeEventListener('click', handleFirstInteraction);
        try {
          soundManager.pauseMusicaFondo();
        } catch (error) {
          console.warn('Error al pausar música:', error);
        }
      };
    } catch (error) {
      console.error('Error al inicializar el juego:', error);
    }
  }, []); // Removí las dependencias para evitar re-renders

  // Mostrar mensaje cuando cambie
  useEffect(() => {
    if (mensaje) {
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
      
      // Si es una ganancia, animar fichas
      if (mensaje.includes('Ganas') || mensaje.includes('BlackJack')) {
        setFichasCrupier([...fichasEnApuesta]);
        setAnimarGanancia(true);
        setTimeout(() => {
          setAnimarGanancia(false);
          setFichasCrupier([]);
        }, 2000);
      }
    }
  }, [mensaje, fichasEnApuesta]);
  
  // Manejar Game Over con delay
  useEffect(() => {
    // Solo mostrar game over después de 2 segundos de juego activo
    const timer = setTimeout(() => {
      if (jugador1 && 
          jugador1.balanceJugador < 100 && 
          jugador1.apuestoJugador === 0 && 
          jugador1.cartasQueTiene?.length === 0) {
        setMostrarGameOver(true);
      } else {
        setMostrarGameOver(false);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [jugador1?.balanceJugador, jugador1?.apuestoJugador, jugador1?.cartasQueTiene?.length]);

  // Manejadores
  const handleApostar = (cantidad) => {
    const resultado = agregarApuesta(cantidad, `f${cantidad}`);
    if (resultado !== true) {
      soundManager.playPop();
    }
  };

  const handleRepartir = async () => {
    if (!jugador1 || jugador1.apuestoJugador < jugador1.APUESTO_MIN) {
      soundManager.playPop();
      return;
    }
    // Deshabilitar el botón mientras se reparten
    await repartirCartas();
  };

  const handleSacarUna = () => {
    soundManager.playSacarFichas();
    quitarUltimaFicha();
  };

  const handleSacarTodas = () => {
    soundManager.playSacarFichas();
    quitarTodasLasFichas();
  };

  // Condiciones de visibilidad
  const mostrarBotonesApuesta = 
    jugador1?.cartasQueTiene?.length === 0 &&
    !isMas && !isTurnoCrupier && !isRepartirPrincipal && !isDoblar;

  const mostrarBotonRepartir = 
    mostrarBotonesApuesta && jugador1?.apuestoJugador >= jugador1?.APUESTO_MIN && !isRepartirPrincipal;

  const mostrarBotonesSacarFichas = 
    mostrarBotonesApuesta && jugador1?.apuestoJugador > 0;

  const mostrarBotonesAccion = 
    jugador1?.cartasQueTiene?.length > 0 &&
    jugador1?.apuestoJugador > 0 &&
    !isMas && !isTurnoCrupier && !isRepartirPrincipal && !isDoblar;

  const mostrarBotonDoblar = 
    mostrarBotonesAccion && jugador1?.puedeDoblar();

  const mostrarPuntosJugador = jugador1?.sumaPuntos() > 0;
  const mostrarPuntosCrupier = 
    crupier?.sumaPuntos() > 0 && 
    (crupier?.cartasQueTiene?.length < 2 || 
     crupier?.cartasQueTiene[1]?.isAbierta());

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'radial-gradient(ellipse at center, #1a3d1a 0%, #0a1a0a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Imagen ursol.png */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: window.innerWidth >= 700 ? '600px' : '400px',
        height: window.innerWidth >= 700 ? '600px' : '400px',
        backgroundImage: 'url(/blackjack-web/images/ursol.png)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        zIndex: 1,
        opacity: 0.3,
        pointerEvents: 'none'
      }} />
      {/* Baraja */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20px',
          right: '100px',
          width: `${anchoCarta}px`,
          height: `${anchoCarta * 1.46}px`,
          backgroundImage: 'url(/blackjack-web/images/cartas/cartacubierta.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
          transform: 'rotate(-70deg)'
        }}
      />

      {/* Información de apuestas */}
      <div style={{
        color: 'white', 
        fontSize: '14px', 
        fontWeight: 'bold', 
        textShadow: 'rgba(0, 0, 0, 0.5) 2px 2px 4px', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        padding: '10px 20px', 
        borderRadius: '10px', 
        backdropFilter: 'blur(5px)', 
        position: 'absolute', 
        top: '0px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        opacity: 0.7,
        zIndex: 9999
      }}>
        Apuesta: min:$100, max:$2000
      </div>

      {/* Fichas del crupier */}
      <div style={{
        position: 'absolute',
        top: '0px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: window.innerWidth < 700 ? '200px' : '300px',
        height: window.innerWidth < 700 ? '100px' : '150px',
        backgroundImage: 'url(/blackjack-web/images/fichas_crupier.png)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }} />

      {/* Cartas del jugador */}
      {jugador1 && jugador1.cartasQueTiene && jugador1.cartasQueTiene.map((carta, index) => (
        <Carta 
          key={`jugador-${index}-${carta.palo}-${carta.nombre}`}
          carta={carta}
          index={index}
          jugador={jugador1}
          anchoCarta={anchoCarta}
        />
      ))}

      {/* Cartas del crupier */}
      {crupier && crupier.cartasQueTiene && crupier.cartasQueTiene.map((carta, index) => (
        <Carta 
          key={`crupier-${index}-${carta.palo}-${carta.nombre}`}
          carta={carta}
          index={index}
          jugador={crupier}
          anchoCarta={anchoCarta}
        />
      ))}

      {/* Panel de fichas apostadas */}
      <PanelFichas 
        fichas={fichasEnApuesta} 
        enApuesta={true}
        animarGanancia={false}
      />

      {/* Panel de fichas del crupier (cuando ganas) */}
      {fichasCrupier.length > 0 && (
        <PanelFichas 
          fichas={fichasCrupier} 
          enApuesta={false}
          animarGanancia={animarGanancia}
        />
      )}

      {/* Imagen de apuesta */}
      <div style={{
        position: 'absolute',
        bottom: '250px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${anchoCarta * 0.8}px`,
        height: `${anchoCarta * 0.8}px`,
        backgroundImage: 'url(/blackjack-web/images/apuesto.png)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }} />

      {/* Información del juego */}
      <InfoJuego
        balance={jugador1?.balanceJugador || 0}
        apuesta={jugador1?.apuestoJugador || 0}
        puntosJugador={jugador1?.sumaPuntos() || 0}
        puntosCrupier={crupier?.sumaPuntos() || 0}
        cartasRestantes={baraja?.getCartasRestantes() || 52}
        mostrarPuntosJugador={mostrarPuntosJugador}
        mostrarPuntosCrupier={mostrarPuntosCrupier}
      />

      {/* Botones de apuesta */}
      <BotonesApuesta
        onApostar={handleApostar}
        visible={mostrarBotonesApuesta}
      />

      {/* Botones del juego */}
      <BotonesJuego
        onRepartir={handleRepartir}
        onPedir={pedirCarta}
        onPlantarse={plantarse}
        onDoblar={doblar}
        onSacarUna={handleSacarUna}
        onSacarTodas={handleSacarTodas}
        mostrarRepartir={mostrarBotonRepartir}
        mostrarAcciones={mostrarBotonesAccion}
        mostrarDoblar={mostrarBotonDoblar}
        mostrarSacarFichas={mostrarBotonesSacarFichas}
        disabled={isMas || isTurnoCrupier || isRepartirPrincipal || isDoblar}
      />

      {/* Mensaje */}
      <Mensaje
        texto={mensaje}
        color={colorMensaje}
        visible={mostrarMensaje}
      />

      {/* Popup Game Over */}
      {mostrarGameOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: '-50%',
            y: '-50%'
          }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            backgroundColor: 'rgba(0,0,0,0.9)',
            padding: window.innerWidth < 700 ? '20px' : '40px',
            borderRadius: window.innerWidth < 700 ? '15px' : '20px',
            textAlign: 'center',
            color: 'white',
            zIndex: 2000,
            maxWidth: '90vw',
            maxHeight: '90vh'
          }}
        >
          <h2>¡Game Over!</h2>
          <p>No tienes suficiente dinero para continuar</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setMostrarGameOver(false);
              soundManager.playNuevaBaraja();
              reiniciarJuego();
            }}
            style={{
              marginTop: '20px',
              padding: '10px 30px',
              fontSize: '18px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Reiniciar
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default MesaJuego;
