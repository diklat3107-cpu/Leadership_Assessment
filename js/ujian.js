// Ganti URL ini dengan URL Web App Google Apps Script Anda
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxs-5HAAB20TqkVoDJu1y-en3LLCHJrI0BsFMrN1xS_i4AU3HdLh2kGeudJ0rnD_t68gQ/exec";

let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let timerInterval;
let timeLeft = 3600;

document.addEventListener("DOMContentLoaded", () => {
  displayUserInfo();
  fetchQuestions();
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
      // Menangani format respons successResponse dari Code.gs
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
  document.getElementById("questionText").textContent = q.text;

  const container = document.getElementById("optionsContainer");
  container.innerHTML = "";
  q.options.forEach(opt => {
    const isChecked = userAnswers[q.id] === opt.id ? "checked" : "";
    container.innerHTML += `
      <label class="option-item">
        <input type="radio" name="answer" value="${opt.id}" ${isChecked} onchange="saveAnswer(${q.id}, '${opt.id}')">
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
  if (!confirm("Apakah Anda yakin ingin menyelesaikan ujian?")) return;

  clearInterval(timerInterval);
  
  // Hitung Skor
  let score = 0;
  questions.forEach(q => {
    if (userAnswers[q.id] && userAnswers[q.id] === q.key) {
      score += (100 / questions.length);
    }
  });

  const rawUser = localStorage.getItem("cbt_auth_user") || sessionStorage.getItem("cbt_auth_user");
  let user = { nama: "Andi Saputra", nim: "22101001" };
  if (rawUser) { try { user = JSON.parse(rawUser); } catch(e){} }

  const payload = {
    action: "submitExam",
    student: user,
    score: Math.round(score),
    totalQuestions: questions.length,
    answers: userAnswers
  };

  // Kirim data dengan format URLSearchParams (Menghindari CORS Error pada Apps Script)
  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload)
  })
  .then(() => {
    alert(`Ujian Selesai! Skor Anda: ${Math.round(score)}\nData berhasil dikirim ke server.`);
    window.location.href = "mahasiswa.html";
  })
  .catch(err => {
    console.error("Error submitting exam:", err);
    alert(`Ujian Selesai! Skor Anda: ${Math.round(score)} (Gagal simpan ke server)`);
    window.location.href = "mahasiswa.html";
  });
}
