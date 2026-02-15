// ==================== FIREBASE CONFIGURATION ====================
const firebaseConfig = {
  apiKey: "AIzaSyAPz8Z5IPeUlQN5fwZ27DOtSAyRy3SOTms",
  authDomain: "pro-equinox-427705-a0.firebaseapp.com",
  databaseURL: "https://pro-equinox-427705-a0-default-rtdb.firebaseio.com",
  projectId: "pro-equinox-427705-a0",
  storageBucket: "pro-equinox-427705-a0.firebasestorage.app",
  messagingSenderId: "625384703554",
  appId: "1:625384703554:web:eff89db7b1ff32f22ecfdb",
  measurementId: "G-VNE8ER3BCL"
};

let database = null;
let dataRef = null;
let firebaseReady = false;

// ==================== FIREBASE INITIALIZATION ====================
async function initFirebase() {
    try {
        console.log('📦 Initializing Firebase...');
        
        // Check if Firebase is loaded
        if (typeof firebase === 'undefined') {
            throw new Error('Firebase SDK not loaded');
        }
        
        // Initialize Firebase app if not already initialized
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        database = firebase.database();
        dataRef = database.ref('auctionData');
        firebaseReady = true;
        
        console.log('✅ Firebase connected successfully!');
        
        // Listen for real-time updates
        dataRef.on('value', (snapshot) => {
            const cloudData = snapshot.val();
            if (cloudData && !AppState.isInteracting && !AppState.isModalOpen) {
                console.log('📡 Real-time update from Firebase');
                const hasChanges = JSON.stringify(AppState.data) !== JSON.stringify(cloudData);
                
                if (hasChanges) {
                    AppState.data = { ...AppState.data, ...cloudData };
                    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(cloudData));
                    
                    const view = getViewFromURL();
                    if (view === 'display') {
                        renderDisplayView();
                    } else if (AppState.user && AppState.user.role === 'owner') {
                        renderOwnerView();
                    } else if (AppState.user && AppState.user.role === 'admin') {
                        renderAdminView();
                    }
                }
            }
        });
        
        // Load initial data from Firebase
        const snapshot = await dataRef.once('value');
        const firebaseData = snapshot.val();
        if (firebaseData) {
            console.log('📥 Initial data loaded from Firebase');
            AppState.data = { ...AppState.data, ...firebaseData };
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(firebaseData));
        }
        
        return true;
    } catch (error) {
        console.error('❌ Firebase error:', error);
        firebaseReady = false;
        showToast('Running in offline mode', 'error');
        return false;
    }
}

const CONFIG = {
    ADMIN_PASSWORD: 'admin2026',
    AUTO_REFRESH_INTERVAL: 2000,
    YEAR: '2026',
    STORAGE_KEY: 'iplAuction2026_v3',
    SESSION_KEY: 'iplUser2026_v3'
};

// ==================== TEAM LOGOS ====================
const TEAM_LOGOS = {
    'Mumbai Indians': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/MI/Logos/Logooutline/MIoutline.png',
    'Chennai Super Kings': 'https://documents.iplt20.com/ipl/CSK/Logos/Logooutline/CSKoutline.png',
    'Royal Challengers Bangalore': 'https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png',
    'Royal Challengers Bengaluru': 'https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png',
    'Kolkata Knight Riders': 'https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png',
    'Delhi Capitals': 'https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png',
    'Punjab Kings': 'https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png',
    'Rajasthan Royals': 'https://documents.iplt20.com/ipl/RR/Logos/Logooutline/RRoutline.png',
    'Sunrisers Hyderabad': 'https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png',
    'Gujarat Titans': 'https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png',
    'Lucknow Super Giants': 'https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png',
    'MI': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/MI/Logos/Logooutline/MIoutline.png',
    'CSK': 'https://documents.iplt20.com/ipl/CSK/Logos/Logooutline/CSKoutline.png',
    'RCB': 'https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png',
    'KKR': 'https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png',
    'DC': 'https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png',
    'PBKS': 'https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png',
    'RR': 'https://documents.iplt20.com/ipl/RR/Logos/Logooutline/RRoutline.png',
    'SRH': 'https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png',
    'GT': 'https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png',
    'LSG': 'https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png'
};

const IPL_LOGO = 'https://www.iplt20.com/assets/images/ipl-logo-new-old.png';
const IILM_LOGO = 'https://iilm.ac.in/uploads/all/1/dbcb.png';

function getTeamLogo(teamName) {
    if (!teamName) return null;
    if (TEAM_LOGOS[teamName]) return TEAM_LOGOS[teamName];
    const teamKey = Object.keys(TEAM_LOGOS).find(key => key.toLowerCase() === teamName.toLowerCase());
    if (teamKey) return TEAM_LOGOS[teamKey];
    const partialMatch = Object.keys(TEAM_LOGOS).find(
        key => key.toLowerCase().includes(teamName.toLowerCase()) || teamName.toLowerCase().includes(key.toLowerCase())
    );
    return partialMatch ? TEAM_LOGOS[partialMatch] : null;
}

// ==================== STATE MANAGEMENT ====================
const AppState = {
    user: null,
    data: {
        teams: [],
        players: [],
        teamPasswords: {},
        accessRequests: {},
        liveBidding: null,
        biddingHistory: [],
        customIncrement: 10,
        customIncrementUnit: 'L'
    },
    isInteracting: false,
    isModalOpen: false
};

let refreshInterval = null;

// ==================== MONEY CONVERSION UTILITIES ====================
function lakhsToCrores(lakhs) {
    return lakhs / 100;
}

function croresToLakhs(crores) {
    return crores * 100;
}

function parseAmountToLakhs(value, unit) {
    const num = parseFloat(value);
    if (isNaN(num)) return 0;
    switch(unit) {
        case 'K': return num / 100;
        case 'L': return num;
        case 'Cr': return num * 100;
        default: return num;
    }
}

function formatMoney(lakhs, forceUnit = null) {
    if (lakhs === 0) return '₹0';
    const absLakhs = Math.abs(lakhs);
    if (forceUnit === 'L' || (absLakhs < 100 && forceUnit !== 'Cr')) {
        if (absLakhs < 1) return `₹${(lakhs * 1000).toFixed(0)}K`;
        return `₹${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 2)} L`;
    } else {
        const crores = lakhs / 100;
        return `₹${crores.toFixed(2)} Cr`;
    }
}

function formatMoneyShort(lakhs) {
    if (lakhs === 0) return '₹0';
    const absLakhs = Math.abs(lakhs);
    if (absLakhs < 100) {
        if (absLakhs < 1) return `${(lakhs * 100).toFixed(0)}K`;
        return `${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 1)}L`;
    } else {
        const crores = lakhs / 100;
        return `${crores.toFixed(2)}Cr`;
    }
}

function formatMoneyDisplay(lakhs) {
    if (lakhs === 0) return '₹0';
    const absLakhs = Math.abs(lakhs);
    if (absLakhs < 1) {
        const thousands = lakhs * 100;
        return `₹${thousands.toFixed(0)} Thousand`;
    } else if (absLakhs < 100) {
        return `₹${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 2)} Lakhs`;
    } else {
        const crores = lakhs / 100;
        return `₹${crores.toFixed(2)} Crores`;
    }
}

function formatBidAmount(lakhs) {
    if (lakhs === 0) return '₹0';
    const absLakhs = Math.abs(lakhs);
    if (absLakhs < 100) {
        return `₹${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 2)} L`;
    } else {
        const crores = lakhs / 100;
        return `₹${crores.toFixed(2)} Cr`;
    }
}

function getIncrementDisplay(value, unit) {
    if (unit === 'L') {
        if (value < 1) return `${(value * 100).toFixed(0)}K`;
        return `${value}L`;
    } else {
        return `${value}Cr`;
    }
}

// ==================== INITIALIZATION ====================
async function init() {
    createParticles();
    loadData();
    await initFirebase();
    checkAuth();
}

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const colors = ['rgba(20, 184, 166, 0.3)', 'rgba(249, 115, 22, 0.3)', 'rgba(6, 182, 212, 0.3)'];
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 8 + 4;
        particle.style.cssText = `
            left: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            animation-duration: ${Math.random() * 20 + 15}s;
            animation-delay: ${Math.random() * 10}s;
        `;
        container.appendChild(particle);
    }
}

