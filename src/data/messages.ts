import { felicidadMessages, orgulloMessages } from './messages-group1';
import { tristezaMessages, ansiedadMessages } from './messages-group2';
import { pensivaMessages, faltaMotivacionMessages } from './messages-group3';

export type EmotionKey = 'felicidad' | 'tristeza' | 'pensiva' | 'ansiedad' | 'faltaMotivacion' | 'orgullo';

export interface EmotionData {
  key: EmotionKey;
  label: string;
  bgImage: string;
  messages: string[];
}

export const emotions: EmotionData[] = [
  {
    key: 'felicidad',
    label: 'Felicidad',
    bgImage: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2070&auto=format&fit=crop',
    messages: felicidadMessages,
  },
  {
    key: 'tristeza',
    label: 'Tristeza',
    bgImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1974&auto=format&fit=crop',
    messages: tristezaMessages,
  },
  {
    key: 'pensiva',
    label: 'Pensativa',
    bgImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop',
    messages: pensivaMessages,
  },
  {
    key: 'ansiedad',
    label: 'Ansiedad',
    bgImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop',
    messages: ansiedadMessages,
  },
  {
    key: 'faltaMotivacion',
    label: 'Sin Motivación',
    bgImage: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=2064&auto=format&fit=crop',
    messages: faltaMotivacionMessages,
  },
  {
    key: 'orgullo',
    label: 'Orgullo',
    bgImage: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2076&auto=format&fit=crop',
    messages: orgulloMessages,
  },
];

export function getRandomMessage(emotion: EmotionData): string {
  const idx = Math.floor(Math.random() * emotion.messages.length);
  return emotion.messages[idx];
}
