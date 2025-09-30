import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Mensajes originales
const MESSAGES = [
  'Tu futuro te lo dicen tus datos',
  'Libera tu tiempo con automatización',
  'Inaugura tu tienda virtual, centraliza tus productos',
  '¡E-commerce, tus clientes necesitan tu tienda',
  'Cada clic cuenta. Conquista tu audiencia',
  'Galerías profesionales interactivas. Posiciona tu talento.',
  'Infraestructuras empresariales en la web. Unifica tus procesos',
  'Ecosistemas digitales completos. Maximiza tu valor.'
];

// Efectos disponibles
const EFFECTS = [
  'fade',
  'typewriter',
  'slide',
  'scale',
  'colorSwap',
  'blur',
  'wordFlip',
];

// Utilidad para dividir el mensaje en dos líneas
function splitMessage(message: string): [string, string] {
  // Si el mensaje tiene menos de 6 palabras, rellena con puntos
  const words = message.split(' ');
  if (words.length < 6) {
    while (words.length < 6) {
      words.push('...');
    }
  }
  // Si tiene más de 8, recorta y agrega "..."
  if (words.length > 8) {
    return [words.slice(0, 4).join(' '), words.slice(4, 8).join(' ') + '...'];
  }
  // Normal: 1ra línea 3-4 palabras, 2da el resto
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

export function useHeroTextAnimation() {
  const [index, setIndex] = useState(0);
  const [effect, setEffect] = useState(EFFECTS[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animRef = useRef<HTMLDivElement | null>(null);

  const message = MESSAGES[index % MESSAGES.length] || '';
  const [line1, line2] = splitMessage(message);

  // Typewriter effect logic
  useEffect(() => {
    if (effect !== 'typewriter') {
      return;
    }
    setIsTyping(true);
    setTypewriterText('');
    let i = 0;
    const full = `${line1}\n${line2}`;
    function type() {
      setTypewriterText(full.slice(0, i));
      if (i < full.length) {
        i++;
        timeoutRef.current = setTimeout(type, 30);
      } else {
        setIsTyping(false);
      }
    }
    type();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line
  }, [index, effect]);

  // Animación GSAP para otros efectos
  useEffect(() => {
    if (!animRef.current || effect === 'typewriter') {
      return;
    }
    const tl = gsap.timeline();
    switch (effect) {
      case 'fade':
        tl.fromTo(animRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 });
        break;
      case 'slide':
        tl.fromTo(animRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 });
        break;
      case 'scale':
        tl.fromTo(animRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7 });
        break;
      case 'colorSwap':
        tl.fromTo(animRef.current, { color: '#fff' }, { color: 'var(--color-primary)', duration: 0.7, yoyo: true, repeat: 1 });
        break;
      case 'blur':
        tl.fromTo(animRef.current, { filter: 'blur(8px)', opacity: 0 }, { filter: 'blur(0px)', opacity: 1, duration: 0.7 });
        break;
      case 'wordFlip':
        tl.fromTo(animRef.current, { rotateX: 90, opacity: 0 }, { rotateX: 0, opacity: 1, duration: 0.7 });
        break;
      default:
        break;
    }
    return () => {
      tl.kill();
    };
  }, [index, effect]);

  // Cambio automático de mensaje y efecto
  useEffect(() => {
    if (effect === 'typewriter' && isTyping) {
      return;
    }
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
      setEffect(EFFECTS[Math.floor(Math.random() * EFFECTS.length)]);
    }, 3500);
    return () => clearTimeout(timer);
  }, [index, effect, isTyping]);

  return {
    line1,
    line2,
    effect,
    typewriterText,
    isTyping,
    animRef,
    currentMessage: message,
  };
}
