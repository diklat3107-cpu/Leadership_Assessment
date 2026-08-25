let currentQuestionIndex = 0;
let userAnswers = {};
let timerInterval;
let timeLeft = 3600; // 60 menit dalam detik

// Data Soal Simulasi Berpikir Kritis (Facione Framework)
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
  const userJson = localStorage.getItem("cbt_auth_user");
  if (userJson) {
    const user = JSON.parse(userJson);
    document.getElementById("studentInfo").textContent = `${user.nama || "Mahasiswa"} (${user.identifier || user.nim || "-"})`;
  }

  loadQuestion();
  startTimer();
});

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

  // Atur Navigasi Tombol
  document.getElementById("prevBtn").disabled = currentQuestionIndex === 0;
  if (currentQuestionIndex === questions.length - 1) {
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("submitBtn").style.display = "block";
  } else {
    document.getElementById("nextBtn").style.display = "block";
    document.getElementById("submitBtn").style.display = "none";
  }
}

function saveAnswer(questionId, optionId) {
  userAnswers[questionId] = optionId;
}

function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
}

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
