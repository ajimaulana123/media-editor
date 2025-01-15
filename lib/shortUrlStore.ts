interface UrlMapping {
  [key: string]: {
    longUrl: string;
    createdAt: number;
  };
}

// Simpan mapping di memory
const urlMappings: UrlMapping = {};

// Waktu expired 24 jam dalam milidetik
const EXPIRY_TIME = 24 * 60 * 60 * 1000;

export const shortUrlStore = {
  create: (longUrl: string, shortCode: string) => {
    urlMappings[shortCode] = {
      longUrl,
      createdAt: Date.now(),
    };
    return shortCode;
  },

  get: (shortCode: string) => {
    const mapping = urlMappings[shortCode];
    if (!mapping) return null;

    // Cek apakah URL sudah expired
    if (Date.now() - mapping.createdAt > EXPIRY_TIME) {
      delete urlMappings[shortCode];
      return null;
    }

    return mapping.longUrl;
  },

  // Opsional: Method untuk membersihkan URL yang expired
  cleanup: () => {
    const now = Date.now();
    Object.keys(urlMappings).forEach(shortCode => {
      if (now - urlMappings[shortCode].createdAt > EXPIRY_TIME) {
        delete urlMappings[shortCode];
      }
    });
  }
}; 