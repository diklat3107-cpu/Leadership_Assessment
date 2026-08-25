/**
 * Dashboard Mahasiswa Logic
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Ambil Data User dari LocalStorage
  const userJson = localStorage.getItem("cbt_auth_user");
  
  if (!userJson) {
    // Jika belum login, kembalikan ke halaman login
    window.location.href = "index.html";
    return;
  }

  const user = JSON.parse(userJson);

  // 2. Tampilkan Data Profil Mahasiswa
  renderProfile(user);

  // 3. Pasang Event Listener Tombol Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
        localStorage.clear();
        window.location.href = "index.html";
      }
    });
  }

  // 4. Muat Daftar Assessment/Ujian
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
    framework: "Facione Critical Thinking Framework",
    status: "READY"
  };

  container.innerHTML = `
    <div class="exam-card">
      <div class="exam-card-header">
        <span class="badge badge-primary">Mata Kuliah Kepemimpinan</span>
        <span class="badge badge-success">Tersedia</span>
      </div>
      <h3 class="exam-title">${mockExam.title}</h3>
      <p class="exam-desc">Pengukuran kemampuan analisis, evaluasi, dan inferensi melalui studi kasus dinamika kepemimpinan.</p>
      
      <div class="exam-meta">
        <div class="meta-item">
          <strong>Waktu:</strong> ${mockExam.duration}
        </div>
        <div class="meta-item">
          <strong>Jumlah Soal:</strong> ${mockExam.totalQuestions}
        </div>
        <div class="meta-item">
          <strong>Standar:</strong> ${mockExam.framework}
        </div>
      </div>

      <div class="exam-action">
        <button id="startExamBtn" class="btn-primary" style="width: auto; padding: 10px 24px;">
          Mulai Kerjakan Ujian
        </button>
      </div>
    </div>
  `;

  const startBtn = document.getElementById("startExamBtn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      alert("Selamat! Anda siap melangkah ke PHASE 4 (Lembar Ujian & Pengerjaan Soal).");
    });
  }
}
