import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar el diseño responsivo
 * Calcula tamaños y posiciones basados en las dimensiones de la pantalla
 */
export const useResponsive = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 700,
    isSmallMobile: window.innerWidth < 500,
    isLandscape: window.innerWidth > window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 700,
        isSmallMobile: window.innerWidth < 500,
        isLandscape: window.innerWidth > window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cálculo de tamaños base
  const calcularTamaños = () => {
    const { width, height, isLandscape } = dimensions;
    
    // Tamaño de cartas
    const anchoCarta = isLandscape 
      ? Math.min(height / 8, width / 12) 
      : Math.min(width / 6, height / 10);
    
    // Tamaño de fichas
    const tamañoFicha = isLandscape 
      ? Math.min(height / 14, width / 16)
      : Math.min(width / 10, height / 18);
    
    // Tamaño de botones
    const tamañoBoton = {
      padding: dimensions.isMobile ? '6px 10px' : '10px 20px',
      fontSize: dimensions.isMobile ? '10px' : '16px',
      minWidth: dimensions.isMobile ? '60px' : '100px'
    };

    return {
      anchoCarta: Math.max(80, Math.min(150, anchoCarta)),
      tamañoFicha: Math.max(40, Math.min(80, tamañoFicha)),
      tamañoBoton,
      alturaFicha: tamañoFicha
    };
  };

  // Cálculo de posiciones
  const calcularPosiciones = () => {
    const { width, height, isMobile, isSmallMobile } = dimensions;
    
    return {
      // Balance
      balance: {
        bottom: isMobile ? '100px' : '20px',
        left: isMobile ? '50%' : '20px',
        transform: isMobile ? 'translateX(-50%)' : 'none',
        fontSize: isMobile ? '12px' : '16px',
        padding: isMobile ? '8px 16px' : '10px 20px'
      },
      
      // Fichas de apuesta
      fichasApuesta: {
        bottom: isSmallMobile ? '180px' : '155px',
        left: isSmallMobile ? '55%' : '45%'
      },
      
      // Botones de juego
      botonesJuego: {
        bottom: isMobile ? '150px' : '100px',
        gap: isMobile ? '5px' : '10px',
        maxWidth: isMobile ? '800px' : '600px',
        tamañoBoton: {
          padding: isMobile ? '6px 10px' : '10px 20px',
          fontSize: isMobile ? '10px' : '16px',
          minWidth: isMobile ? '60px' : '100px'
        }
      },
      
      // Fichas del crupier
      fichasCrupier: {
        width: isMobile ? '200px' : '300px',
        height: isMobile ? '100px' : '150px'
      },
      
      // Puntos del jugador/crupier
      puntos: {
        fontSize: isMobile ? '18px' : '24px'
      },
      
      // Mensajes
      mensaje: {
        padding: isMobile ? '8px 12px' : '20px 40px',
        borderRadius: isMobile ? '8px' : '22px',
        fontSize: isMobile ? '12px' : '24px',
        minWidth: isMobile ? '150px' : '300px'
      },
      
      // Imagen ursol
      ursol: {
        width: width >= 700 ? '600px' : '400px',
        height: width >= 700 ? '600px' : '400px'
      }
    };
  };

  return {
    ...dimensions,
    tamaños: calcularTamaños(),
    posiciones: calcularPosiciones()
  };
};

export default useResponsive;
