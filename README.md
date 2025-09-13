# 🃏 Blackjack Web Game

Una implementación completa del juego de Blackjack (21) en React, convertida desde el proyecto Android/Kotlin original **"Black jack Argentina"** desarrollado por [Gleb Ursol](https://play.google.com/store/apps/details?id=com.ursolgleb.blackjacknoactivity). Incluye persistencia de datos, animaciones fluidas y diseño responsive.

![Blackjack Game](https://img.shields.io/badge/Game-Blackjack-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![License](https://img.shields.io/badge/License-MIT-green)
![Original App](https://img.shields.io/badge/Original-Android%20App-orange)



<div style="display: flex;" align="center">
<img src="https://github.com/user-attachments/assets/66ab3a11-ffaf-4b08-81a1-5301bfe05b68" style="width: 67%;"/>
 <img src="https://github.com/user-attachments/assets/e1adc97f-87ed-4852-8e8d-66516a553c5f" style="width: 25%;" />
</div>


## ✨ Características

- 🎮 **Juego completo de Blackjack** con reglas estándar del casino
- 💾 **Persistencia completa** - No pierdes progreso al cerrar el navegador
- 🎨 **Diseño responsive** - Funciona en móviles, tablets y desktop
- 🎬 **Animaciones fluidas** - Reparto secuencial de cartas con Framer Motion
- 🔊 **Sistema de audio** - Efectos de sonido y música de fondo
- 🎯 **Interfaz intuitiva** - Controles simples y feedback visual claro

## 🚀 Demo

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Play%20Now-green?style=for-the-badge)](https://tu-demo-url.com)

## 🛠️ Tecnologías

### Frontend
- **React 18** - Biblioteca principal para la UI
- **Vite** - Herramienta de construcción ultra-rápida
- **JavaScript ES6+** - Sin TypeScript para simplicidad

### Gestión de Estado
- **Zustand** - Gestión de estado global simple y eficiente

### Animaciones y UI
- **Framer Motion** - Animaciones fluidas y transiciones
- **CSS3** - Estilos responsive y efectos visuales

### Audio
- **Howler.js** - Manejo de audio y efectos de sonido

### Persistencia
- **localStorage** - Almacenamiento local del navegador

## 📦 Instalación

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/idgleb/blackjack-web.git
cd blackjack-web
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:5173
```

## 🎮 Cómo Jugar

### Objetivo
Obtener 21 puntos o acercarse lo más posible sin pasarse. Gana si tienes más puntos que el crupier.

### Reglas
- **Cartas numéricas**: Su valor nominal
- **J, Q, K**: 10 puntos
- **As**: 1 u 11 puntos (automático)
- **Crupier**: Debe pedir cartas hasta llegar a 17
- **Blackjack**: As + carta de 10 puntos = 21 (ganas automáticamente)

### Controles
- **Fichas de apuesta**: Haz clic para apostar ($100, $500, $1000, $2000)
- **REPARTIR**: Inicia una nueva ronda
- **SACAR UNA**: Pide una carta adicional
- **PARAR**: Termina tu turno
- **DOBLAR**: Dobla tu apuesta y pide una carta final

## 🏗️ Arquitectura

### Estructura del Proyecto
```
src/
├── components/          # Componentes React
│   ├── MesaJuego.jsx   # Componente principal
│   ├── Carta.jsx       # Componente de carta
│   ├── BotonesJuego.jsx # Botones de acción
│   └── ...
├── models/             # Clases de datos
│   ├── Carta.js        # Modelo de carta
│   ├── Jugador.js      # Modelo de jugador
│   └── BarajaDeCartas.js # Modelo de baraja
├── store/              # Gestión de estado
│   └── gameStore.js    # Store principal (Zustand)
├── utils/              # Utilidades
│   ├── constants.js    # Constantes del juego
│   └── soundManager.js # Gestor de audio
└── App.jsx             # Componente raíz
```

### Patrón de Diseño
- **Modelo-Vista-Controlador (MVC)** adaptado
- **Estado centralizado** con Zustand
- **Componentes funcionales** con hooks
- **Separación de responsabilidades** clara

## 💾 Persistencia de Datos

El juego guarda automáticamente:
- ✅ Balance del jugador
- ✅ Apuesta actual
- ✅ Cartas del jugador y crupier
- ✅ Cartas restantes en la baraja
- ✅ Estado del juego (turnos, mensajes)

**Recarga la página y continúa donde lo dejaste!**

## 🎨 Características Responsive

### Breakpoints
- **Desktop**: >= 700px - Experiencia completa
- **Tablet**: 500px - 699px - Layout adaptado
- **Mobile**: < 500px - Interfaz optimizada

### Adaptaciones
- Botones más pequeños en móviles
- Layout de fichas optimizado
- Texto y elementos escalados
- Navegación táctil mejorada

## 🔊 Sistema de Audio

### Efectos de Sonido
- 🎵 Música de fondo
- 🃏 Sonido de cartas
- 🎉 Resultados (ganar, perder, empate, blackjack)
- 🔄 Nueva baraja

### Controles
- Audio se activa con la primera interacción
- Respeta las políticas de autoplay del navegador

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Producción
npm run build        # Build optimizado
npm run preview      # Preview del build

# Calidad de código
npm run lint         # Verificar código
```

## 📊 Métricas del Proyecto

- **Líneas de código**: ~2000+
- **Componentes React**: 8
- **Clases de modelo**: 3
- **Acciones del store**: 15+
- **Assets**: 60+ imágenes, 10+ sonidos
- **Tamaño del bundle**: ~500KB (optimizado)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! 

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### 🔗 Enlaces Útiles para Contribuir

- 📱 **[App Original](https://play.google.com/store/apps/details?id=com.ursolgleb.blackjacknoactivity)** - Para entender la funcionalidad original
- 🏠 **[Repositorio Kotlin](https://github.com/idgleb/blackjack)** - Para ver la implementación original

## 📝 Roadmap

### Próximas Características
- [ ] Modo multijugador
- [ ] Estadísticas de juego
- [ ] Diferentes tipos de cartas
- [ ] Modo torneo
- [ ] Integración con base de datos

### Mejoras Técnicas
- [ ] Tests unitarios
- [ ] PWA (Progressive Web App)
- [ ] Optimización de rendimiento
- [ ] Internacionalización

## 🐛 Reportar Bugs

¿Encontraste un bug? Por favor:

1. Verifica que no esté ya reportado en [Issues](../../issues)
2. Crea un nuevo issue con:
   - Descripción detallada
   - Pasos para reproducir
   - Capturas de pantalla (si aplica)
   - Información del navegador

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **[Gleb Ursol](https://play.google.com/store/apps/details?id=com.ursolgleb.blackjacknoactivity)** - Desarrollador del proyecto original "Black jack Argentina" en Android/Kotlin
- **[Proyecto Original Kotlin](https://github.com/idgleb/blackjack)** - Repositorio del código fuente original
- Comunidad de React por las excelentes herramientas
- Framer Motion por las animaciones increíbles
- Zustand por la simplicidad del estado

## 📞 Contacto

**Desarrollador Web**: [idgleb](https://github.com/idgleb)
**Proyecto**: [Blackjack Web](https://github.com/idgleb/blackjack-web)

### 🔗 Enlaces Relacionados

- 📱 **[App Original Android](https://play.google.com/store/apps/details?id=com.ursolgleb.blackjacknoactivity)** - "Black jack Argentina" en Google Play Store
- 🏠 **[Repositorio Kotlin](https://github.com/idgleb/blackjack)** - Código fuente original en Android/Kotlin
- 🌐 **[Versión Web](https://github.com/idgleb/blackjack-web)** - Esta implementación en React

---

⭐ **¡Dale una estrella al proyecto si te gusta!** ⭐

![GitHub stars](https://img.shields.io/github/stars/idgleb/blackjack-web?style=social)
![GitHub forks](https://img.shields.io/github/forks/idgleb/blackjack-web?style=social)
