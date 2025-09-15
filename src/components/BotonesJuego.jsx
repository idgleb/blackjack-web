import React from 'react';
import { motion } from 'framer-motion';

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
  const isMobile = window.innerWidth < 700;
  
  const buttonStyle = {
    padding: isMobile ? '6px 10px' : '10px 20px',
    fontSize: isMobile ? '10px' : '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    background: 'linear-gradient(to bottom, #4CAF50, #45a049)',
    color: 'white',
    minWidth: isMobile ? '80px' : '100px'
  };

  return (
    <>
      {/* Botones de gestión: REPARTIR, SACAR UNA, SACAR TODAS - Posición original */}
      <div style={{
        position: 'absolute',
        bottom: isMobile 
          ? 'max(150px, env(safe-area-inset-bottom, 20px) + 130px)' 
          : 'max(100px, env(safe-area-inset-bottom, 20px) + 80px)',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: isMobile ? '5px' : '10px',
        flexWrap: isMobile ? 'nowrap' : 'wrap',
        justifyContent: 'center',
        maxWidth: isMobile ? '800px' : '600px'
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

      {/* Botones de acción: MÁS, PARAR, DOBLAR - Misma posición que botones de apuesta */}
      <div style={{
        position: 'absolute',
        left: '50%',
        bottom: 'max(20px, env(safe-area-inset-bottom, 20px) + 20px)', // Misma posición que botones de apuesta
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        width: 'auto',
        transform: 'translateX(-50%)'
      }}>
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
      </div>
    </>
  );
};

export default BotonesJuego;
