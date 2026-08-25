const API = {
  async request(payload) {
    try {
      const response = await fetch(CONFIG.API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Koneksi internet bermasalah." };
    }
  },

  async login(identifier, password) {
    return await this.request({
      action: "login",
      identifier: identifier.trim(),
      password: password,
      user_agent: navigator.userAgent
    });
  },

  async validateSession(token) {
    return await this.request({ action: "validateSession", token: token });
  },

  async logout(token) {
    return await this.request({ action: "logout", token: token });
  }
};