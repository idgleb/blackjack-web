import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useResponsive from '../hooks/useResponsive';

const InfoJuego = ({ 
  balance, 
  apuesta, 
  puntosJugador, 
  puntosCrupier,
  cartasRestantes,
  mostrarPuntosJugador,
  mostrarPuntosCrupier 
}) => {
  const { posiciones } = useResponsive();
  
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
          bottom: posiciones.balance.bottom,
          left: posiciones.balance.left,
          transform: posiciones.balance.transform,
          fontSize: posiciones.balance.fontSize,
          padding: posiciones.balance.padding
        }}
      >
        Balance: ${balance.toFixed(2)}
      </motion.div>

      {/* Apuesta */}
      <motion.div
        style={{
          ...infoStyle,
          position: 'absolute',
          bottom: '200px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        $ {apuesta.toFixed(2)}
      </motion.div>

      {/* Cartas en baraja */}
      <motion.div
        style={{
          ...infoStyle,
          position: 'absolute',
          top: '20px',
          right: '20px',
          fontSize: '14px',
          textAlign: 'center'
        }}
      >
        {cartasRestantes} cartas<br/>en baraja
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
              bottom: '300px',
              left: '20px',
              backgroundColor: 'rgba(67, 21, 0, 0.8)',
              fontSize: posiciones.puntos.fontSize
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
              left: '20px',
              backgroundColor: 'rgba(67, 21, 0, 0.8)',
              fontSize: posiciones.puntos.fontSize
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
