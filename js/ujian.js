// Ganti URL ini dengan URL Web App Google Apps Script Anda
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxs-5HAAB20TqkVoDJu1y-en3LLCHJrI0BsFMrN1xS_i4AU3HdLh2kGeudJ0rnD_t68gQ/exec";

let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let timerInterval;
let timeLeft = 3600;

// Variabel untuk melacak pelanggaran kecurangan & pengaman submit
let violationCount = 0;
const MAX_VIOLATIONS = 3; 
let isSubmitting = false; // Flag penting untuk mencegah looping alert/submit

document.addEventListener("DOMContentLoaded", () => {
  displayUserInfo();
  fetchQuestions();
  setupProctoring(); 
});

function displayUserInfo() {
  const studentElem = document.getElementById("studentInfo");
  if (!studentElem) return;

  const rawUser = localStorage.getItem("cbt_auth_user") || sessionStorage.getItem("cbt_auth_user");
  let user = null;
  if (rawUser) {
    try { user = JSON.parse(rawUser); } catch (e) {}
  }

  const nama = (user && (user.nama || user.name)) ? (user.nama || user.name) : "Mahasiswa";
  const nim = (user && (user.identifier || user.nim)) ? (user.identifier || user.nim) : "NIM";

  studentElem.textContent = `Mahasiswa: ${nama} (${nim})`;
}

// Fetch soal dari Google Sheets
function fetchQuestions() {
  const questionTextElem = document.getElementById("questionText");
  if (questionTextElem) questionTextElem.textContent = "Mengambil soal dari server...";

  fetch(`${SCRIPT_URL}?action=getQuestions`)
    .then(res => res.json())
    .then(res => {
      const questionData = res.data || (Array.isArray(res) ? res : null);
      
      if (questionData && questionData.length > 0) {
        questions = questionData;
        currentQuestionIndex = 0;
        loadQuestion();
        startTimer();
      } else {
        console.warn("Respons server kosong atau format tidak sesuai:", res);
        alert("Gagal memuat soal dari server. Menggunakan soal cadangan.");
        useFallbackQuestions();
      }
    })
    .catch(err => {
      console.error("Error fetching questions:", err);
      alert("Gagal memuat soal dari server. Menggunakan soal cadangan.");
      useFallbackQuestions();
    });
}

function useFallbackQuestions() {
  questions = [
    {
      id: 1,
      facione_dimension: "ANALYSIS",
      text: "Sebuah tim proyek mengalami penurunan kinerja setelah terjadi konflik antaranggota tim. Langkah pertama yang berbasis analisis masalah secara kritis adalah...",
      options: [
        { id: "A", text: "Langsung mengganti anggota tim yang paling sering memicu perdebatan." },
        { id: "B", text: "Mengumpulkan bukti/data objektif terkait akar konflik dan dampaknya terhadap capaian tugas." },
        { id: "C", text: "Melaporkan langsung masalah ini kepada dosen pengampu tanpa dialog internal." },
        { id: "D", text: "Abaikan konflik dan fokus menyelesaikan sisa pekerjaan secara individu." }
      ],
      key: "B"
    }
  ];
  loadQuestion();
  startTimer();
}

function loadQuestion() {
  if (questions.length === 0) return;

  const q = questions[currentQuestionIndex];
  
  document.getElementById("questionNum").textContent = `Soal ${currentQuestionIndex + 1} dari ${questions.length}`;

  const dimensionElem = document.getElementById("facioneDimension");
  if (dimensionElem) {
    if (q.facione_dimension) {
      dimensionElem.textContent = `Dimensi: ${q.facione_dimension}`;
      dimensionElem.style.display = "inline-block";
    } else {
      dimensionElem.style.display = "none";
    }
  }

  document.getElementById("questionText").textContent = q.text;

  const container = document.getElementById("optionsContainer");
  container.innerHTML = "";
  q.options.forEach(opt => {
    const isChecked = userAnswers[q.id] === opt.id ? "checked" : "";
    container.innerHTML += `
      <label class="option-item">
        <input type="radio" name="answer" value="${opt.id}" ${isChecked} onchange="saveAnswer('${q.id}', '${opt.id}')">
        <div><strong>${opt.id}.</strong> ${opt.text}</div>
      </label>
    `;
  });

  document.getElementById("prevBtn").disabled = currentQuestionIndex === 0;
  if (currentQuestionIndex === questions.length - 1) {
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("submitBtn").style.display = "block";
  } else {
    document.getElementById("nextBtn").style.display = "block";
    document.getElementById("submitBtn").style.display = "none";
  }
}

function saveAnswer(questionId, optionId) { userAnswers[questionId] = optionId; }
function nextQuestion() { if (currentQuestionIndex < questions.length - 1) { currentQuestionIndex++; loadQuestion(); } }
function prevQuestion() { if (currentQuestionIndex > 0) { currentQuestionIndex--; loadQuestion(); } }

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timer").textContent = `Sisa Waktu: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("Waktu ujian telah habis!");
      finishExam();
    }
  }, 1000);
}

