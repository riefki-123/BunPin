/**
 * Logic for Layanan Hub (layanan.html)
 */

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    initChart();
    initJejakJanin();
    initGamification();
    checkTour();
});

/* =========================================
   TAB SWITCHING
========================================= */
function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    // Deactivate all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active', 'text-primary-green', 'border-primary-green');
        btn.classList.add('text-neutral-gray', 'border-transparent');
    });

    // Show active tab
    document.getElementById(tabId).classList.add('active');

    // Activate selected button
    const activeBtn = document.getElementById('btn-' + tabId);
    activeBtn.classList.remove('text-neutral-gray', 'border-transparent');
    activeBtn.classList.add('active', 'text-primary-green', 'border-primary-green');
}

// Make globally available
window.switchTab = switchTab;

/* =========================================
   UI INITIALIZATION
========================================= */
function initUI() {
    const state = store.getState();
    if (state.user_profile && state.user_profile.nama_ibu) {
        document.getElementById('greeting-text').textContent = `Halo Bunda ${state.user_profile.nama_ibu}!`;
    }
}

/* =========================================
   PANTAU TUMBUH (CHART.JS)
========================================= */
let growthChartInstance = null;

function initChart() {
    const form = document.getElementById('form-tumbuh');
    if (!form) return;

    // Update label angka saat slider usia digeser
    const usiaInput = document.getElementById('usia');
    const usiaLabel = document.getElementById('usia-label');
    usiaInput.addEventListener('input', (e) => {
        usiaLabel.textContent = e.target.value + ' Bulan';
    });

    // Listen to changes to show reference
    form.addEventListener('input', () => {
        const age = parseInt(document.getElementById('usia').value);
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const refText = document.getElementById('status-rujukan');

        if (!isNaN(age) && age >= 0 && age <= 24) {
            // Rough dummy estimation for "Normal"
            const baseBB = gender === 'L' ? 3.3 : 3.2;
            const baseTB = gender === 'L' ? 50.5 : 49.9;

            const minBB = (baseBB + age * 0.5).toFixed(1);
            const maxBB = (baseBB + age * 0.8).toFixed(1);

            refText.textContent = `Standar Pita Hijau (WHO) usia ${age} bulan: BB ${minBB}-${maxBB} kg.`;
            refText.classList.remove('hidden');
        } else {
            refText.classList.add('hidden');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const usia = parseInt(document.getElementById('usia').value);
        const bb = parseFloat(document.getElementById('berat').value);
        const tb = parseFloat(document.getElementById('tinggi').value);

        store.addRiwayatTumbuh({
            gender,
            bulan: usia,
            bb,
            tb,
            tanggal_cek: new Date().toISOString()
        });

        // Add XP
        const result = store.addXP(20);
        updateXPUI(result);

        form.reset();
        document.getElementById('status-rujukan').classList.add('hidden');
        renderChart();

        // Optional Confetti for tracking
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 }
        });
    });

    renderChart();
}