// ==================== DATA MANAGEMENT ====================
function loadData() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            AppState.data = { ...AppState.data, ...parsed };
            if (!AppState.data.accessRequests) {
                AppState.data.accessRequests = {};
            }
        }
    } catch (e) {
        console.error('Error loading data:', e);
    }
}

async function saveData() {
    try {
        const dataToSave = JSON.stringify(AppState.data);
        localStorage.setItem(CONFIG.STORAGE_KEY, dataToSave);
        console.log('💾 Saved to localStorage');
        
        if (firebaseReady && dataRef) {
            await dataRef.set(AppState.data);
            console.log('☁️ Synced to Firebase!');
        }
    } catch (e) {
        console.error('Error saving data:', e);
        showToast('Error saving data!', 'error');
    }
}

// ==================== AUTHENTICATION ====================
function checkAuth() {
    try {
        const savedUser = sessionStorage.getItem(CONFIG.SESSION_KEY);
        if (savedUser) {
            AppState.user = JSON.parse(savedUser);
            renderApp();
        } else {
            renderLogin();
        }
    } catch (e) {
        renderLogin();
    }
}

function login(role, password, teamName = null) {
    if (role === 'admin') {
        if (password === CONFIG.ADMIN_PASSWORD) {
            AppState.user = { role: 'admin' };
            sessionStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(AppState.user));
            showToast('Welcome Admin! 🎉');
            renderApp();
            return true;
        } else {
            showToast('Invalid admin password!', 'error');
            return false;
        }
    } else if (role === 'owner') {
        const teamPassword = AppState.data.teamPasswords[teamName];
        if (teamPassword && teamPassword === password) {
            AppState.user = { role: 'owner', team: teamName };
            sessionStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(AppState.user));
            showToast(`Welcome ${teamName}! 🏏`);
            renderApp();
            return true;
        } else {
            showToast('Invalid team password!', 'error');
            return false;
        }
    }
    return false;
}

function logout() {
    sessionStorage.removeItem(CONFIG.SESSION_KEY);
    AppState.user = null;
    stopAutoRefresh();
    showToast('Logged out successfully!');
    renderLogin();
}

// ==================== ACCESS REQUEST SYSTEM ====================
function requestAccess(teamName) {
    if (!AppState.data.accessRequests) {
        AppState.data.accessRequests = {};
    }
    AppState.data.accessRequests[teamName] = {
        status: 'pending',
        requestedAt: new Date().toISOString()
    };
    saveData();
    showToast('Access request sent! ⏳');
    renderOwnerView();
}

function approveAccess(teamName) {
    if (AppState.data.accessRequests && AppState.data.accessRequests[teamName]) {
        AppState.data.accessRequests[teamName].status = 'approved';
        AppState.data.accessRequests[teamName].respondedAt = new Date().toISOString();
        saveData();
        showToast(`Access approved for ${teamName}! ✓`);
        renderAdminView();
    }
}

function denyAccess(teamName) {
    if (AppState.data.accessRequests && AppState.data.accessRequests[teamName]) {
        AppState.data.accessRequests[teamName].status = 'denied';
        AppState.data.accessRequests[teamName].respondedAt = new Date().toISOString();
        saveData();
        showToast(`Access denied for ${teamName}!`);
        renderAdminView();
    }
}

function revokeAccess(teamName) {
    if (AppState.data.accessRequests && AppState.data.accessRequests[teamName]) {
        delete AppState.data.accessRequests[teamName];
        saveData();
        showToast(`Access revoked for ${teamName}!`);
        renderAdminView();
    }
}

function hasAccess(teamName) {
    return AppState.data.accessRequests && 
           AppState.data.accessRequests[teamName] && 
           AppState.data.accessRequests[teamName].status === 'approved';
}

function getPendingRequests() {
    if (!AppState.data.accessRequests) return [];
    return Object.entries(AppState.data.accessRequests)
        .filter(([_, r]) => r.status === 'pending')
        .map(([name, req]) => ({ name, ...req }));
}

function getApprovedRequests() {
    if (!AppState.data.accessRequests) return [];
    return Object.entries(AppState.data.accessRequests)
        .filter(([_, r]) => r.status === 'approved')
        .map(([name, req]) => ({ name, ...req }));
}

// ==================== UTILITY FUNCTIONS ====================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeAttr(text) {
    if (!text) return '';
    return text.replace(/'/g, '&apos;').replace(/"/g, '&quot;');
}

function getTeamStats(teamName) {
    const team = AppState.data.teams.find(t => t.name === teamName);
    if (!team) return { spent: 0, remaining: 0, playerCount: 0, players: [], initialPurse: 0 };
    const players = AppState.data.players.filter(p => p.team === teamName);
    const spent = players.reduce((sum, p) => sum + parseFloat(p.price), 0);
    const remaining = parseFloat(team.initialPurse) - spent;
    return { spent, remaining, playerCount: players.length, players, initialPurse: parseFloat(team.initialPurse) };
}

function calculateTotalSpent() {
    const total = AppState.data.players.reduce((sum, p) => sum + parseFloat(p.price), 0);
    return formatMoney(total);
}

function getHighestBid() {
    if (AppState.data.players.length === 0) return '₹0';
    const highest = Math.max(...AppState.data.players.map(p => parseFloat(p.price)));
    return formatMoney(highest);
}

// ==================== RENDERING ====================
function renderApp() {
    const view = getViewFromURL();
    if (view === 'display') {
        renderDisplayView();
        startAutoRefresh();
    } else if (AppState.user && AppState.user.role === 'admin') {
        stopAutoRefresh();
        renderAdminView();
    } else if (AppState.user && AppState.user.role === 'owner') {
        renderOwnerView();
        startAutoRefresh();
    } else {
        renderLogin();
    }
}

function startAutoRefresh() {
    stopAutoRefresh();
    refreshInterval = setInterval(() => {
        if (AppState.isInteracting || AppState.isModalOpen) return;
        loadData();
        const view = getViewFromURL();
        if (view === 'display') {
            renderDisplayView();
        } else if (AppState.user && AppState.user.role === 'owner') {
            const activeElement = document.activeElement;
            if (!activeElement || (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'SELECT' && activeElement.tagName !== 'TEXTAREA')) {
                renderOwnerView();
            }
        }
    }, CONFIG.AUTO_REFRESH_INTERVAL);
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

function getViewFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') || 'default';
}

function switchView(view) {
    window.location.href = `?view=${view}`;
}

// ==================== SYNC STATUS INDICATOR ====================
function renderSyncIndicator() {
    return `
        <div style="position: fixed; bottom: 20px; right: 20px; background: ${firebaseReady ? 'rgba(34, 197, 94, 0.9)' : 'rgba(251, 146, 60, 0.9)'}; color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.85rem; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 8px;">
            <span style="width: 8px; height: 8px; background: ${firebaseReady ? '#22c55e' : '#fbbf24'}; border-radius: 50%; animation: pulse 2s infinite;"></span>
            <span>${firebaseReady ? '🔥 Live Sync Active' : '⚠️ Offline Mode'}</span>
        </div>
        <style>
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        </style>
    `;
}

// ==================== LOGIN VIEW ====================
function renderLogin() {
    const teamsOptions = AppState.data.teams.map(t => 
        `<option value="${escapeHtml(t.name)}">${escapeHtml(t.name)}</option>`
    ).join('');

    document.getElementById('app').innerHTML = `
        <div class="login-screen">
            <div class="login-box">
                <div class="university-branding">
                    <img src="${IILM_LOGO}" alt="IILM University" class="university-logo">
                    <div class="university-name">IILM University, Greater Noida</div>
                </div>
                
                <div class="ipl-logo-container">
                    <img src="${IPL_LOGO}" alt="IPL Logo" class="ipl-logo">
                </div>
                <div class="login-title">🏆 IPL AUCTION ${CONFIG.YEAR}</div>
                <p class="login-subtitle">Secure Access Portal</p>
                
                <div class="tab-container">
                    <button class="tab-btn active" id="adminTabBtn" onclick="window.switchLoginTab('admin')">Admin</button>
                    <button class="tab-btn" id="ownerTabBtn" onclick="window.switchLoginTab('owner')">Team Owner</button>
                </div>

                <div id="adminTab">
                    <form onsubmit="window.handleAdminLogin(event)">
                        <div class="form-group">
                            <label class="form-label">🔐 Admin Password</label>
                            <input type="password" class="form-input" id="adminPassword" required placeholder="Enter admin password">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">
                            Login as Admin
                        </button>
                    </form>
                </div>

                <div id="ownerTab" style="display: none;">
                    <form onsubmit="window.handleOwnerLogin(event)">
                        <div class="form-group">
                            <label class="form-label">🏏 Select Team</label>
                            <select class="form-select" id="ownerTeam" required>
                                <option value="">Choose your team...</option>
                                ${teamsOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">🔐 Team Password</label>
                            <input type="password" class="form-input" id="ownerPassword" required placeholder="Enter team password">
                        </div>
                        <button type="submit" class="btn btn-success" style="width: 100%;">
                            Login as Team Owner
                        </button>
                    </form>
                </div>

                <div class="login-divider">or</div>

                <button class="btn btn-secondary" onclick="window.switchView('display')" style="width: 100%;">
                    📺 View Live Display
                </button>
                
                <div class="login-footer">
                    Presented by IILM University, Greater Noida
                </div>
            </div>
        </div>
        ${renderSyncIndicator()}
    `;
}

