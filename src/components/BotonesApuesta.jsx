import React from 'react';
import { motion } from 'framer-motion';
import soundManager from '../utils/soundManager';
import useResponsive from '../hooks/useResponsive';

const BotonesApuesta = ({ onApostar, visible = true }) => {
  const { tamaños, posiciones } = useResponsive();
  
  const fichas = [
    { valor: 10, imagen: '/blackjack-web/images/fichas/f10.png' },
    { valor: 25, imagen: '/blackjack-web/images/fichas/f25.png' },
    { valor: 50, imagen: '/blackjack-web/images/fichas/f50.png' },
    { valor: 100, imagen: '/blackjack-web/images/fichas/f100.png' },
    { valor: 500, imagen: '/blackjack-web/images/fichas/f500.png' }
  ];

  const handleClick = (valor) => {
    soundManager.playApostar();
    onApostar(valor);
  };

  return (
    <motion.div
      className="botones-apuesta"
      animate={{ 
        opacity: visible ? 1 : 0, 
        y: visible ? 0 : 20,
        x: '-50%'
      }}
      style={{
        position: 'absolute',
        left: '50%',
        bottom: posiciones.botonesApuesta.bottom,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: posiciones.botonesApuesta.gap,
        width: 'auto',
        maxWidth: '90vw', // Evitar que se salgan de la pantalla
        padding: '0 10px', // Padding lateral
        pointerEvents: visible ? 'auto' : 'none'
      }}
    >
      {fichas.map(ficha => (
        <motion.button
          key={ficha.valor}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleClick(ficha.valor)}
          style={{
            width: `${tamaños.tamañoFicha}px`,
            height: `${tamaños.tamañoFicha}px`,
            border: 'none',
            outline: 'none',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            backgroundImage: `url(${ficha.imagen})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            fontSize: 0,
            lineHeight: 0,
            color: 'transparent',
            overflow: 'hidden'
          }}
        >
          <span style={{ display: 'none' }}>{ficha.valor}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default BotonesApuesta;
