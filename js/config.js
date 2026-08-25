const CONFIG = {
  // Ganti URL di bawah ini dengan URL Web App Google Apps Script Anda
  API_URL: "https://script.google.com/macros/s/AKfycbxs-5HAAB20TqkVoDJu1y-en3LLCHJrI0BsFMrN1xS_i4AU3HdLh2kGeudJ0rnD_t68gQ/exec",
  
  STORAGE_KEYS: {
    TOKEN: "cbt_auth_token",
    USER: "cbt_auth_user",
    EXPIRES_AT: "cbt_auth_expires"
  },

  ROUTES: {
    MAHASISWA: "mahasiswa.html",
    DOSEN: "dosen.html",
    ADMIN: "dosen.html",
    LOGIN: "index.html"
  }
};

Object.freeze(CONFIG);
