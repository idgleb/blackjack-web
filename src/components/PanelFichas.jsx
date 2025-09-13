import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Ficha from './Ficha';

const PanelFichas = ({ fichas, enApuesta = true, animarGanancia = false }) => {
  const alturaFicha = window.innerWidth <= window.innerHeight 
    ? window.innerWidth / 10 
    : window.innerHeight / 14;

  return (
    <motion.div
      className="panel-fichas"
      animate={animarGanancia ? {
        x: enApuesta ? 0 : window.innerWidth / 2,
        y: enApuesta ? 
          (window.innerHeight - alturaFicha) : 
          (window.innerHeight - alturaFicha / 2)
      } : {}}
      transition={{ duration: 2, ease: "easeOut" }}
      style={{
        position: 'absolute',
        left: window.innerWidth < 500 ? '55%' : '45%',
        bottom: enApuesta ? (window.innerWidth < 500 ? '180px' : '155px') : 'auto',
        top: enApuesta ? 'auto' : '0',
        width: `${alturaFicha * 3}px`,
        height: `${alturaFicha * 2}px`,
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
