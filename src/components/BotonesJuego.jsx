import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';

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
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700 || window.innerHeight < 700);
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight && (window.innerWidth < 700 || window.innerHeight < 700));
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 700 && window.innerWidth <= 1024);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isCurrentlyMobile = width < 700 || height < 700;
      const isCurrentlyLandscape = width > height && (width < 700 || height < 700);
      const isCurrentlyTablet = width >= 700 && width <= 1024;
      
      
      setIsMobile(isCurrentlyMobile);
      setIsLandscape(isCurrentlyLandscape);
      setIsTablet(isCurrentlyTablet);
    };

    updateDimensions(); // Llamar inmediatamente
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  const buttonStyle = {
    padding: isMobile ? '8px 18px' : '10px 20px',
    fontSize: isMobile ? '10px' : '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    background: 'linear-gradient(to bottom, #4CAF50, #45a049)',
    color: 'white',
    minWidth: isMobile ? '80px' : '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  };

  // Estilo específico para botones de acción (MÁS, PARAR, DOBLAR) - más grandes en landscape
  const actionButtonStyle = {
    padding: isTablet ? '18px 28px' : (isLandscape ? '8px 12px' : (isMobile ? '16px 16px' : '12px 24px')),
    fontSize: isTablet ? '18px' : (isLandscape ? '12px' : (isMobile ? '14px' : '18px')),
    fontWeight: 'bold',
    border: 'none',
    borderRadius: isTablet ? '10px' : (isLandscape ? '5px' : (isMobile ? '8px' : '8px')),
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    color: 'white',
    minWidth: isTablet ? '120px' : (isLandscape ? '60px' : (isMobile ? 'auto' : '120px')),
    width: isMobile && !isLandscape ? 'auto' : undefined,
    whiteSpace: 'nowrap'
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
🎯 {t('repartir')}
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
🪙 {t('quitarFicha')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSacarTodas}
              style={{...buttonStyle, background: 'linear-gradient(to bottom, #795548, #5D4037)'}}
            >
🪙 {t('sacarTodas')}
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
        gap: isLandscape ? '6px' : (isMobile ? '12px' : '10px'),
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
              style={{...actionButtonStyle, background: 'linear-gradient(to bottom, #2196F3, #1976D2)'}}
            >
{isMobile ? '🃏' : '🃏'} {t('sacarUna')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPlantarse}
              disabled={disabled}
              style={{...actionButtonStyle, background: 'linear-gradient(to bottom, #FF9800, #F57C00)'}}
            >
{isMobile ? '✋' : '✋'} {t('parar')}
            </motion.button>
          </>
        )}

        {mostrarDoblar && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDoblar}
            disabled={disabled}
            style={{...actionButtonStyle, background: 'linear-gradient(to bottom, #9C27B0, #7B1FA2)'}}
          >
{isMobile ? '⚡' : '⚡'} {t('doblar')}
          </motion.button>
        )}
      </div>
    </>
  );
};

export default BotonesJuego;
