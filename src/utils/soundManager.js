import { Howl, Howler } from 'howler';

class SoundManager {
  constructor() {
    this.sounds = {};
    this.musicaFondo = null;
    this.initialized = false;
  }

  // Inicializar todos los sonidos
  init() {
    if (this.initialized) return;

    // Música de fondo
    this.musicaFondo = new Howl({
      src: ['/sounds/jazzfondo.mp3'],
      loop: true,
      volume: 0.2
    });

    // Efectos de sonido (soporta mp3 y m4a)
    this.sounds = {
      tupierdes: new Howl({ src: ['/sounds/tupierdes.m4a', '/sounds/tupierdes.mp3'] }),
      tuganas: new Howl({ src: ['/sounds/tuganas.m4a', '/sounds/tuganas.mp3'] }),
      sacarfichas: new Howl({ src: ['/sounds/sacarfichas.mp3'] }),
      pop: new Howl({ src: ['/sounds/pop.mp3'] }),
      pierdes2: new Howl({ src: ['/sounds/pierdes2.mp3'] }),
      nuevabarajavoz: new Howl({ src: ['/sounds/nuevabarajavoz.m4a', '/sounds/nuevabarajavoz.mp3'] }),
      nuevabaraja2: new Howl({ src: ['/sounds/nuevabaraja2.mp3'] }),
      ganasfichas2: new Howl({ src: ['/sounds/ganasfichas2.mp3'] }),
      ganasfichas: new Howl({ src: ['/sounds/ganasfichas.mp3'] }),
      flotar: new Howl({ src: ['/sounds/flotar.mp3'] }),
      empate: new Howl({ src: ['/sounds/empate.m4a', '/sounds/empate.mp3'] }),
      blackjack: new Howl({ src: ['/sounds/blackjack.m4a', '/sounds/blackjack.mp3'] }),
      apostar: new Howl({ src: ['/sounds/apostar.mp3'] }),
      abrir: new Howl({ src: ['/sounds/abrir.mp3'] })
    };

    this.initialized = true;
  }

  // Reproducir música de fondo
  playMusicaFondo() {
    try {
      if (this.musicaFondo && !this.musicaFondo.playing()) {
        this.musicaFondo.play();
      }
    } catch (error) {
      console.warn('Error al reproducir música de fondo:', error);
    }
  }

  // Pausar música de fondo
  pauseMusicaFondo() {
    try {
      if (this.musicaFondo) {
        this.musicaFondo.pause();
      }
    } catch (error) {
      console.warn('Error al pausar música de fondo:', error);
    }
  }

  // Reproducir efecto de sonido
  playSound(soundName) {
    try {
      if (this.sounds[soundName]) {
        this.sounds[soundName].play();
      }
    } catch (error) {
      console.warn(`Error al reproducir sonido ${soundName}:`, error);
    }
  }

  // Reproducir múltiples sonidos
  playSounds(soundNames) {
    soundNames.forEach(name => this.playSound(name));
  }

  // Métodos específicos para sonidos del juego
  playApostar() {
    this.playSound('apostar');
  }

  playSacarFichas() {
    this.playSound('sacarfichas');
  }

  playFlotar() {
    this.playSound('flotar');
  }

  playAbrir() {
    this.playSound('abrir');
  }

  playPop() {
    this.playSound('pop');
  }

  playResultado(coeficiente) {
    if (coeficiente < 1) {
      this.playSounds(['tupierdes', 'pierdes2']);
    } else if (coeficiente > 1) {
      if (coeficiente === 2.5) {
        this.playSounds(['blackjack', 'ganasfichas']);
      } else {
        this.playSounds(['tuganas', 'ganasfichas2']);
      }
    } else {
      this.playSound('empate');
    }
  }

  playNuevaBaraja() {
    this.playSounds(['nuevabarajavoz', 'nuevabaraja2']);
  }

  // Limpiar recursos
  dispose() {
    if (this.musicaFondo) {
      this.musicaFondo.unload();
    }
    
    Object.values(this.sounds).forEach(sound => {
      sound.unload();
    });
    
    this.initialized = false;
  }
}

// Crear instancia única (singleton)
const soundManager = new SoundManager();

export default soundManager;
