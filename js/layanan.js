/**
 * Logic for Layanan Hub (layanan.html)
 * Diperbarui dengan Database Pertumbuhan & Kehamilan + Fetch JSON Gamifikasi
 */

// --- DATABASE LOKAL (Dari scriptmain.js) ---
const dataPertumbuhan = {
    L: { // Laki-laki
        0: { bb: [2.5, 4.4], tb: [46.1, 53.7] }, 1: { bb: [3.4, 5.8], tb: [50.8, 58.6] }, 2: { bb: [4.3, 7.1], tb: [54.4, 62.4] },
        3: { bb: [5.0, 8.0], tb: [57.3, 65.5] }, 4: { bb: [5.6, 8.7], tb: [59.7, 68.0] }, 5: { bb: [6.0, 9.3], tb: [61.7, 70.1] },
        6: { bb: [6.3, 9.8], tb: [63.3, 71.9] }, 7: { bb: [6.7, 10.3], tb: [64.8, 73.5] }, 8: { bb: [6.9, 10.7], tb: [66.2, 75.0] },
        9: { bb: [7.1, 11.0], tb: [67.5, 76.5] }, 10: { bb: [7.4, 11.4], tb: [68.7, 77.9] }, 11: { bb: [7.6, 11.7], tb: [69.9, 79.2] },
        12: { bb: [7.7, 12.0], tb: [71.0, 80.5] }, 13: { bb: [7.9, 12.3], tb: [72.0, 81.7] }, 14: { bb: [8.1, 12.5], tb: [73.0, 83.0] },
        15: { bb: [8.3, 12.8], tb: [74.1, 84.2] }, 16: { bb: [8.5, 13.1], tb: [75.0, 85.4] }, 17: { bb: [8.7, 13.4], tb: [76.0, 86.5] },
        18: { bb: [8.8, 13.7], tb: [76.9, 87.7] }, 19: { bb: [9.0, 14.0], tb: [77.7, 88.7] }, 20: { bb: [9.1, 14.2], tb: [78.5, 89.8] },
        21: { bb: [9.3, 14.5], tb: [79.3, 90.8] }, 22: { bb: [9.4, 14.8], tb: [80.1, 91.9] }, 23: { bb: [9.6, 15.0], tb: [80.9, 92.9] },
        24: { bb: [9.7, 15.3], tb: [81.7, 93.9] }
    },
    P: { // Perempuan
        0: { bb: [2.4, 4.2], tb: [45.4, 52.9] }, 1: { bb: [3.2, 5.5], tb: [49.8, 57.6] }, 2: { bb: [3.9, 6.6], tb: [53.0, 61.1] },
        3: { bb: [4.5, 7.5], tb: [55.6, 64.0] }, 4: { bb: [5.0, 8.2], tb: [57.8, 66.4] }, 5: { bb: [5.4, 8.8], tb: [59.6, 68.5] },
        6: { bb: [5.7, 9.3], tb: [61.2, 70.3] }, 7: { bb: [6.0, 9.8], tb: [62.7, 71.9] }, 8: { bb: [6.3, 10.2], tb: [64.0, 73.5] },
        9: { bb: [6.5, 10.5], tb: [65.3, 75.0] }, 10: { bb: [6.7, 10.9], tb: [66.5, 76.4] }, 11: { bb: [6.9, 11.2], tb: [67.7, 77.8] },
        12: { bb: [7.0, 11.5], tb: [68.9, 79.2] }, 13: { bb: [7.2, 11.8], tb: [69.9, 80.5] }, 14: { bb: [7.4, 12.1], tb: [71.0, 81.7] },
        15: { bb: [7.6, 12.4], tb: [72.0, 83.0] }, 16: { bb: [7.8, 12.7], tb: [73.0, 84.2] }, 17: { bb: [7.9, 12.9], tb: [73.9, 85.3] },
        18: { bb: [8.1, 13.2], tb: [74.9, 86.5] }, 19: { bb: [8.3, 13.5], tb: [75.8, 87.6] }, 20: { bb: [8.4, 13.7], tb: [76.6, 88.6] },
        21: { bb: [8.6, 14.0], tb: [77.5, 89.7] }, 22: { bb: [8.7, 14.3], tb: [78.3, 90.8] }, 23: { bb: [8.9, 14.5], tb: [79.2, 91.8] },
        24: { bb: [9.0, 14.8], tb: [80.0, 92.9] }
    }
};

