import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Ficha from './Ficha';

const PanelFichas = ({ fichas, enApuesta = true, animarGanancia = false, animarPerdida = false, chipAnimations = [] }) => {
  const alturaFicha = window.innerWidth <= window.innerHeight 
    ? window.innerWidth / 10 
    : window.innerHeight / 14;


  return (
    <motion.div
      className="panel-fichas"
      initial={enApuesta ? {} : { x: 0, y: 0, scale: 1 }}
      animate={
        enApuesta ? (
          animarPerdida ? {
            // Animación de pérdida desde apuesta: hacia el crupier (arriba y izquierda)
            x: -100,
            y: [0, -window.innerHeight/2, -window.innerHeight],
            scale: [1, 0.8, 0.3]
          } : {
            // Resetear posición después de la animación
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0
          }
        ) : (
          animarGanancia ? {
            // Animación de ganancia: hacia el jugador (arco parabólico hasta el final)
            x: [0, 20, 100],
            y: [0, window.innerHeight/2, window.innerHeight],
            scale: [1, 1.5, 1]
          } : {
            // Resetear posición después de la animación
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0
          }
        )
      }
      transition={{ 
        duration: 2,
        ease: "easeInOut",
        delay: 0.3
      }}
      style={{
        position: 'absolute',
        left: window.innerWidth < 500 ? '55%' : '45%',
        bottom: enApuesta ? (window.innerWidth < 500 ? '180px' : '155px') : 'auto',
        top: enApuesta ? 'auto' : '0',
        width: `${alturaFicha * 3}px`,
        height: `${alturaFicha * 2}px`,
        pointerEvents: 'none',
        zIndex: 1000
      }}
    >
      <AnimatePresence>
        {fichas.map((ficha, index) => {
          // Buscar la animación correspondiente para esta ficha específica
          const matchingAnimation = chipAnimations.find(anim => {
            if (anim.isRemove) {
              // Para animaciones de quitar, debe coincidir valor e índice exacto
              return anim.valor === ficha.cantidad && anim.targetIndex === index;
            } else {
              // Para animaciones de agregar, buscar la más reciente del mismo valor
              return anim.valor === ficha.cantidad && !anim.isRemove;
            }
          });
          
          return (
            <Ficha 
              key={`${ficha.tipo}-${index}-${ficha.cantidad}`}
              valor={ficha.cantidad} 
              tipo={ficha.tipo}
              index={index}
              enApuesta={enApuesta}
              fromX={matchingAnimation ? matchingAnimation.fromX : null}
              fromY={matchingAnimation ? matchingAnimation.fromY : null}
              animationId={matchingAnimation ? matchingAnimation.id : null}
              isRemove={matchingAnimation ? matchingAnimation.isRemove : false}
              buttonX={matchingAnimation ? matchingAnimation.buttonX : null}
              buttonY={matchingAnimation ? matchingAnimation.buttonY : null}
            />
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default PanelFichas;
