import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';

const InfoJuego = ({ 
  balance, 
  apuesta, 
  puntosJugador, 
  puntosCrupier,
  cartasRestantes,
  mostrarPuntosJugador,
  mostrarPuntosCrupier 
}) => {
  const { t } = useLanguage();
  const infoStyle = {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '10px 20px',
    borderRadius: '10px',
    backdropFilter: 'blur(5px)'
  };

  return (
    <>
      {/* Balance */}
      <motion.div
        style={{
          ...infoStyle,
          position: 'absolute',
          bottom: '70px',
          left: '10px',
          fontSize: (window.innerWidth < 700 || window.innerHeight < 700) ? '12px' : '16px',
          padding: (window.innerWidth < 700 || window.innerHeight < 700) ? '8px 16px' : '10px 20px'
        }}
      >
{t('balance')}: ${balance.toFixed(2)}
      </motion.div>

      {/* Apuesta */}
      <motion.div
        style={{
          ...infoStyle,
          position: 'absolute',
          bottom: window.innerWidth > window.innerHeight && (window.innerWidth < 700 || window.innerHeight < 700) ? '100px' : '200px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: window.innerWidth < 700 ? '14px' : '18px',
          padding: window.innerWidth < 700 ? '6px 12px' : '10px 20px'
        }}
      >
        $ {apuesta.toFixed(2)}
      </motion.div>

      {/* Cartas en baraja */}
      <motion.div
        style={{
          ...infoStyle,
          position: 'absolute',
          top: window.innerWidth < 700 ? '60px' : '20px',
          right: '20px',
          fontSize: '14px',
          textAlign: 'center'
        }}
      >
{t('cartasRestantes')} {cartasRestantes}
      </motion.div>

      {/* Puntos del jugador */}
      <AnimatePresence>
        {mostrarPuntosJugador && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              ...infoStyle,
              position: 'absolute',
              bottom: '40vh',
              left: '10vw',
              backgroundColor: 'rgba(67, 21, 0, 0.8)',
              fontSize: window.innerWidth < 700 ? '18px' : '24px'
            }}
          >
            {puntosJugador}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Puntos del crupier */}
      <AnimatePresence>
        {mostrarPuntosCrupier && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              ...infoStyle,
              position: 'absolute',
              top: '150px',
              left: '10vw',
              backgroundColor: 'rgba(67, 21, 0, 0.8)',
              fontSize: window.innerWidth < 700 ? '18px' : '24px'
            }}
          >
            {puntosCrupier}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info de apuesta */}
    </>
  );
};

export default InfoJuego;