function finishExam() {
  // Jika sudah dalam proses submit, abaikan pemanggilan berulang
  if (isSubmitting) return;

  // Jika dipanggil manual via tombol, minta konfirmasi
  // Jika dipanggil otomatis karena pelanggaran/waktu habis, langsung lewati konfirmasi
  if (event && event.type === 'click') {
    if (!confirm("Apakah Anda yakin ingin menyelesaikan ujian?")) return;
  }

  isSubmitting = true; // Kunci agar event proctoring tidak memicu pelanggaran lagi
  clearInterval(timerInterval);
  
  // Matikan event listener proctoring agar tidak mendeteksi aktivitas lagi saat pengiriman
  window.removeEventListener("blur", handleBlurEvent);
  document.removeEventListener("visibilitychange", handleVisibilityEvent);

  let score = 0;
  const dimensionStats = {};

  questions.forEach(q => {
    const dim = (q.facione_dimension || "UNSPECIFIED").toUpperCase().trim();
    if (!dimensionStats[dim]) {
      dimensionStats[dim] = { total: 0, correct: 0, percentage: 0 };
    }
    dimensionStats[dim].total += 1;

    if (userAnswers[q.id] && userAnswers[q.id] === q.key) {
      score += (100 / questions.length);
      dimensionStats[dim].correct += 1;
    }
  });

  Object.keys(dimensionStats).forEach(dim => {
    const stat = dimensionStats[dim];
    stat.percentage = Math.round((stat.correct / stat.total) * 100);
  });

  const rawUser = localStorage.getItem("cbt_auth_user") || sessionStorage.getItem("cbt_auth_user");
  let user = { nama: "Andi Saputra", nim: "22101001" };
  if (rawUser) { try { user = JSON.parse(rawUser); } catch(e){} }

  const finalScore = Math.round(score);

  const payload = {
    action: "submitExam",
    student: user,
    score: finalScore,
    totalQuestions: questions.length,
    answers: userAnswers,
    questions: questions
  };

  const resultStorageData = {
    score: finalScore,
    totalQuestions: questions.length,
    dimensionStats: dimensionStats,
    timestamp: new Date().toISOString()
  };
  sessionStorage.setItem("last_exam_result", JSON.stringify(resultStorageData));

  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload)
  })
  .then(() => {
    alert(`Ujian Selesai!\nSkor Anda: ${finalScore}\nData berhasil dikirim ke server.`);
    window.location.href = "mahasiswa.html";
  })
  .catch(err => {
    console.error("Error submitting exam:", err);
    alert(`Ujian Selesai!\nSkor Anda: ${finalScore} (Gagal simpan ke server)`);
    window.location.href = "mahasiswa.html";
  });
}

// --- Fungsi Pengawasan (Proctoring) yang Diperbaiki ---

function setupProctoring() {
  document.addEventListener("visibilitychange", handleVisibilityEvent);
  window.addEventListener("blur", handleBlurEvent);
}

function handleVisibilityEvent() {
  if (document.hidden && !isSubmitting) {
    handleViolation("Pindah Tab / Browser Diminimalkan");
  }
}

function handleBlurEvent() {
  // Hanya tangkap blur jika benar-benar tidak sedang submit dan halaman tersembunyi/kehilangan fokus
  if (!isSubmitting && document.hasFocus() === false) {
    // Opsional: Untuk mencegah double trigger bersamaan dengan visibilitychange, 
    // kita bisa fokuskan pengecekan pada visibilitychange saja atau berikan jeda.
    // Di sini kita gunakan penanganan aman:
  }
}

// Kita sederhanakan fungsi pemicu pelanggaran agar menggunakan satu pintu terpusat
function handleViolation(reason) {
  if (isSubmitting) return; // Jangan deteksi pelanggaran jika ujian sudah mau/sedang disubmit

  violationCount++;
  sendViolationToServer(reason);

  if (violationCount >= MAX_VIOLATIONS) {
    isSubmitting = true;
    alert(`PERINGATAN KERAS!\nAnda telah berpindah layar sebanyak ${violationCount} kali.\nUjian Anda dihentikan dan jawaban akan otomatis dikirim!`);
    finishExam();
  } else {
    alert(`PERINGATAN KECURANGAN (${violationCount}/${MAX_VIOLATIONS})!\nSistem mendeteksi Anda meninggalkan layar ujian (${reason}). Harap tetap di halaman ujian!`);
  }
}

function sendViolationToServer(reason) {
  const rawUser = localStorage.getItem("cbt_auth_user") || sessionStorage.getItem("cbt_auth_user");
  let user = { nama: "Mahasiswa", nim: "-" };
  if (rawUser) { try { user = JSON.parse(rawUser); } catch(e){} }

  const payload = {
    action: "logViolation",
    student: user,
    violationType: reason,
    count: violationCount,
    timestamp: new Date().toISOString()
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });
}
