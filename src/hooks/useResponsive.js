import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar el diseño responsivo
 * Calcula tamaños y posiciones basados en las dimensiones de la pantalla
 */
export const useResponsive = () => {
  // Función para obtener dimensiones reales del viewport
  const getRealViewport = () => {
    // SIEMPRE usar window.innerWidth/Height (área visible del navegador)
    // Esto funciona correctamente en móviles reales
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  };

  // Detectar si es realmente un dispositivo móvil (no solo DevTools)
  const isRealMobile = () => {
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isMobileSize = window.innerWidth <= 768 && window.innerHeight <= 1024;
    
    // Debug para móviles reales
    if (isMobileUA) {
      const viewport = getRealViewport();
      console.log('📱 Móvil real detectado:', {
        userAgent: navigator.userAgent.substring(0, 50) + '...',
        windowSize: { width: window.innerWidth, height: window.innerHeight },
        screenSize: { width: screen.width, height: screen.height },
        visualViewport: window.visualViewport ? { width: window.visualViewport.width, height: window.visualViewport.height } : 'No disponible',
        finalViewport: viewport,
        botonesApuesta: `bottom: ${isMobileUA ? '30px' : (window.innerWidth < 700 ? '10px' : '20px')}`
      });
    }
    
    return isMobileUA || isMobileSize;
  };

  const [dimensions, setDimensions] = useState(() => {
    const viewport = getRealViewport();
    const realMobile = isRealMobile();
    return {
      width: viewport.width,
      height: viewport.height,
      isMobile: realMobile || viewport.width < 700,
      isSmallMobile: realMobile || viewport.width < 500,
      isLandscape: viewport.width > viewport.height,
      isRealMobile: realMobile
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const viewport = getRealViewport();
      const realMobile = isRealMobile();
      setDimensions({
        width: viewport.width,
        height: viewport.height,
        isMobile: realMobile || viewport.width < 700,
        isSmallMobile: realMobile || viewport.width < 500,
        isLandscape: viewport.width > viewport.height,
        isRealMobile: realMobile
      });
    };

    // Listener para cambios de viewport (móviles)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
    }
    
    // Listener tradicional para navegadores de escritorio
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      }
      window.removeEventListener('resize', handleResize);
    };
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
    const { width, height, isMobile, isSmallMobile, isRealMobile } = dimensions;
    
    return {
      // Balance
      balance: {
        bottom: isRealMobile ? '130px' : (isMobile ? '100px' : '20px'), // Más arriba para móviles reales
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
      
       // Botones de apuesta (fichas)
       botonesApuesta: {
         bottom: isRealMobile ? '50px' : (isMobile ? '10px' : '20px'), // Más arriba para móviles reales
         gap: isMobile ? '8px' : '10px'
       },
       
       // Botones de juego
       botonesJuego: {
         bottom: isRealMobile ? '150px' : (isMobile ? '150px' : '100px'), // Valor fijo para móviles reales
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
