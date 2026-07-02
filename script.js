let selectedYear = 2009; // Default tahun awal
let calculatedAge = 17;   // Umur otomatis 17 (2026 - 2009)
let text = "";           
let i = 0;
let giftOpened = false;
let isAnswerCorrect = false;
let currentInput = "";
let heartInterval = null; // Menyimpan ID interval agar tidak duplikat

// Fungsi utama untuk mengatur pergantian gambar di bingkai bulat atas secara otomatis
function changeFrameImage(nextPhaseId) {
    const frame = document.getElementById("main-frame");
    if (!frame) return;

    if (nextPhaseId === "phase-2") {
        frame.innerHTML = '<img src="bubu-dudu-seeyall.gif" class="frame-image">';
    } else if (nextPhaseId === "phase-3") {
        frame.innerHTML = '<img src="danilimz.gif" class="frame-image">';
    } else if (nextPhaseId === "phase-4") {
        frame.innerHTML = '<img src="bobonchik-spin-sp.gif" alt="Dudu baju macan" class="frame-image">';
    }
}

// Fungsi bantu transisi halaman agar smooth
function switchPhase(currentPhaseId, nextPhaseId) {
    const current = document.getElementById(currentPhaseId);
    const next = document.getElementById(nextPhaseId);
    
    if (!current || !next) return;

    current.style.opacity = "0";
    current.style.transform = "translateY(-15px)";
    
    changeFrameImage(nextPhaseId);
    
    setTimeout(() => {
        current.classList.remove("active");
        next.classList.add("active");
        next.offsetWidth; 
        next.style.opacity = "1";
        next.style.transform = "translateY(0)";
    }, 400);
}

// Tahap 1: Klik Kado -> Masuk ke Slider Tahun Lahir + PLAY MUSIK
function triggerGiftClick() {
    if (giftOpened) return;
    giftOpened = true;

    // 🔥 DI SINI KODENYA NYALAIN LAGU
    const bgMusic = document.getElementById("bg-music");
    if (bgMusic) {
        bgMusic.play().catch(error => {
            console.log("Autoplay diblokir oleh browser, butuh interaksi user:", error);
        });
    }

    switchPhase("phase-1", "phase-2");
}

// Tahap 2: Klik Lanjutkan di Slider -> Masuk ke Kalkulator
function goToCalc() {
    calculatedAge = 2026 - selectedYear;
    
    const dynamicH1 = document.getElementById("dynamic-h1");
    if (dynamicH1) {
        dynamicH1.innerText = `Selamat Ulang Tahun Sayang yang ke-${calculatedAge}! 🎉`;
    }
    
    text = `makasih banyak yaa sayang udah peduli sama akuu di umur kamu yang ke-${calculatedAge} ini. akuu sayang kamuu banget beneran dehh.`;

    switchPhase("phase-2", "phase-3");
}

// --- LOGIKA MINI KALKULATOR ---
function pressNum(num) {
    if (currentInput === "DONE") return;

    if (currentInput.length < 4) {
        if (currentInput === "0" || currentInput === "") {
            currentInput = String(num); 
        } else {
            currentInput += String(num);
        }
        const display = document.getElementById("calc-display");
        if (display) display.innerText = currentInput;
    }
}

function clearCalc() {
    if (currentInput === "DONE") return; 
    currentInput = "";
    const display = document.getElementById("calc-display");
    const errorText = document.getElementById("calc-error");
    if (display) display.innerText = "0";
    if (errorText) errorText.innerText = "";
}

function checkAnswer() {
    const errorText = document.getElementById("calc-error");
    const card = document.getElementById("main-card");
    const display = document.getElementById("calc-display");
    
    if (String(currentInput).trim() === "12") {
        if (errorText) {
            errorText.style.color = "#81c784";
            errorText.innerText = "Betul! ";
        }
        currentInput = "DONE"; 

        setTimeout(() => {
            isAnswerCorrect = true;
            switchPhase("phase-3", "phase-4");
            
            i = 0; 
            const typingContainer = document.getElementById("typing-text");
            if (typingContainer) typingContainer.innerText = ""; 
            
            setTimeout(typeWriter, 300);
            
            if (!heartInterval) {
                heartInterval = setInterval(createHeart, 400);
            }
        }, 600);
    } else {
        if (card) {
            card.classList.add("shake");
            setTimeout(() => card.classList.remove("shake"), 300);
        }
        if (errorText) {
            errorText.style.color = "#ff5252";
            errorText.innerText = "Salah ih, coba hitung lagi! 😤";
        }
        currentInput = "";
        if (display) display.innerText = "0";
    }
}

// --- ENGINE MESIN TIK (SLOWER VERSION) ---
function typeWriter() {
    const typingContainer = document.getElementById("typing-text");
    if (!typingContainer) return;

    if (i < text.length) {
        typingContainer.textContent += text.charAt(i);
        i++;
        // Angka 100 ms membuat ritme ketikan terasa lebih pas dan dramatis
        setTimeout(typeWriter, 100); 
    }
}

// --- ENGINE SLIDER TAHUN ---
function updateYearDisplay(val) {
    selectedYear = parseInt(val);
    const display = document.getElementById("year-display");
    if (display) display.innerText = val;
}

// --- ENGINE HUJAN HATI ---
function createHeart() {
    if (!isAnswerCorrect) return; 

    const container = document.getElementById('heart-container');
    if (!container) return;

    const heart = document.createElement('div');
    heart.classList.add('particle');
    
    const heartIcons = ['❤', '🌸', '✨', '🎀'];
    heart.innerHTML = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
    heart.style.opacity = Math.random();
    heart.style.fontSize = (Math.random() * 15 + 10) + 'px';
    
    container.appendChild(heart);
    setTimeout(() => { heart.remove(); }, 6000);
}