const dataKehamilan = {
    8: { bbJanin: "1 gr", tbJanin: "4 cm" }, 9: { bbJanin: "2 gr", tbJanin: "4 cm" }, 10: { bbJanin: "4 gr", tbJanin: "6.5 cm" },
    11: { bbJanin: "7 gr", tbJanin: "6.5 cm" }, 12: { bbJanin: "14 gr", tbJanin: "9.0 cm" }, 13: { bbJanin: "25 gr", tbJanin: "9.0 cm" },
    14: { bbJanin: "45 gr", tbJanin: "12.5 cm" }, 15: { bbJanin: "70 gr", tbJanin: "12.5 cm" }, 16: { bbJanin: "100 gr", tbJanin: "16.0 cm" },
    17: { bbJanin: "140 gr", tbJanin: "16.0 cm" }, 18: { bbJanin: "190 gr", tbJanin: "20.5 cm" }, 19: { bbJanin: "240 gr", tbJanin: "20.5 cm" },
    20: { bbJanin: "300 gr", tbJanin: "25.0 cm" }, 21: { bbJanin: "360 gr", tbJanin: "25.0 cm" }, 22: { bbJanin: "430 gr", tbJanin: "27.5 cm" },
    23: { bbJanin: "501 gr", tbJanin: "27.5 cm" }, 24: { bbJanin: "600 gr", tbJanin: "30.0 cm" }, 25: { bbJanin: "700 gr", tbJanin: "30.0 cm" },
    26: { bbJanin: "800 gr", tbJanin: "32.5 cm" }, 27: { bbJanin: "900 gr", tbJanin: "32.5 cm" }, 28: { bbJanin: "1.001 gr", tbJanin: "35.0 cm" },
    29: { bbJanin: "1.175 gr", tbJanin: "35.0 cm" }, 30: { bbJanin: "1.350 gr", tbJanin: "37.5 cm" }, 31: { bbJanin: "1.501 gr", tbJanin: "37.5 cm" },
    32: { bbJanin: "1.675 gr", tbJanin: "40.0 cm" }, 33: { bbJanin: "1.825 gr", tbJanin: "40.0 cm" }, 34: { bbJanin: "2.001 gr", tbJanin: "42.5 cm" },
    35: { bbJanin: "2.160 gr", tbJanin: "42.5 cm" }, 36: { bbJanin: "2.340 gr", tbJanin: "45.0 cm" }, 37: { bbJanin: "2.591 gr", tbJanin: "45.0 cm" },
    38: { bbJanin: "2.775 gr", tbJanin: "47.5 cm" }, 39: { bbJanin: "3.001 gr", tbJanin: "47.5 cm" }, 40: { bbJanin: "3.250 gr", tbJanin: "50.0 cm" },
    41: { bbJanin: "3.501 gr", tbJanin: "50.0 cm" }, 42: { bbJanin: "4.001 gr", tbJanin: "52.5 cm" }, 43: { bbJanin: "4.501 gr", tbJanin: "52.5 cm" }
};

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    initChart();
    initJejakJanin();
    initGamification();
    loadEdukasiJSON();
});

function initUI() {
    const state = store.getState();
    if (state.user_profile && state.user_profile.nama_ibu) {
        document.getElementById('greeting-text').textContent = `Halo Bunda ${state.user_profile.nama_ibu}!`;
    }
}

/* =========================================
   PANTAU TUMBUH (TERINTEGRASI ALGORITMA BARU)
========================================= */
let growthChartInstance = null;

function initChart() {
    const form = document.getElementById('form-tumbuh');
    if (!form) return;

    form.addEventListener('input', () => {
        const age = parseInt(document.getElementById('usia').value);
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const refText = document.getElementById('status-rujukan');

        if (!isNaN(age) && age >= 0 && age <= 24) {
            const standar = dataPertumbuhan[gender][age];
            refText.innerHTML = `Pita Hijau (WHO) Usia ${age} Bln:<br> BB: <b>${standar.bb[0]}-${standar.bb[1]} kg</b> | TB: <b>${standar.tb[0]}-${standar.tb[1]} cm</b>`;
            refText.classList.remove('hidden');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const usia = parseInt(document.getElementById('usia').value);
        const bb = parseFloat(document.getElementById('berat').value);
        const tb = parseFloat(document.getElementById('tinggi').value);

        // Skrining Cepat
        const standar = dataPertumbuhan[gender][usia];
        let statusText = "";
        if(bb < standar.bb[0]) statusText = "Perhatian: BB di bawah Pita Hijau.";
        else if(bb > standar.bb[1]) statusText = "Perhatian: BB di atas rata-rata.";
        else statusText = "Hebat! BB Si Kecil ada di Pita Hijau.";

        store.addRiwayatTumbuh({ gender, bulan: usia, bb, tb, tanggal_cek: new Date().toISOString() });
        const result = store.addXP(20);
        updateXPUI(result);

        alert(`${statusText}\nBunda mendapatkan +20 XP karena mencatat hari ini!`);

        document.getElementById('status-rujukan').classList.add('hidden');
        renderChart();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    });

    renderChart(); // Initial render
}

function renderChart() {
    const ctx = document.getElementById('growthChart');
    if (!ctx) return;

    const state = store.getState();
    const riwayat = state.riwayat_tumbuh;
    const gender = riwayat.length > 0 ? riwayat[0].gender : 'L'; // Default L if empty

    const labels = Array.from({ length: 25 }, (_, i) => i);
    const pitaHijauLower = labels.map(m => dataPertumbuhan[gender][m].bb[0]);
    const pitaHijauUpper = labels.map(m => dataPertumbuhan[gender][m].bb[1]);

    const userData = new Array(25).fill(null);
    riwayat.forEach(r => { if (r.bulan >= 0 && r.bulan <= 24) userData[r.bulan] = r.bb; });

    if (growthChartInstance) growthChartInstance.destroy();

    growthChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Batas Atas Normal', data: pitaHijauUpper,
                    borderColor: 'rgba(124, 200, 178, 0.2)', backgroundColor: 'rgba(124, 200, 178, 0.2)',
                    fill: '+1', pointRadius: 0, borderWidth: 1, tension: 0.4
                },
                {
                    label: 'Batas Bawah Normal', data: pitaHijauLower,
                    borderColor: 'rgba(124, 200, 178, 0.2)', backgroundColor: 'transparent',
                    fill: false, pointRadius: 0, borderWidth: 1, tension: 0.4
                },
                {
                    label: 'Berat Si Kecil (kg)', data: userData,
                    borderColor: '#2FA77C', backgroundColor: '#2FA77C', borderWidth: 3,
                    pointRadius: 5, pointBackgroundColor: '#fff', fill: false, tension: 0.3
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { x: { title: { display: true, text: 'Usia (Bulan)' }, min: 0, max: 24 } }
        }
    });
}

