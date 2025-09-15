import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useResponsive from '../hooks/useResponsive';
import Ficha from './Ficha';

const PanelFichas = ({ fichas, enApuesta = true, animarGanancia = false }) => {
  const { tamaños, posiciones, isSmallMobile } = useResponsive();

  return (
    <motion.div
      className="panel-fichas"
      animate={animarGanancia ? {
        x: enApuesta ? 0 : window.innerWidth / 2,
        y: enApuesta ? 
          (window.innerHeight - tamaños.alturaFicha) : 
          (window.innerHeight - tamaños.alturaFicha / 2)
      } : {}}
      transition={{ duration: 2, ease: "easeOut" }}
      style={{
        position: 'absolute',
        left: isSmallMobile ? '55%' : '45%',
        bottom: enApuesta ? (isSmallMobile ? '180px' : '155px') : 'auto',
        top: enApuesta ? 'auto' : '0',
        width: `${tamaños.alturaFicha * 3}px`,
        height: `${tamaños.alturaFicha * 2}px`,
        pointerEvents: 'none'
      }}
    >
      <AnimatePresence>
        {fichas.map((ficha, index) => (
          <Ficha 
            key={`${ficha.tipo}-${index}`}
            valor={ficha.cantidad} 
            tipo={ficha.tipo}
            index={index}
            enApuesta={enApuesta}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default PanelFichas;
