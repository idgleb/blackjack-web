import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Mensaje = ({ texto, color, visible }) => {
  const isMobile = window.innerWidth < 700;
  
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
            padding: isMobile ? '8px 12px' : '20px 40px',
            borderRadius: isMobile ? '8px' : '22px',
            fontSize: isMobile ? '12px' : '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
            zIndex: 1000,
            minWidth: isMobile ? '150px' : '300px'
          }}
        >
          {texto}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Mensaje;