window.switchLoginTab = function(tab) {
    document.getElementById('adminTabBtn').classList.toggle('active', tab === 'admin');
    document.getElementById('ownerTabBtn').classList.toggle('active', tab === 'owner');
    document.getElementById('adminTab').style.display = tab === 'admin' ? 'block' : 'none';
    document.getElementById('ownerTab').style.display = tab === 'owner' ? 'block' : 'none';
};

window.handleAdminLogin = function(e) {
    e.preventDefault();
    login('admin', document.getElementById('adminPassword').value);
};

window.handleOwnerLogin = function(e) {
    e.preventDefault();
    const team = document.getElementById('ownerTeam').value;
    const password = document.getElementById('ownerPassword').value;
    if (!team) {
        showToast('Please select a team!', 'error');
        return;
    }
    login('owner', password, team);
};

// ==================== ADMIN VIEW ====================
function renderAdminView() {
    const pendingRequests = getPendingRequests();
    const approvedRequests = getApprovedRequests();
    
    document.getElementById('app').innerHTML = `
        <header class="header">
            <div class="header-content">
                <div class="logo">
                    <img src="${IPL_LOGO}" alt="IPL" class="header-logo">
                    IPL AUCTION ${CONFIG.YEAR}
                </div>
                <div class="header-university">
                    <img src="${IILM_LOGO}" alt="IILM University" class="header-university-logo">
                </div>
                <div class="user-badge">
                    <span>👤 Admin</span>
                    <span class="user-role">ADMIN</span>
                </div>
                <div class="nav-buttons">
                    <button class="btn btn-primary" onclick="window.switchView('display')">📺 Display</button>
                    <button class="btn btn-secondary" onclick="window.exportToCSV()">📥 Export</button>
                    <button class="btn btn-danger" onclick="window.logout()">🚪 Logout</button>
                </div>
            </div>
        </header>

        <div class="container">
            ${renderAccessRequestsSection(pendingRequests, approvedRequests)}
            ${renderLiveBiddingArena()}
            ${renderStatsGrid()}
            ${renderMostExpensive()}
            ${renderAddTeamForm()}
            ${renderTeamsOverview()}
            ${renderAllPlayers()}
            ${renderDangerZone()}
        </div>
        ${renderSyncIndicator()}
    `;
}

