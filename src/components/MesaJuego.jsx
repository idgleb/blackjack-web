import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import soundManager from '../utils/soundManager';
import { useLanguage } from '../hooks/useLanguage';
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
    reiniciarJuegoCompleto
  } = useGameStore();

  const [anchoCarta, setAnchoCarta] = useState(120);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [animarGanancia, setAnimarGanancia] = useState(false);
  const [animarPerdida, setAnimarPerdida] = useState(false);
  const [fichasCrupier, setFichasCrupier] = useState([]);
  const [mostrarGameOver, setMostrarGameOver] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight && window.innerWidth < 700);
  
  // Hook de idioma
  const { currentLanguage, changeLanguage, t, availableLanguages, isLoading } = useLanguage();

  useEffect(() => {
    try {
      // Calcular tamaño de cartas según ventana
      const calcularAnchoCarta = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isCurrentlyMobile = width < 700 || height < 700;
        const isCurrentlyLandscape = width > height && (width < 700 || height < 700);
        
        setIsMobile(isCurrentlyMobile);
        setIsLandscape(isCurrentlyLandscape);
        
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
      if (mensaje.includes('Ganas') || mensaje.includes('BlackJack') || mensaje.includes('win') || mensaje.includes('gana') || mensaje.includes('赢了') || mensaje.includes('जीते') || mensaje.includes('فزت') || mensaje.includes('ganha') || mensaje.includes('জিতেছেন') || mensaje.includes('выиграли') || mensaje.includes('勝ち') || mensaje.includes('gagnez')) {
          setFichasCrupier([...fichasEnApuesta]);
          setAnimarGanancia(true);
          setTimeout(() => {
            setAnimarGanancia(false);
            setFichasCrupier([]);
          }, 2000);
        }
        
        // Si es una pérdida, animar fichas de apuesta hacia el crupier
        if (mensaje.includes('Pierdes') || mensaje.includes('lose') || mensaje.includes('输了') || mensaje.includes('हारे') || mensaje.includes('خسرت') || mensaje.includes('perdeu') || mensaje.includes('হারলেন') || mensaje.includes('проиграли') || mensaje.includes('負け') || mensaje.includes('perdu')) {
          setAnimarPerdida(true);
          setTimeout(() => {
            setAnimarPerdida(false);
          }, 2000);
        }
    }
  }, [mensaje, fichasEnApuesta]);
  
  // Manejar Game Over con delay
  useEffect(() => {
    // Solo mostrar game over después de 2 segundos de juego activo
    const timer = setTimeout(() => {
      if (jugador1 && 
          (jugador1.balanceJugador + jugador1.apuestoJugador) < 100 && 
          jugador1.cartasQueTiene?.length === 0) {
        setMostrarGameOver(true);
      } else {
        setMostrarGameOver(false);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [jugador1?.balanceJugador, jugador1?.apuestoJugador, jugador1?.cartasQueTiene?.length]);

  // Cerrar menú al hacer clic fuera (solo para desktop)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mostrarMenu && !isMobile && !isLandscape && !event.target.closest('[data-menu-container]')) {
        setMostrarMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mostrarMenu, isMobile, isLandscape]);

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
      height: '100dvh', // Dynamic viewport height for mobile
      background: 'radial-gradient(ellipse at center, #1a3d1a 0%, #0a1a0a 100%)',
      position: 'relative',
      overflow: 'hidden',
      paddingBottom: 'env(safe-area-inset-bottom, 20px)' // Safe area for mobile
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

      {/* Información de Apuesta */}
      {/* infoApuesta movido a InfoJuego.jsx para centralizar */}
      {/* infoApuesta movido a InfoJuego.jsx para centralizar */}

      {/* Botón Menú */}
      <div data-menu-container style={{ position: 'absolute', top: isMobile ? '8px' : '20px', left: isMobile ? '8px' : '20px', zIndex: 1000 }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMostrarMenu(!mostrarMenu)}
          style={{
            padding: isLandscape ? '8px 12px' : (isMobile ? '10px 16px' : '12px 20px'),
            fontSize: isLandscape ? '12px' : (isMobile ? '12px' : '16px'),
            backgroundColor: 'rgba(76, 175, 80, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: isLandscape ? '8px' : (isMobile ? '6px' : '12px'),
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          {t('menu')}
        </motion.button>

        {/* Dropdown del Menú para Desktop */}
        {mostrarMenu && !isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '8px',
              background: 'linear-gradient(145deg, rgba(20, 20, 20, 0.95), rgba(40, 40, 40, 0.95))',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '12px 0',
              minWidth: '220px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              overflow: 'hidden'
            }}
          >
            {/* Separador decorativo */}
            <div style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.5), transparent)',
              margin: '0 16px 8px 16px'
            }} />
            
            <motion.button
              whileHover={{ 
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                x: 4
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setMostrarMenu(false);
                soundManager.playNuevaBaraja();
                reiniciarJuegoCompleto();
              }}
              style={{
                width: '100%',
                padding: '16px 20px',
                fontSize: '15px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: '500'
              }}
            >
              <span style={{ fontSize: '16px' }}>🔄</span>
              <span>{t('reiniciarJuego')}</span>
            </motion.button>
            
            {/* Separador entre opciones */}
            <div style={{
              height: '1px',
              background: 'rgba(255,255,255,0.1)',
              margin: '4px 16px'
            }} />
            
            <motion.button
              whileHover={{ 
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                x: 4
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setMostrarMenu(false);
                window.open('https://play.google.com/store/apps/details?id=com.ursolgleb.blackjacknoactivity', '_blank');
              }}
              style={{
                width: '100%',
                padding: '16px 20px',
                fontSize: '15px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: '500'
              }}
            >
              <span style={{ fontSize: '16px' }}>📱</span>
              <span>{t('cargarAppPlayStore')}</span>
            </motion.button>
            
            {/* Separador entre secciones */}
            <div style={{
              height: '1px',
              background: 'rgba(255,255,255,0.1)',
              margin: '8px 16px'
            }} />
            
            {/* Selector de idioma */}
            <div style={{
              padding: '8px 16px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: '500',
              textAlign: 'center'
            }}>
              🌍 {t('menu')} / Language
            </div>
            
            {/* Lista de idiomas */}
            <div style={{
              maxHeight: '250px',
              overflowY: 'auto',
              padding: '0 8px 8px 8px'
            }}>
              {availableLanguages.map(lang => (
                <motion.button
                  key={lang.code}
                  whileHover={{ 
                    backgroundColor: currentLanguage === lang.code ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255,255,255,0.1)',
                    x: 4
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setMostrarMenu(false);
                    changeLanguage(lang.code);
                  }}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    fontSize: '13px',
                    backgroundColor: currentLanguage === lang.code ? 'rgba(76, 175, 80, 0.2)' : 'transparent',
                    color: currentLanguage === lang.code ? '#4CAF50' : '#ffffff',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    margin: '2px 0',
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  <span style={{ fontSize: '14px' }}>{lang.flag}</span>
                  <span style={{ flex: 1 }}>{lang.name}</span>
                  {currentLanguage === lang.code && (
                    <span style={{ fontSize: '12px', color: '#4CAF50' }}>✓</span>
                  )}
                </motion.button>
              ))}
            </div>
            
            {/* Separador decorativo inferior */}
            <div style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.5), transparent)',
              margin: '8px 16px 0 16px'
            }} />
          </motion.div>
        )}
      </div>

      {/* Bottom Sheet para Móviles Portrait */}
      {mostrarMenu && isMobile && !isLandscape && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMostrarMenu(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1999,
              backdropFilter: 'blur(2px)'
            }}
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(20, 20, 20, 0.98)',
              backdropFilter: 'blur(20px)',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              padding: '20px',
              paddingBottom: '40px',
              maxHeight: '80vh',
              overflowY: 'auto',
              zIndex: 2000,
              boxShadow: '0 -8px 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderBottom: 'none'
            }}
          >
            {/* Handle */}
            <div style={{
              width: '40px',
              height: '4px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: '2px',
              margin: '0 auto 20px auto'
            }} />
            
            {/* Título */}
            <div style={{
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>⚙️</span>
              <span>{t('menu')}</span>
            </div>
            
            {/* Separador decorativo */}
            <div style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.5), transparent)',
              margin: '0 0 20px 0'
            }} />
            
            {/* Opciones del menú */}
            <div style={{ marginBottom: '20px' }}>
              <motion.button
                whileHover={{ backgroundColor: 'rgba(76, 175, 80, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setMostrarMenu(false);
                  soundManager.playNuevaBaraja();
                  reiniciarJuegoCompleto();
                }}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  fontSize: '16px',
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontWeight: '500',
                  marginBottom: '12px'
                }}
              >
                <span style={{ fontSize: '20px' }}>🔄</span>
                <span>{t('reiniciarJuego')}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ backgroundColor: 'rgba(33, 150, 243, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setMostrarMenu(false);
                  window.open('https://play.google.com/store/apps/details?id=com.ursolgleb.blackjacknoactivity', '_blank');
                }}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  fontSize: '16px',
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(33, 150, 243, 0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontWeight: '500'
                }}
              >
                <span style={{ fontSize: '20px' }}>📱</span>
                <span>{t('cargarAppPlayStore')}</span>
              </motion.button>
            </div>
            
            {/* Separador entre secciones */}
            <div style={{
              height: '1px',
              background: 'rgba(255,255,255,0.1)',
              margin: '20px 0'
            }} />
            
            {/* Selector de idioma */}
            <div style={{
              textAlign: 'center',
              fontSize: '16px',
              color: 'rgba(255,255,255,0.8)',
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '18px' }}>🌍</span>
              <span>Language / Idioma</span>
            </div>
            
            {/* Lista de idiomas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {availableLanguages.map(lang => (
                <motion.button
                  key={lang.code}
                  whileHover={{ 
                    backgroundColor: currentLanguage === lang.code ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255,255,255,0.1)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setMostrarMenu(false);
                    changeLanguage(lang.code);
                  }}
                  disabled={isLoading}
                  style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    backgroundColor: currentLanguage === lang.code ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,255,255,0.05)',
                    color: currentLanguage === lang.code ? '#4CAF50' : '#ffffff',
                    border: currentLanguage === lang.code ? '1px solid rgba(76, 175, 80, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontWeight: '500',
                    opacity: isLoading ? 0.6 : 1,
                    flexDirection: 'column',
                    minHeight: '60px'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{lang.flag}</span>
                  <span style={{ fontSize: '12px' }}>{lang.name}</span>
                  {currentLanguage === lang.code && (
                    <span style={{ fontSize: '10px', color: '#4CAF50' }}>✓</span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* Bottom Sheet para Móviles Landscape */}
      {mostrarMenu && isLandscape && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMostrarMenu(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1999,
              backdropFilter: 'blur(2px)'
            }}
          />
          
          {/* Bottom Sheet Landscape */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '15vh' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(20, 20, 20, 0.98)',
              backdropFilter: 'blur(20px)',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              padding: '12px 16px',
              paddingBottom: '20px',
              height: '85vh',
              overflowY: 'auto',
              zIndex: 2000,
              boxShadow: '0 -8px 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderBottom: 'none'
            }}
          >
            {/* Handle compacto */}
            <div style={{
              width: '30px',
              height: '3px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: '2px',
              margin: '0 auto 12px auto'
            }} />
            
            {/* Contenido en layout horizontal */}
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              {/* Opciones principales */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                minWidth: '140px'
              }}>
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(76, 175, 80, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setMostrarMenu(false);
                    soundManager.playNuevaBaraja();
                    reiniciarJuegoCompleto();
                  }}
                  style={{
                    padding: '10px 12px',
                    fontSize: '13px',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    color: '#ffffff',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '500'
                  }}
                >
                  <span style={{ fontSize: '14px' }}>🔄</span>
                  <span>{t('reiniciarJuego')}</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(33, 150, 243, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setMostrarMenu(false);
                    window.open('https://play.google.com/store/apps/details?id=com.ursolgleb.blackjacknoactivity', '_blank');
                  }}
                  style={{
                    padding: '10px 12px',
                    fontSize: '13px',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    color: '#ffffff',
                    border: '1px solid rgba(33, 150, 243, 0.3)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '500'
                  }}
                >
                  <span style={{ fontSize: '14px' }}>📱</span>
                  <span>{t('cargarAppPlayStore')}</span>
                </motion.button>
              </div>
              
              {/* Separador vertical */}
              <div style={{
                width: '1px',
                background: 'rgba(255,255,255,0.1)',
                margin: '0 8px'
              }} />
              
              {/* Selector de idioma compacto */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: '600',
                  marginBottom: '8px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}>
                  <span style={{ fontSize: '14px' }}>🌍</span>
                  <span>Language</span>
                </div>
                
                {/* Grid de idiomas compacto */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '4px',
                  maxHeight: '240px',
                  overflowY: 'auto'
                }}>
                  {availableLanguages.map(lang => (
                    <motion.button
                      key={lang.code}
                      whileHover={{ 
                        backgroundColor: currentLanguage === lang.code ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255,255,255,0.1)'
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setMostrarMenu(false);
                        changeLanguage(lang.code);
                      }}
                      disabled={isLoading}
                      style={{
                        padding: '6px 8px',
                        fontSize: '10px',
                        backgroundColor: currentLanguage === lang.code ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,255,255,0.05)',
                        color: currentLanguage === lang.code ? '#4CAF50' : '#ffffff',
                        border: currentLanguage === lang.code ? '1px solid rgba(76, 175, 80, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        fontWeight: '500',
                        opacity: isLoading ? 0.6 : 1,
                        flexDirection: 'column',
                        minHeight: '40px'
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>{lang.flag}</span>
                      <span style={{ fontSize: '8px' }}>{lang.name}</span>
                      {currentLanguage === lang.code && (
                        <span style={{ fontSize: '8px', color: '#4CAF50' }}>✓</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}

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
      {/* infoApuesta centralizado en InfoJuego.jsx */}

      {/* Fichas del crupier */}
      <div style={{
        position: 'absolute',
        top: '0px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: isLandscape ? '180px' : (isMobile ? '200px' : '300px'),
        height: isLandscape ? '90px' : (isMobile ? '100px' : '150px'),
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
        animarPerdida={animarPerdida}
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
        bottom: isLandscape ? '200px' : '250px',
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
          <h2>{t('gameOver')}</h2>
          <p>{t('sinDineroSuficiente')}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setMostrarGameOver(false);
              soundManager.playNuevaBaraja();
              reiniciarJuegoCompleto();
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
{t('reiniciar')}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default MesaJuego;
