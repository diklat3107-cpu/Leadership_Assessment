const CONFIG = {
  // Ganti URL di bawah ini dengan URL Web App Google Apps Script Anda
  API_URL: "https://script.google.com/macros/s/AKfycbx_Ganti_Dengan_Deployment_ID_Anda/exec",
  
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