/* =========================================
   JEJAK JANIN (TERINTEGRASI ALGORITMA BARU)
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

        if (checkDate < hpht) { alert("Tanggal cek tidak boleh sebelum HPHT."); return; }

        const hpl = new Date(hpht.getTime() + 280 * 24 * 60 * 60 * 1000);
        const diffTime = Math.abs(checkDate - hpht);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const weeks = Math.floor(diffDays / 7);
        const days = diffDays % 7;

        let estWeight = "--", estLenght = "--";
        if (dataKehamilan[weeks]) {
            estWeight = dataKehamilan[weeks].bbJanin;
            estLenght = dataKehamilan[weeks].tbJanin;
        } else if (weeks < 8) {
            estWeight = "< 1 gr"; estLenght = "Seukuran biji";
        }

        document.getElementById('res-usia-janin').textContent = `${weeks} Ming ${days} Hari`;
        document.getElementById('res-hpl').textContent = hpl.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        document.getElementById('res-estimasi').innerHTML = `Berat: <span class="text-primary-mint font-extrabold text-lg">${estWeight}</span><br> Panjang: <span class="text-primary-mint font-extrabold text-lg">${estLenght}</span>`;

        document.getElementById('janin-result').classList.replace('hidden', 'grid');
    });
}

/* =========================================
   GAMIFIKASI & MATERI EDUKASI (JSON)
========================================= */
let edukasiDataGlobal = [];

function loadEdukasiJSON() {
    // Memanggil data_edukasi.json dari folder lokal (Pastikan file satu folder/bisa diakses)
    fetch('data_edukasi.json')
        .then(response => response.json())
        .then(data => {
            edukasiDataGlobal = data.modules;
            renderDaftarMateri();
        })
        .catch(err => {
            console.error("Gagal meload JSON Edukasi, menggunakan fallback data.", err);
            document.getElementById('modul-list').innerHTML = `<p class="text-center text-neutral-gray p-4">Menunggu data terhubung...</p>`;
        });
}

function renderDaftarMateri() {
    const listContainer = document.getElementById('modul-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    edukasiDataGlobal.forEach((modul, index) => {
        const thumbUrl = modul.youtube_id ? `https://img.youtube.com/vi/${modul.youtube_id}/hqdefault.jpg` : modul.image;
        
        const html = `
        <div class="bg-neutral-white rounded-2xl p-6 shadow flex flex-col sm:flex-row gap-6 items-center border hover:border-primary-mint transition group cursor-pointer" onclick="bukaModalEdukasi(${index})">
            <div class="w-24 h-24 rounded-xl bg-primary-light flex items-center justify-center shrink-0 overflow-hidden">
                <img src="${thumbUrl}" alt="Thumb" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
            </div>
            <div class="flex-grow text-center sm:text-left">
                <div class="flex justify-center sm:justify-start gap-2 mb-2">
                    <span class="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded">+20 XP</span>
                </div>
                <h3 class="text-xl font-bold text-neutral-dark mb-1">${modul.title}</h3>
                <p class="text-sm text-neutral-gray">${modul.subtitle}</p>
            </div>
            <button class="bg-neutral-cream text-primary-green font-bold w-full sm:w-auto px-6 py-3 rounded-xl hover:bg-primary-mint hover:text-white transition whitespace-nowrap">
                Buka Materi
            </button>
        </div>`;
        listContainer.insertAdjacentHTML('beforeend', html);
    });
}

