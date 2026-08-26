const Auth = {
  saveSession(sessionData) {
    const { user, session } = sessionData;
    // Menggunakan localStorage agar data sesi tetap persisten antar halaman
    localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, session.token || session.session_id);
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(CONFIG.STORAGE_KEYS.EXPIRES_AT, session.expires_at);
  },

  getToken() { 
    return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN); 
  },

  getUser() {
    const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated() {
    const token = this.getToken();
    const expiresAt = localStorage.getItem(CONFIG.STORAGE_KEYS.EXPIRES_AT);
    if (!token || !expiresAt) return false;
    return new Date() < new Date(expiresAt);
  },

  clearSession() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.EXPIRES_AT);
  },

  /**
   * Mengarahkan pengguna berdasarkan role secara dinamis
   */
  redirectUserByRole(role) {
    const normalizedRole = (role || "").toLowerCase().trim();
    
    // Pengalihan cerdas berdasarkan role
    if (normalizedRole === "dosen" || normalizedRole === "admin" || normalizedRole === "lecturer") {
      window.location.href = "dosen.html";
    } else if (CONFIG.ROUTES && CONFIG.ROUTES[normalizedRole]) {
      window.location.href = CONFIG.ROUTES[normalizedRole];
    } else {
      window.location.href = "mahasiswa.html"; // Default fallback ke mahasiswa/ujian
    }
  },

  async logout() {
    const token = this.getToken();
    if (token) {
      try {
        await API.logout(token);
      } catch (err) {
        console.error("Gagal logout di server:", err);
      }
    }
    this.clearSession();
    window.location.href = CONFIG.ROUTES && CONFIG.ROUTES.LOGIN ? CONFIG.ROUTES.LOGIN : "index.html";
  }
};
