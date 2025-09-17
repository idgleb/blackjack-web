import React from 'react';
import { motion } from 'framer-motion';
import soundManager from '../utils/soundManager';

const Ficha = ({ valor, tipo, index, enApuesta = true, fromX, fromY, animationId, isRemove = false, buttonX, buttonY }) => {
  const fichaImages = {
    10: '/blackjack-web/images/fichas/f10.png',
    25: '/blackjack-web/images/fichas/f25.png',
    50: '/blackjack-web/images/fichas/f50.png',
    100: '/blackjack-web/images/fichas/f100.png',
    500: '/blackjack-web/images/fichas/f500.png'
  };

  const alturaFicha = window.innerWidth <= window.innerHeight 
    ? window.innerWidth / 10 
    : window.innerHeight / 14;

  const dispYfichas = 7;
  const candFichEnCol = 15;

  const calcularPosicion = () => {
    if (enApuesta) {
      const y = -alturaFicha - (index % candFichEnCol) * dispYfichas;
      const x = alturaFicha * Math.floor(index / candFichEnCol);
      return { x, y };
    } else {
      // Posición para fichas del crupier (cuando ganas)
      return { x: 0, y: -index * dispYfichas };
    }
  };

  const posicion = calcularPosicion();

  return (
    <motion.div
      className="ficha"
      initial={{ 
        scale: isRemove ? 1 : 0, 
        opacity: isRemove ? 1 : 0,
        x: isRemove ? 0 : (fromX || 0), // Coordenadas ya son relativas al panel
        y: isRemove ? 0 : (fromY || 0)  // Coordenadas ya son relativas al panel
      }}
      animate={{ 
        scale: isRemove ? 0 : 1, 
        opacity: isRemove ? 0 : 1,
        x: isRemove ? (buttonX || 0) : posicion.x,
        y: isRemove ? (buttonY || 0) : posicion.y
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ 
        duration: 0.6,
        ease: "easeOut"
      }}
      onAnimationComplete={() => {
        // Reproducir sonido cuando la ficha llega a su destino
        if (fromX && fromY && animationId && !isRemove) {
          try {
            soundManager.playApostar();
          } catch (error) {
            console.warn('Error al reproducir sonido de apuesta:', error);
          }
        }
      }}
      style={{
        position: 'absolute',
        width: `${alturaFicha}px`,
        height: `${alturaFicha}px`,
        backgroundImage: `url(${fichaImages[valor]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '50%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        zIndex: 1000 + index
      }}
    >
      <span style={{ display: 'none' }}>{valor}</span>
    </motion.div>
  );
};

export default Ficha;
