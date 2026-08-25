/**
 * Dashboard Mahasiswa Logic
 */
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Proteksi Halaman: Hanya Role 'MAHASISWA' yang Boleh Masuk
  const user = await Auth.protectPage(["MAHASISWA"]);
  if (!user) return; 

  // 2. Tampilkan Data Profil Mahasiswa
  renderProfile(user);

  // 3. Pasang Event Listener Tombol Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
        Auth.logout();
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

  // Membaca property nama dan identifier/nim dengan lebih fleksibel
  const name = user.nama || user.name || "Mahasiswa";
  const nim = user.identifier || user.nim || user.email || "-";

  if (userNameElem) userNameElem.textContent = name;
  if (userNimElem) userNimElem.textContent = nim;
}

/**
 * Memuat Daftar Ujian
 */
async function loadAssessments() {
  const container = document.getElementById("assessmentList");
  if (!container) return;

  // Data Ujian Berpikir Kritis Facione
  const mockExam = {
    id: "EXAM_FACIONE_01",
    title: "Critical Thinking Assessment - Leadership",
    duration: "60 Menit",
    totalQuestions: "15 Soal Kasus (Komprehensif)",
    framework: "Facione Critical Thinking Framework",
    status: "READY"
  };

  // Render Card Ujian ke Halaman
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

  // Listener Tombol Mulai Ujian
  const startBtn = document.getElementById("startExamBtn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      alert("Selamat! Anda siap melangkah ke PHASE 4 (Lembar Ujian & Pengerjaan Soal).");
    });
  }
}
