import React from 'react';
import { motion } from 'framer-motion';
import soundManager from '../utils/soundManager';

const BotonesApuesta = ({ onApostar, visible = true, onChipAnimation }) => {
  const fichas = [
    { valor: 10, imagen: '/blackjack-web/images/fichas/f10.png' },
    { valor: 25, imagen: '/blackjack-web/images/fichas/f25.png' },
    { valor: 50, imagen: '/blackjack-web/images/fichas/f50.png' },
    { valor: 100, imagen: '/blackjack-web/images/fichas/f100.png' },
    { valor: 500, imagen: '/blackjack-web/images/fichas/f500.png' }
  ];

  const handleClick = (valor, event) => {
    // Obtener coordenadas exactas del centro del botón presionado
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const buttonX = buttonRect.left + buttonRect.width / 2;
    const buttonY = buttonRect.top + buttonRect.height / 2;
    
    // Llamar a la animación de ficha con coordenadas precisas
    if (onChipAnimation) {
      onChipAnimation(valor, buttonX, buttonY);
    }
    
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
        bottom: 'max(20px, env(safe-area-inset-bottom, 20px) + 20px)', // Safe area + extra padding
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        width: 'auto',
        pointerEvents: visible ? 'auto' : 'none'
      }}
    >
      {fichas.map(ficha => (
        <motion.button
          key={ficha.valor}
          data-chip-value={ficha.valor}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(event) => handleClick(ficha.valor, event)}
          style={{
            width: '60px',
            height: '60px',
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