window.bukaModalEdukasi = function(index) {
    const modul = edukasiDataGlobal[index];
    if (!modul) return;

    document.getElementById('modal-title').textContent = modul.title;
    document.getElementById('modal-subtitle').textContent = modul.subtitle;
    document.getElementById('modal-img').src = modul.image || `https://img.youtube.com/vi/${modul.youtube_id}/hqdefault.jpg`;
    
    // Render Paragraf
    const contentHtml = modul.content.map(p => `<p>${p}</p>`).join('');
    document.getElementById('modal-content').innerHTML = contentHtml;

    // Render Kuis
    const quizContainer = document.getElementById('modal-quiz-container');
    quizContainer.innerHTML = '';
    
    modul.quiz.forEach((q, qIdx) => {
        let optionsHTML = q.options.map((opt, oIdx) => `
            <button onclick="jawabKuis(this, ${oIdx}, ${q.correct}, 'exp-${index}-${qIdx}')" class="w-full text-left p-3 rounded-lg border border-secondary-peach bg-white hover:bg-secondary-blush transition text-sm text-neutral-dark font-medium">
                ${opt}
            </button>
        `).join('');

        quizContainer.insertAdjacentHTML('beforeend', `
            <div class="mb-4">
                <p class="font-bold text-neutral-dark mb-2 text-sm">${qIdx + 1}. ${q.question}</p>
                <div class="space-y-2" id="qbox-${index}-${qIdx}">${optionsHTML}</div>
                <div id="exp-${index}-${qIdx}" class="hidden mt-2 p-3 bg-white rounded-lg text-xs text-neutral-gray border border-gray-100">
                    <strong>💡 Info:</strong> ${q.explanation}
                </div>
            </div>
        `);
    });

    document.getElementById('edukasi-modal').classList.remove('hidden');
};

window.jawabKuis = function(btnElement, selected, correct, expId) {
    const parentBox = btnElement.parentElement;
    
    // Disable semua tombol di dalam soal ini
    Array.from(parentBox.children).forEach(btn => {
        btn.disabled = true;
        btn.classList.remove('hover:bg-secondary-blush');
    });

    if(selected === correct) {
        btnElement.classList.replace('bg-white', 'bg-primary-green');
        btnElement.classList.replace('border-secondary-peach', 'border-primary-green');
        btnElement.classList.replace('text-neutral-dark', 'text-white');
        btnElement.innerHTML += ' <i class="fa-solid fa-check-circle float-right mt-0.5"></i>';
        
        // Kasih XP
        const res = store.addXP(20);
        updateXPUI(res);
        confetti({ particleCount: 30, spread: 40 });
    } else {
        btnElement.classList.replace('bg-white', 'bg-secondary-coral');
        btnElement.classList.replace('text-neutral-dark', 'text-white');
        btnElement.innerHTML += ' <i class="fa-solid fa-xmark-circle float-right mt-0.5"></i>';
        
        // Highlight yang benar
        parentBox.children[correct].classList.replace('bg-white', 'bg-primary-light');
        parentBox.children[correct].classList.add('border-primary-green', 'text-primary-green');
    }

    document.getElementById(expId).classList.remove('hidden');
};

function initGamification() {
    const state = store.getState();
    updateXPUI({ level: state.gamifikasi.level, xp: state.gamifikasi.xp, leveledUp: false });
}

function updateXPUI(result) {
    const lvlH = document.getElementById('header-level');
    const xpH = document.getElementById('header-xp');
    if (lvlH) lvlH.textContent = `Lv.${result.level}`;
    if (xpH) xpH.textContent = `${result.xp} XP`;

    const akademiLvl = document.getElementById('akademi-lvl');
    const akademiXP = document.getElementById('akademi-xp');
    const xpBar = document.getElementById('xp-bar');
    const nextInfo = document.getElementById('xp-to-next');

    if (akademiLvl && xpBar) {
        akademiLvl.textContent = `Level ${result.level}`;
        akademiXP.textContent = `${result.xp} Total XP`;
        const currentLvlBaseline = (result.level - 1) * 100;
        const xpInLevel = result.xp - currentLvlBaseline;
        const percent = Math.min((xpInLevel / 100) * 100, 100);
        xpBar.style.width = `${percent}%`;
        nextInfo.textContent = `${100 - xpInLevel} XP lagi ke Level ${result.level + 1}`;
    }

    if (result.leveledUp) {
        confetti({ particleCount: 150, spread: 120, origin: { y: 0.6 } });
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

renderBadges();