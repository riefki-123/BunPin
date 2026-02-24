/**
 * State Management using Vanilla JS LocalStorage
 * Store Key: 'bunpin_data'
 */

const STORE_KEY = 'bunpin_data';

const defaultState = {
    user_profile: {
        nama_ibu: '',
        anak_gender: 'L',
        hpht_terakhir: ''
    },
    riwayat_tumbuh: [], // { gender, bulan, bb, tb, tanggal_cek }
    gamifikasi: {
        xp: 0,
        level: 1,
        badges: []
    }
};

const store = {
    init() {
        const data = localStorage.getItem(STORE_KEY);
        if (!data) {
            localStorage.setItem(STORE_KEY, JSON.stringify(defaultState));
        }
    },

    getState() {
        this.init();
        return JSON.parse(localStorage.getItem(STORE_KEY));
    },

    setState(newState) {
        localStorage.setItem(STORE_KEY, JSON.stringify(newState));
    },

    updateProfile(profileData) {
        const state = this.getState();
        state.user_profile = { ...state.user_profile, ...profileData };
        this.setState(state);
    },

    addRiwayatTumbuh(data) {
        const state = this.getState();
        // Prevent duplicate month entry, replace if exists
        const existingIndex = state.riwayat_tumbuh.findIndex(r => r.bulan === data.bulan);
        if (existingIndex >= 0) {
            state.riwayat_tumbuh[existingIndex] = data;
        } else {
            state.riwayat_tumbuh.push(data);
        }
        // Sort array by month
        state.riwayat_tumbuh.sort((a, b) => a.bulan - b.bulan);
        this.setState(state);
    },

    addXP(amount) {
        const state = this.getState();
        state.gamifikasi.xp += amount;

        // Calculate new level: 1 level per 100 xp
        const newLevel = Math.floor(state.gamifikasi.xp / 100) + 1;

        let leveledUp = false;
        if (newLevel > state.gamifikasi.level) {
            state.gamifikasi.level = newLevel;
            leveledUp = true;
        }

        this.setState(state);
        return { level: state.gamifikasi.level, xp: state.gamifikasi.xp, leveledUp };
    },

    addBadge(badgeName) {
        const state = this.getState();
        if (!state.gamifikasi.badges.includes(badgeName)) {
            state.gamifikasi.badges.push(badgeName);
            this.setState(state);
        }
    }
};

// Initialize on load
store.init();