function renderChart() {
    const ctx = document.getElementById('growthChart');
    if (!ctx) return;

    const state = store.getState();
    const riwayat = state.riwayat_tumbuh;

    // Prepare dummy 'Pita Hijau' data (Lower to Upper bounds for 0-24)
    const labels = Array.from({ length: 25 }, (_, i) => i);
    // Rough estimate array
    const pitaHijauLower = labels.map(m => 3.2 + m * 0.4);
    const pitaHijauUpper = labels.map(m => 4.5 + m * 0.6);

    // Map user data
    const userData = new Array(25).fill(null);
    riwayat.forEach(r => {
        if (r.bulan >= 0 && r.bulan <= 24) {
            userData[r.bulan] = r.bb;
        }
    });

    if (growthChartInstance) {
        growthChartInstance.destroy();
    }

    growthChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Batas Atas Normal',
                    data: pitaHijauUpper,
                    borderColor: 'rgba(124, 200, 178, 0.2)', // primary-mint
                    backgroundColor: 'rgba(124, 200, 178, 0.2)',
                    fill: '+1',
                    pointRadius: 0,
                    borderWidth: 1,
                    tension: 0.4
                },
                {
                    label: 'Batas Bawah Normal',
                    data: pitaHijauLower,
                    borderColor: 'rgba(124, 200, 178, 0.2)',
                    backgroundColor: 'transparent',
                    fill: false,
                    pointRadius: 0,
                    borderWidth: 1,
                    tension: 0.4
                },
                {
                    label: 'Berat Si Kecil (kg)',
                    data: userData,
                    borderColor: '#2FA77C', // primary-green
                    backgroundColor: '#2FA77C',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#2FA77C',
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Usia (Bulan)' },
                    min: 0,
                    max: 24,
                    grid: { display: false }
                },
                y: {
                    title: { display: true, text: 'Berat Badan (kg)' },
                    min: 0,
                    max: 20
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        filter: function (item) {
                            return item.text !== 'Batas Bawah Normal' && item.text !== 'Batas Atas Normal';
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}

/* =========================================
   JEJAK JANIN
========================================= */
function initJejakJanin() {
    const form = document.getElementById('form-janin');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const hphtInput = document.getElementById('hpht').value;
        if (!hphtInput) return;

        const hpht = new Date(hphtInput);
        const cekInput = document.getElementById('tanggalCek').value;
        const checkDate = cekInput ? new Date(cekInput) : new Date();

        // HPL = HPHT + 280 days
        const hpl = new Date(hpht.getTime() + 280 * 24 * 60 * 60 * 1000);

        // Usia Janin in weeks / days
        const diffTime = Math.abs(checkDate - hpht);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        const weeks = Math.floor(diffDays / 7);
        const days = diffDays % 7;

        // Estimations (dummy math scaled to weeks)
        const estWeight = weeks < 12 ? '< 50g' :
            weeks < 24 ? Math.floor(weeks * 25) + 'g' :
                (weeks * 0.1).toFixed(1) + ' kg';
        const estLenght = weeks < 12 ? '< 10cm' : Math.floor(weeks * 1.2) + ' cm';

        // Populate UI
        document.getElementById('res-usia-janin').textContent = `${weeks} Ming ${days} Hari`;

        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        document.getElementById('res-hpl').textContent = hpl.toLocaleDateString('id-ID', options);

        document.getElementById('res-estimasi').innerHTML = `
      Berat: <span class="text-primary-mint font-extrabold text-lg">${estWeight}</span><br>
      Panjang: <span class="text-primary-mint font-extrabold text-lg">${estLenght}</span>
    `;

        document.getElementById('janin-result').classList.replace('hidden', 'grid');
    });
}

/* =========================================
   GAMIFIKASI (AKADEMI BUNDA)
========================================= */
function initGamification() {
    const state = store.getState();
    updateXPUI({ level: state.gamifikasi.level, xp: state.gamifikasi.xp, leveledUp: false });
}

function updateXPUI(result) {
    // Header UI
    const lvlH = document.getElementById('header-level');
    const xpH = document.getElementById('header-xp');

    if (lvlH) lvlH.textContent = `Lv.${result.level}`;
    if (xpH) xpH.textContent = `${result.xp} XP`;

    // Akademi UI
    const akademiLvl = document.getElementById('akademi-lvl');
    const akademiXP = document.getElementById('akademi-xp');
    const xpBar = document.getElementById('xp-bar');
    const nextInfo = document.getElementById('xp-to-next');

    if (akademiLvl && akademiXP && xpBar && nextInfo) {
        akademiLvl.textContent = `Level ${result.level}`;
        akademiXP.textContent = `${result.xp} Total XP`;

        const currentLvlBaseline = (result.level - 1) * 100;
        const xpInLevel = result.xp - currentLvlBaseline;
        const percent = Math.min((xpInLevel / 100) * 100, 100);

        xpBar.style.width = `${percent}%`;
        nextInfo.textContent = `${100 - xpInLevel} XP lagi ke Level ${result.level + 1}`;
    }

    if (result.leveledUp) {
        confetti({
            particleCount: 150,
            spread: 120,
            origin: { y: 0.6 },
            colors: ['#2FA77C', '#F07C82', '#F4EDE4']
        });
        // Give a badge occasionally
        if (result.level === 2) store.addBadge('Ibu Belajar');
        if (result.level === 3) store.addBadge('Pakar Nutrisi');
        renderBadges();
    }
}

function renderBadges() {
    const container = document.getElementById('badges-container');
    if (!container) return;

    const tags = store.getState().gamifikasi.badges;
    if (tags.length === 0) {
        container.innerHTML = `<span class="text-xs bg-neutral-cream text-neutral-gray px-2 py-1 rounded-md">Belum ada badge</span>`;
    } else {
        container.innerHTML = tags.map(t => `<span class="text-xs bg-primary-light text-primary-green border border-primary-mint px-2 py-1 rounded-md shadow-sm"><i class="fa-solid fa-medal mr-1"></i>${t}</span>`).join('');
    }
}

