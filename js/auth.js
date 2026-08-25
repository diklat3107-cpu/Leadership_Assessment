const Auth = {
  saveSession(sessionData) {
    const { user, session } = sessionData;
    sessionStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, session.token);
    sessionStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    sessionStorage.setItem(CONFIG.STORAGE_KEYS.EXPIRES_AT, session.expires_at);
  },

  getToken() { return sessionStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN); },
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

  redirectUserByRole(role) {
    window.location.href = CONFIG.ROUTES[role] || CONFIG.ROUTES.LOGIN;
  },

  async logout() {
    const token = this.getToken();
    if (token) await API.logout(token);
    this.clearSession();
    window.location.href = CONFIG.ROUTES.LOGIN;
  }
};