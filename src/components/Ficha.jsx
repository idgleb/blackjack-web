import React from 'react';
import { motion } from 'framer-motion';
import soundManager from '../utils/soundManager';

const Ficha = ({ valor, tipo, index, enApuesta = true }) => {
  const fichaImages = {
    10: '/images/fichas/f10.png',
    25: '/images/fichas/f25.png',
    50: '/images/fichas/f50.png',
    100: '/images/fichas/f100.png',
    500: '/images/fichas/f500.png'
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
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: posicion.x,
        y: posicion.y
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ 
        duration: 0.3,
        ease: "backOut"
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
        zIndex: 50 + index
      }}
    >
      <span style={{ display: 'none' }}>{valor}</span>
    </motion.div>
  );
};

export default Ficha;
