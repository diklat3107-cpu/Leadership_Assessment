const Auth = {
  saveSession(sessionData) {
    const { user, session } = sessionData;
    sessionStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, session.token || session.session_id);
    sessionStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    sessionStorage.setItem(CONFIG.STORAGE_KEYS.EXPIRES_AT, session.expires_at);
  },

  getToken() { 
    return sessionStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN); 
  },

  getUser() {
    const userData = sessionStorage.getItem(CONFIG.STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated() {
    const token = this.getToken();
    const expiresAt = sessionStorage.getItem(CONFIG.STORAGE_KEYS.EXPIRES_AT);
    if (!token || !expiresAt) return false;
    return new Date() < new Date(expiresAt);
  },

  clearSession() {
    sessionStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
    sessionStorage.removeItem(CONFIG.STORAGE_KEYS.EXPIRES_AT);
  },

  /**
   * Mengarahkan pengguna berdasarkan role secara dinamis
   */
  redirectUserByRole(role) {
    const normalizedRole = (role || "").toLowerCase().trim();
    
    // Cek apakah ada rute khusus di CONFIG.ROUTES, atau arahkan manual
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
