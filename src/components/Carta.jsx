import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import soundManager from '../utils/soundManager';

const Carta = ({ carta, index, jugador, anchoCarta = 120 }) => {
  // Verificar que todos los objetos existan
  if (!carta || !jugador) {
    return null;
  }
  
  const [prevAbierta, setPrevAbierta] = useState(carta.isAbierta());
  
  // Detectar cuando la carta se voltea
  useEffect(() => {
    if (carta.isAbierta() && !prevAbierta) {
      soundManager.playAbrir();
      setPrevAbierta(true);
    }
  }, [carta.isAbierta(), prevAbierta]);
  
  
  // Calcular posición de la carta
  const position = jugador.getXYProximaCarta(index, anchoCarta);
  
  // Estilo de la carta
  const altoCarta = anchoCarta * 1.46;
  
  return (
    <motion.div
      className="carta"
      initial={{ 
        x: window.innerWidth / 2 + 180,
        y: -140,
        rotate: -70,
        scale: 1
      }}
      animate={{ 
        x: position.x,
        y: position.y,
        rotate: 0,
        scale: 1
      }}
      transition={{ 
        duration: 0.4,
        ease: "easeOut"
      }}
      onAnimationStart={() => {
        try {
          soundManager.playFlotar();
        } catch (error) {
          console.warn('Error al reproducir sonido flotar:', error);
        }
      }}
      style={{
        position: 'absolute',
        width: `${anchoCarta}px`,
        height: `${altoCarta}px`,
        transformOrigin: 'center center',
        zIndex: 100 + index,
        perspective: '1000px'
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          backgroundImage: carta.isAbierta() 
            ? `url(/blackjack-web/images/cartas/${carta.getImagenNombre()}.png)`
            : `url(/blackjack-web/images/cartas/cartacubierta.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
    </motion.div>
  );
};

export default Carta;
