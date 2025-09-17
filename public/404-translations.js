// Traducciones para la página 404
const translations = {
  'zh': {
    title: 'Blackjack Web - 页面未找到',
    heading: '🃏 404',
    message: '糟糕！这个页面在黑杰克游戏中不存在。',
    button: '返回游戏'
  },
  'es': {
    title: 'Blackjack Web - Página no encontrada',
    heading: '🃏 404',
    message: '¡Oops! Esta página no existe en el juego de Blackjack.',
    button: 'Volver al Juego'
  },
  'en': {
    title: 'Blackjack Web - Page Not Found',
    heading: '🃏 404',
    message: 'Oops! This page doesn\'t exist in the Blackjack game.',
    button: 'Back to Game'
  },
  'hi': {
    title: 'Blackjack Web - पेज नहीं मिला',
    heading: '🃏 404',
    message: 'ओह! यह पेज ब्लैकजैक गेम में मौजूद नहीं है।',
    button: 'गेम पर वापस जाएं'
  },
  'ar': {
    title: 'Blackjack Web - الصفحة غير موجودة',
    heading: '🃏 404',
    message: 'عذراً! هذه الصفحة غير موجودة في لعبة البلاك جاك.',
    button: 'العودة إلى اللعبة'
  },
  'pt': {
    title: 'Blackjack Web - Página não encontrada',
    heading: '🃏 404',
    message: 'Ops! Esta página não existe no jogo de Blackjack.',
    button: 'Voltar ao Jogo'
  },
  'bn': {
    title: 'Blackjack Web - পেজ পাওয়া যায়নি',
    heading: '🃏 404',
    message: 'ওহ! এই পেজটি ব্ল্যাকজ্যাক গেমে বিদ্যমান নেই।',
    button: 'গেমে ফিরে যান'
  },
  'ru': {
    title: 'Blackjack Web - Страница не найдена',
    heading: '🃏 404',
    message: 'Упс! Эта страница не существует в игре Блэкджек.',
    button: 'Вернуться к игре'
  },
  'ja': {
    title: 'Blackjack Web - ページが見つかりません',
    heading: '🃏 404',
    message: 'おっと！このページはブラックジャックゲームには存在しません。',
    button: 'ゲームに戻る'
  },
  'fr': {
    title: 'Blackjack Web - Page non trouvée',
    heading: '🃏 404',
    message: 'Oups ! Cette page n\'existe pas dans le jeu de Blackjack.',
    button: 'Retour au jeu'
  }
};

// Detectar idioma del navegador
function detectLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0];
  
  // Verificar si el idioma está soportado
  if (translations[langCode]) {
    return langCode;
  }
  
  // Fallback a inglés si no se encuentra el idioma
  return 'en';
}

// Obtener traducción
function t(key) {
  const lang = detectLanguage();
  const translation = translations[lang];
  
  if (translation && translation[key]) {
    return translation[key];
  }
  
  // Fallback a inglés si no se encuentra la traducción
  return translations['en'][key] || key;
}

// Aplicar traducciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  const lang = detectLanguage();
  
  // Configurar dirección del texto para idiomas RTL
  if (lang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', lang);
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }
  
  // Actualizar título de la página
  document.title = t('title');
  
  // Actualizar contenido
  const heading = document.querySelector('h1');
  const message = document.querySelector('p');
  const button = document.querySelector('.btn');
  
  if (heading) heading.textContent = t('heading');
  if (message) message.textContent = t('message');
  if (button) button.textContent = t('button');
});
