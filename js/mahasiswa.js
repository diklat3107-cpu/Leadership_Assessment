document.addEventListener("DOMContentLoaded", () => {
  renderUserInfo();
  renderExamResultCard();
  renderExamList();
});

// 1. Tampilkan Informasi Mahasiswa di Navbar
function renderUserInfo() {
  const rawUser = localStorage.getItem("cbt_auth_user") || sessionStorage.getItem("cbt_auth_user");
  let user = null;
  if (rawUser) {
    try { user = JSON.parse(rawUser); } catch (e) {}
  }

  const nama = (user && (user.nama || user.name)) ? (user.nama || user.name) : "Mahasiswa";
  const nim = (user && (user.identifier || user.nim)) ? (user.identifier || user.nim) : "NIM";

  const userNameElem = document.getElementById("userName");
  const userNimElem = document.getElementById("userNim");

  if (userNameElem) userNameElem.textContent = nama;
  if (userNimElem) userNimElem.textContent = nim;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("cbt_auth_user");
      sessionStorage.removeItem("cbt_auth_user");
      window.location.href = "login.html";
    });
  }
}

// 2. Tampilkan Card Hasil Ujian & Grafik Facione jika ada data ujian
function renderExamResultCard() {
  const resultCard = document.getElementById("resultAnalysisCard");
  const rawResult = sessionStorage.getItem("last_exam_result");

  if (!rawResult || !resultCard) return;

  try {
    const result = JSON.parse(rawResult);
    resultCard.style.display = "block";

    // Set Skor Akhir
    document.getElementById("finalScoreVal").textContent = result.score || 0;

    // Set Format Tanggal
    if (result.timestamp) {
      const date = new Date(result.timestamp);
      document.getElementById("resultTimestamp").textContent = `Tanggal Ujian: ${date.toLocaleString('id-ID')}`;
    }

    const stats = result.dimensionStats || {};
    const labels = Object.keys(stats);
    const scores = labels.map(key => stats[key].percentage);

    // Render Breakdown List
    const breakdownContainer = document.getElementById("dimensionBreakdownList");
    if (breakdownContainer) {
      breakdownContainer.innerHTML = labels.map(dim => {
        const item = stats[dim];
        return `
          <div style="background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; font-size: 13px; color: #334155;">${dim}</span>
            <span style="font-size: 13px; font-weight: 700; color: ${item.percentage >= 70 ? '#16a34a' : '#d97706'};">
              ${item.correct}/${item.total} Soal (${item.percentage}%)
            </span>
          </div>
        `;
      }).join('');
    }

    // Render Chart.js Radar Chart
    const ctx = document.getElementById("facioneRadarChart");
    if (ctx && typeof Chart !== "undefined") {
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Penguasaan Dimensi (%)',
            data: scores,
            backgroundColor: 'rgba(37, 99, 235, 0.2)',
            borderColor: '#2563eb',
            borderWidth: 2,
            pointBackgroundColor: '#2563eb'
          }]
        },
        options: {
          responsive: true,
          scales: {
            r: {
              angleLines: { color: '#e2e8f0' },
              grid: { color: '#e2e8f0' },
              suggestedMin: 0,
              suggestedMax: 100
            }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }
  } catch (e) {
    console.error("Gagal membaca hasil ujian dari sessionStorage:", e);
  }
}

// 3. Tampilkan Card Ujian yang Tersedia
function renderExamList() {
  const container = document.getElementById("assessmentList");
  if (!container) return;

  container.innerHTML = `
    <div class="exam-card">
      <div class="exam-card-header">
        <span class="badge badge-primary">Mata Kuliah Kepemimpinan</span>
        <span class="badge badge-success">Tersedia</span>
      </div>
      <h3 class="exam-title">Critical Thinking Assessment - Leadership</h3>
      <p class="exam-desc">Pengukuran kemampuan analisis, evaluasi, dan inferensi melalui studi kasus dinamika kepemimpinan.</p>
      
      <div class="exam-meta">
        <div><strong>Waktu:</strong> 60 Menit</div>
        <div><strong>Jumlah Soal:</strong> 15 Soal Kasus (Komprehensif)</div>
        <div><strong>Standar:</strong> Facione Critical Thinking Framework</div>
      </div>
      
      <div class="exam-action">
        <button onclick="window.location.href='ujian.html'" class="btn btn-primary" style="padding: 10px 24px; font-weight: 600; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Mulai Kerjakan Ujian
        </button>
      </div>
    </div>
  `;
}
