import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'app.title': 'Q-MAP Intelligent Route Optimization',
      'nav.planner': 'Route Planner',
      'nav.history': 'History',
      'nav.analytics': 'Analytics',
      'nav.settings': 'Settings',
      'route.origin': 'Origin Location',
      'route.destination': 'Destination Location',
      'route.addStop': 'Add Stop',
      'route.optimize': 'Run Quantum Optimization (QIGA)',
      'route.recommended': 'Recommended Route',
      'route.alternative': 'Alternative Route',
      'route.fitness': 'Pareto Fitness',
      'route.startNav': 'Start Navigation',
    },
  },
  hi: {
    translation: {
      'app.title': 'Q-MAP इंटेलिजेंट रूट ऑप्टिमाइज़ेशन',
      'nav.planner': 'रूट प्लानर',
      'nav.history': 'इतिहास',
      'nav.analytics': 'एनालिटिक्स',
      'nav.settings': 'सेटिंग्स',
      'route.origin': 'प्रस्थान स्थान',
      'route.destination': 'गंतव्य स्थान',
      'route.addStop': 'स्टॉप जोड़ें',
      'route.optimize': 'क्वांटम ऑप्टिमाइज़ेशन चलाएं (QIGA)',
      'route.recommended': 'अनुशंसित मार्ग',
      'route.alternative': 'वैकल्पिक मार्ग',
      'route.fitness': 'फिटनेस स्कोर',
      'route.startNav': 'नेविगेशन शुरू करें',
    },
  },
  gu: {
    translation: {
      'app.title': 'Q-MAP ઈન્ટેલિજન્ટ રૂટ ઓપ્ટિમાઇઝેશન',
      'nav.planner': 'રૂટ પ્લાનર',
      'nav.history': 'ઇતિહાસ',
      'nav.analytics': 'એનાલિટિક્સ',
      'nav.settings': 'સેટિંગ્સ',
      'route.origin': 'શરૂઆતનું સ્થળ',
      'route.destination': 'ગંતવ્ય સ્થળ',
      'route.addStop': 'સ્ટોપ ઉમેરો',
      'route.optimize': 'ક્વોન્ટમ ઓપ્ટિમાઇઝેશન ચલાવો (QIGA)',
      'route.recommended': 'ભલામણ કરેલ માર્ગ',
      'route.alternative': 'વૈકલ્પિક માર્ગ',
      'route.fitness': 'ફિટનેસ સ્કોર',
      'route.startNav': 'નેવિગેશન શરૂ કરો',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