// ==================== ACCESS REQUESTS SECTION ====================
function renderAccessRequestsSection(pending, approved) {
    const hasAnyRequests = pending.length > 0 || approved.length > 0;
    if (!hasAnyRequests) return '';
    
    return `
        <div class="card warning-card">
            <div class="card-header">
                🔐 Access Management
                ${pending.length > 0 ? `<span class="badge pending">${pending.length} Pending</span>` : ''}
            </div>
            
            ${pending.length > 0 ? `
                <div class="access-section">
                    <h4 style="color: var(--warning); margin-bottom: 1rem;">⏳ Pending Requests</h4>
                    ${pending.map(req => `
                        <div class="access-request-item">
                            <div class="access-info">
                                <span class="access-team-name">${escapeHtml(req.name)}</span>
                                <span class="access-time">Requested: ${new Date(req.requestedAt).toLocaleString()}</span>
                            </div>
                            <div class="access-actions">
                                <button class="btn-action approve" onclick="window.approveAccess('${escapeAttr(req.name)}')">✓ Approve</button>
                                <button class="btn-action deny" onclick="window.denyAccess('${escapeAttr(req.name)}')">✕ Deny</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${approved.length > 0 ? `
                <div class="access-section" style="margin-top: ${pending.length > 0 ? '2rem' : '0'};">
                    <h4 style="color: var(--success); margin-bottom: 1rem;">✓ Approved Access (${approved.length})</h4>
                    ${approved.map(req => `
                        <div class="access-request-item approved">
                            <div class="access-info">
                                <span class="access-team-name" style="color: var(--success);">${escapeHtml(req.name)}</span>
                                <span class="access-time">Approved: ${new Date(req.respondedAt).toLocaleString()}</span>
                            </div>
                            <div class="access-actions">
                                <button class="btn-action delete" onclick="window.revokeAccess('${escapeAttr(req.name)}')">🔒 Revoke</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

// ==================== STATS GRID ====================
function renderStatsGrid() {
    return `
        <div class="stats-grid">
            <div class="stat-card orange">
                <span class="stat-icon">💰</span>
                <div class="stat-label">Total Spent</div>
                <div class="stat-value">${calculateTotalSpent()}</div>
            </div>
            <div class="stat-card teal">
                <span class="stat-icon">👥</span>
                <div class="stat-label">Players Sold</div>
                <div class="stat-value">${AppState.data.players.length}</div>
            </div>
            <div class="stat-card purple">
                <span class="stat-icon">🏏</span>
                <div class="stat-label">Teams</div>
                <div class="stat-value">${AppState.data.teams.length}</div>
            </div>
            <div class="stat-card gold">
                <span class="stat-icon">⭐</span>
                <div class="stat-label">Highest Bid</div>
                <div class="stat-value">${getHighestBid()}</div>
            </div>
        </div>
    `;
}

// ==================== MOST EXPENSIVE ====================
function renderMostExpensive() {
    if (AppState.data.players.length === 0) return '';
    const most = [...AppState.data.players].sort((a, b) => parseFloat(b.price) - parseFloat(a.price))[0];
    return `
        <div class="card">
            <div class="highlight-box">
                <span class="highlight-crown">👑</span>
                <div class="highlight-title">Most Expensive Player</div>
                <div class="highlight-name">${escapeHtml(most.name)}</div>
                <div class="highlight-team">${escapeHtml(most.team)} • ${escapeHtml(most.role)}</div>
                <div class="highlight-price">${formatMoneyDisplay(parseFloat(most.price))}</div>
            </div>
        </div>
    `;
}

// ==================== ADD TEAM FORM ====================
function renderAddTeamForm() {
    return `
        <div class="card">
            <div class="card-header">➕ Add New Team</div>
            <form onsubmit="window.addTeam(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Team Name</label>
                        <input type="text" class="form-input" id="teamName" required placeholder="e.g., Mumbai Indians" 
                            onfocus="AppState.isInteracting = true" onblur="AppState.isInteracting = false">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Initial Purse</label>
                        <div class="input-with-unit">
                            <input type="number" class="form-input" id="teamPurse" required placeholder="e.g., 100" step="0.01" min="0.01"
                                onfocus="AppState.isInteracting = true" onblur="AppState.isInteracting = false">
                            <select class="form-select" id="teamPurseUnit"
                                onfocus="AppState.isInteracting = true" onblur="AppState.isInteracting = false">
                                <option value="Cr" selected>Crores</option>
                                <option value="L">Lakhs</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Team Password</label>
                        <input type="text" class="form-input" id="teamPassword" required placeholder="Min 4 characters" minlength="4"
                            onfocus="AppState.isInteracting = true" onblur="AppState.isInteracting = false">
                    </div>
                </div>
                <button type="submit" class="btn btn-success">Add Team</button>
            </form>
        </div>
    `;
}

// ==================== TEAMS OVERVIEW ====================
function renderTeamsOverview() {
    if (AppState.data.teams.length === 0) {
        return `
            <div class="card">
                <div class="card-header">🏏 Teams Overview</div>
                <div class="empty-state">
                    <div class="empty-icon">🏏</div>
                    <div class="empty-title">No teams yet</div>
                    <p>Add your first team to get started!</p>
                </div>
            </div>
        `;
    }
    
    const teamsHTML = AppState.data.teams.map(team => {
        const stats = getTeamStats(team.name);
        const logoUrl = getTeamLogo(team.name);
        return `
            <div class="team-card">
                ${logoUrl ? `<div class="team-logo-container"><img src="${logoUrl}" alt="${escapeHtml(team.name)}" class="team-logo" onerror="this.style.display='none'"></div>` : ''}
                <div class="team-name">${escapeHtml(team.name)}</div>
                <div class="team-stats">
                    <div class="team-stat-row">
                        <span class="team-stat-label">Initial Purse</span>
                        <span class="team-stat-value">${formatMoney(stats.initialPurse)}</span>
                    </div>
                    <div class="team-stat-row">
                        <span class="team-stat-label">Spent</span>
                        <span class="team-stat-value">${formatMoney(stats.spent)}</span>
                    </div>
                    <div class="team-stat-row">
                        <span class="team-stat-label">Remaining</span>
                        <span class="team-stat-value ${stats.remaining >= 0 ? 'success' : 'danger'}">${formatMoney(stats.remaining)}</span>
                    </div>
                    <div class="team-stat-row">
                        <span class="team-stat-label">Players</span>
                        <span class="team-stat-value">${stats.playerCount}</span>
                    </div>
                </div>
                <div class="team-actions">
                    <button class="btn-action view" onclick="window.viewTeamDetails('${escapeAttr(team.name)}')">👁 View</button>
                    <button class="btn-action delete" onclick="window.confirmDeleteTeam('${escapeAttr(team.name)}')">🗑 Delete</button>
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="card">
            <div class="card-header">🏏 Teams Overview</div>
            <div class="teams-grid">${teamsHTML}</div>
        </div>
    `;
}

// ==================== ALL PLAYERS ====================
function renderAllPlayers() {
    if (AppState.data.players.length === 0) {
        return `
            <div class="card">
                <div class="card-header">📋 All Players</div>
                <div class="empty-state">
                    <div class="empty-icon">⚡</div>
                    <div class="empty-title">No players sold yet</div>
                    <p>Start the auction to see players here!</p>
                </div>
            </div>
        `;
    }
    
    const sorted = [...AppState.data.players].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    return `
        <div class="card">
            <div class="card-header">
                📋 All Players
                <span class="badge">${sorted.length}</span>
            </div>
            <div class="table-container">
                <table class="players-table">
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Team</th>
                            <th>Role</th>
                            <th>Price</th>
                            <th>Added By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sorted.map((p, i) => `
                            <tr>
                                <td>${i === 0 ? '<span class="player-crown">👑</span>' : ''}${escapeHtml(p.name)}</td>
                                <td>${escapeHtml(p.team)}</td>
                                <td>${escapeHtml(p.role)}</td>
                                <td class="price-tag">${formatMoney(parseFloat(p.price))}</td>
                                <td><span class="badge-small ${p.addedBy || 'admin'}">${p.addedBy || 'admin'}</span></td>
                                <td>
                                    <button class="btn-action edit" onclick="window.editPlayerRole(${p.id})">Edit</button>
                                    <button class="btn-action delete" onclick="window.confirmDeletePlayer(${p.id})">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ==================== DANGER ZONE ====================
function renderDangerZone() {
    return `
        <div class="card danger-card">
            <div class="card-header" style="color: var(--danger);">⚠️ Danger Zone</div>
            <button class="btn btn-danger" onclick="window.confirmResetAll()">🔄 Reset All Data</button>
        </div>
    `;
}

// ==================== LIVE BIDDING ARENA ====================
function renderLiveBiddingArena() {
    const bid = AppState.data.liveBidding;
    
    if (!bid || bid.status !== 'active') {
        return `
            <div class="card">
                <div class="card-header">🔥 Live Bidding Arena</div>
                <form onsubmit="window.startBidding(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Player Name</label>
                            <input type="text" class="form-input" id="bidPlayerName" required placeholder="e.g., Virat Kohli"
                                onfocus="AppState.isInteracting = true" onblur="AppState.isInteracting = false">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Role</label>
                            <select class="form-select" id="bidPlayerRole" required
                                onfocus="AppState.isInteracting = true" onblur="AppState.isInteracting = false">
                                <option value="Batsman">Batsman</option>
                                <option value="Bowler">Bowler</option>
                                <option value="All-Rounder">All-Rounder</option>
                                <option value="Wicket-Keeper">Wicket-Keeper</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Base Price</label>
                            <div class="input-with-unit">
                                <input type="number" class="form-input" id="bidBasePrice" required placeholder="e.g., 50" step="0.01" min="0.01"
                                    onfocus="AppState.isInteracting = true" onblur="AppState.isInteracting = false">
                                <select class="form-select" id="bidBasePriceUnit"
                                    onfocus="AppState.isInteracting = true" onblur="AppState.isInteracting = false">
                                    <option value="L" selected>Lakhs</option>
                                    <option value="Cr">Crores</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-success" style="font-size: 1.1rem;">🚀 Start Bidding</button>
                </form>
            </div>
        `;
    }
    
    const customInc = AppState.data.customIncrement || 10;
    const customUnit = AppState.data.customIncrementUnit || 'L';
    const customIncLakhs = customUnit === 'Cr' ? customInc * 100 : customInc;
    const inc1 = customIncLakhs;
    const inc2 = customIncLakhs * 2;
    const inc3 = customIncLakhs * 5;
    
    return `
        <div class="bidding-arena active">
            <div class="player-spotlight">
                <div class="player-name-big">${escapeHtml(bid.playerName)}</div>
                <div class="player-role-big">${escapeHtml(bid.role)}</div>
                <span class="base-price-tag">Base: ${formatBidAmount(parseFloat(bid.basePrice))}</span>
            </div>

            <div class="current-bid-box">
                <div class="current-bid-label">Current Bid</div>
                <div class="current-bid-amount">${formatBidAmount(parseFloat(bid.currentBid))}</div>
                <div class="current-bidder-name">
                    ${bid.currentBidder ? `🏏 ${escapeHtml(bid.currentBidder)}` : 'Waiting for bids...'}
                </div>
            </div>

            <div class="increment-control-box">
                <div class="increment-control-row">
                    <label>Custom Increment:</label>
                    <div class="increment-input-group">
                        <input type="number" class="increment-input" id="customIncrement" 
                            value="${customInc}" step="1" min="1" 
                            onchange="window.updateCustomIncrement()"
                            onfocus="AppState.isInteracting = true" onblur="AppState.isInteracting = false">
                        <select class="increment-unit-select" id="customIncrementUnit" onchange="window.updateCustomIncrement()"
                            onfocus="AppState.isInteracting = true" onblur="AppState.isInteracting = false">
                            <option value="L" ${customUnit === 'L' ? 'selected' : ''}>Lakhs</option>
                            <option value="Cr" ${customUnit === 'Cr' ? 'selected' : ''}>Crores</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="bid-buttons">
                <button class="bid-btn custom" onclick="window.addBid(${inc1})">+ ${formatMoneyShort(inc1)}</button>
                <button class="bid-btn" onclick="window.addBid(${inc2})">+ ${formatMoneyShort(inc2)}</button>
                <button class="bid-btn" onclick="window.addBid(${inc3})">+ ${formatMoneyShort(inc3)}</button>
            </div>

            <div class="team-selector">
                <h3>Select Bidding Team:</h3>
                <div class="team-selector-grid">
                    ${AppState.data.teams.map(team => {
                        const stats = getTeamStats(team.name);
                        const canBid = stats.remaining >= bid.currentBid;
                        const isActive = bid.currentBidder === team.name;
                        return `
                            <button class="team-select-btn ${isActive ? 'active' : ''}" 
                                onclick="window.setBidder('${escapeAttr(team.name)}')" 
                                ${!canBid ? 'disabled' : ''}>
                                <div class="team-btn-name">${escapeHtml(team.name)}</div>
                                <div class="team-btn-purse" style="color: ${canBid ? 'var(--success)' : 'var(--danger)'}">
                                    ${formatMoney(stats.remaining)}
                                </div>
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>

            <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                <button class="btn btn-success" style="flex: 1;" onclick="window.completeBid('sold')">
                    ✓ SOLD${bid.currentBidder ? ` to ${bid.currentBidder}` : ''}
                </button>
                <button class="btn btn-danger" style="flex: 1;" onclick="window.completeBid('unsold')">✗ UNSOLD</button>
                <button class="btn btn-warning" onclick="window.undoBid()">↶ Undo</button>
            </div>

            ${bid.bidHistory && bid.bidHistory.length > 0 ? `
                <div>
                    <h3 style="color: var(--gold); margin-bottom: 1rem;">Bid History:</h3>
                    <div class="bid-history-box">
                        ${bid.bidHistory.slice().reverse().map(h => `
                            <div class="bid-history-item">
                                <div>
                                    <span class="bid-history-team">${escapeHtml(h.team)}</span>
                                    <span class="bid-history-time">${new Date(h.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <span class="bid-history-amount">${formatBidAmount(parseFloat(h.amount))}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

window.updateCustomIncrement = function() {
    const value = parseFloat(document.getElementById('customIncrement').value) || 10;
    const unit = document.getElementById('customIncrementUnit').value;
    AppState.data.customIncrement = value;
    AppState.data.customIncrementUnit = unit;
    saveData();
    renderAdminView();
};

window.startBidding = function(e) {
    e.preventDefault();
    const name = document.getElementById('bidPlayerName').value.trim();
    const role = document.getElementById('bidPlayerRole').value;
    const basePriceValue = parseFloat(document.getElementById('bidBasePrice').value);
    const basePriceUnit = document.getElementById('bidBasePriceUnit').value;
    
    if (!name || !role || isNaN(basePriceValue) || basePriceValue <= 0) {
        showToast('Please fill all fields correctly!', 'error');
        return;
    }
    
    const basePriceLakhs = parseAmountToLakhs(basePriceValue, basePriceUnit);
    AppState.data.liveBidding = {
        playerName: name,
        role: role,
        basePrice: basePriceLakhs,
        currentBid: basePriceLakhs,
        currentBidder: null,
        bidHistory: [],
        status: 'active',
        startTime: new Date().toISOString()
    };
    saveData();
    renderAdminView();
    showToast(`Bidding started for ${name}! 🔥`);
};

window.setBidder = function(teamName) {
    const bid = AppState.data.liveBidding;
    if (!bid || bid.status !== 'active') return;
    const stats = getTeamStats(teamName);
    if (stats.remaining < bid.currentBid) {
        showToast(`${teamName} doesn't have enough purse!`, 'error');
        return;
    }
    bid.currentBidder = teamName;
    saveData();
    renderAdminView();
};

window.addBid = function(incrementLakhs) {
    const bid = AppState.data.liveBidding;
    if (!bid || bid.status !== 'active') return;
    
    if (!bid.currentBidder) {
        showToast('Select a team first!', 'error');
        return;
    }
    
    if (bid.bidHistory && bid.bidHistory.length > 0) {
        const lastBid = bid.bidHistory[bid.bidHistory.length - 1];
        if (lastBid.team === bid.currentBidder) {
            showToast('Please select a different team before bidding again!', 'error');
            return;
        }
    }
    
    const newAmount = parseFloat(bid.currentBid) + parseFloat(incrementLakhs);
    const stats = getTeamStats(bid.currentBidder);
    
    if (newAmount > stats.remaining) {
        showToast(`${bid.currentBidder} can't afford this bid!`, 'error');
        return;
    }
    
    bid.bidHistory = bid.bidHistory || [];
    bid.bidHistory.push({
        team: bid.currentBidder,
        amount: newAmount,
        timestamp: new Date().toISOString()
    });
    bid.currentBid = newAmount;
    saveData();
    renderAdminView();
    showToast(`Bid: ${formatBidAmount(newAmount)} by ${bid.currentBidder} 📈`);
};

window.undoBid = function() {
    const bid = AppState.data.liveBidding;
    if (!bid || bid.status !== 'active' || !bid.bidHistory || bid.bidHistory.length === 0) {
        showToast('Nothing to undo!', 'error');
        return;
    }
    bid.bidHistory.pop();
    if (bid.bidHistory.length > 0) {
        const last = bid.bidHistory[bid.bidHistory.length - 1];
        bid.currentBid = last.amount;
        bid.currentBidder = last.team;
    } else {
        bid.currentBid = bid.basePrice;
        bid.currentBidder = null;
    }
    saveData();
    renderAdminView();
    showToast('Last bid undone! ↶');
};

window.completeBid = function(status) {
    const bid = AppState.data.liveBidding;
    if (!bid || bid.status !== 'active') return;
    
    if (status === 'sold') {
        if (!bid.currentBidder) {
            showToast('No bidder selected!', 'error');
            return;
        }
        AppState.data.players.push({
            id: Date.now(),
            name: bid.playerName,
            team: bid.currentBidder,
            price: bid.currentBid,
            role: bid.role,
            timestamp: new Date().toISOString(),
            addedBy: 'auction'
        });
        bid.status = 'sold';
        bid.finalTeam = bid.currentBidder;
        bid.finalPrice = bid.currentBid;
        AppState.data.biddingHistory = AppState.data.biddingHistory || [];
        AppState.data.biddingHistory.push({...bid});
        saveData();
        renderAdminView();
        showToast(`${bid.playerName} SOLD to ${bid.currentBidder} for ${formatBidAmount(bid.currentBid)}! 🎉`);
    } else {
        bid.status = 'unsold';
        AppState.data.biddingHistory = AppState.data.biddingHistory || [];
        AppState.data.biddingHistory.push({...bid});
        saveData();
        renderAdminView();
        showToast(`${bid.playerName} went UNSOLD ❌`);
    }
};

// ==================== VIEW TEAM DETAILS ====================
window.viewTeamDetails = function(teamName) {
    const team = AppState.data.teams.find(t => t.name === teamName);
    if (!team) return;
    
    const stats = getTeamStats(teamName);
    const players = stats.players;
    const batsmen = players.filter(p => p.role === 'Batsman');
    const bowlers = players.filter(p => p.role === 'Bowler');
    const allRounders = players.filter(p => p.role === 'All-Rounder');
    const wicketKeepers = players.filter(p => p.role === 'Wicket-Keeper');
    
    const renderRoleSection = (title, list, icon) => {
        if (list.length === 0) return '';
        return `
            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: var(--primary); margin-bottom: 0.75rem;">${icon} ${title} (${list.length})</h4>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${list.map(p => `
                        <div style="display: flex; justify-content: space-between; padding: 0.6rem; background: rgba(20, 184, 166, 0.05); border-radius: 8px;">
                            <span>${escapeHtml(p.name)}</span>
                            <span class="price-tag">${formatMoney(parseFloat(p.price))}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    };
    
    openModal(`${teamName} - Team Details`, `
        <div class="stats-grid" style="margin-bottom: 1.5rem;">
            <div class="stat-card teal" style="padding: 1rem;">
                <span class="stat-icon" style="font-size: 1.5rem;">💰</span>
                <div class="stat-label" style="font-size: 0.75rem;">Initial Purse</div>
                <div class="stat-value" style="font-size: 1.2rem;">${formatMoney(stats.initialPurse)}</div>
            </div>
            <div class="stat-card orange" style="padding: 1rem;">
                <span class="stat-icon" style="font-size: 1.5rem;">💸</span>
                <div class="stat-label" style="font-size: 0.75rem;">Spent</div>
                <div class="stat-value" style="font-size: 1.2rem;">${formatMoney(stats.spent)}</div>
            </div>
            <div class="stat-card ${stats.remaining >= 0 ? 'teal' : ''}" style="padding: 1rem; ${stats.remaining < 0 ? 'color: var(--danger);' : ''}">
                <span class="stat-icon" style="font-size: 1.5rem;">💵</span>
                <div class="stat-label" style="font-size: 0.75rem;">Remaining</div>
                <div class="stat-value" style="font-size: 1.2rem; ${stats.remaining < 0 ? 'color: var(--danger); -webkit-text-fill-color: var(--danger);' : ''}">${formatMoney(stats.remaining)}</div>
            </div>
            <div class="stat-card purple" style="padding: 1rem;">
                <span class="stat-icon" style="font-size: 1.5rem;">👥</span>
                <div class="stat-label" style="font-size: 0.75rem;">Players</div>
                <div class="stat-value" style="font-size: 1.2rem;">${stats.playerCount}</div>
            </div>
        </div>
        ${players.length === 0 ? `
            <div class="empty-state" style="padding: 2rem;">
                <div class="empty-icon">🏏</div>
                <div class="empty-title">No players yet</div>
            </div>
        ` : `
            ${renderRoleSection('Batsmen', batsmen, '🏏')}
            ${renderRoleSection('Bowlers', bowlers, '⚡')}
            ${renderRoleSection('All-Rounders', allRounders, '💪')}
            ${renderRoleSection('Wicket-Keepers', wicketKeepers, '🧤')}
        `}
    `);
};

// ==================== OWNER VIEW ====================
function renderOwnerView() {
    const teamName = AppState.user.team;
    const team = AppState.data.teams.find(t => t.name === teamName);
    
    if (!team) {
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="card">
                    <div class="empty-state">
                        <div class="empty-icon">❌</div>
                        <div class="empty-title">Team Not Found</div>
                        <button class="btn btn-danger" onclick="window.logout()">Logout</button>
                    </div>
                </div>
            </div>
            ${renderSyncIndicator()}
        `;
        return;
    }
    
    const stats = getTeamStats(teamName);
    const accessReq = AppState.data.accessRequests ? AppState.data.accessRequests[teamName] : null;
    const hasAdminAccess = hasAccess(teamName);
    const bid = AppState.data.liveBidding;
    const logoUrl = getTeamLogo(teamName);
    
    const batsmen = stats.players.filter(p => p.role === 'Batsman');
    const bowlers = stats.players.filter(p => p.role === 'Bowler');
    const allRounders = stats.players.filter(p => p.role === 'All-Rounder');
    const wicketKeepers = stats.players.filter(p => p.role === 'Wicket-Keeper');
    
    document.getElementById('app').innerHTML = `
        <header class="header">
            <div class="header-content">
                <div class="logo">
                    <img src="${IPL_LOGO}" alt="IPL" class="header-logo">
                    IPL AUCTION ${CONFIG.YEAR}
                </div>
                <div class="header-university">
                    <img src="${IILM_LOGO}" alt="IILM University" class="header-university-logo">
                </div>
                <div class="user-badge">
                    ${logoUrl ? `<img src="${logoUrl}" alt="${escapeHtml(teamName)}" class="user-team-logo" onerror="this.style.display='none'">` : ''}
                    <span>🏏 ${escapeHtml(teamName)}</span>
                    <span class="user-role">OWNER</span>
                    ${hasAdminAccess ? '<span class="access-badge">EDIT ACCESS</span>' : ''}
                </div>
                <div class="nav-buttons">
                    <button class="btn btn-danger" onclick="window.logout()">🚪 Logout</button>
                </div>
            </div>
        </header>

        <div class="owner-view">
            <div class="container">
                ${renderOwnerAccessCard(teamName, accessReq)}
                ${renderOwnerLiveBid(bid, teamName, stats)}
                
                <div class="team-banner">
                    ${logoUrl ? `<img src="${logoUrl}" alt="${escapeHtml(teamName)}" class="team-banner-logo" onerror="this.style.display='none'">` : '<div class="team-banner-icon">🏆</div>'}
                    <div class="team-banner-name">${escapeHtml(teamName)}</div>
                    <div class="team-banner-sub">IPL ${CONFIG.YEAR} • Team Dashboard</div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card ${stats.remaining >= 0 ? 'teal' : ''}" ${stats.remaining < 0 ? 'style="color: var(--danger);"' : ''}>
                        <span class="stat-icon">💰</span>
                        <div class="stat-label">Remaining</div>
                        <div class="stat-value" ${stats.remaining < 0 ? 'style="color: var(--danger); -webkit-text-fill-color: var(--danger);"' : ''}>${formatMoney(stats.remaining)}</div>
                    </div>
                    <div class="stat-card orange">
                        <span class="stat-icon">💸</span>
                        <div class="stat-label">Spent</div>
                        <div class="stat-value">${formatMoney(stats.spent)}</div>
                    </div>
                    <div class="stat-card purple">
                        <span class="stat-icon">👥</span>
                        <div class="stat-label">Players</div>
                        <div class="stat-value">${stats.playerCount}</div>
                    </div>
                    <div class="stat-card gold">
                        <span class="stat-icon">⭐</span>
                        <div class="stat-label">Top Buy</div>
                        <div class="stat-value">${stats.players.length > 0 ? formatMoney(Math.max(...stats.players.map(p => parseFloat(p.price)))) : '₹0'}</div>
                    </div>
                </div>

                ${hasAdminAccess ? renderOwnerAddPlayer(teamName, stats.remaining) : ''}

                <div class="card">
                    <div class="card-header">
                        🏏 Your Squad
                        ${hasAdminAccess ? '<span style="color: var(--success); font-size: 0.85rem;">(Edit Enabled)</span>' : ''}
                    </div>
                    ${renderOwnerSquad(batsmen, '🏏 Batsmen', hasAdminAccess)}
                    ${renderOwnerSquad(bowlers, '⚡ Bowlers', hasAdminAccess)}
                    ${renderOwnerSquad(allRounders, '💪 All-Rounders', hasAdminAccess)}
                    ${renderOwnerSquad(wicketKeepers, '🧤 Wicket-Keepers', hasAdminAccess)}
                    ${stats.players.length === 0 ? `
                        <div class="empty-state">
                            <div class="empty-icon">🏏</div>
                            <div class="empty-title">No players yet</div>
                            <p>Players will appear here as you buy them!</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
        ${renderSyncIndicator()}
    `;
}

function renderOwnerAccessCard(teamName, accessReq) {
    if (!accessReq) {
        return `
            <div class="access-card">
                <div class="access-card-title">🔓 Request Edit Access</div>
                <p class="access-card-text">Get permission to add players and manage your team!</p>
                <button class="btn btn-warning" onclick="window.requestAccess('${escapeAttr(teamName)}')">📨 Request Access</button>
            </div>
        `;
    }
    if (accessReq.status === 'pending') {
        return `
            <div class="access-card pending">
                <div class="access-card-title">⏳ Request Pending</div>
                <p class="access-card-text">Waiting for admin approval...</p>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">Requested: ${new Date(accessReq.requestedAt).toLocaleString()}</p>
            </div>
        `;
    }
    if (accessReq.status === 'approved') {
        return `
            <div class="access-card approved">
                <div class="access-card-title">✅ Edit Access Granted!</div>
                <p class="access-card-text">You can now add players and manage your team.</p>
            </div>
        `;
    }
    return `
        <div class="access-card denied">
            <div class="access-card-title">❌ Access Denied</div>
            <p class="access-card-text">Your request was not approved.</p>
            <button class="btn btn-warning" onclick="window.requestAccess('${escapeAttr(teamName)}')">📨 Request Again</button>
        </div>
    `;
}

function renderOwnerLiveBid(bid, teamName, stats) {
    if (!bid || bid.status !== 'active') return '';
    const canBid = stats.remaining >= bid.currentBid;
    return `
        <div class="bidding-arena ${bid.currentBidder === teamName ? 'active' : ''}">
            <div class="player-spotlight">
                <div class="player-name-big">${escapeHtml(bid.playerName)}</div>
                <div class="player-role-big">${escapeHtml(bid.role)}</div>
                <span class="base-price-tag">Base: ${formatBidAmount(parseFloat(bid.basePrice))}</span>
            </div>
            <div class="current-bid-box">
                <div class="current-bid-label">Current Bid</div>
                <div class="current-bid-amount">${formatBidAmount(parseFloat(bid.currentBid))}</div>
                <div class="current-bidder-name" style="color: ${bid.currentBidder === teamName ? 'var(--success)' : 'var(--gold)'}">
                    ${bid.currentBidder ? `🏏 ${escapeHtml(bid.currentBidder)} ${bid.currentBidder === teamName ? '(YOU)' : ''}` : 'Waiting...'}
                </div>
            </div>
            <div style="text-align: center; padding: 1rem; background: ${canBid ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; border-radius: 10px;">
                <div style="color: ${canBid ? 'var(--success)' : 'var(--danger)'}; font-weight: 600;">
                    ${canBid ? '✓ You can bid on this player!' : '✗ Insufficient purse for this bid'}
                </div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">Your purse: ${formatMoney(stats.remaining)}</div>
            </div>
        </div>
    `;
}

function renderOwnerAddPlayer(teamName, remaining) {
    return `
        <div class="card success-card">
            <div class="card-header" style="color: var(--success);">⚡ Add Player</div>
            <form onsubmit="window.addPlayerAsOwner(event, '${escapeAttr(teamName)}')">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Player Name</label>
                        <input type="text" class="form-input" id="ownerPlayerName" required placeholder="e.g., Virat Kohli"
                            onfocus="AppState.isInteracting = true" onblur="AppState.isInteracting = false">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Price</label>
                        <div class="input-with-unit">
                            <input type="number" class="form-input" id="ownerPlayerPrice" required placeholder="e.g., 50" step="0.01" min="0.01"
                                onfocus="AppState.isInteracting = true" onblur="AppState.isInteracting = false">
                            <select class="form-select" id="ownerPlayerPriceUnit"
                                onfocus="AppState.isInteracting = true" onblur="AppState.isInteracting = false">
                                <option value="L" selected>Lakhs</option>
                                <option value="Cr">Crores</option>
                            </select>
                        </div>
                        <div class="form-hint">Remaining: ${formatMoney(remaining)}</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Role</label>
                        <select class="form-select" id="ownerPlayerRole" required
                            onfocus="AppState.isInteracting = true" onblur="AppState.isInteracting = false">
                            <option value="Batsman">Batsman</option>
                            <option value="Bowler">Bowler</option>
                            <option value="All-Rounder">All-Rounder</option>
                            <option value="Wicket-Keeper">Wicket-Keeper</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn btn-success">✓ Add Player</button>
            </form>
        </div>
    `;
}

function renderOwnerSquad(players, title, canEdit) {
    if (players.length === 0) return '';
    return `
        <h4 style="color: var(--primary); margin: 1.5rem 0 0.75rem 0;">${title} (${players.length})</h4>
        <div class="table-container">
            <table class="players-table">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Price</th>
                        ${canEdit ? '<th>Actions</th>' : ''}
                    </tr>
                </thead>
                <tbody>
                    ${players.map(p => `
                        <tr>
                            <td>${escapeHtml(p.name)}</td>
                            <td class="price-tag">${formatMoney(parseFloat(p.price))}</td>
                            ${canEdit ? `
                                <td>
                                    <button class="btn-action edit" onclick="window.editPlayerRoleAsOwner(${p.id})">Edit</button>
                                    <button class="btn-action delete" onclick="window.confirmDeletePlayerAsOwner(${p.id})">Delete</button>
                                </td>
                            ` : ''}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ==================== OWNER ACTIONS ====================
window.requestAccess = requestAccess;

window.addPlayerAsOwner = function(e, teamName) {
    e.preventDefault();
    if (!AppState.user || AppState.user.role !== 'owner' || AppState.user.team !== teamName) {
        showToast('Unauthorized!', 'error');
        return;
    }
    if (!hasAccess(teamName)) {
        showToast('No edit access!', 'error');
        return;
    }
    const name = document.getElementById('ownerPlayerName').value.trim();
    const priceValue = parseFloat(document.getElementById('ownerPlayerPrice').value);
    const priceUnit = document.getElementById('ownerPlayerPriceUnit').value;
    const role = document.getElementById('ownerPlayerRole').value;
    
    if (!name || isNaN(priceValue) || priceValue <= 0) {
        showToast('Fill all fields correctly!', 'error');
        return;
    }
    
    const priceLakhs = parseAmountToLakhs(priceValue, priceUnit);
    const stats = getTeamStats(teamName);
    
    if (priceLakhs > stats.remaining) {
        showToast('Insufficient purse!', 'error');
        return;
    }
    
    AppState.data.players.push({
        id: Date.now(),
        name,
        team: teamName,
        price: priceLakhs,
        role,
        timestamp: new Date().toISOString(),
        addedBy: 'owner'
    });
    saveData();
    showToast(`${name} added for ${formatMoney(priceLakhs)}! 🎉`);
    AppState.isInteracting = false;
    renderOwnerView();
};

window.confirmDeletePlayerAsOwner = function(playerId) {
    const player = AppState.data.players.find(p => p.id === playerId);
    if (!player) return;
    if (!confirm(`Delete ${player.name}? This cannot be undone.`)) return;
    deletePlayerAsOwner(playerId);
};

function deletePlayerAsOwner(playerId) {
    const player = AppState.data.players.find(p => p.id === playerId);
    if (!player) return;
    if (!AppState.user || AppState.user.role !== 'owner' || AppState.user.team !== player.team) {
        showToast('Unauthorized!', 'error');
        return;
    }
    if (!hasAccess(AppState.user.team)) {
        showToast('No edit access!', 'error');
        return;
    }
    AppState.data.players = AppState.data.players.filter(p => p.id !== playerId);
    saveData();
    showToast(`${player.name} deleted!`);
    renderOwnerView();
}

window.editPlayerRoleAsOwner = function(playerId) {
    const player = AppState.data.players.find(p => p.id === playerId);
    if (!player) return;
    if (!AppState.user || AppState.user.role !== 'owner' || AppState.user.team !== player.team || !hasAccess(AppState.user.team)) {
        showToast('Unauthorized!', 'error');
        return;
    }
    openModal('Change Role', `
        <form onsubmit="window.updatePlayerRoleOwner(event, ${playerId})">
            <p style="margin-bottom: 1rem;"><strong>${escapeHtml(player.name)}</strong></p>
            <div class="form-group">
                <label class="form-label">New Role</label>
                <select class="form-select" id="ownerNewRole" required>
                    <option value="Batsman" ${player.role === 'Batsman' ? 'selected' : ''}>Batsman</option>
                    <option value="Bowler" ${player.role === 'Bowler' ? 'selected' : ''}>Bowler</option>
                    <option value="All-Rounder" ${player.role === 'All-Rounder' ? 'selected' : ''}>All-Rounder</option>
                    <option value="Wicket-Keeper" ${player.role === 'Wicket-Keeper' ? 'selected' : ''}>Wicket-Keeper</option>
                </select>
            </div>
            <button type="submit" class="btn btn-success" style="width: 100%;">Update</button>
        </form>
    `);
};

window.updatePlayerRoleOwner = function(e, playerId) {
    e.preventDefault();
    const player = AppState.data.players.find(p => p.id === playerId);
    if (!player || !AppState.user || AppState.user.team !== player.team || !hasAccess(AppState.user.team)) {
        showToast('Unauthorized!', 'error');
        closeModal();
        return;
    }
    player.role = document.getElementById('ownerNewRole').value;
    saveData();
    closeModal();
    showToast('Role updated!');
    renderOwnerView();
};

// ==================== DISPLAY VIEW ====================
function renderDisplayView() {
    const bid = AppState.data.liveBidding;
    document.getElementById('app').innerHTML = `
        <div class="display-view">
            <div class="display-header">
                <div class="display-logos">
                    <img src="${IILM_LOGO}" alt="IILM University" class="display-university-logo">
                    <img src="${IPL_LOGO}" alt="IPL Logo" class="display-ipl-logo">
                </div>
                <div class="display-title">🏏 IPL AUCTION ${CONFIG.YEAR} 🏏</div>
                <div class="display-subtitle">IILM University, Greater Noida</div>
                <span class="live-badge">
                    <span class="live-dot"></span>
                    LIVE
                </span>
            </div>
            <div class="container">
                ${bid && bid.status === 'active' ? renderDisplayBidding(bid) : ''}
                ${renderStatsGrid()}
                ${renderMostExpensive()}
                ${renderDisplayTeams()}
                ${renderRecentPurchases()}
            </div>
        </div>
        ${renderSyncIndicator()}
    `;
}

function renderDisplayBidding(bid) {
    return `
        <div class="bidding-arena active">
            <div class="player-spotlight">
                <div class="player-name-big">${escapeHtml(bid.playerName)}</div>
                <div class="player-role-big">${escapeHtml(bid.role)}</div>
                <span class="base-price-tag">Base: ${formatBidAmount(parseFloat(bid.basePrice))}</span>
            </div>
            <div class="current-bid-box">
                <div class="current-bid-label">Current Bid</div>
                <div class="current-bid-amount">${formatBidAmount(parseFloat(bid.currentBid))}</div>
                <div class="current-bidder-name">
                    ${bid.currentBidder ? `🏏 ${escapeHtml(bid.currentBidder)}` : 'Waiting for bids...'}
                </div>
            </div>
        </div>
    `;
}

function renderDisplayTeams() {
    if (AppState.data.teams.length === 0) {
        return `
            <div class="card">
                <div class="card-header">🏏 Teams</div>
                <div class="empty-state">
                    <div class="empty-icon">🏏</div>
                    <div class="empty-title">No teams yet</div>
                </div>
            </div>
        `;
    }
    return `
        <div class="card">
            <div class="card-header">🏏 Team Standings</div>
            <div class="teams-grid">
                ${AppState.data.teams.map(team => {
                    const stats = getTeamStats(team.name);
                    const logoUrl = getTeamLogo(team.name);
                    return `
                        <div class="team-card">
                            ${logoUrl ? `<div class="team-logo-container"><img src="${logoUrl}" alt="${escapeHtml(team.name)}" class="team-logo" onerror="this.style.display='none'"></div>` : ''}
                            <div class="team-name">${escapeHtml(team.name)}</div>
                            <div class="team-stats">
                                <div class="team-stat-row">
                                    <span class="team-stat-label">Remaining</span>
                                    <span class="team-stat-value ${stats.remaining >= 0 ? 'success' : 'danger'}">${formatMoney(stats.remaining)}</span>
                                </div>
                                <div class="team-stat-row">
                                    <span class="team-stat-label">Spent</span>
                                    <span class="team-stat-value">${formatMoney(stats.spent)}</span>
                                </div>
                                <div class="team-stat-row">
                                    <span class="team-stat-label">Players</span>
                                    <span class="team-stat-value">${stats.playerCount}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderRecentPurchases() {
    if (AppState.data.players.length === 0) {
        return `
            <div class="card">
                <div class="card-header">⚡ Recent Purchases</div>
                <div class="empty-state">
                    <div class="empty-icon">⚡</div>
                    <div class="empty-title">No purchases yet</div>
                </div>
            </div>
        `;
    }
    const recent = [...AppState.data.players].reverse().slice(0, 8);
    return `
        <div class="card">
            <div class="card-header">⚡ Recent Purchases</div>
            <div class="table-container">
                <table class="players-table">
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Team</th>
                            <th>Role</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${recent.map(p => `
                            <tr>
                                <td>${escapeHtml(p.name)}</td>
                                <td>${escapeHtml(p.team)}</td>
                                <td>${escapeHtml(p.role)}</td>
                                <td class="price-tag">${formatMoney(parseFloat(p.price))}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ==================== ADMIN CRUD ====================
window.addTeam = function(e) {
    e.preventDefault();
    const name = document.getElementById('teamName').value.trim();
    const purseValue = parseFloat(document.getElementById('teamPurse').value);
    const purseUnit = document.getElementById('teamPurseUnit').value;
    const password = document.getElementById('teamPassword').value.trim();
    
    if (!name || isNaN(purseValue) || purseValue <= 0 || password.length < 4) {
        showToast('Fill all fields correctly!', 'error');
        return;
    }
    if (AppState.data.teams.find(t => t.name.toLowerCase() === name.toLowerCase())) {
        showToast('Team already exists!', 'error');
        return;
    }
    
    const purseLakhs = parseAmountToLakhs(purseValue, purseUnit);
    AppState.data.teams.push({ name, initialPurse: purseLakhs });
    AppState.data.teamPasswords[name] = password;
    saveData();
    showToast(`${name} added with ${formatMoney(purseLakhs)} purse! 🎉`);
    AppState.isInteracting = false;
    renderAdminView();
};

window.confirmDeleteTeam = function(teamName) {
    if (!confirm(`Delete ${teamName} and all its players? This cannot be undone.`)) return;
    deleteTeam(teamName);
};

function deleteTeam(teamName) {
    AppState.data.teams = AppState.data.teams.filter(t => t.name !== teamName);
    AppState.data.players = AppState.data.players.filter(p => p.team !== teamName);
    delete AppState.data.teamPasswords[teamName];
    if (AppState.data.accessRequests) delete AppState.data.accessRequests[teamName];
    saveData();
    showToast(`${teamName} deleted!`);
    renderAdminView();
}

window.confirmDeletePlayer = function(playerId) {
    const player = AppState.data.players.find(p => p.id === playerId);
    if (!player) return;
    if (!confirm(`Delete ${player.name}? This cannot be undone.`)) return;
    deletePlayer(playerId);
};

function deletePlayer(playerId) {
    const player = AppState.data.players.find(p => p.id === playerId);
    if (!player) return;
    AppState.data.players = AppState.data.players.filter(p => p.id !== playerId);
    saveData();
    showToast(`${player.name} deleted!`);
    renderAdminView();
}

window.editPlayerRole = function(playerId) {
    const player = AppState.data.players.find(p => p.id === playerId);
    if (!player) return;
    openModal('Change Role', `
        <form onsubmit="window.updatePlayerRole(event, ${playerId})">
            <p style="margin-bottom: 1rem;"><strong>${escapeHtml(player.name)}</strong></p>
            <div class="form-group">
                <label class="form-label">New Role</label>
                <select class="form-select" id="newRole" required>
                    <option value="Batsman" ${player.role === 'Batsman' ? 'selected' : ''}>Batsman</option>
                    <option value="Bowler" ${player.role === 'Bowler' ? 'selected' : ''}>Bowler</option>
                    <option value="All-Rounder" ${player.role === 'All-Rounder' ? 'selected' : ''}>All-Rounder</option>
                    <option value="Wicket-Keeper" ${player.role === 'Wicket-Keeper' ? 'selected' : ''}>Wicket-Keeper</option>
                </select>
            </div>
            <button type="submit" class="btn btn-success" style="width: 100%;">Update</button>
        </form>
    `);
};

window.updatePlayerRole = function(e, playerId) {
    e.preventDefault();
    const player = AppState.data.players.find(p => p.id === playerId);
    if (player) {
        player.role = document.getElementById('newRole').value;
        saveData();
        closeModal();
        showToast('Role updated!');
        renderAdminView();
    }
};

window.confirmResetAll = function() {
    if (!confirm('⚠️ Delete ALL data? This cannot be undone!')) return;
    if (!confirm('Are you absolutely sure? This will delete all teams, players, and auction history.')) return;
    resetAll();
};

function resetAll() {
    AppState.data = {
        teams: [],
        players: [],
        teamPasswords: {},
        accessRequests: {},
        liveBidding: null,
        biddingHistory: [],
        customIncrement: 10,
        customIncrementUnit: 'L'
    };
    saveData();
    showToast('All data reset! 🔄');
    renderAdminView();
}

// ==================== EXPORT ====================
window.exportToCSV = function() {
    let csv = `IPL AUCTION ${CONFIG.YEAR} - IILM University Greater Noida\n\n`;
    csv += 'TEAMS\nName,Initial Purse,Spent,Remaining,Players\n';
    AppState.data.teams.forEach(t => {
        const s = getTeamStats(t.name);
        csv += `${t.name},${formatMoney(s.initialPurse)},${formatMoney(s.spent)},${formatMoney(s.remaining)},${s.playerCount}\n`;
    });
    csv += '\nPLAYERS\nName,Team,Role,Price,Added By\n';
    AppState.data.players.forEach(p => {
        csv += `${p.name},${p.team},${p.role},${formatMoney(parseFloat(p.price))},${p.addedBy || 'admin'}\n`;
    });
    csv += `\nSTATS\nTotal Spent,${calculateTotalSpent()}\nPlayers Sold,${AppState.data.players.length}\nHighest Bid,${getHighestBid()}\n`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `IPL_Auction_IILM_${CONFIG.YEAR}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('CSV exported! 📥');
};

// ==================== UI HELPERS ====================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMessage');
    if (!toast || !msg) return;
    msg.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function openModal(title, content) {
    AppState.isModalOpen = true;
    const modal = document.getElementById('modal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    modal.classList.add('active');
}

function closeModal() {
    AppState.isModalOpen = false;
    document.getElementById('modal').classList.remove('active');
}

// Expose global functions
window.logout = logout;
window.switchView = switchView;
window.approveAccess = approveAccess;
window.denyAccess = denyAccess;
window.revokeAccess = revokeAccess;
window.closeModal = closeModal;

// ==================== EVENT LISTENERS ====================
window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
};

window.onbeforeunload = function() {
    stopAutoRefresh();
};

document.addEventListener('DOMContentLoaded', init);