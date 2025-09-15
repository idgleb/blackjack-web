import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useResponsive from '../hooks/useResponsive';

const Mensaje = ({ texto, color, visible }) => {
  const { posiciones } = useResponsive();
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: window.innerWidth, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -window.innerWidth, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: color,
            color: '#FFFF00',
            padding: posiciones.mensaje.padding,
            borderRadius: posiciones.mensaje.borderRadius,
            fontSize: posiciones.mensaje.fontSize,
            fontWeight: 'bold',
            textAlign: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
            zIndex: 1000,
            minWidth: posiciones.mensaje.minWidth
          }}
        >
          {texto}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Mensaje;
