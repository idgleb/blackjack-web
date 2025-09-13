# Blackjack Web

Una versión web del juego de Blackjack, convertido desde una aplicación Android en Kotlin a una aplicación web moderna con React.

## 🎮 Características

- **Juego completo de Blackjack** con todas las reglas estándar
- **Animaciones suaves** usando Framer Motion
- **Sistema de sonidos** completo con música de fondo
- **Persistencia de datos** - el balance se guarda automáticamente
- **Diseño responsivo** - funciona en desktop y móvil
- **Interfaz intuitiva** similar a la app original de Android

## 🚀 Instalación

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```

3. Los recursos multimedia ya están incluidos:
   - ✅ Sonidos en `public/sounds/`
   - ✅ Imágenes de cartas en `public/images/cartas/`
   - ✅ Imágenes de fichas en `public/images/fichas/`

## 🎨 Recursos Incluidos

Todos los recursos del proyecto original de Kotlin han sido migrados:

### Imágenes de Cartas (52 + dorso)
- Todas las cartas de los 4 palos (corazón, diamante, trébol, pica)
- Carta cubierta para el dorso

### Imágenes de Fichas
- Fichas de $10, $25, $50, $100 y $500

### Archivos de Sonido
- Música de fondo jazz
- Efectos de sonido para todas las acciones del juego
- Voces para eventos especiales (blackjack, empate, etc.)

### Colores del Juego
Los colores se han mantenido idénticos al proyecto Kotlin:
- **Ganas**: #007100
- **Pierdes**: #710001
- **Empate**: #002f40
- **Común**: #431500

## 🎯 Cómo Jugar

1. **Apuesta**: Haz clic en las fichas para apostar (mínimo $100, máximo $2000)
2. **Repartir**: Presiona REPARTIR para comenzar el juego
3. **Acciones**:
   - **MÁS**: Pide otra carta
   - **PARAR**: Mantén tus cartas actuales
   - **DOBLAR**: Dobla tu apuesta y recibe una carta más
4. **Objetivo**: Acércate a 21 sin pasarte

## 🛠️ Tecnologías Utilizadas

- **React** - Framework de UI
- **Vite** - Build tool
- **Framer Motion** - Animaciones
- **Zustand** - Manejo de estado
- **Howler.js** - Sistema de audio

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Dispositivos móviles (iOS/Android)
- ✅ Tablets
- ✅ Desktop

## 🔧 Desarrollo

Para ejecutar en modo desarrollo:
```bash
npm run dev
```

Para construir para producción:
```bash
npm run build
```

## 📄 Licencia

Este proyecto es una conversión educativa del proyecto original de Android.