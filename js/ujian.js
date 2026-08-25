let currentQuestionIndex = 0;
let userAnswers = {};
let timerInterval;
let timeLeft = 3600;

const questions = [
  {
    id: 1,
    text: "Sebuah tim proyek mengalami penurunan kinerja setelah terjadi konflik antaranggota tim. Sebagai ketua tim, langkah pertama yang berbasis analisis masalah secara kritis adalah...",
    options: [
      { id: "A", text: "Langsung mengganti anggota tim yang paling sering memicu perdebatan." },
      { id: "B", text: "Mengumpulkan bukti/data objektif terkait akar konflik dan dampaknya terhadap capaian tugas." },
      { id: "C", text: "Melaporkan langsung masalah ini kepada dosen pengampu tanpa dialog internal." },
      { id: "D", text: "Abaikan konflik dan fokus menyelesaikan sisa pekerjaan secara individu." }
    ]
  },
  {
    id: 2,
    text: "Dalam mengevaluasi data hasil survei kepuasan organisasi, Anda menemukan data yang saling bertolak belakang antara kelompok senior dan junior. Sikap inferensi kritis Anda adalah...",
    options: [
      { id: "A", text: "Membuang data kelompok junior karena kurang berpengalaman." },
      { id: "B", text: "Memilih data yang mendukung hipotesis awal Anda saja." },
      { id: "C", text: "Menganalisis pola perbedaan persepsi antara kedua kelompok secara objektif sebelum menarik kesimpulan." },
      { id: "D", text: "Mengambil rata-rata matematis tanpa mempertimbangkan konteks kualitatif." }
    ]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  displayUserInfo();
  loadQuestion();
  startTimer();
});

function displayUserInfo() {
  const studentElem = document.getElementById("studentInfo");
  if (!studentElem) return;

  const rawUser = localStorage.getItem("cbt_auth_user") || 
                  localStorage.getItem("user") || 
                  sessionStorage.getItem("cbt_auth_user");
  
  let user = null;
  if (rawUser) {
    try { user = JSON.parse(rawUser); } catch (e) {}
  }

  const nama = (user && (user.nama || user.name)) ? (user.nama || user.name) : "Andi Saputra";
  const nim = (user && (user.identifier || user.nim)) ? (user.identifier || user.nim) : "22101001";

  studentElem.textContent = `Mahasiswa: ${nama} (${nim})`;
}

function loadQuestion() {
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
  if (confirm("Apakah Anda yakin ingin menyelesaikan ujian?")) {
    clearInterval(timerInterval);
    alert("Ujian Selesai! Jawaban Anda telah tersimpan.");
    window.location.href = "mahasiswa.html";
  }
}