// Global window functions for inline onclick in HTML
window.readModule = function (id) {
    const res = store.addXP(10);
    updateXPUI(res);
    alert(`Modul ${id} berhasil dibaca. Bunda mendapatkan +10 XP!`);
}

window.takeQuiz = function () {
    const correct = confirm("Kuis: Stunting murni karena faktor genetik dan tidak bisa dicegah. Mitos atau Fakta? \n\n(Klik 'OK' untuk Mitos, 'Cancel' untuk Fakta)");

    if (correct) {
        const res = store.addXP(50);
        updateXPUI(res);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        alert("Benar sekali! Stunting 100% karena faktor defisiensi nutrisi. Bunda dapat +50 XP!");
    } else {
        alert("Sayang sekali, itu MITOS. Stunting bisa dicegah mulai dari 1000 Hari Pertama Kehidupan.");
    }
}

// Initial Render badges
renderBadges();

/* =========================================
   SHEPHERD.JS ONBOARDING TOUR
========================================= */
function checkTour() {
    if (typeof Shepherd === 'undefined') return;

    const isDone = localStorage.getItem('bunpin_tour_done');
    if (!isDone) {
        setTimeout(startTour, 1000);
    }
}

function startTour() {
    const tour = new Shepherd.Tour({
        defaultStepOptions: {
            cancelIcon: { enabled: true },
            classes: 'shepherd-theme-custom shadow-xl border border-primary-mint',
            scrollTo: { behavior: 'smooth', block: 'center' }
        },
        useModalOverlay: true
    });

    tour.addStep({
        title: 'Selamat Datang di BundaPintar!',
        text: 'Mari kita keliling sejenak untuk mengenal fitur-fitur di dalam Layanan Hub ini.',
        attachTo: { element: '#tour-tabs-container', on: 'bottom' },
        buttons: [{ action: tour.next, text: 'Lanjut', classes: 'bg-primary-green text-white px-4 py-2 rounded-lg font-bold' }]
    });

    tour.addStep({
        title: 'Catat Tumbuh Kembang',
        text: 'Bunda bisa mencatat berat dan tinggi anak di sini. Grafiknya akan otomatis disesuaikan dengan kurva standar WHO.',
        attachTo: { element: '#tour-input-tumbuh', on: 'right' },
        buttons: [{ action: tour.next, text: 'Lanjut', classes: 'bg-primary-green text-white px-4 py-2 rounded-lg font-bold' }]
    });

    tour.addStep({
        title: 'Kalkulator Jejak Janin',
        text: 'Cek usia kehamilan dengan masuk ke tab ini.',
        attachTo: { element: '#btn-tab2', on: 'bottom' },
        advanceOn: { selector: '#btn-tab2', event: 'click' },
        buttons: [{ action: tour.next, text: 'Lanjut', classes: 'bg-primary-green text-white px-4 py-2 rounded-lg font-bold' }]
    });

    tour.addStep({
        title: 'Gamifikasi & Akademi',
        text: 'Bunda bisa baca artikel dan kuis untuk dapetin XP di Akademi Bunda!',
        attachTo: { element: '#btn-tab3', on: 'bottom' },
        advanceOn: { selector: '#btn-tab3', event: 'click' },
        buttons: [{ action: tour.next, text: 'Mengerti', classes: 'bg-primary-green text-white px-4 py-2 rounded-lg font-bold' }]
    });

    tour.addStep({
        title: 'BidanBot Siap Menjawab',
        text: 'Jika ada keluhan atau ingin nanya resep MPASI, Bidan AI selalu aktif 24 jam untuk Bunda.',
        attachTo: { element: '#btn-tab4', on: 'bottom' },
        advanceOn: { selector: '#btn-tab4', event: 'click' },
        buttons: [{ action: tour.next, text: 'Selesai Tour', classes: 'bg-primary-green text-white px-4 py-2 rounded-lg font-bold' }]
    });

    tour.on('complete', () => {
        localStorage.setItem('bunpin_tour_done', 'true');
        switchTab('tab1');
        confetti({ particleCount: 100, spread: 70 });
    });

    tour.on('cancel', () => {
        localStorage.setItem('bunpin_tour_done', 'true');
    });

    // Reset to tab 1 to start tour safely
    switchTab('tab1');
    tour.start();
}
