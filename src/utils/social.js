import { SITE_CONFIG } from './constants.js';

// Social sharing utilities
export const socialShare = {
  whatsapp: (text, url = window.location.href) => {
    const message = encodeURIComponent(`${text} - ${url}`);
    window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${message}`, '_blank');
  },

  facebook: (url = window.location.href) => {
    const shareUrl = encodeURIComponent(url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
  },

  twitter: (text, url = window.location.href) => {
    const tweet = encodeURIComponent(`${text} ${url}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
  },

  generic: (title = document.title, url = window.location.href) => {
    if (navigator.share) {
      navigator.share({ title, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('URL copiada al portapapeles');
    }
  }
};

// Contact utilities
export const contact = {
  phone: () => window.open(`tel:${SITE_CONFIG.phone}`),
  email: () => window.open(`mailto:${SITE_CONFIG.email}`),
  whatsapp: (message = 'Hola, me gustaría obtener más información') => {
    const text = encodeURIComponent(message);
    window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${text}`, '_blank');
  }
};

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.socialShare = socialShare;
  window.contact = contact;
}