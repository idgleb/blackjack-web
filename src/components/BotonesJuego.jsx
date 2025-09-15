import React from 'react';
import { motion } from 'framer-motion';
import useResponsive from '../hooks/useResponsive';

const BotonesJuego = ({ 
  onRepartir, 
  onPedir, 
  onPlantarse, 
  onDoblar,
  onSacarUna,
  onSacarTodas,
  mostrarRepartir,
  mostrarAcciones,
  mostrarDoblar,
  mostrarSacarFichas,
  disabled
}) => {
  const { posiciones, isMobile } = useResponsive();
  
  const buttonStyle = {
    ...posiciones.botonesJuego.tamañoBoton,
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    background: 'linear-gradient(to bottom, #4CAF50, #45a049)',
    color: 'white'
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: posiciones.botonesJuego.bottom,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: posiciones.botonesJuego.gap,
      flexWrap: isMobile ? 'nowrap' : 'wrap',
      justifyContent: 'center',
      maxWidth: posiciones.botonesJuego.maxWidth
    }}>
      {mostrarRepartir && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRepartir}
          disabled={disabled}
          style={buttonStyle}
        >
          REPARTIR
        </motion.button>
      )}

      {mostrarAcciones && (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPedir}
            disabled={disabled}
            style={{...buttonStyle, background: 'linear-gradient(to bottom, #2196F3, #1976D2)'}}
          >
            MÁS
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlantarse}
            disabled={disabled}
            style={{...buttonStyle, background: 'linear-gradient(to bottom, #FF9800, #F57C00)'}}
          >
            PARAR
          </motion.button>
        </>
      )}

      {mostrarDoblar && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDoblar}
          disabled={disabled}
          style={{...buttonStyle, background: 'linear-gradient(to bottom, #9C27B0, #7B1FA2)'}}
        >
          DOBLAR
        </motion.button>
      )}

      {mostrarSacarFichas && (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSacarUna}
            style={{...buttonStyle, background: 'linear-gradient(to bottom, #607D8B, #455A64)'}}
          >
            SACAR UNA
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSacarTodas}
            style={{...buttonStyle, background: 'linear-gradient(to bottom, #795548, #5D4037)'}}
          >
            SACAR TODAS
          </motion.button>
        </>
      )}
    </div>
  );
};

export default BotonesJuego;
