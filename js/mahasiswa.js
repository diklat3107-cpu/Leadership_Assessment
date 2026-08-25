/**
 * Dashboard Mahasiswa Logic
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Ambil Data User dari LocalStorage
  const userJson = localStorage.getItem("cbt_auth_user") || 
                   localStorage.getItem("user") || 
                   sessionStorage.getItem("cbt_auth_user");
  
  let user = null;
  if (userJson) {
    try {
      user = JSON.parse(userJson);
    } catch (e) {
      console.error("Gagal parse data user", e);
    }
  }

  // Tampilkan profil pengguna
  if (user) {
    renderProfile(user);
  } else {
    renderProfile({ nama: "Mahasiswa Assessment", identifier: "22101001" });
  }

  // 2. Event Listener Tombol Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "index.html";
      }
    });
  }

  // 3. Muat Daftar Ujian
  loadAssessments();
});

/**
 * Menampilkan Informasi Profil Pengguna di Header
 */
function renderProfile(user) {
  const userNameElem = document.getElementById("userName");
  const userNimElem = document.getElementById("userNim");

  const name = user.nama || user.name || "Mahasiswa";
  const nim = user.identifier || user.nim || user.email || "-";

  if (userNameElem) userNameElem.textContent = name;
  if (userNimElem) userNimElem.textContent = nim;
}

/**
 * Memuat Daftar Ujian
 */
function loadAssessments() {
  const container = document.getElementById("assessmentList");
  if (!container) return;

  const mockExam = {
    id: "EXAM_FACIONE_01",
    title: "Critical Thinking Assessment - Leadership",
    duration: "60 Menit",
    totalQuestions: "15 Soal Kasus (Komprehensif)",
    framework: "Facione Critical Thinking Framework"
  };

  container.innerHTML = `
    <div class="exam-card" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-top: 24px;">
      <div class="exam-card-header" style="display: flex; justify-content: space-between; margin-bottom: 16px;">
        <span class="badge" style="background: #e0e7ff; color: #3730a3; padding: 6px 12px; border-radius: 20px; font-weight: 600; font-size: 12px;">Mata Kuliah Kepemimpinan</span>
        <span class="badge" style="background: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 20px; font-weight: 600; font-size: 12px;">Tersedia</span>
      </div>
      <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 20px;">${mockExam.title}</h3>
      <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">Pengukuran kemampuan analisis, evaluasi, dan inferensi melalui studi kasus dinamika kepemimpinan.</p>
      
      <div style="display: flex; gap: 24px; margin-bottom: 24px; font-size: 14px; color: #334155;">
        <div><strong>Waktu:</strong> ${mockExam.duration}</div>
        <div><strong>Jumlah Soal:</strong> ${mockExam.totalQuestions}</div>
        <div><strong>Standar:</strong> ${mockExam.framework}</div>
      </div>

      <div>
        <button id="startExamBtn" style="background: #1d4ed8; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer;">
          Mulai Kerjakan Ujian
        </button>
      </div>
    </div>
  `;

  const startBtn = document.getElementById("startExamBtn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      window.location.href = "ujian.html";
    });
  }
}
