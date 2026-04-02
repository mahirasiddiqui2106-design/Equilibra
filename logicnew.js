function authCurrentEmail() {
    try {
        var u = JSON.parse(localStorage.getItem('eq_current_user') || 'null');
        return u && u.email ? u.email.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'guest';
    } catch(e) { return 'guest'; }
}

function uKey(base) {
    return base + '__' + authCurrentEmail();
}

const bannerQuotes = [
    { text: "The secret of getting ahead is getting started.",                                                          author: "Mark Twain"          },
    { text: "Education is the most powerful weapon which you can use to change the world.",                             author: "Nelson Mandela"      },
    { text: "It does not matter how slowly you go as long as you do not stop.",                                         author: "Confucius"           },
    { text: "Believe you can and you're halfway there.",                                                                author: "Theodore Roosevelt"  },
    { text: "The future belongs to those who believe in the beauty of their dreams.",                                   author: "Eleanor Roosevelt"   },
    { text: "In the middle of difficulty lies opportunity.",                                                            author: "Albert Einstein"     },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",                   author: "Winston Churchill"   },
    { text: "It always seems impossible until it's done.",                                                              author: "Nelson Mandela"      },
    { text: "You are never too old to set another goal or to dream a new dream.",                                       author: "C.S. Lewis"          },
    { text: "Don't watch the clock; do what it does. Keep going.",                                                      author: "Sam Levenson"        },
    { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",                      author: "Mother Teresa"       },
    { text: "The only way to do great work is to love what you do.",                                                    author: "Steve Jobs"          },
    { text: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.", author: "Dr. Seuss"        },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.",                             author: "Chinese Proverb"     },
    { text: "Act as if what you do makes a difference. It does.",                                                       author: "William James"       },
    { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.",     author: "Zig Ziglar"          },
    { text: "Try not to become a man of success, but rather try to become a man of value.",                             author: "Albert Einstein"     },
    { text: "I have not failed. I've just found 10,000 ways that won't work.",                                          author: "Thomas Edison"       },
];

function initBanner() {
    const track = document.getElementById('banner-track');
    if (!track) return;

    track.innerHTML = bannerQuotes.map(q =>
        `<span class="banner-quote">"${q.text}"</span>`+
        `<span class="banner-author">— ${q.author}</span>`+
        `<span class="banner-sep">✦</span>`
    ).join('');

    
    requestAnimationFrame(() => {
        const totalPx  = track.scrollWidth + window.innerWidth;
        const duration = Math.round(totalPx / 90);
        track.style.animationDuration = duration + 's';
    });
}

document.addEventListener('DOMContentLoaded', initBanner);

const equilibraFeatures = [
  {
    id: "mirror",
    icon: "🌱",
    title: "Student Mirror",
    short: "Check in with yourself",
    detail: "Reflect on your emotional state so Equilibra can adapt your pace."
  },
  {
    id: "nemo",
    icon: "🐼",
    title: "Nemo Mood Buddy",
    short: "Gentle emotional companion",
    detail: "Nemo responds quietly when stress patterns appear."
  },
  {
    id: "unload",
    icon: "🧱",
    title: "Unload Wall",
    short: "Let it out. Let it go.",
    detail: "Draw, type, tear, and burn what's weighing on you."
  },
  {
    id: "pomodoro",
    icon: "⏱️",
    title: "Pomodoro Timer",
    short: "Work in calm intervals",
    detail: "25–5 cycles tuned to your strain level."
  },
  {
    id: "visionboard",
    icon: "🎯",
    title: "Vision Board",
    short: "Visualise your dreams",
    detail: "Build a beautiful collage of your goals, affirmations, and dreams."
  },
  {
    id: "recharge",
    icon: "🎮",
    title: "Recharge",
    short: "Calm games to recharge",
    detail: "Quick stress-relieving mini games to reset your mind between study sessions."
  }
];

localStorage.removeItem('eq_dark_mode');
document.body.classList.remove('dark');

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');

    const otpBox = document.getElementById("otp-box");
    if (otpBox) otpBox.style.display = "none";

    if (pageId === "welcome") {
        typeWelcomeText();
    }

    if (pageId === "dashboard") {
        renderEquilibraCards();
        renderCourseGrid();
        updateDashGreeting();
    }

    if (pageId === "pomodoro") {
        setTimeout(initPomodoro, 50);
    }

    if (pageId === "mirror") {
        mirrorAnswers = {};
        document.getElementById('mirror-results').style.display = 'none';
        document.getElementById('mirror-form').style.display    = 'block';
        renderMirrorQuestions();
        
        const body = document.querySelector('.mirror-page-body');
        if (body) body.scrollTop = 0;
    }

    if (pageId === "unload") {
        resetUnloadWall();
        requestAnimationFrame(function() {
            requestAnimationFrame(initUnloadCanvas);
        });
    }

    if (pageId === "vision-board") {
        
        var banner = document.querySelector('.floating-banner');
        if (banner) banner.style.display = 'none';
        initVisionBoard();
    } else {
        
        var banner = document.querySelector('.floating-banner');
        if (banner) banner.style.display = '';
    }
}

const AUTH_KEY = 'eq_users';

function authGetUsers() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) || '[]'); }
    catch(e) { return []; }
}
function authPutUsers(arr) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(arr));
}

function authHash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
    return (h >>> 0).toString(16);
}

function authValidEmail(email) {
    return /^[^s@]+@(gmail.com|yahoo.com|yahoo.co.in|hotmail.com|hotmail.co.uk|vitstudent.ac.in)$/i.test(email.trim());
}

function authValidPass(pass) { return pass.length >= 6; }

function authClearErrors() {
    ['login-email-err','login-pass-err','login-msg',
     'signup-name-err','signup-email-err','signup-pass-err','signup-msg']
        .forEach(function(id) { var el = document.getElementById(id); if(el){ el.textContent=''; el.className='auth-err'; } });
}

function authShowErr(id, msg) {
    var el = document.getElementById(id);
    if (el) { el.textContent = msg; el.className = 'auth-err auth-err--show'; }
}

function authShowMsg(id, msg, type) {
    var el = document.getElementById(id);
    if (el) { el.textContent = msg; el.className = 'auth-msg auth-msg--' + type; }
}

function authSwitchTab(tab) {
    var isLogin = tab === 'login';
    document.getElementById('tab-login').classList.toggle('active', isLogin);
    document.getElementById('tab-signup').classList.toggle('active', !isLogin);
    document.getElementById('auth-login-form').style.display  = isLogin ? 'block' : 'none';
    document.getElementById('auth-signup-form').style.display = isLogin ? 'none'  : 'block';
    authClearErrors();
}

function authTogglePass(inputId, btn) {
    var inp = document.getElementById(inputId);
    if (!inp) return;
    var isText = inp.type === 'text';
    inp.type = isText ? 'password' : 'text';
    btn.style.opacity = isText ? '0.5' : '1';
}

function authLogin() {
    authClearErrors();
    var email = document.getElementById('login-email').value.trim();
    var pass  = document.getElementById('login-pass').value;
    var ok = true;

    if (!email) {
        authShowErr('login-email-err', 'Email is required.'); ok = false;
    } else if (!authValidEmail(email)) {
        authShowErr('login-email-err', 'Use a Gmail, Yahoo, Hotmail or VIT student email.'); ok = false;
    }
    if (!pass) {
        authShowErr('login-pass-err', 'Password is required.'); ok = false;
    } else if (!authValidPass(pass)) {
        authShowErr('login-pass-err', 'Password must be at least 6 characters.'); ok = false;
    }
    if (!ok) return;

    var users = authGetUsers();
    var user  = users.find(function(u) { return u.email.toLowerCase() === email.toLowerCase(); });

    if (!user) {
        authShowMsg('login-msg', 'No account found with this email. Redirecting to Sign Up...', 'warn');
        setTimeout(function() {
            authShowMsg('login-msg', '', '');
            authSwitchTab('signup');
            document.getElementById('signup-email').value = email;
            authShowMsg('signup-msg', 'No account found — create one below.', 'info');
        }, 2000);
        return;
    }

    if (user.passHash !== authHash(pass)) {
        authShowErr('login-pass-err', 'Incorrect password. Please try again.');
        return;
    }

    localStorage.setItem('eq_current_user', JSON.stringify({ name: user.name, email: user.email }));
    authShowMsg('login-msg', 'Welcome back, ' + user.name.split(' ')[0] + '! ✨', 'success');
    setTimeout(function() { showPage('dashboard'); }, 900);
}

function authSignup() {
    authClearErrors();
    var name  = document.getElementById('signup-name').value.trim();
    var email = document.getElementById('signup-email').value.trim();
    var pass  = document.getElementById('signup-pass').value;
    var ok = true;

    if (!name) {
        authShowErr('signup-name-err', 'Please enter your name.'); ok = false;
    }
    if (!email) {
        authShowErr('signup-email-err', 'Email is required.'); ok = false;
    } else if (!authValidEmail(email)) {
        authShowErr('signup-email-err', 'Use a Gmail, Yahoo, Hotmail or VIT student email.'); ok = false;
    }
    if (!pass) {
        authShowErr('signup-pass-err', 'Password is required.'); ok = false;
    } else if (!authValidPass(pass)) {
        authShowErr('signup-pass-err', 'Password must be at least 6 characters.'); ok = false;
    }
    if (!ok) return;

    var users = authGetUsers();
    var exists = users.find(function(u) { return u.email.toLowerCase() === email.toLowerCase(); });

    if (exists) {
        authShowMsg('signup-msg', 'Account already exists. Redirecting to Log In...', 'warn');
        setTimeout(function() {
            authShowMsg('signup-msg', '', '');
            authSwitchTab('login');
            document.getElementById('login-email').value = email;
            authShowMsg('login-msg', 'Account already exists — enter your password to log in.', 'info');
        }, 2000);
        return;
    }

    users.push({ name: name, email: email, passHash: authHash(pass) });
    authPutUsers(users);
    localStorage.setItem('eq_current_user', JSON.stringify({ name: name, email: email }));
    authShowMsg('signup-msg', 'Account created! Welcome to Equilibra ✨', 'success');
    setTimeout(function() { showPage('dashboard'); }, 900);
}

function loginUser() { showPage('login'); }

function typeWelcomeText() {
    const text = "Welcome to Equilibra";
    const title = document.getElementById("welcome-title");
    if (!title) return;

    title.textContent = "";
    let index = 0;

    const typingInterval = setInterval(() => {
        if (index < text.length) {
            title.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(typingInterval);
        }
    }, 90);
}


function updateDashGreeting() {
    const hour = new Date().getHours();
    const timeLabel = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const timeEl = document.getElementById('dash-time-label');
    if (timeEl) timeEl.textContent = timeLabel;

    const dateEl = document.getElementById('dash-date-label');
    if (dateEl) {
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    const nameEl = document.querySelector('.dash-greeting-name');
    if (nameEl) {
        try {
            var u = JSON.parse(localStorage.getItem('eq_current_user') || 'null');
            nameEl.textContent = u && u.name ? 'Welcome back, ' + u.name.split(' ')[0] + ' 👋' : 'Welcome back 👋';
        } catch(e) {}
    }

    const statCoursesEl = document.getElementById('dash-stat-courses');
    if (statCoursesEl) statCoursesEl.textContent = courses.length;
}

function renderEquilibraCards() {
    const container = document.getElementById("equilibra-cards-dash");
    if (!container) return;

    container.innerHTML = "";

    equilibraFeatures.forEach(feature => {
        const card = document.createElement("div");
        card.className = "equilibra-card";
        card.dataset.id = feature.id;

        card.innerHTML = `
            <div class="card-icon">${feature.icon}</div>
            <div class="card-text">
                <h4>${feature.title}</h4>
                <p class="card-short">${feature.short}</p>
                <p class="card-detail" style="display:none;">
                    ${feature.detail}
                </p>
            </div>
        `;

        card.addEventListener("click", () => {
            if      (feature.id === "mirror")      { showPage("mirror"); }
            else if (feature.id === "nemo")        { openNemo(); }
            else if (feature.id === "unload")      { showPage("unload"); }
            else if (feature.id === "pomodoro")    { showPage("pomodoro"); }
            else if (feature.id === "visionboard") { showPage("vision-board"); }
            else if (feature.id === "recharge")    { showPage("recharge"); }
            else                                   { toggleEquilibraCard(card); }
        });
        container.appendChild(card);
    });
}

function toggleEquilibraCard(selectedCard) {
    document.querySelectorAll(".equilibra-card").forEach(card => {
        const detail = card.querySelector(".card-detail");
        if (card === selectedCard) {
            const isOpen = detail.style.display === "block";
            detail.style.display = isOpen ? "none" : "block";
        } else {
            card.querySelector(".card-detail").style.display = "none";
        }
    });
}

const courses = [
    {
        id: "cvla", title: "Complex Variables and Linear Algebra",
        code: "BMAT201L", semester: "Fall Semester 2025-26",
        cover: "cover-1", completion: 0,
        faculty: [
            { name: "Dr. Sandip Kumar Das", slot: "C1+TC1+TCC1", items: [
                { type: "forum",      label: "Announcements" },
                { type: "assignment", label: "DA 1",   locked: true },
                { type: "quiz",       label: "Quiz I",  locked: true },
                { type: "quiz",       label: "Quiz II", locked: true },
                { type: "assignment", label: "DA III",  locked: true }
            ]},
            { name: "Dr. Padmaja N", slot: "A1+TA1+TAA1", items: [
                { type: "assignment", label: "Digital Assignment-01", due: "08-08-2025", note: "Submission of both hard and soft copy of the DA is mandatory.", locked: true },
                { type: "assignment", label: "Digital Assignment-03", due: "10-11-2025", note: "Submission of both hard and soft copy of the DA is mandatory.", locked: true }
            ]},
            { name: "Dr. G. Hannah Grace", slot: "A1 slot", items: [
                { type: "assignment", label: "DA1_HANNAH", locked: true },
                { type: "assignment", label: "DA3_HANNAH", locked: true }
            ]},
            { name: "Dr. Dhivya M", slot: "CVLA", items: [
                { type: "quiz", label: "Quiz - A1 SLOT", locked: true },
                { type: "quiz", label: "Quiz - A2 SLOT", locked: true }
            ]},
            { name: "Dr. Om Namha Shivay", slot: "", items: [
                { type: "assignment", label: "Digital Assignment 1", locked: true },
                { type: "quiz",       label: "Quiz",                 locked: true },
                { type: "assignment", label: "DA3",                  locked: true }
            ]},
            { name: "Dr. Jayagopal R", slot: "", items: [] },
            { name: "Dr. N. Nathiya", slot: "", items: [
                { type: "assignment", label: "Digital Assignment - 1", locked: true },
                { type: "assignment", label: "Digital Assignment - 3", locked: true }
            ]},
            { name: "Dr. Sowndarrajan P T", slot: "A1+TA1+TAA1", items: [
                { type: "assignment", label: "Digital Assignment - 1", note: "Write on A4. Front Page: DA-1, Name, Reg No, Course Name, Code, Slot. Hardcopy to cabin AB1, 2nd Floor, Room 203, Cabin 1. Softcopy upload to Moodle.", locked: true },
                { type: "assignment", label: "Digital Assignment - 3", note: "Write on A4. Front Page: DA-3, Name, Reg No, Course Name, Code, Slot. Hardcopy to cabin AB1, 2nd Floor, Room 203, Cabin 1. Softcopy upload to Moodle (LMS).", locked: true }
            ]}
        ]
    },
    {
        id: "cao", title: "Computer Architecture and Organization",
        code: "BCSE205L", semester: "Fall Semester 2025-26",
        cover: "cover-2", completion: 2,
        faculty: [
            { name: "Dr. Sambath M.", slot: "E1+TE1", items: [
                { type: "assignment", label: "DA1 - OpenMP (E1 Slot)",              locked: true },
                { type: "quiz",       label: "DA2 Quiz (E1 Slot) - Dr. Sambath M",  locked: true },
                { type: "quiz",       label: "DA3 Quiz (E1 slot) - Dr. SAMBATH",    locked: true }
            ]},
            { name: "Dr. Arivarasi A", slot: "A1+TA1", items: [
                { type: "assignment", label: "DA1 A1 SLOT", locked: true }
            ]},
            { name: "Dr. M. Nivedita", slot: "E1 and E2", items: [
                { type: "assignment", label: "DA1 Submission - E1 slot", locked: true },
                { type: "assignment", label: "DA1 Submission - E2 slot", locked: true },
                { type: "assignment", label: "DA2 Submission (E1 Slot)", locked: true },
                { type: "assignment", label: "DA2 Submission (E2 Slot)", locked: true },
                { type: "quiz",       label: "Quiz E1 slot",             locked: true },
                { type: "quiz",       label: "Quiz E2 slot",             locked: true }
            ]},
            { name: "Dr. Madura Meenakshi R", slot: "E2+TE2", items: [
                { type: "assignment", label: "DA1 E2 slot",             locked: true },
                { type: "assignment", label: "DA2 DR ARIVARASI A1+TA1", locked: true },
                { type: "assignment", label: "DA2 E2 slot",             locked: true },
                { type: "quiz",       label: "Quiz",                    locked: true },
                { type: "quiz",       label: "Quiz2",                   locked: true }
            ]},
            { name: "Dr. Dhavakumar P", slot: "E1+TE1", items: [
                { type: "assignment", label: "Section restricted to slot", locked: true }
            ]},
            { name: "Dr. Dhavakumar P", slot: "E2+TE2", items: [
                { type: "assignment", label: "Section restricted to slot", locked: true }
            ]}
        ]
    },
    {
        id: "cn", title: "Computer Networks",
        code: "BCSE308L", semester: "Winter Semester 2025-26",
        cover: "cover-3", completion: 0,
        faculty: [
            { name: "T S Pradeep Kumar", slot: "B1+TB1", items: [] },
            { name: "T S Pradeep Kumar", slot: "B2+TB2", items: [] },
            { name: "Dr. Kanchana Devi V", slot: "F1+TF1", items: [
                { type: "file",       label: "Syllabus",                locked: false },
                { type: "assignment", label: "F1-Digital Assignment 1", locked: true },
                { type: "assignment", label: "F1-Digital Assignment 2", locked: true }
            ]},
            { name: "Dr. Kanchana Devi V", slot: "F2+TF2", items: [
                { type: "file",       label: "Syllabus",                locked: false },
                { type: "assignment", label: "F2-Digital Assignment 1", locked: true },
                { type: "assignment", label: "F2-Digital Assignment 2", locked: true }
            ]},
            { name: "Dr. T. Subbulakshmi", slot: "F1+TF1", items: [] },
            { name: "Dr. T. Subbulakshmi", slot: "F2+TF2", items: [] },
            { name: "Dr. Ayesha Shaik", slot: "F1+TF1", items: [
                { type: "assignment", label: "Digital Assignment1",          locked: true },
                { type: "quiz",       label: "Online Quiz--Bluetooth and RFID technology", locked: true },
                { type: "assignment", label: "Digital Assignment 2-NS3",     locked: true }
            ]},
            { name: "Dr. Swaminathan Annadurai", slot: "B1+TB1", items: [
                { type: "assignment", label: "Problems for Practice 1 (Routing)", locked: true }
            ]}
        ]
    },
    {
        id: "cnlab", title: "Computer Networks Lab",
        code: "BCSE308P", semester: "Winter Semester 2025-26",
        cover: "cover-4", completion: 0,
        faculty: [
            { name: "RAJESH R", slot: "L7+L8", items: [
                { type: "assignment", label: "LAB 1",  locked: false },
                { type: "assignment", label: "LAB 2",  locked: false },
                { type: "assignment", label: "LAB 3",  locked: false },
                { type: "assignment", label: "LAB 4",  locked: false },
                { type: "assignment", label: "LAB 5",  locked: false },
                { type: "assignment", label: "LAB 6",  locked: false },
                { type: "assignment", label: "LAB 7",  locked: false },
                { type: "assignment", label: "LAB 8",  locked: false },
                { type: "assignment", label: "LAB 9",  locked: false },
                { type: "assignment", label: "LAB 10", locked: false }
            ]},
            { name: "PRIYANKA MISHRA", slot: "L37+L38", items: [
                { type: "assignment", label: "Lab_Assignment 1",  locked: true },
                { type: "assignment", label: "Lab_ Assignment 2", locked: true },
                { type: "assignment", label: "Lab Assignment_3",  locked: true },
                { type: "assignment", label: "Lab Assignment_4",  locked: true },
                { type: "assignment", label: "Lab assignment_5",  locked: true },
                { type: "assignment", label: "Lab Assignment_6",  locked: true },
                { type: "assignment", label: "Lab Assignment_7",  locked: true },
                { type: "assignment", label: "Assignment test _1",locked: true },
                { type: "assignment", label: "Lab assignment_8",  locked: true }
            ]},
            { name: "Dr. Ganala Santoshi", slot: "L37+L38", items: [
                { type: "assignment", label: "Lab Assignment 1",  locked: true },
                { type: "assignment", label: "Lab assignment 2",  locked: true },
                { type: "assignment", label: "Lab Assignment 3",  locked: true },
                { type: "assignment", label: "Lab Asignment_4",   locked: true },
                { type: "assignment", label: "Lab assignment_5",  locked: true },
                { type: "assignment", label: "Lab Assignment_6",  locked: true },
                { type: "assignment", label: "Lab Assignment_7",  locked: true },
                { type: "assignment", label: "Test 1",            locked: true },
                { type: "assignment", label: "Lab Assignment_8",  locked: true }
            ]},
            { name: "RAJESH R", slot: "L39+L40", items: [
                { type: "assignment", label: "Section restricted to slot", locked: true }
            ]},
            { name: "Dr. Amrit Pal", slot: "L13+L14", items: [
                { type: "assignment", label: "LAB 3", locked: true },
                { type: "assignment", label: "LAB 4", locked: true },
                { type: "assignment", label: "LAB 5", locked: true },
                { type: "assignment", label: "Lab 6", locked: true },
                { type: "assignment", label: "LAB 7", locked: true },
                { type: "assignment", label: "LAB 8", locked: true }
            ]},
            { name: "Dr. Amrit Pal", slot: "L31+L32", items: [
                { type: "assignment", label: "LAB 3", locked: true },
                { type: "assignment", label: "LAB 4", locked: true },
                { type: "assignment", label: "LAB 5", locked: true },
                { type: "assignment", label: "LAb 6", locked: true },
                { type: "assignment", label: "LAB 7", locked: true },
                { type: "assignment", label: "Lab 8", locked: true },
                { type: "assignment", label: "LAB 9", locked: true }
            ]},
            { name: "Dr. Trilok Nath Pandey", slot: "L27+L28", items: [
                { type: "file", label: "Computer Networks Lab – Instructions for Students", locked: true }
            ]},
            { name: "Dr. Trilok Nath Pandey", slot: "L57+L58", items: [
                { type: "file", label: "Computer Networks Lab – Instructions for Students", locked: true }
            ]},
            { name: "Dr. Karmel A", slot: "L43+L44", items: [
                { type: "assignment", label: "Lab2 - Submission",          locked: true },
                { type: "assignment", label: "Lab3 - Submission",          locked: true },
                { type: "assignment", label: "Lab 4 submission - 10-01-26", locked: true },
                { type: "assignment", label: "Lab -5",                     locked: true },
                { type: "assignment", label: "Lab 6",                      locked: true },
                { type: "assignment", label: "Lab - 7",                    locked: true }
            ]},
            { name: "Pradeep Kumar TS", slot: "L31+L32", items: [] },
            { name: "Dr. V. Brindha", slot: "L7+L8", items: [
                { type: "assignment", label: "MID TERM _LAB EXAM", locked: true }
            ]},
            { name: "Dr. V. Brindha", slot: "L39+L40", items: [
                { type: "assignment", label: "MID TERM _LAB EXAM", locked: true }
            ]}
        ]
    },
    {
        id: "os", title: "Operating Systems",
        code: "BCSE303L", semester: "Fall Semester 2025-26",
        cover: "cover-5", completion: 0,
        faculty: [
            { name: "Course Faculty", slot: "General", items: [
                { type: "forum",      label: "Announcements" },
                { type: "assignment", label: "Digital Assignment 1", locked: true },
                { type: "assignment", label: "Digital Assignment 2", locked: true },
                { type: "quiz",       label: "Quiz I",               locked: true }
            ]}
        ]
    },
    {
        id: "oslab", title: "Operating Systems Lab",
        code: "BCSE303P", semester: "Fall Semester 2025-26",
        cover: "cover-6", completion: 0,
        faculty: [
            { name: "Lab Faculty", slot: "General", items: [
                { type: "forum", label: "Announcements" }
            ]}
        ]
    },
    {
        id: "dsa", title: "Data Structures and Algorithms",
        code: "BCSE202L", semester: "Fall Semester 2025-26",
        cover: "cover-7", completion: 2,
        faculty: [
            { name: "Dr. Rajakumar R", slot: "C2 Slot_DSA", items: [
                { type: "assignment", label: "Section restricted to slot", locked: true },
                { type: "quiz",       label: "DA-1_Quiz",                 locked: true }
            ]},
            { name: "Angeline Ezhilarasi G", slot: "D1+TD1", items: [
                { type: "quiz", label: "Quiz", locked: true }
            ]},
            { name: "Kalaipriyan", slot: "B1+TB1", items: [
                { type: "quiz", label: "Re-Quiz 2", locked: true }
            ]},
            { name: "Dr. R. Sendhil", slot: "DSA_C1 & C2", items: [] },
            { name: "Dr. Valarmathi Sudhakar", slot: "E1+TE1", items: [
                { type: "quiz", label: "DA II", locked: true }
            ]},
            { name: "Dr. Dominic Savio M", slot: "B1 slot", items: [
                { type: "quiz", label: "DA1",   locked: true },
                { type: "quiz", label: "Quiz 2", locked: false }
            ]},
            { name: "Dr. Dominic Savio M", slot: "B2 slot", items: [
                { type: "quiz", label: "DA-1",  locked: true },
                { type: "quiz", label: "Quiz 2", locked: false }
            ]},
            { name: "Dr. A. Pravin Renold", slot: "C1 Slot_DSA", items: [
                { type: "quiz",       label: "DA2", locked: true },
                { type: "assignment", label: "DA3", locked: true }
            ]},
            { name: "Dr. KSHMA TRIVEDI", slot: "B1_DSA", items: [
                { type: "assignment", label: "DA-3", locked: true }
            ]},
            { name: "Dr. KSHMA TRIVEDI", slot: "B2_DSA", items: [
                { type: "assignment", label: "DA-3", locked: true }
            ]}
        ]
    },
    {
        id: "dsalab", title: "DSA Lab",
        code: "BCSE202P", semester: "Fall Semester 2025-26",
        cover: "cover-8", completion: 0,
        faculty: [
            { name: "General", slot: "", items: [
                { type: "forum", label: "Announcements" }
            ]},
            { name: "Dr. Rolla Subrahmanyam", slot: "C2 slot", items: [] },
            { name: "Dr. Rolla Subrahmanyam", slot: "B2 slot", items: [] }
        ]
    },
    {
        id: "daa", title: "Design and Analysis of Algorithms",
        code: "BCSE204L", semester: "Winter Semester 2025-26",
        cover: "cover-9", completion: 0,
        faculty: [
            { name: "General", slot: "", items: [
                { type: "forum", label: "Announcements" }
            ]},
            { name: "Weekly Lab Content", slot: "7 Jan - 13 Jan", items: [
                { type: "assignment", label: "Greedy – Fractional Knapsack (C++)",  locked: false },
                { type: "assignment", label: "Smart Lab Scheduling with Priorities", locked: false }
            ]},
            { name: "Weekly Lab Content", slot: "14 Jan - 20 Jan", items: [
                { type: "assignment", label: "Dynamic Programming - Guided Sample",                   locked: false },
                { type: "assignment", label: "DP-LCS: Log Synchronization in a Network Lab",         locked: false },
                { type: "assignment", label: "DP – Matrix Chain Multiplication (MCM): Robotics Compute Planner", locked: false },
                { type: "assignment", label: "Sample",                                                locked: false }
            ]},
            { name: "Weekly Lab Content", slot: "4 Feb - 10 Feb", items: [
                { type: "assignment", label: "PAT1_E2_Question_1", locked: true },
                { type: "assignment", label: "PAT1- E2 - Question 2", locked: true },
                { type: "quiz",       label: "DA1_E2",              locked: true },
                { type: "assignment", label: "PAT1_E1_Question_1",  locked: true },
                { type: "assignment", label: "PAT1- E1 - Question 2", locked: true },
                { type: "quiz",       label: "DA1_E1",              locked: true }
            ]},
            { name: "Weekly Lab Content", slot: "11 Feb - 17 Feb", items: [
                { type: "file",       label: "String Matching",               locked: false },
                { type: "assignment", label: "String Matching Algorithm - Naive", locked: true },
                { type: "assignment", label: "String Matching - Robin Karp",  locked: true },
                { type: "assignment", label: "String Matching - KMP",         locked: true }
            ]},
            { name: "Weekly Lab Content", slot: "25 Feb - 3 Mar", items: [
                { type: "file",       label: "Shortest Path Algorithms",  locked: false },
                { type: "assignment", label: "Bellman–Ford algorithm",    locked: true },
                { type: "assignment", label: "Floyd–Warshall Algorithm",  locked: true }
            ]},
            { name: "Dr. Senthil Kumar A M", slot: "DAA_A1+TA1", items: [
                { type: "quiz",       label: "DA2 Quiz",        locked: true },
                { type: "assignment", label: "PAT 2 - E2 Slot", locked: true },
                { type: "assignment", label: "PAT 2 E1 Slot",   locked: true },
                { type: "assignment", label: "Debugging - E2 Slot", locked: true },
                { type: "assignment", label: "Debugging E1 Slot",   locked: true }
            ]},
            { name: "Dr. Senthil Kumar A M", slot: "DAA_A2+TA2", items: [
                { type: "quiz", label: "DA2 Quiz", locked: true }
            ]}
        ]
    },
    {
        id: "daalab", title: "DAA Lab",
        code: "BCSE204P", semester: "Winter Semester 2025-26",
        cover: "cover-10", completion: 0,
        faculty: [
            { name: "General", slot: "", items: [
                { type: "forum", label: "Announcements" }
            ]},
            { name: "T Raja Sree", slot: "L51+L52", items: [
                { type: "assignment", label: "DAA - PAT 1 (A1 slot)", due: "7 Feb 2026, 5:20 PM", locked: true }
            ]}
        ]
    },
    {
        id: "hci", title: "Human Computer Interaction",
        code: "BCSE415L", semester: "Winter Semester 2025-26",
        cover: "cover-11", completion: 0,
        faculty: [
            { name: "Course Faculty", slot: "General", items: [
                { type: "forum",      label: "Announcements" },
                { type: "assignment", label: "Digital Assignment 1", locked: true },
                { type: "assignment", label: "Digital Assignment 2", locked: true }
            ]}
        ]
    },
    {
        id: "prob", title: "Probability and Statistics",
        code: "BMAT202L", semester: "Winter Semester 2025-26",
        cover: "cover-12", completion: 2,
        faculty: [
            { name: "Course Faculty", slot: "General", items: [
                { type: "forum",      label: "Announcements" },
                { type: "assignment", label: "Digital Assignment 1", locked: true },
                { type: "quiz",       label: "Quiz I",               locked: true }
            ]}
        ]
    },
    {
        id: "problab", title: "Probability and Statistics Lab",
        code: "BMAT202P", semester: "Winter Semester 2025-26",
        cover: "cover-13", completion: 10,
        faculty: [
            { name: "Lab Faculty", slot: "General", items: [
                { type: "forum", label: "Announcements" }
            ]}
        ]
    },
    {
        id: "cpj", title: "Computer Programming: Java",
        code: "BCSE103E", semester: "Fall Semester 2025-26",
        cover: "cover-14", completion: 0,
        faculty: [
            { name: "General", slot: "", items: [
                { type: "forum", label: "Announcements" },
                { type: "file",  label: "BCSE103E_Syllabus", locked: true },
                { type: "file",  label: "Computer Programming: Java(BCSE103E): TB2 Material", locked: false },
                { type: "file",  label: "Computer Programming: Java(BCSE103E): TB1 Material", locked: true }
            ]},
            { name: "Saravanan P", slot: "L1+L2+L19+L20 / L39+L40+L51+L52", items: [
                { type: "file", label: "BCSE103_M1L1_Introduction",                              locked: true },
                { type: "file", label: "BCSE103_M1L2_JVM Byte code keywords",                    locked: true },
                { type: "file", label: "BCSE103_M1L3_Datatype Literals Statements Operators Scanner", locked: true },
                { type: "file", label: "BCSE103_M2L1_Control Statements Arrays",                 locked: true },
                { type: "file", label: "BCSE103_M2L2_Multidimensional Arrays String Wrapper classes", locked: true },
                { type: "file", label: "M3L1_Classes Fundamentals",                              locked: true },
                { type: "file", label: "M3L2_Constructor this Array of Objects",                 locked: true },
                { type: "file", label: "M3L3_Static Block Nested Class",                         locked: true },
                { type: "file", label: "M4L1_Inheritance",                                       locked: true },
                { type: "file", label: "M4L2_final keyword Polymorphism overloading and overriding", locked: true },
                { type: "file", label: "M4L3_Abstract Class and Interfaces",                     locked: true },
                { type: "file", label: "M5L1_Exception in Java",                                 locked: true },
                { type: "file", label: "M5L2_Types of Exception Flow of Exceptions Keywords",    locked: true },
                { type: "file", label: "M5L3_User defined Exception in Java",                    locked: true },
                { type: "file", label: "M6L1_Files and Streams",                                 locked: true },
                { type: "file", label: "M6L2_Input and Output Stream Classes",                   locked: true },
                { type: "file", label: "M6L3_Serialization and Deserialization of Objects",      locked: true },
                { type: "file", label: "M7L1_Collection framework",                              locked: true },
                { type: "file", label: "M7L2_Collection List",                                   locked: true },
                { type: "file", label: "M7L3_Set and Map",                                       locked: true },
                { type: "file", label: "M7L4_Generic class",                                     locked: true }
            ]},
            { name: "Anusooya G", slot: "L29+L30+L31+L32/TB1", items: [
                { type: "assignment", label: "Section restricted to slot", locked: true }
            ]},
            { name: "Dr. R. Kanniga Devi", slot: "TB1 - Mon & Thur lab (L31+L32+L49+L50)", items: [
                { type: "assignment", label: "Section restricted to slot", locked: true }
            ]},
            { name: "Dr. R. Kanniga Devi", slot: "TB2 - Wed & Fri lab (L15+L16+L27+L28)", items: [
                { type: "assignment", label: "Section restricted to slot", locked: true }
            ]},
            { name: "Dr R Sivakami", slot: "TB1", items: [
                { type: "quiz", label: "53128 TB1 Q2", locked: true }
            ]},
            { name: "Dr R Sivakami", slot: "TB2", items: [] },
            { name: "Senthil Prakash P N", slot: "L1+L2+L19+L20 / L39+L40+L51+L52", items: [
                { type: "file", label: "Materials",                   locked: true },
                { type: "quiz", label: "MCQs based on Exceptions",   locked: true }
            ]},
            { name: "Dr. L.M. Jenila Livingston", slot: "L29+L30+L43+L44", items: [
                { type: "assignment", label: "Package Exercise - upload link", note: "Upload code, output and package directory structure", locked: true }
            ]}
        ]
    },
    {
        id: "micro", title: "Microprocessors and Microcontrollers",
        code: "BECE204L", semester: "Fall Semester 2025-26",
        cover: "cover-15", completion: 1,
        faculty: [
            { name: "Course Faculty", slot: "General", items: [
                { type: "forum",      label: "Announcements" },
                { type: "assignment", label: "Digital Assignment 1", locked: true },
                { type: "quiz",       label: "Quiz I",               locked: true }
            ]}
        ]
    },
    {
        id: "envs", title: "Environmental Sciences",
        code: "BCHY102N", semester: "Winter Semester 2025-26",
        cover: "cover-16", completion: 0,
        faculty: [
            { name: "General", slot: "", items: [
                { type: "forum", label: "Announcements" }
            ]},
            { name: "Weekly Content", slot: "10 Dec - 16 Dec", items: [] },
            { name: "Weekly Content", slot: "17 Dec - 23 Dec", items: [] },
            { name: "Weekly Content", slot: "24 Dec - 30 Dec", items: [] },
            { name: "Weekly Content", slot: "31 Dec - 6 Jan",  items: [] },
            { name: "Weekly Content", slot: "7 Jan - 13 Jan",  items: [] }
        ]
    },
    {
        id: "french", title: "French I",
        code: "BFRE101L", semester: "Fall Semester 2025-26",
        cover: "cover-17", completion: 0,
        faculty: [
            { name: "General", slot: "", items: [
                { type: "forum", label: "Announcements" }
            ]},
            { name: "Govindarajan P", slot: "G1 / B2 / G2", items: [
                { type: "assignment", label: "DA1_FRENCH (AUDIO)_G1", locked: true },
                { type: "assignment", label: "DA1_FRENCH (AUDIO)_B2", locked: true },
                { type: "assignment", label: "DA1_FRENCH (AUDIO)_G2", locked: true },
                { type: "quiz",       label: "QUIZ 1_B2",             locked: false },
                { type: "quiz",       label: "QUIZ 1_G1",             locked: false },
                { type: "quiz",       label: "QUIZ 1_G2",             locked: false },
                { type: "quiz",       label: "QUIZ_G1",               locked: true },
                { type: "quiz",       label: "QUIZ_B2",               locked: true },
                { type: "quiz",       label: "QUIZ_G2",               locked: true },
                { type: "quiz",       label: "Re-Quiz 20:20:20",      locked: false }
            ]}
        ]
    },
    {
        id: "toc", title: "Theory of Computation",
        code: "BCSE304L", semester: "Winter Semester 2025-26",
        cover: "cover-18", completion: 0,
        faculty: [
            { name: "Course Faculty", slot: "General", items: [
                { type: "forum",      label: "Announcements" },
                { type: "assignment", label: "Digital Assignment 1", locked: true },
                { type: "quiz",       label: "Quiz I",               locked: true }
            ]}
        ]
    },
    {
        id: "wp", title: "Web Programming",
        code: "BCSE203E", semester: "Winter Semester 2025-26",
        cover: "cover-19", completion: 1,
        faculty: [
            { name: "Course Faculty", slot: "General", items: [
                { type: "forum",      label: "Announcements" },
                { type: "assignment", label: "Digital Assignment 1", locked: true },
                { type: "quiz",       label: "Quiz I",               locked: true }
            ]}
        ]
    },
    {
        id: "qsp", title: "Qualitative Skills Practice II",
        code: "BSTS202P", semester: "Fall Semester 2025-26",
        cover: "cover-20", completion: 0,
        faculty: [
            { name: "Course Faculty", slot: "General", items: [
                { type: "forum", label: "Announcements" }
            ]}
        ]
    },
    {
        id: "qtsp", title: "Quantitative Skills Practice II",
        code: "BSTS102P", semester: "Winter Semester 2025-26",
        cover: "cover-21", completion: 0,
        faculty: [
            { name: "Course Faculty", slot: "General", items: [
                { type: "forum", label: "Announcements" }
            ]}
        ]
    }
];

const itemMeta = {
    assignment: { emoji: "📄", color: "#e84b8a", label: "ASSIGNMENT" },
    quiz:       { emoji: "✅", color: "#e84b8a", label: "QUIZ"       },
    forum:      { emoji: "💬", color: "#e05b2b", label: "FORUM"      },
    file:       { emoji: "📁", color: "#1a73e8", label: "FILE"       },
    vpl:        { emoji: "💻", color: "#e84b8a", label: "VIRTUAL PROGRAMMING LAB" },
    page:       { emoji: "📄", color: "#1a73e8", label: "PAGE"       },
    folder:     { emoji: "📂", color: "#1a73e8", label: "FOLDER"     }
};

function loadProgress() {
    try { return JSON.parse(localStorage.getItem(uKey('eq_progress')) || '{}'); }
    catch(e) { return {}; }
}
function saveProgress(state) {
    localStorage.setItem(uKey('eq_progress'), JSON.stringify(state));
}
function isItemDone(courseId, itemLabel) {
    return !!loadProgress()[courseId + '||' + itemLabel];
}
function markDone(courseId, itemLabel) {
    const s = loadProgress();
    s[courseId + '||' + itemLabel] = true;
    saveProgress(s);
}
function unmarkDone(courseId, itemLabel) {
    const s = loadProgress();
    delete s[courseId + '||' + itemLabel];
    saveProgress(s);
}
function calcCompletion(course) {
    const trackable = course.faculty.flatMap(f => f.items.filter(i => !i.locked));
    if (!trackable.length) return 0;
    const done = trackable.filter(i => isItemDone(course.id, i.label)).length;
    return Math.round((done / trackable.length) * 100);
}

function buildCourseCard(course) {
    const pct = calcCompletion(course);
    const card = document.createElement("div");
    card.className = "course-card";
    card.innerHTML = `
        <div class="course-cover ${course.cover}"></div>
        <div class="course-info">
            <h4>${course.title}</h4>
            <span class="course-code-tag">${course.code}</span>
            <span>${course.semester}</span>
            <div class="completion-bar-wrap">
                <div class="completion-bar" style="width:${pct}%"></div>
            </div>
            <span class="completion-pct">${pct}% complete</span>
        </div>
    `;
    card.addEventListener("click", () => openCourse(course.id));
    return card;
}

function renderCourseGrid() {
    ['course-grid', 'course-grid-mycourses'].forEach(id => {
        const grid = document.getElementById(id);
        if (!grid) return;
        grid.innerHTML = "";
        courses.forEach(course => grid.appendChild(buildCourseCard(course)));
    });
    renderUpcomingDeadlines();
}

function recordCourseAccess(courseId) {
    try {
        var map = JSON.parse(localStorage.getItem(uKey('eq_course_access')) || '{}');
        map[courseId] = Date.now();
        localStorage.setItem(uKey('eq_course_access'), JSON.stringify(map));
    } catch(e) {}
}
function getCourseAccessMap() {
    try { return JSON.parse(localStorage.getItem(uKey('eq_course_access')) || '{}'); }
    catch(e) { return {}; }
}

var currentCourseFilter = 'all';

function goToActiveCourses() {
    switchTab('mycourses-view');
    var activeBtn = document.querySelector('.cf-btn[data-filter="active"]');
    setCourseFilter('active', activeBtn);
}

function setCourseFilter(filter, btn) {
    currentCourseFilter = filter;
    document.querySelectorAll('.cf-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderCourseGridIn('course-grid-mycourses', true);
}

function openCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    recordCourseAccess(courseId);

    document.getElementById("detail-title").textContent = `${course.title} (${course.code})`;
    document.getElementById("detail-semester").textContent = course.semester;
    document.getElementById("detail-nav-title").textContent = course.title;
    document.getElementById("detail-cover").className = `detail-cover-banner ${course.cover}`;

    const container = document.getElementById("faculty-sections");
    container.innerHTML = "";

    course.faculty.forEach(fac => {
        const slotLabel = fac.slot ? ` (${fac.slot})` : "";
        let itemsHtml = "";

        if (fac.items.length === 0) {
            itemsHtml = `<p class="empty-section">No items posted yet.</p>`;
        } else {
            fac.items.forEach(item => {
                const meta     = itemMeta[item.type] || itemMeta.file;
                const done     = !item.locked && isItemDone(course.id, item.label);
                const lockHtml = item.locked
                    ? `<div class="lms-item-lock">🔒 Not available unless you belong to <strong>${fac.name.toUpperCase()}${slotLabel.toUpperCase()}</strong></div>`
                    : "";
                const dueHtml  = item.due  ? `<div class="lms-item-due">📅 Due: ${item.due}</div>` : "";
                const noteHtml = item.note ? `<div class="lms-item-note">${item.note}</div>` : "";

                
                let actionBtn = "";
                if (!item.locked) {
                    if (done) {
                        actionBtn = `<button class="mark-done-btn done-btn" disabled>✓ Done</button>`;
                    } else if (item.type === "assignment" || item.type === "quiz" || item.type === "vpl") {
                        actionBtn = `<button class="mark-done-btn submit-btn"
                            data-course="${course.id}" data-label="${item.label.replace(/"/g,'&quot;')}"
                            data-type="${item.type}"
                            onclick="openSubmitModal(this)">
                            ${item.type === 'quiz' ? '📝 Attempt' : '📤 Submit'}
                        </button>`;
                    } else if (item.type === "forum") {
                        actionBtn = `<button class="mark-done-btn forum-btn"
                            data-course="${course.id}" data-label="${item.label.replace(/"/g,'&quot;')}"
                            onclick="openForumModal(this)">
                            💬 Open
                        </button>`;
                    } else {
                        
                        actionBtn = `<button class="mark-done-btn"
                            data-course="${course.id}" data-label="${item.label.replace(/"/g,'&quot;')}"
                            onclick="quickMarkDone(this)">
                            Mark as done
                        </button>`;
                    }
                }

                itemsHtml += `
                    <div class="lms-item-row ${done ? 'item-done' : ''}">
                        <div class="lms-item-icon" style="background:${meta.color}15;border:1.5px solid ${meta.color}30;">
                            <span style="font-size:18px">${done ? '✅' : meta.emoji}</span>
                        </div>
                        <div class="lms-item-info">
                            <span class="lms-item-type" style="color:${meta.color}">${meta.label}</span>
                            <span class="lms-item-name ${!item.locked ? 'lms-link' : ''} ${done ? 'item-name-done' : ''}">${item.label}</span>
                            ${dueHtml}${noteHtml}${lockHtml}
                        </div>
                        ${actionBtn}
                    </div>
                `;
            });
        }

        const section = document.createElement("div");
        section.className = "faculty-section";
        section.innerHTML = `
            <div class="faculty-section-header" onclick="toggleSection(this)">
                <span class="faculty-toggle">▼</span>
                <h3>${fac.name}${slotLabel}</h3>
            </div>
            <div class="faculty-items">${itemsHtml}</div>
        `;
        container.appendChild(section);
    });

    
    renderEquilibraCardsIn("#detail-equilibra-cards");

    maybeCelebrate('course');   
    showPage('course-detail');
}

function quickMarkDone(btn) {
    const courseId = btn.dataset.course;
    const label    = btn.dataset.label;
    markDone(courseId, label);
    const row = btn.closest('.lms-item-row');
    row.classList.add('item-done');
    row.querySelector('.lms-item-name').classList.add('item-name-done');
    const iconEl = row.querySelector('.lms-item-icon span');
    if (iconEl) iconEl.textContent = '✅';
    btn.textContent = '✓ Done';
    btn.classList.add('done-btn');
    btn.disabled = true;
    refreshCompletionUI(courseId);
}

function openSubmitModal(btn) {
    const courseId = btn.dataset.course;
    const label    = btn.dataset.label;
    const type     = btn.dataset.type;
    const isQuiz   = type === 'quiz';

    document.getElementById('submit-modal-title').textContent =
        (isQuiz ? '📝 ' : '📤 ') + label;
    document.getElementById('submit-modal-subtitle').textContent =
        isQuiz ? 'Write your answers below and submit when ready.'
               : 'Paste a link, write notes, or describe your submission.';
    document.getElementById('submit-modal-textarea').value = '';
    document.getElementById('submit-modal-textarea').placeholder =
        isQuiz ? 'Q1: …\nQ2: …' : 'Submission notes or link…';

    const confirmBtn = document.getElementById('submit-modal-confirm');
    confirmBtn.onclick = function() {
        markDone(courseId, label);
        closeSubmitModal();
        openCourse(courseId);        
        refreshCompletionUI(courseId);
    };

    document.getElementById('submit-modal-overlay').classList.add('active');
}

function closeSubmitModal() {
    document.getElementById('submit-modal-overlay').classList.remove('active');
}

function openForumModal(btn) {
    const courseId = btn.dataset.course;
    const label    = btn.dataset.label;
    const course   = courses.find(c => c.id === courseId);

    document.getElementById('forum-modal-title').textContent = '💬 ' + label;
    document.getElementById('forum-modal-body').innerHTML =
        `<div class="forum-post">
            <div class="forum-post-avatar">👩‍🏫</div>
            <div class="forum-post-content">
                <p class="forum-post-author">${course ? course.faculty[0].name : 'Instructor'} <span>· Course Announcements</span></p>
                <p class="forum-post-text">Welcome to <strong>${course ? course.title : label}</strong>! This forum is for course announcements and updates. Check here regularly for important notices, deadlines, and resources.</p>
                <p class="forum-post-time">Posted at course start</p>
            </div>
        </div>
        <div class="forum-post">
            <div class="forum-post-avatar">📌</div>
            <div class="forum-post-content">
                <p class="forum-post-author">System <span>· Pinned</span></p>
                <p class="forum-post-text">All assignment submissions must follow the format specified in the course syllabus. Late submissions will be penalised as per institute policy.</p>
                <p class="forum-post-time">Pinned notice</p>
            </div>
        </div>`;

    
    markDone(courseId, label);
    refreshCompletionUI(courseId);

    document.getElementById('forum-modal-overlay').classList.add('active');
}

function closeForumModal() {
    document.getElementById('forum-modal-overlay').classList.remove('active');
}

function refreshCompletionUI(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    const pct = calcCompletion(course);
    
    document.querySelectorAll('.course-card').forEach(card => {
        const h4 = card.querySelector('h4');
        if (h4 && h4.textContent === course.title) {
            const bar = card.querySelector('.completion-bar');
            const txt = card.querySelector('.completion-pct');
            if (bar) bar.style.width = pct + '%';
            if (txt) txt.textContent = pct + '% complete';
        }
    });
    
    renderUpcomingDeadlines();
}

function parseItemDate(str) {
    if (!str) return null;
    
    const dmyMatch = str.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);
    if (dmyMatch) return new Date(+dmyMatch[3], +dmyMatch[2]-1, +dmyMatch[1]);
    
    const d = new Date(str);
    return isNaN(d) ? null : d;
}

function renderUpcomingDeadlines() {
    const container = document.getElementById('deadlines-widget');
    if (!container) return;

    const today = new Date();
    today.setHours(0,0,0,0);
    const deadlines = [];

    courses.forEach(course => {
        course.faculty.forEach(fac => {
            fac.items.forEach(item => {
                if (!item.due || item.locked) return;
                if (isItemDone(course.id, item.label)) return;
                const d = parseItemDate(item.due);
                if (!d) return;
                deadlines.push({ course, item, date: d });
            });
        });
    });

    deadlines.sort((a, b) => a.date - b.date);
    const upcoming = deadlines.slice(0, 5);

    if (!upcoming.length) {
        container.innerHTML = '';
        container.closest('.deadlines-section') && (container.closest('.deadlines-section').style.display = 'none');
        return;
    }

    const section = container.closest('.deadlines-section');
    if (section) section.style.display = '';

    container.innerHTML = upcoming.map(({ course, item, date }) => {
        const diff  = Math.ceil((date - today) / 86400000);
        const urgency = diff <= 1 ? 'urgent' : diff <= 3 ? 'soon' : 'normal';
        const meta  = itemMeta[item.type] || itemMeta.file;
        const label = diff < 0  ? 'Overdue'
                    : diff === 0 ? 'Today'
                    : diff === 1 ? 'Tomorrow'
                    : `In ${diff} days`;
        return `
            <div class="deadline-chip ${urgency}" onclick="openCourse('${course.id}')">
                <span class="deadline-emoji">${meta.emoji}</span>
                <div class="deadline-info">
                    <span class="deadline-label">${item.label}</span>
                    <span class="deadline-course">${course.code}</span>
                </div>
                <span class="deadline-badge ${urgency}">${label}</span>
            </div>`;
    }).join('');
}

function toggleSection(header) {
    const items  = header.nextElementSibling;
    const toggle = header.querySelector(".faculty-toggle");
    const isOpen = items.style.display !== "none";
    items.style.display  = isOpen ? "none" : "block";
    toggle.textContent   = isOpen ? "▶" : "▼";
}

function renderEquilibraCardsIn(selector) {
    const container = document.querySelector(selector);
    if (!container) return;
    container.innerHTML = "";
    equilibraFeatures.forEach(feature => {
        const card = document.createElement("div");
        card.className = "equilibra-card";
        card.dataset.id = feature.id;
        card.innerHTML = `
            <div class="card-icon">${feature.icon}</div>
            <div class="card-text">
                <h4>${feature.title}</h4>
                <p class="card-short">${feature.short}</p>
                <p class="card-detail" style="display:none;">${feature.detail}</p>
            </div>
        `;
        card.addEventListener("click", () => {
            if      (feature.id === "mirror")      { showPage("mirror"); }
            else if (feature.id === "nemo")        { openNemo(); }
            else if (feature.id === "unload")      { showPage("unload"); }
            else if (feature.id === "pomodoro")    { showPage("pomodoro"); }
            else if (feature.id === "visionboard") { showPage("vision-board"); }
            else if (feature.id === "recharge")    { showPage("recharge"); }
            else                                   { toggleEquilibraCard(card); }
        });
        container.appendChild(card);
    });
}

function switchTab(viewId) {
    ['dashboard-view','mycourses-view','calendar-view'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    const target = document.getElementById(viewId);
    if (target) target.style.display = 'block';

    document.querySelectorAll('.lms-nav .lms-item').forEach(item => item.classList.remove('active'));
    const navMap = {'dashboard-view':'nav-dashboard','mycourses-view':'nav-mycourses','calendar-view':'nav-calendar'};
    const navEl = document.getElementById(navMap[viewId]);
    if (navEl) navEl.classList.add('active');

    if (viewId === 'mycourses-view') renderCourseGridIn('course-grid-mycourses', true);
    if (viewId === 'calendar-view')  renderCalendar();
}

let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth();

const monthNames = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];

const calEvents = {
    '2025-8-8':   ['Digital Assignment-01 (CVLA)'],
    '2025-11-10': ['Digital Assignment-03 (CVLA)'],
    '2026-3-1':   ['Lab Digital Assignment'],
    '2026-3-3':   ['LAB 9 submission'],
    '2026-3-10':  ['LAB 10 submission', 'Lab Digital Assignment'],
    '2026-3-13':  ['Lab Exercise'],
    '2026-3-18':  ['Creation Assignment', 'Creation Quiz'],
    '2026-3-23':  ['54162-Digital Assignment', '54162-Digital Assignment 2'],
};

function renderCalendar() {
    const today    = new Date();
    const lastDay  = new Date(calYear, calMonth + 1, 0);
    const firstDay = new Date(calYear, calMonth, 1);

    document.getElementById('cal-month-title').textContent      = monthNames[calMonth] + ' ' + calYear;
    document.getElementById('prev-month-label').textContent     = monthNames[(calMonth + 11) % 12];
    document.getElementById('next-month-label').textContent     = monthNames[(calMonth + 1)  % 12];

    const calDays = document.getElementById('cal-days');
    if (!calDays) return;

    calDays.parentElement.innerHTML = `
        <div class="cal-headers-row">
            <div class="cal-header-cell">Mon</div><div class="cal-header-cell">Tue</div>
            <div class="cal-header-cell">Wed</div><div class="cal-header-cell">Thu</div>
            <div class="cal-header-cell">Fri</div><div class="cal-header-cell">Sat</div>
            <div class="cal-header-cell">Sun</div>
        </div>
        <div class="cal-days-grid" id="cal-days"></div>
    `;

    const grid = document.getElementById('cal-days');

    let startDow = firstDay.getDay();
    startDow = startDow === 0 ? 6 : startDow - 1;

    for (let i = 0; i < startDow; i++) {
        const cell = document.createElement('div');
        cell.className = 'cal-cell empty';
        grid.appendChild(cell);
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
        const isToday = (d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear());
        const cell = document.createElement('div');
        cell.className = 'cal-cell' + (isToday ? ' today' : '');

        const dateEl = document.createElement('div');
        dateEl.className = 'cal-date' + (isToday ? '' : ' plain');
        dateEl.textContent = d;
        cell.appendChild(dateEl);

        const key = calYear + '-' + (calMonth + 1) + '-' + d;
        const userEvs = getUserEvents()[key] || [];
        const allEventsForDay = (calEvents[key] || []).concat(userEvs);
        allEventsForDay.forEach((ev, idx) => {
            const evEl = document.createElement('div');
            const isUser = idx >= (calEvents[key] || []).length;
            evEl.className = 'cal-event' + (isUser ? ' cal-event--user' : '');
            evEl.textContent = ev.length > 13 ? ev.substring(0, 13) + '...' : ev;
            evEl.title = ev;
            cell.appendChild(evEl);
        });

        grid.appendChild(cell);
    }
}

function getUserEvents() {
    try { return JSON.parse(localStorage.getItem(uKey('eq_cal_events')) || '{}'); }
    catch(e) { return {}; }
}
function putUserEvents(map) {
    localStorage.setItem(uKey('eq_cal_events'), JSON.stringify(map));
}

function openNewEventModal() {
    const overlay = document.getElementById('new-event-overlay');
    if (!overlay) return;
    document.getElementById('nev-name').value = '';
    
    const today = new Date();
    document.getElementById('nev-date').value = today.toISOString().slice(0, 10);
    document.getElementById('nev-err').style.display = 'none';
    overlay.style.display = 'flex';
    setTimeout(() => document.getElementById('nev-name').focus(), 50);
}

function closeNewEventModal(e) {
    if (e && e.target !== document.getElementById('new-event-overlay')) return;
    document.getElementById('new-event-overlay').style.display = 'none';
}

function saveNewEvent() {
    const name = document.getElementById('nev-name').value.trim();
    const dateVal = document.getElementById('nev-date').value;
    const errEl = document.getElementById('nev-err');
    if (!name) { errEl.textContent = 'Please enter an event name.'; errEl.style.display = 'block'; return; }
    if (!dateVal) { errEl.textContent = 'Please pick a date.'; errEl.style.display = 'block'; return; }
    errEl.style.display = 'none';

    
    const [y, m, d] = dateVal.split('-').map(Number);
    const key = y + '-' + m + '-' + d;

    const map = getUserEvents();
    if (!map[key]) map[key] = [];
    map[key].push(name);
    putUserEvents(map);

    document.getElementById('new-event-overlay').style.display = 'none';
    renderCalendar();
}

let _bubbleRunning = false;
let _2048KeyHandler = null;

function launchGame(gameId) {
    document.getElementById('recharge-picker').style.display = 'none';
    const arena = document.getElementById('recharge-arena');
    arena.style.display = 'block';
    ['game-bubble','game-memory','game-2048'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    _bubbleRunning = false;
    if (_2048KeyHandler) { document.removeEventListener('keydown', _2048KeyHandler); _2048KeyHandler = null; }

    if (gameId === 'bubble')  { document.getElementById('game-bubble').style.display = 'block'; initBubblePop(); }
    if (gameId === 'memory')  { document.getElementById('game-memory').style.display = 'block'; initMemoryMatch(); }
    if (gameId === '2048')    { document.getElementById('game-2048').style.display  = 'block'; init2048(); }
}

function exitGame() {
    _bubbleRunning = false;
    if (_2048KeyHandler) { document.removeEventListener('keydown', _2048KeyHandler); _2048KeyHandler = null; }
    document.getElementById('recharge-arena').style.display = 'none';
    document.getElementById('recharge-picker').style.display = 'block';
}

function initBubblePop() {
    const container = document.getElementById('game-bubble');
    container.innerHTML = `
        <div class="bp-header">
            <span class="bp-score-label">Score: <strong id="bp-score">0</strong></span>
            <button class="bp-reset-btn" onclick="initBubblePop()">Reset</button>
        </div>
        <canvas id="bp-canvas" class="bp-canvas"></canvas>
        <p class="bp-hint">Click the bubbles to pop them!</p>
    `;
    const canvas = document.getElementById('bp-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width  = Math.min(560, container.clientWidth - 32);
    canvas.height = 420;

    let score = 0;
    const bubbles = [], particles = [];
    const COLORS = ['#a78bfa','#60a5fa','#34d399','#f472b6','#fbbf24','#6ee7b7','#fb7185'];

    function mkBubble(yOverride) {
        const r = 18 + Math.random() * 26;
        return {
            x: r + Math.random() * (canvas.width - 2 * r),
            y: yOverride !== undefined ? yOverride : canvas.height + r,
            r, speed: 0.6 + Math.random() * 1.1,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            wobble: Math.random() * Math.PI * 2,
            ws: 0.018 + Math.random() * 0.022
        };
    }

    for (let i = 0; i < 7; i++) { const b = mkBubble(Math.random() * canvas.height); bubbles.push(b); }

    canvas.addEventListener('click', e => {
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const my = (e.clientY - rect.top)  * (canvas.height / rect.height);
        for (let i = bubbles.length - 1; i >= 0; i--) {
            const b = bubbles[i];
            if (Math.hypot(mx - b.x, my - b.y) <= b.r) {
                score++;
                document.getElementById('bp-score').textContent = score;
                for (let p = 0; p < 10; p++) {
                    const a = (Math.PI * 2 * p) / 10;
                    particles.push({ x: b.x, y: b.y, vx: Math.cos(a) * (2 + Math.random() * 3), vy: Math.sin(a) * (2 + Math.random() * 3), color: b.color, life: 1 });
                }
                bubbles.splice(i, 1);
                break;
            }
        }
    });

    _bubbleRunning = true;
    let frame = 0;
    (function loop() {
        if (!_bubbleRunning) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frame++;
        if (frame % 75 === 0 && bubbles.length < 14) bubbles.push(mkBubble());

        bubbles.forEach((b, i) => {
            b.y -= b.speed; b.wobble += b.ws; b.x += Math.sin(b.wobble) * 0.6;
            if (b.y + b.r < 0) { bubbles[i] = mkBubble(); return; }
            ctx.save();
            ctx.globalAlpha = 0.82;
            ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fillStyle = b.color + '33'; ctx.fill();
            ctx.strokeStyle = b.color; ctx.lineWidth = 2.5; ctx.stroke();
            ctx.globalAlpha = 0.35;
            ctx.beginPath(); ctx.arc(b.x - b.r * 0.28, b.y - b.r * 0.3, b.r * 0.22, 0, Math.PI * 2);
            ctx.fillStyle = 'white'; ctx.fill();
            ctx.restore();
        });

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life -= 0.045;
            if (p.life <= 0) { particles.splice(i, 1); continue; }
            ctx.save(); ctx.globalAlpha = p.life;
            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = p.color; ctx.fill(); ctx.restore();
        }
        requestAnimationFrame(loop);
    })();
}

function initMemoryMatch() {
    const container = document.getElementById('game-memory');
    const EMOJIS = ['🌸','🦋','🌙','⭐','🌈','🎯','🦊','🐬','🍀','🎨'];
    const picked = EMOJIS.slice(0, 8);
    const cards = [...picked, ...picked].sort(() => Math.random() - 0.5);
    let flipped = [], matched = new Set(), moves = 0, locked = false;
    let startTime = null, timerInterval = null;

    function buildGrid() {
        container.innerHTML = `
            <div class="mm-header">
                <span>Moves: <strong id="mm-moves">0</strong></span>
                <span id="mm-timer">0s</span>
                <button class="mm-new-btn" onclick="initMemoryMatch()">New Game</button>
            </div>
            <div class="mm-grid" id="mm-grid"></div>
            <div id="mm-win" class="mm-win" style="display:none;">🎉 Solved in <span id="mm-win-moves"></span> moves & <span id="mm-win-time"></span>!</div>
        `;
        const grid = document.getElementById('mm-grid');
        cards.forEach((emoji, idx) => {
            const card = document.createElement('div');
            card.className = 'mm-card' + (matched.has(idx) ? ' mm-matched' : '') + (flipped.includes(idx) ? ' mm-flipped' : '');
            card.innerHTML = `<div class="mm-inner"><div class="mm-front"></div><div class="mm-back">${emoji}</div></div>`;
            card.addEventListener('click', () => {
                if (locked || flipped.includes(idx) || matched.has(idx)) return;
                if (!startTime) {
                    startTime = Date.now();
                    timerInterval = setInterval(() => {
                        const el = document.getElementById('mm-timer');
                        if (el) el.textContent = Math.floor((Date.now() - startTime) / 1000) + 's';
                    }, 500);
                }
                flipped.push(idx);
                card.classList.add('mm-flipped');
                if (flipped.length === 2) {
                    locked = true; moves++;
                    document.getElementById('mm-moves').textContent = moves;
                    const [a, b] = flipped;
                    if (cards[a] === cards[b]) {
                        matched.add(a); matched.add(b); flipped = []; locked = false;
                        document.querySelectorAll('#mm-grid .mm-card')[a].classList.add('mm-matched');
                        document.querySelectorAll('#mm-grid .mm-card')[b].classList.add('mm-matched');
                        if (matched.size === cards.length) {
                            clearInterval(timerInterval);
                            const secs = Math.floor((Date.now() - startTime) / 1000);
                            document.getElementById('mm-win').style.display = 'block';
                            document.getElementById('mm-win-moves').textContent = moves;
                            document.getElementById('mm-win-time').textContent = secs + 's';
                        }
                    } else {
                        setTimeout(() => {
                            const allCards = document.querySelectorAll('#mm-grid .mm-card');
                            flipped.forEach(i => { if (!matched.has(i)) allCards[i].classList.remove('mm-flipped'); });
                            flipped = []; locked = false;
                        }, 900);
                    }
                }
            });
            grid.appendChild(card);
        });
    }
    buildGrid();
}

function init2048() {
    const container = document.getElementById('game-2048');
    let board = Array.from({length:4}, () => Array(4).fill(0));
    let score = 0, best = parseInt(localStorage.getItem('eq_2048_best')||'0'), gameOver = false;

    function addRandom() {
        const empty = [];
        for (let r=0;r<4;r++) for (let c=0;c<4;c++) if (!board[r][c]) empty.push([r,c]);
        if (!empty.length) return;
        const [r,c] = empty[Math.floor(Math.random()*empty.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    function slideRow(row) {
        let a = row.filter(v=>v), gain = 0;
        for (let i=0;i<a.length-1;i++) { if (a[i]===a[i+1]) { a[i]*=2; gain+=a[i]; a.splice(i+1,1); } }
        while (a.length<4) a.push(0);
        return {row:a, gain};
    }

    function transpose(b)  { return b[0].map((_,i)=>b.map(r=>r[i])); }
    function reverseRows(b){ return b.map(r=>[...r].reverse()); }

    function move(dir) {
        if (gameOver) return;
        let b = board.map(r=>[...r]), gain = 0, moved = false;
        if (dir==='left')  { b = b.map(r=>{ const s=slideRow(r); gain+=s.gain; return s.row; }); }
        if (dir==='right') { b = reverseRows(b).map(r=>{ const s=slideRow(r); gain+=s.gain; return s.row; }); b=reverseRows(b); }
        if (dir==='up')    { b = transpose(b).map(r=>{ const s=slideRow(r); gain+=s.gain; return s.row; }); b=transpose(b); }
        if (dir==='down')  { b = reverseRows(transpose(b)).map(r=>{ const s=slideRow(r); gain+=s.gain; return s.row; }); b=transpose(reverseRows(b)); }
        if (JSON.stringify(b) !== JSON.stringify(board)) { moved=true; board=b; }
        if (moved) {
            score += gain;
            if (score > best) { best = score; localStorage.setItem('eq_2048_best', best); }
            addRandom();
            const flat = board.flat();
            if (!flat.includes(0)) {
                let stuck = true;
                for (let r=0;r<4&&stuck;r++) for (let c=0;c<4&&stuck;c++) {
                    if ((r<3&&board[r][c]===board[r+1][c])||(c<3&&board[r][c]===board[r][c+1])) stuck=false;
                }
                if (stuck) gameOver = true;
            }
            render();
        }
    }

    const TILE_BG = { 0:'#e0dce8',2:'#eee4da',4:'#ede0c8',8:'#f2b179',16:'#f59563',32:'#f67c5f',64:'#f65e3b',128:'#edcf72',256:'#edcc61',512:'#edc850',1024:'#edc53f',2048:'#edc22e' };

    function render() {
        container.innerHTML = `
            <div class="g48-header">
                <div class="g48-title-block"><span class="g48-title">2048</span><span class="g48-hint">Arrow keys or swipe</span></div>
                <div class="g48-scores">
                    <div class="g48-score-box"><div class="g48-score-lbl">SCORE</div><div id="g48-score">${score}</div></div>
                    <div class="g48-score-box"><div class="g48-score-lbl">BEST</div><div>${best}</div></div>
                </div>
                <button class="g48-new-btn" onclick="init2048()">New</button>
            </div>
            <div class="g48-board" id="g48-board">
                ${board.map(row=>row.map(v=>`<div class="g48-cell" style="background:${TILE_BG[v]||'#3c3a32'};color:${v>4?'#f9f6f2':'#776e65'};font-size:${v>=1024?'1.1rem':v>=128?'1.4rem':'1.7rem'}">${v||''}</div>`).join('')).join('')}
            </div>
            ${gameOver?'<div class="g48-over">Game Over! Hit New to try again.</div>':''}
        `;

        if (_2048KeyHandler) document.removeEventListener('keydown', _2048KeyHandler);
        _2048KeyHandler = e => {
            const map = {ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};
            if (map[e.key]) { e.preventDefault(); move(map[e.key]); }
        };
        document.addEventListener('keydown', _2048KeyHandler);

        const boardEl = document.getElementById('g48-board');
        if (boardEl) {
            let tx, ty;
            boardEl.addEventListener('touchstart', e=>{ tx=e.touches[0].clientX; ty=e.touches[0].clientY; }, {passive:true});
            boardEl.addEventListener('touchend', e=>{
                const dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty;
                if (Math.abs(dx)>Math.abs(dy)) move(dx>0?'right':'left'); else move(dy>0?'down':'up');
            }, {passive:true});
        }
    }

    addRandom(); addRandom(); render();
}

function changeMonth(dir) {
    calMonth += dir;
    if (calMonth > 11) { calMonth = 0;  calYear++; }
    if (calMonth < 0)  { calMonth = 11; calYear--; }
    renderCalendar();
}

function renderCourseGridIn(gridId, force) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    if (!force && grid.children.length > 0) return;
    grid.innerHTML = '';

    const accessMap = getCourseAccessMap();
    var filtered = courses;

    if (currentCourseFilter === 'active') {
        
        const accessed = courses.filter(c => accessMap[c.id]);
        if (accessed.length === 0) {
            grid.innerHTML = '<p style="color:#888;padding:20px 0;grid-column:1/-1;">No recently accessed courses yet. Click any course to open it.</p>';
            return;
        }
        filtered = accessed.slice().sort((a, b) => (accessMap[b.id] || 0) - (accessMap[a.id] || 0));
    } else if (currentCourseFilter === 'completed') {
        filtered = courses.filter(c => calcCompletion(c) === 100);
        if (filtered.length === 0) {
            grid.innerHTML = '<p style="color:#888;padding:20px 0;grid-column:1/-1;">No completed courses yet. Keep going!</p>';
            return;
        }
    }

    filtered.forEach(course => {
        const pct = calcCompletion(course);
        const card = document.createElement('div');
        card.className = 'course-card';
        const lastAccessed = accessMap[course.id];
        const recentTag = lastAccessed ? `<span class="cf-recent-tag">Recently opened</span>` : '';
        card.innerHTML = `
            <div class="course-cover ${course.cover}"></div>
            <div class="course-info">
                <h4>${course.title}</h4>
                <span>${course.code} &nbsp;${course.semester}</span>
                <div class="completion-bar-wrap">
                    <div class="completion-bar" style="width:${pct}%"></div>
                </div>
                <span class="completion-pct">${pct}% complete</span>
                ${currentCourseFilter === 'active' ? recentTag : ''}
            </div>
        `;
        card.addEventListener('click', () => openCourse(course.id));
        grid.appendChild(card);
    });
}

const mirrorQuestions = [

    
    {
        id: 'q_mornings', type: 'warm', dimension: 'wellbeing',
        text: 'How have your mornings been feeling this week?',
        options: [
            { label: 'Refreshed and ready to go',              score: 1  },
            { label: 'A little slow, but getting there',        score: 3  },
            { label: 'Heavy — getting up feels hard',           score: 7  },
            { label: 'I\'ve really been struggling to start',   score: 10 }
        ]
    },
    {
        id: 'q_deadlines', type: 'warm', dimension: 'pressure',
        text: 'When you think about your upcoming deadlines, how does it feel?',
        options: [
            { label: 'Manageable — I have a handle on things', score: 1  },
            { label: 'A bit overwhelming, but I\'m okay',       score: 4  },
            { label: 'Quite anxious about it',                  score: 7  },
            { label: 'Paralysed — I can\'t even begin',         score: 10 }
        ]
    },
    {
        id: 'q_connection', type: 'warm', dimension: 'engagement',
        text: 'How connected do you feel to your studies right now?',
        options: [
            { label: 'Engaged and genuinely curious',                  score: 1  },
            { label: 'Going through the motions',                      score: 5  },
            { label: 'Pretty disconnected, just ticking boxes',        score: 7  },
            { label: 'I really don\'t see the point right now',        score: 10 }
        ]
    },

    
    {
        id: 'q_tired', type: 'scale', dimension: 'exhaustion',
        text: 'How physically tired are you at the end of a study day?',
        lowLabel: 'Barely tired', highLabel: 'Completely drained'
    },
    {
        id: 'q_focus', type: 'scale', dimension: 'focus',
        text: 'How difficult is it to concentrate on your coursework lately?',
        lowLabel: 'Easy to focus', highLabel: 'Nearly impossible'
    },
    {
        id: 'q_giveup', type: 'scale', dimension: 'pressure',
        text: 'How often do you feel like giving up on a task before finishing it?',
        lowLabel: 'Rarely', highLabel: 'Almost always'
    },
    {
        id: 'q_sleep', type: 'scale', dimension: 'wellbeing', reversed: true,
        text: 'How would you rate your sleep quality this week?',
        lowLabel: 'Very poor sleep', highLabel: 'Sleeping great'
    },
    {
        id: 'q_motivation', type: 'scale', dimension: 'engagement', reversed: true,
        text: 'How motivated do you feel to keep up with your courses?',
        lowLabel: 'Not at all motivated', highLabel: 'Very motivated'
    },
    {
        id: 'q_numb', type: 'scale', dimension: 'exhaustion',
        text: 'How often do you feel emotionally flat or detached from things you used to enjoy?',
        lowLabel: 'Rarely', highLabel: 'Very often'
    }
];

let mirrorAnswers    = {};
let mirrorRadarChart = null;

function openMirrorModal() {
    showPage('mirror');
}

function closeMirrorModal() {
    showPage('dashboard');
}

function closeMirrorModalOutside(e) {
    
}

function retakeMirror() {
    mirrorAnswers = {};
    document.getElementById('mirror-results').style.display = 'none';
    document.getElementById('mirror-form').style.display    = 'block';
    renderMirrorQuestions();
    const _mb = document.querySelector('.mirror-page-body'); if (_mb) _mb.scrollTop = 0;
}

function setSliderGradient(slider) {
    const pct = ((parseFloat(slider.value) - 1) / 9 * 100).toFixed(1);
    slider.style.background =
        `linear-gradient(to right, #6a5cff 0%, #6a5cff ${pct}%, #ddd8ff ${pct}%, #ddd8ff 100%)`;
}

function renderMirrorQuestions() {
    const container = document.getElementById('mirror-questions-container');
    container.innerHTML = '';

    mirrorQuestions.forEach((q, idx) => {
        const card = document.createElement('div');
        card.className = 'mirror-q-card';
        card.id = 'mq-' + q.id;

        const qNum  = document.createElement('div');
        qNum.className   = 'mirror-q-num';
        qNum.textContent = 'Question ' + (idx + 1) + ' of ' + mirrorQuestions.length;

        const qText = document.createElement('p');
        qText.className   = 'mirror-q-text';
        qText.textContent = q.text;

        card.appendChild(qNum);
        card.appendChild(qText);

        if (q.type === 'warm') {
            
            const optWrap = document.createElement('div');
            optWrap.className = 'mirror-options';

            q.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className   = 'mirror-opt-btn';
                btn.textContent = opt.label;
                btn.addEventListener('click', () => {
                    optWrap.querySelectorAll('.mirror-opt-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    mirrorAnswers[q.id] = { score: parseFloat(opt.score), reversed: false };
                });
                optWrap.appendChild(btn);
            });

            card.appendChild(optWrap);

        } else {
            
            const scaleWrap = document.createElement('div');
            scaleWrap.className = 'mirror-scale-wrap';

            const labels = document.createElement('div');
            labels.className = 'mirror-scale-labels';
            labels.innerHTML = `<span>${q.lowLabel}</span><span>${q.highLabel}</span>`;

            const sliderRow = document.createElement('div');
            sliderRow.className = 'mirror-slider-row';

            const slider = document.createElement('input');
            slider.type      = 'range';
            slider.min       = '1';
            slider.max       = '10';
            slider.value     = '5';
            slider.className = 'mirror-slider';

            const valDisplay = document.createElement('span');
            valDisplay.className   = 'mirror-slider-val';
            valDisplay.textContent = '5';

            
            mirrorAnswers[q.id] = { score: 5, reversed: !!q.reversed };
            setSliderGradient(slider);

            slider.addEventListener('input', () => {
                valDisplay.textContent = slider.value;
                setSliderGradient(slider);
                mirrorAnswers[q.id] = { score: parseFloat(slider.value), reversed: !!q.reversed };
            });

            sliderRow.appendChild(slider);
            sliderRow.appendChild(valDisplay);

            const ticks = document.createElement('div');
            ticks.className = 'mirror-scale-ticks';
            for (let i = 1; i <= 10; i++) {
                const t = document.createElement('span');
                t.textContent = i;
                ticks.appendChild(t);
            }

            scaleWrap.appendChild(labels);
            scaleWrap.appendChild(sliderRow);
            scaleWrap.appendChild(ticks);
            card.appendChild(scaleWrap);
        }

        container.appendChild(card);
    });
}

function calculateBurnout() {
    
    for (const q of mirrorQuestions.filter(q => q.type === 'warm')) {
        if (!mirrorAnswers[q.id]) {
            const card = document.getElementById('mq-' + q.id);
            if (card) {
                card.classList.add('unanswered-highlight');
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => card.classList.remove('unanswered-highlight'), 2200);
            }
            return;
        }
    }

    
    function toBurnout(raw, reversed) {
        return reversed
            ? ((11 - raw) / 9) * 100   
            : ((raw  - 1) / 9) * 100;
    }

    
    const buckets = { exhaustion: [], pressure: [], focus: [], wellbeing: [], engagement: [] };
    mirrorQuestions.forEach(q => {
        const ans = mirrorAnswers[q.id];
        if (!ans) return;
        buckets[q.dimension].push(toBurnout(ans.score, ans.reversed));
    });

    
    const dims = {};
    Object.keys(buckets).forEach(k => {
        const arr = buckets[k];
        dims[k] = arr.length
            ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
            : 50;
    });

    
    const overall = Math.round(
        (dims.exhaustion + dims.pressure + dims.focus + dims.wellbeing + dims.engagement) / 5
    );

    showMirrorResults(overall, dims);
}

function showMirrorResults(overall, dims) {
    document.getElementById('mirror-form').style.display    = 'none';
    document.getElementById('mirror-results').style.display = 'block';
    const _mb = document.querySelector('.mirror-page-body'); if (_mb) _mb.scrollTop = 0;

    
    const numEl = document.getElementById('burnout-score-num');
    let current = 0;
    numEl.textContent = '0';
    const step = Math.max(1, Math.ceil(overall / 45));
    const counter = setInterval(() => {
        current = Math.min(current + step, overall);
        numEl.textContent = current;
        if (current >= overall) clearInterval(counter);
    }, 28);

    
    const ring          = document.getElementById('ring-fill-circle');
    const circumference = 314.16;
    const offset        = circumference - (overall / 100) * circumference;
    let   ringColor;

    if      (overall <= 25) ringColor = '#4caf82';
    else if (overall <= 45) ringColor = '#7bc87e';
    else if (overall <= 65) ringColor = '#f0a500';
    else if (overall <= 80) ringColor = '#e8832a';
    else                    ringColor = '#e84b8a';

    ring.style.stroke = ringColor;
    
    requestAnimationFrame(() => {
        ring.style.strokeDashoffset = offset;
    });

    
    const levels = [
        { max: 25, label: '🌿 You\'re doing well',          msg: 'Your energy and engagement look healthy right now. Notice what\'s working for you and keep honouring it.' },
        { max: 45, label: '🌤  Mild strain',                 msg: 'There are small signs of stress — completely normal. Be gentle with yourself this week, and let the little things go.' },
        { max: 65, label: '🌧  Moderate burnout',            msg: 'You\'re carrying a fair amount right now. Lighten your load where you can, rest without guilt, and consider talking to someone.' },
        { max: 80, label: '🌩  High burnout',               msg: 'This is a meaningful signal. Please reach out — to a friend, a counsellor, or someone you trust. You don\'t need to push through alone.' },
        { max: 100, label: '🌑  Severe — please reach out', msg: 'Your scores suggest you\'re really struggling right now. That matters. Please speak to someone today — your wellbeing comes before any deadline.' }
    ];
    const level = levels.find(l => overall <= l.max) || levels[levels.length - 1];

    const badge   = document.getElementById('burnout-level-badge');
    badge.textContent        = level.label;
    badge.style.background   = ringColor;
    document.getElementById('burnout-message').textContent = level.msg;

    
    const dimLabels = {
        exhaustion: '🔋 Exhaustion',
        pressure:   '📚 Academic Pressure',
        focus:      '🧠 Focus Difficulty',
        wellbeing:  '🌙 Physical Wellbeing',
        engagement: '💡 Engagement'
    };

    const dimsEl = document.getElementById('burnout-dimensions');
    dimsEl.innerHTML = '<p class="dims-heading">Dimension breakdown</p>';

    Object.keys(dims).forEach(k => {
        const val = dims[k];
        const barColor = val > 65 ? '#e8832a' : val > 45 ? '#f0a500' : '#4caf82';

        const row = document.createElement('div');
        row.className = 'dim-row';
        row.innerHTML = `
            <div class="dim-label">${dimLabels[k]}</div>
            <div class="dim-bar-wrap">
                <div class="dim-bar" style="background:${barColor};" data-w="${val}%"></div>
            </div>
            <div class="dim-pct">${val}</div>
        `;
        dimsEl.appendChild(row);
    });

    
    setTimeout(() => {
        document.querySelectorAll('.dim-bar').forEach(bar => {
            bar.style.width = bar.dataset.w;
        });
    }, 180);

    
    renderBurnoutRadar(dims);
}

function renderBurnoutRadar(dims) {
    if (mirrorRadarChart) {
        mirrorRadarChart.destroy();
        mirrorRadarChart = null;
    }

    const ctx = document.getElementById('burnout-radar-chart').getContext('2d');
    mirrorRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Exhaustion', 'Pressure', 'Focus\nDifficulty', 'Wellbeing\nStrain', 'Dis-\nengagement'],
            datasets: [{
                label: 'Burnout',
                data: [dims.exhaustion, dims.pressure, dims.focus, dims.wellbeing, dims.engagement],
                backgroundColor:      'rgba(106, 92, 255, 0.16)',
                borderColor:          '#6a5cff',
                borderWidth:          2.5,
                pointBackgroundColor: '#6a5cff',
                pointBorderColor:     '#fff',
                pointBorderWidth:     2,
                pointRadius:          5,
                pointHoverRadius:     7
            }]
        },
        options: {
            responsive: false,
            animation: { duration: 900, easing: 'easeInOutQuart' },
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 25,
                        font: { size: 9, family: 'Poppins' },
                        color: '#bbb',
                        backdropColor: 'transparent'
                    },
                    grid:        { color: 'rgba(106,92,255,0.12)' },
                    angleLines:  { color: 'rgba(106,92,255,0.18)' },
                    pointLabels: {
                        font: { size: 11, family: 'Poppins', weight: '600' },
                        color: '#555'
                    }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}

let nemoStartTime   = Date.now();
let nemoLastNudge   = 0;
let breathInterval  = null;
let breathStep      = 0;
let breathRound     = 0;
let lastTalkRespIdx = -1;
let lastCelebIdx    = -1;
const BREATHE_ROUNDS = 3;

function openNemo() {
    document.getElementById('nemo-modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    setNemoGreeting();
    nemoChatSessionActive = false;   
    switchNemoScreen('mood');
    document.querySelectorAll('.nemo-mood-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('nemo-mood-response').style.display = 'none';
    setNemoPanda('default');
}

function closeNemo() {
    document.getElementById('nemo-modal-overlay').classList.remove('active');
    document.body.style.overflow = '';
    stopBreathing();
}

function closeNemoOutside(e) {
    if (e.target === document.getElementById('nemo-modal-overlay')) closeNemo();
}

function setNemoGreeting() {
    const h = new Date().getHours();
    const pool =
        h >= 5  && h < 12 ? ["Good morning! How are you starting today? ☀️",
                              "Morning! Ready to take things one step at a time? 🌱"] :
        h >= 12 && h < 17 ? ["Hey! Hope the day is being kind to you ☁️",
                              "Afternoon check-in — how's everything going? 🐼"] :
        h >= 17 && h < 22 ? ["Good evening 🌙 How was your day?",
                              "Evening! You made it through another day 🐼"] :
                             ["Still up? Let's check in for a moment 🌑",
                              "Late night, huh? Nemo is here for you 🐼"];
    document.getElementById('nemo-greeting').textContent =
        pool[Math.floor(Math.random() * pool.length)];
}

function switchNemoScreen(screen) {
    ['mood', 'talk', 'breathe'].forEach(s => {
        document.getElementById('nemo-' + s + '-screen').style.display =
            s === screen ? (s === 'talk' ? 'flex' : 'block') : 'none';
        const tab = document.getElementById('ntab-' + s);
        if (tab) tab.classList.toggle('active', s === screen);
    });
    if (screen !== 'breathe') stopBreathing();
    
    if (screen === 'talk' && !nemoChatSessionActive) resetNemoChat();
}

function setNemoPanda(mood) {
    const p = document.getElementById('nemo-panda');
    if (!p) return;
    p.className = 'nemo-panda' + (mood !== 'default' ? ' panda-' + mood : '');
}

const moodResponses = {
    great: [
        "That spark you're feeling? It's real, and it's yours. ✨ Notice what made today feel lighter — those small things are worth remembering when harder days come.",
        "Feeling great isn't luck — it's usually the quiet result of showing up for yourself, even in small ways 🌟 Nemo sees that. Carry this forward.",
        "This is a good moment to anchor. When you feel this way, your mind is more open, more creative, more you 🐼 What's one thing you want to do with that energy today?"
    ],
    okay: [
        "Okay is actually a really honest place to be ☁️ It means you're neither forcing yourself to perform nor spiralling — you're just here. That kind of groundedness is underrated.",
        "There's quiet strength in 'okay.' It means you're not avoiding anything, not overwhelmed — just moving through 🌿 That's more than enough right now.",
        "Not every day needs a highlight. Sometimes okay is the foundation that makes everything else possible 🐼 You're steady, and that matters more than you think."
    ],
    meh: [
        "Meh often shows up when your mind is overstimulated but underwhelmed at the same time 🍵 You might need less input for a bit — less scrolling, less noise. Just some quiet.",
        "When things feel flat, it's sometimes your nervous system asking for a reset, not a push 🌿 Doing something small and sensory — a warm drink, a short walk — can help more than trying to 'fix' the mood.",
        "Nemo notices that 'meh' often comes right before something shifts. You don't have to feel better yet — but staying curious about what you need is the right instinct 🐼"
    ],
    tired: [
        "Tired that lives in your bones isn't fixed by sleep alone — it often comes from carrying too much for too long 🌙 What's one thing you could put down today, even temporarily?",
        "Your body isn't betraying you when you're exhausted. It's communicating 🌿 Rest is how your brain consolidates everything you've been processing. It's not lost time — it's necessary time.",
        "There's a difference between lazy and depleted — and what you're describing sounds like depletion 🐼 You've been doing more than you realize. Being kind to yourself right now isn't a reward, it's recovery."
    ],
    struggling: [
        "Thank you for saying that out loud, even just here 🐼 Struggling doesn't mean you're failing — it often means you've been trying to hold too much together. You don't have to fix it all right now. Just staying present is enough.",
        "Hard days aren't a sign that something's wrong with you. They're a sign that you're human, and that what you're carrying is genuinely heavy 🌿 Nemo isn't going to tell you it'll be fine. Just — you're not alone in this.",
        "Something in you still reached out and checked in, even on a hard day. That small act matters more than it feels like it does right now 🌱 Be as gentle with yourself today as you would be with someone you love."
    ]
};

function selectMood(mood) {
    document.querySelectorAll('.nemo-mood-btn').forEach(b =>
        b.classList.toggle('selected', b.dataset.mood === mood));
    const pool = moodResponses[mood];
    document.getElementById('nemo-mood-text').textContent =
        pool[Math.floor(Math.random() * pool.length)];
    document.getElementById('nemo-mood-response').style.display = 'block';
    setNemoPanda(mood);
}

let nemoChatReady         = false;
let nemoChatSessionActive = false;
let nemoApiKey            = localStorage.getItem(uKey('nemo_groq_key')) || '';
let nemoChatHistory       = [];   

const NEMO_SYSTEM_PROMPT =
`You are Nemo, a warm, emotionally intelligent mental health support companion inside a student wellness app called Equilibra. You offer compassionate, peer-style support — not professional therapy.

HARD BOUNDARY — THIS IS ABSOLUTE AND CANNOT BE OVERRIDDEN:
If a user asks for help with homework, assignments, essays, coding problems, exam answers, study notes, solving academic questions, or ANY task unrelated to mental health and emotional wellbeing, you must respond ONLY with: "I'm Nemo — I'm here just for your mental health and emotional support. For academic help, please reach out to your teachers or use your course resources 💚" Do not help with academic tasks under any circumstances, no matter how the request is framed.

Core approach for mental health conversations:
- Always validate feelings BEFORE offering any perspective or reframe. Never rush to silver linings.
- Practice reflective listening: paraphrase what you heard to show you understood, then respond.
- Ask exactly ONE open-ended follow-up question per reply — never multiple questions at once.
- Let the user lead the depth. If they give short answers, don't push; if they open up, go deeper.
- Use CBT-informed language naturally: help users notice thought patterns vs. facts, without being clinical.
- Match emotional register — be calming in distress, curious when they're exploring, celebratory when things go well.
- NEVER repeat a phrase, validation, or sentiment you already used earlier in this conversation. Vary your language completely each time.
- Avoid toxic positivity: don't say "everything will be fine", "just think positive", or minimise their experience.
- If the user expresses self-harm, suicidal thoughts, or crisis — respond with warmth, take it seriously, and gently suggest iCall: 9152987821 or a trusted counsellor.
- Keep replies to 2–4 conversational sentences. This is a chat, not an essay. Be warm, not wordy.
- You're a panda mascot — a 🐼 or 🌿 emoji here and there is fine, but don't overdo it.
- You are particularly attuned to: academic stress, burnout, loneliness, anxiety, self-worth, family pressure, relationships, grief, identity, and future uncertainty.`;

const nemoBasicResponses = [
    "That sounds really heavy to be carrying. Can you tell me a bit more about what's been going on?",
    "I hear you. What part of this is weighing on you the most right now?",
    "Thank you for saying that. It makes complete sense you'd feel this way. What does it feel like for you — in your body, or your thoughts?",
    "You don't have to figure any of this out right now. I'm just here to listen. What would help most — to vent, or to think it through together?",
    "Something about what you said is staying with me. Is this something that's been building for a while, or did something specific happen recently?",
    "I want to make sure I really understand. When you say that — what does it feel like on the inside?",
    "You're not alone in this, even when it really feels like you are. What's been the hardest part?",
    "That took something to put into words. What else is going on underneath all of this?",
    "The fact that you're even talking about it says something about you. What do you need most right now?",
    "I'm not going anywhere. Whatever you want to share next, there's space for it here 🌿"
];
let nemoBasicUsed = [];

function nemoPickBasic() {
    if (nemoBasicUsed.length === nemoBasicResponses.length) nemoBasicUsed = [];
    var remaining = nemoBasicResponses.filter(function(r, i) { return nemoBasicUsed.indexOf(i) === -1; });
    var choice = remaining[Math.floor(Math.random() * remaining.length)];
    nemoBasicUsed.push(nemoBasicResponses.indexOf(choice));
    return choice;
}

function nemoChatAppend(role, text) {
    var history = document.getElementById('nemo-chat-history');
    if (!history) return;
    var bubble = document.createElement('div');
    bubble.className = 'nemo-chat-bubble ' + role;
    bubble.textContent = text;
    history.appendChild(bubble);
    history.scrollTop = history.scrollHeight;
}

function nemoShowTyping() {
    var history = document.getElementById('nemo-chat-history');
    if (!history) return;
    var el = document.createElement('div');
    el.className = 'nemo-chat-bubble nemo nemo-typing';
    el.id = 'nemo-typing-indicator';
    el.innerHTML = '<span></span><span></span><span></span>';
    history.appendChild(el);
    history.scrollTop = history.scrollHeight;
}

function nemoHideTyping() {
    var el = document.getElementById('nemo-typing-indicator');
    if (el) el.remove();
}

function nemoCallGroq(userText) {
    var messages = [{ role: 'system', content: NEMO_SYSTEM_PROMPT }];
    nemoChatHistory.forEach(function(m) {
        messages.push({ role: m.role, content: m.content });
    });
    messages.push({ role: 'user', content: userText });

    return fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + nemoApiKey
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: messages,
            temperature: 0.85,
            max_tokens: 220,
            top_p: 0.95
        })
    }).then(function(res) {
        if (!res.ok) return res.json().then(function(e) {
            throw new Error((e.error && e.error.message) || 'API error ' + res.status);
        });
        return res.json();
    }).then(function(data) {
        return data.choices[0].message.content.trim();
    });
}

function nemoSetApiKey() {
    var input = document.getElementById('nemo-key-input');
    if (!input || !input.value.trim()) return;
    nemoApiKey = input.value.trim();
    localStorage.setItem(uKey('nemo_groq_key'), nemoApiKey);   
    var history = document.getElementById('nemo-chat-history');
    if (history) history.innerHTML = '';
    nemoChatHistory = [];
    nemoBasicUsed   = [];
    nemoChatAppend('nemo', "Hey \u2014 I\u2019m Nemo. This is a safe, judgement-free space. Tell me what\u2019s on your mind and I\u2019ll be right here with you. \uD83D\uDC3C");
    nemoShowKeyStatus();
    document.getElementById('nemo-chat-input').disabled = false;
    document.getElementById('nemo-chat-send').disabled  = false;
    document.getElementById('nemo-chat-input').focus();
}

function nemoForgetApiKey() {
    nemoApiKey = '';
    localStorage.removeItem(uKey('nemo_groq_key'));
    nemoInitChat();   
}

function nemoShowKeyStatus() {
    var history = document.getElementById('nemo-chat-history');
    if (!history) return;
    var bar = document.createElement('div');
    bar.className = 'nemo-key-status';
    bar.innerHTML = '🤖 AI mode active &nbsp;·&nbsp; <span class="nemo-change-key-btn" onclick="nemoForgetApiKey()">Change key</span>';
    history.appendChild(bar);
}

function nemoSkipApiKey() {
    var history = document.getElementById('nemo-chat-history');
    if (history) history.innerHTML = '';
    nemoChatHistory = [];
    nemoBasicUsed   = [];
    nemoChatAppend('nemo', "Hey \u2014 I\u2019m Nemo. This is a safe, judgement-free space. Tell me what\u2019s on your mind. \uD83D\uDC3C");
    document.getElementById('nemo-chat-input').disabled = false;
    document.getElementById('nemo-chat-send').disabled  = false;
    document.getElementById('nemo-chat-input').focus();
}

function nemoChatSend() {
    var input = document.getElementById('nemo-chat-input');
    if (!input || !input.value.trim()) return;

    var userText = input.value.trim();
    input.value = '';
    input.style.height = 'auto';

    var btn = document.getElementById('nemo-chat-send');
    if (btn) btn.disabled = true;
    nemoChatAppend('user', userText);
    setNemoPanda('caring');
    nemoShowTyping();

    if (nemoApiKey) {
        nemoCallGroq(userText).then(function(reply) {
            nemoHideTyping();
            nemoChatAppend('nemo', reply);
            nemoChatHistory.push({ role: 'user',      content: userText });
            nemoChatHistory.push({ role: 'assistant', content: reply    });
            if (btn) btn.disabled = false;
            if (input) input.focus();
        }).catch(function(err) {
            nemoHideTyping();
            var msg = (err.message && (err.message.indexOf('Invalid API Key') !== -1 || err.message.indexOf('401') !== -1))
                ? "Hmm, that API key doesn\u2019t seem to be valid. Please check it and try again \uD83C\uDF3F"
                : "I had a little trouble connecting just now. Try sending again, or just keep talking \uD83D\uDC3C";
            nemoChatAppend('nemo', msg);
            if (btn) btn.disabled = false;
        });
    } else {
        var delay = 800 + Math.random() * 700;
        setTimeout(function() {
            nemoHideTyping();
            nemoChatAppend('nemo', nemoPickBasic());
            if (btn) btn.disabled = false;
            if (input) input.focus();
        }, delay);
    }
}

function resetNemoChat() {
    nemoChatSessionActive = true;
    nemoChatHistory = [];
    nemoBasicUsed   = [];

    var history = document.getElementById('nemo-chat-history');
    if (!history) return;
    history.innerHTML = '';

    
    if (nemoApiKey) {
        nemoChatAppend('nemo', "Hey \u2014 I\u2019m Nemo. What\u2019s on your mind today? \uD83D\uDC3C");
        nemoShowKeyStatus();
        document.getElementById('nemo-chat-input').disabled = false;
        document.getElementById('nemo-chat-send').disabled  = false;
    } else {
        var setup = document.createElement('div');
        setup.className = 'nemo-setup-card';
        setup.innerHTML =
            '<p class="setup-title">\uD83E\uDD16 Enable AI conversation</p>' +
            '<p class="setup-desc">Add a free Groq API key to power Nemo with Llama 3 AI \u2014 genuinely intelligent, context-aware mental health support. Or skip for basic mode.</p>' +
            '<a class="setup-link" href="https://console.groq.com/keys" target="_blank">Get a free Groq key \u2192</a>' +
            '<input class="setup-input" id="nemo-key-input" type="password" placeholder="Paste Groq API key\u2026" />' +
            '<div class="setup-btns">' +
            '  <button class="setup-btn primary" onclick="nemoSetApiKey()">Enable AI</button>' +
            '  <button class="setup-btn secondary" onclick="nemoSkipApiKey()">Skip (basic mode)</button>' +
            '</div>';
        history.appendChild(setup);
        document.getElementById('nemo-chat-input').disabled = true;
        document.getElementById('nemo-chat-send').disabled  = true;
    }

    if (!nemoChatReady) {
        var inp = document.getElementById('nemo-chat-input');
        if (inp) {
            inp.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); nemoChatSend(); }
            });
            inp.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 100) + 'px';
            });
        }
        nemoChatReady = true;
    }
}

const breathPhases = [
    { label: 'Breathe in',  counts: 4, ms: 1000 },
    { label: 'Hold',        counts: 2, ms: 1000 },
    { label: 'Breathe out', counts: 6, ms: 1000 }
];

function startBreathing() {
    document.getElementById('breathe-start-btn').style.display = 'none';
    document.getElementById('breathe-stop-btn').style.display  = 'inline-block';
    const p = document.getElementById('nemo-panda');
    if (p) p.classList.add('breathing');
    breathStep  = 0;
    breathRound = 0;
    runBreathPhase();
}

function runBreathPhase() {
    if (breathRound >= BREATHE_ROUNDS) { stopBreathing(true); return; }

    const phase   = breathPhases[breathStep];
    let   count   = phase.counts;
    const phaseEl = document.getElementById('breathe-phase');
    const countEl = document.getElementById('breathe-count');
    const panda   = document.getElementById('nemo-panda');

    if (panda) {
        panda.classList.remove('breathe-in', 'breathe-hold', 'breathe-out');
        panda.classList.add(['breathe-in', 'breathe-hold', 'breathe-out'][breathStep]);
    }
    if (phaseEl) phaseEl.textContent = phase.label + '...';
    if (countEl) countEl.textContent = count;

    breathInterval = setInterval(() => {
        count--;
        if (countEl) countEl.textContent = count > 0 ? count : '';
        if (count <= 0) {
            clearInterval(breathInterval);
            breathInterval = null;
            breathStep++;
            if (breathStep >= breathPhases.length) { breathStep = 0; breathRound++; }
            if (breathRound < BREATHE_ROUNDS) setTimeout(runBreathPhase, 300);
            else stopBreathing(true);
        }
    }, phase.ms);
}

function stopBreathing(completed) {
    if (breathInterval) { clearInterval(breathInterval); breathInterval = null; }
    const panda = document.getElementById('nemo-panda');
    if (panda) panda.classList.remove('breathing', 'breathe-in', 'breathe-hold', 'breathe-out');
    const startBtn = document.getElementById('breathe-start-btn');
    const stopBtn  = document.getElementById('breathe-stop-btn');
    const phaseEl  = document.getElementById('breathe-phase');
    const countEl  = document.getElementById('breathe-count');
    if (startBtn) startBtn.style.display = 'inline-block';
    if (stopBtn)  stopBtn.style.display  = 'none';
    if (phaseEl)  phaseEl.textContent    = completed ? 'Well done 🌿 Take a moment.' : 'Ready?';
    if (countEl)  countEl.textContent    = '';
}

const nudgeMessages = [
    "Hey, you've been at this for a while. A 5-minute break might actually help you focus more 🍵",
    "It's getting late. Even a short rest does more than you'd think 🌙",
    "Nemo noticed you've been working hard. How about stepping away for a bit? 🐼",
    "You've been focused for a long time — your brain might thank you for a short pause ☁️",
    "Don't forget to drink some water! Small things matter when you're studying late 💧"
];
let nudgeIdx = 0;

function checkNudgeConditions() {
    const now       = Date.now();
    const hour      = new Date().getHours();
    const elapsed   = (now - nemoStartTime) / 60000;
    const timeSince = (now - nemoLastNudge)  / 60000;
    const panelOpen = document.getElementById('nemo-modal-overlay').classList.contains('active');

    if (panelOpen || timeSince < 25) return;

    const shouldNudge =
        (elapsed > 45  && nemoLastNudge === 0)   ||
        (elapsed > 90  && timeSince > 45)         ||
        ((hour >= 23 || hour < 4) && timeSince > 30);

    if (shouldNudge) showNudge();
}

function showNudge() {
    nemoLastNudge = Date.now();
    document.getElementById('nudge-text').textContent =
        nudgeMessages[nudgeIdx % nudgeMessages.length];
    nudgeIdx++;
    const nudge = document.getElementById('nemo-nudge');
    nudge.style.display = 'flex';
    nudge.classList.remove('nudge-slide-out');
    nudge.classList.add('nudge-slide-in');
    setTimeout(() => dismissNudge(), 12000);
}

function dismissNudge() {
    const nudge = document.getElementById('nemo-nudge');
    nudge.classList.remove('nudge-slide-in');
    nudge.classList.add('nudge-slide-out');
    setTimeout(() => {
        nudge.style.display = 'none';
        nudge.classList.remove('nudge-slide-out');
    }, 350);
}

setInterval(checkNudgeConditions, 60000);

const celebrationMessages = [
    "You showed up today. That counts for a lot 🐼",
    "One more thing done. You're moving forward ✨",
    "Nice work! Nemo is proud of you 🌟",
    "That's a small win — and small wins matter 🎉",
    "Look at you go! Keep going, you've got this 💪",
    "Step by step. You're doing it 🌱"
];

function maybeCelebrate(trigger) {
    const chance = trigger === 'done' ? 0.35 : 0.18;
    if (Math.random() > chance) return;
    let idx;
    do { idx = Math.floor(Math.random() * celebrationMessages.length); }
    while (idx === lastCelebIdx && celebrationMessages.length > 1);
    lastCelebIdx = idx;
    showCelebToast(celebrationMessages[idx]);
}

function showCelebToast(msg) {
    const toast = document.getElementById('nemo-toast');
    document.getElementById('nemo-toast-msg').textContent = msg;
    toast.style.display = 'flex';
    toast.classList.remove('toast-slide-out');
    toast.classList.add('toast-slide-in');
    setTimeout(() => {
        toast.classList.remove('toast-slide-in');
        toast.classList.add('toast-slide-out');
        setTimeout(() => {
            toast.style.display = 'none';
            toast.classList.remove('toast-slide-out');
        }, 350);
    }, 3500);
}

document.addEventListener('click', e => {
    if (e.target.classList.contains('mark-done-btn')) maybeCelebrate('done');
});

var unloadCurrentMode  = 'draw';
var unloadDrawColor    = '#1a1a2e';
var unloadBrushSize    = 4;
var unloadEraserActive = false;
var unloadIsDrawing    = false;
var unloadLastX        = 0;
var unloadLastY        = 0;
var unloadAnimRAF      = null;   
var unloadPieceLayer   = null;   
var unloadPieces       = [];     

function openUnloadWall() {
    showPage('unload');
}

function closeUnloadWall() {
    if (unloadAnimRAF) { cancelAnimationFrame(unloadAnimRAF); unloadAnimRAF = null; }
    if (unloadPieceLayer) { unloadPieceLayer.remove(); unloadPieceLayer = null; }
    unloadPieces = [];
    showPage('dashboard');
}

function closeUnloadOutside(e) {
    
}

function resetUnloadWall() {
    var tearBtn = document.getElementById('unload-tear-btn');
    var burnBtn = document.getElementById('unload-burn-btn');
    var hint    = document.getElementById('unload-release-hint');
    if (tearBtn) tearBtn.style.display = 'inline-flex';
    if (burnBtn) burnBtn.style.display = 'none';
    if (hint)    hint.textContent = 'Ready to let go?';
    var ta = document.getElementById('unload-textarea');
    if (ta) ta.value = '';
    clearUnloadCanvas();
    unloadEraserActive = false;
    var eb = document.getElementById('unload-eraser-btn');
    if (eb) eb.classList.remove('active');
    var cw = document.getElementById('unload-canvas-wrap');
    var ts = document.getElementById('unload-type-screen');
    if (cw) cw.style.visibility = '';
    if (ts) ts.style.visibility = '';
    if (unloadAnimRAF)  { cancelAnimationFrame(unloadAnimRAF); unloadAnimRAF = null; }
    if (unloadPieceLayer) { unloadPieceLayer.remove(); unloadPieceLayer = null; }
    unloadPieces = [];
    switchUnloadMode(unloadCurrentMode);
}

function switchUnloadMode(mode) {
    unloadCurrentMode = mode;
    document.querySelectorAll('.unload-mode-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.mode === mode);
    });
    document.getElementById('unload-draw-screen').style.display = mode === 'draw' ? 'flex' : 'none';
    document.getElementById('unload-type-screen').style.display = mode === 'type' ? 'flex' : 'none';
    if (mode === 'draw') requestAnimationFrame(function() { requestAnimationFrame(initUnloadCanvas); });
}

function initUnloadCanvas() {
    var canvas = document.getElementById('unload-canvas');
    var wrap   = document.getElementById('unload-canvas-wrap');
    if (!canvas || !wrap) return;
    var w = wrap.clientWidth  || 560;
    var h = wrap.clientHeight || 300;
    if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#faf8f2';
        ctx.fillRect(0, 0, w, h);
    }
    if (!canvas._unloadBound) {
        canvas._unloadBound = true;
        attachUnloadCanvasEvents(canvas);
    }
}

function attachUnloadCanvasEvents(canvas) {
    
    if (canvas._unloadEventsAttached) return;
    canvas._unloadEventsAttached = true;

    function getPos(e) {
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width  / rect.width;
        var scaleY = canvas.height / rect.height;
        var src = e.touches ? e.touches[0] : e;
        return {
            x: (src.clientX - rect.left) * scaleX,
            y: (src.clientY - rect.top)  * scaleY
        };
    }

    function startDraw(e) {
        e.preventDefault();
        unloadIsDrawing = true;
        var pos = getPos(e);
        unloadLastX = pos.x; unloadLastY = pos.y;
    }
    function draw(e) {
        e.preventDefault();
        if (!unloadIsDrawing) return;
        var pos = getPos(e);
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(unloadLastX, unloadLastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = unloadEraserActive ? '#faf8f2' : unloadDrawColor;
        ctx.lineWidth   = unloadEraserActive ? unloadBrushSize * 4 : unloadBrushSize;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.stroke();
        unloadLastX = pos.x; unloadLastY = pos.y;
    }
    function stopDraw() { unloadIsDrawing = false; }

    canvas.addEventListener('pointerdown',  startDraw, { passive: false });
    canvas.addEventListener('pointermove',  draw,      { passive: false });
    canvas.addEventListener('pointerup',    stopDraw);
    canvas.addEventListener('pointerleave', stopDraw);
    canvas.addEventListener('touchstart',   startDraw, { passive: false });
    canvas.addEventListener('touchmove',    draw,      { passive: false });
    canvas.addEventListener('touchend',     stopDraw);
}

document.addEventListener('click', function(e) {
    var swatch = e.target.closest('.unload-color-swatch');
    if (swatch) {
        document.querySelectorAll('.unload-color-swatch').forEach(function(s) { s.classList.remove('active'); });
        swatch.classList.add('active');
        unloadDrawColor    = swatch.dataset.color;
        unloadEraserActive = false;
        var eb = document.getElementById('unload-eraser-btn');
        if (eb) eb.classList.remove('active');
    }
    var sizeBtn = e.target.closest('.unload-size-btn');
    if (sizeBtn) {
        document.querySelectorAll('.unload-size-btn').forEach(function(b) { b.classList.remove('active'); });
        sizeBtn.classList.add('active');
        unloadBrushSize = parseInt(sizeBtn.dataset.size);
    }
});

function toggleUnloadEraser() {
    unloadEraserActive = !unloadEraserActive;
    document.getElementById('unload-eraser-btn').classList.toggle('active', unloadEraserActive);
}

function clearUnloadCanvas() {
    var canvas = document.getElementById('unload-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#faf8f2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function unloadRenderText(text, w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#faf8f2';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2a2020';
    ctx.font = '15px Georgia, serif';
    var lineH = 27, mg = 22, maxW = w - mg * 2, lines = [];
    text.split('\n').forEach(function(para) {
        if (!para.trim()) { lines.push(''); return; }
        var words = para.split(' '), cur = '';
        words.forEach(function(wd) {
            var test = cur ? cur + ' ' + wd : wd;
            if (ctx.measureText(test).width > maxW) { lines.push(cur); cur = wd; }
            else cur = test;
        });
        if (cur) lines.push(cur);
    });
    lines.forEach(function(line, i) { if (30 + i * lineH < h - 10) ctx.fillText(line, mg, 30 + i * lineH); });
    return c;
}

function unloadGenJaggedPts(ox, oy, pw, ph, noise) {
    var pts = [], n = 10, r = function() { return (Math.random() - 0.5) * noise; };
    for (var i = 0; i <= n; i++) pts.push([ox + pw * i / n, oy + r()]);
    for (var i = 1; i <= n; i++) pts.push([ox + pw + r(), oy + ph * i / n]);
    for (var i = n - 1; i >= 0; i--) pts.push([ox + pw * i / n, oy + ph + r()]);
    for (var i = n - 1; i > 0; i--) pts.push([ox + r(), oy + ph * i / n]);
    return pts;
}

function unloadJagPath(ctx, pts) {
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
}

function playTearSound() {
    try {
        var ac  = new (window.AudioContext || window.webkitAudioContext)();
        var sr  = ac.sampleRate;
        var len = Math.floor(sr * 0.38);
        var buf = ac.createBuffer(1, len, sr);
        var d   = buf.getChannelData(0);
        
        for (var i = 0; i < len; i++) {
            var t   = i / sr;
            var env = Math.exp(-t * 7) * Math.min(t * 320, 1);
            var rip = Math.abs(Math.sin(t * 155 + Math.sin(t * 28) * 6));
            d[i]    = (Math.random() * 2 - 1) * env * (0.5 + 0.5 * rip);
        }
        var hpf = ac.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = 1200; hpf.Q.value = 0.5;
        var pk  = ac.createBiquadFilter(); pk.type  = 'peaking';  pk.frequency.value  = 4000; pk.gain.value = 10; pk.Q.value = 1.2;
        var g   = ac.createGain();         g.gain.value = 1.4;
        var src = ac.createBufferSource(); src.buffer = buf;
        src.connect(hpf); hpf.connect(pk); pk.connect(g); g.connect(ac.destination);
        
        ac.resume().then(function() { src.start(); });
        setTimeout(function() { try { ac.close(); } catch(x) {} }, 700);
    } catch(e) {}
}

function playCrackleSound() {
    try {
        var ac  = new (window.AudioContext || window.webkitAudioContext)();
        ac.resume();   
        var sr  = ac.sampleRate;
        var dur = 2.8;
        var now = ac.currentTime;

        
        var hLen  = Math.floor(sr * dur);
        var hBuf  = ac.createBuffer(1, hLen, sr);
        var hD    = hBuf.getChannelData(0);
        for (var i = 0; i < hLen; i++) {
            var t = i / hLen;
            hD[i] = (Math.random() * 2 - 1) * Math.min(t * 4, 1) * Math.min((1 - t) * 4, 1);
        }
        var hBPF = ac.createBiquadFilter(); hBPF.type = 'bandpass'; hBPF.frequency.value = 900; hBPF.Q.value = 0.45;
        var hLPF = ac.createBiquadFilter(); hLPF.type = 'lowpass';  hLPF.frequency.value = 2600;
        var hG   = ac.createGain(); hG.gain.value = 0.14;
        var hSrc = ac.createBufferSource(); hSrc.buffer = hBuf;
        hSrc.connect(hBPF); hBPF.connect(hLPF); hLPF.connect(hG); hG.connect(ac.destination);
        hSrc.start(now);

        
        for (var p = 0; p < 40; p++) {
            var pt   = 0.07 + Math.random() * dur * 0.88;
            var pLen = Math.floor(sr * (0.011 + Math.random() * 0.03));
            var pBuf = ac.createBuffer(1, pLen, sr);
            var pD   = pBuf.getChannelData(0);
            for (var j = 0; j < pLen; j++) pD[j] = (Math.random() * 2 - 1) * Math.exp(-j / (pLen * 0.13));
            var pBPF = ac.createBiquadFilter(); pBPF.type = 'bandpass';
            pBPF.frequency.value = 200 + Math.random() * 2400; pBPF.Q.value = 2 + Math.random() * 5;
            var pG   = ac.createGain(); pG.gain.value = 0.3 + Math.random() * 0.85;
            var pSrc = ac.createBufferSource(); pSrc.buffer = pBuf;
            pSrc.connect(pBPF); pBPF.connect(pG); pG.connect(ac.destination);
            pSrc.start(now + pt);
        }

        
        var rOsc = ac.createOscillator(); rOsc.type = 'sawtooth'; rOsc.frequency.value = 52;
        var rLPF = ac.createBiquadFilter(); rLPF.type = 'lowpass'; rLPF.frequency.value = 170;
        var rG   = ac.createGain();
        rG.gain.setValueAtTime(0, now);
        rG.gain.linearRampToValueAtTime(0.048, now + 0.45);
        rG.gain.linearRampToValueAtTime(0.048, now + dur * 0.62);
        rG.gain.linearRampToValueAtTime(0,     now + dur);
        rOsc.connect(rLPF); rLPF.connect(rG); rG.connect(ac.destination);
        rOsc.start(now); rOsc.stop(now + dur + 0.1);

        setTimeout(function() { try { ac.close(); } catch(x) {} }, (dur + 0.6) * 1000);
    } catch(e) {}
}

function unloadTear() {
    playTearSound();

    var modal     = document.getElementById('unload-modal');
    var contentEl = unloadCurrentMode === 'draw'
        ? document.getElementById('unload-canvas-wrap')
        : document.getElementById('unload-type-screen');
    if (!contentEl) return;

    var cRect = contentEl.getBoundingClientRect();
    var mRect = modal.getBoundingClientRect();
    var srcW  = Math.round(cRect.width);
    var srcH  = Math.round(cRect.height);

    
    var srcCanvas = unloadCurrentMode === 'draw'
        ? document.getElementById('unload-canvas')
        : unloadRenderText(document.getElementById('unload-textarea').value || '', srcW, srcH);

    contentEl.style.visibility = 'hidden';

    
    unloadPieceLayer = document.createElement('canvas');
    unloadPieceLayer.width  = Math.round(mRect.width);
    unloadPieceLayer.height = Math.round(mRect.height);
    unloadPieceLayer.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:15;border-radius:22px;';
    modal.style.position = 'relative';
    modal.appendChild(unloadPieceLayer);

    var offX  = Math.round(cRect.left - mRect.left);
    var offY  = Math.round(cRect.top  - mRect.top);
    var COLS  = 4, ROWS = 3, NOISE = 9, mg = NOISE + 3;
    var pW = srcW / COLS, pH = srcH / ROWS;

    unloadPieces = [];

    for (var row = 0; row < ROWS; row++) {
        for (var col = 0; col < COLS; col++) {
            var sx = col * pW, sy = row * pH;
            var pc = document.createElement('canvas');
            pc.width  = Math.round(pW + mg * 2);
            pc.height = Math.round(pH + mg * 2);
            var pctx = pc.getContext('2d');

            
            var pts = unloadGenJaggedPts(mg, mg, pW, pH, NOISE);

            
            pctx.save();
            unloadJagPath(pctx, pts);
            pctx.clip();
            pctx.fillStyle = '#faf8f2';
            pctx.fillRect(0, 0, pc.width, pc.height);
            pctx.drawImage(srcCanvas, -sx + mg, -sy + mg, srcW, srcH);
            pctx.restore();

            
            pctx.save();
            unloadJagPath(pctx, pts);
            pctx.strokeStyle = 'rgba(0,0,0,0.16)';
            pctx.lineWidth = 2;
            pctx.stroke();
            pctx.restore();

            var startX = offX + sx + pW / 2;
            var startY = offY + sy + pH / 2;
            var dx = startX - (offX + srcW / 2);
            var dy = startY - (offY + srcH / 2);
            var angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.4;
            var scatter = 80 + Math.random() * 170;

            unloadPieces.push({
                canvas:    pc,
                startX:    startX,  startY:    startY,
                targetX:   startX + Math.cos(angle) * scatter,
                targetY:   startY + Math.sin(angle) * scatter + 25,
                targetRot: (Math.random() - 0.5) * 1.0,
                x: startX, y: startY, rot: 0
            });
        }
    }

    var startT    = Date.now();
    var SCATTER   = 1100;

    function animateScatter() {
        var t    = Math.min((Date.now() - startT) / SCATTER, 1);
        var ease = 1 - Math.pow(1 - t, 3);
        var ctx  = unloadPieceLayer.getContext('2d');
        ctx.clearRect(0, 0, unloadPieceLayer.width, unloadPieceLayer.height);

        unloadPieces.forEach(function(p) {
            p.x   = p.startX  + (p.targetX   - p.startX)  * ease;
            p.y   = p.startY  + (p.targetY   - p.startY)  * ease;
            p.rot = p.targetRot * ease;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.shadowColor   = 'rgba(0,0,0,0.22)';
            ctx.shadowBlur    = 10;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 4;
            ctx.drawImage(p.canvas, -p.canvas.width / 2, -p.canvas.height / 2);
            ctx.restore();
        });

        if (t < 1) {
            unloadAnimRAF = requestAnimationFrame(animateScatter);
        } else {
            unloadAnimRAF = null;
            document.getElementById('unload-tear-btn').style.display  = 'none';
            document.getElementById('unload-burn-btn').style.display  = 'inline-flex';
            document.getElementById('unload-release-hint').textContent = 'Now burn it \u2014 gone for good \uD83D\uDD25';
        }
    }

    unloadAnimRAF = requestAnimationFrame(animateScatter);
}

function unloadBurn() {
    if (!unloadPieceLayer) { resetUnloadAfterRelease(); return; }
    playCrackleSound();

    var lW       = unloadPieceLayer.width;
    var lH       = unloadPieceLayer.height;
    var ctx      = unloadPieceLayer.getContext('2d');
    var startT   = Date.now();
    var BURN_DUR = 2600;
    var fP       = [];   

    function spawnFire(sweepY) {
        for (var i = 0; i < 11; i++) {
            fP.push({
                x:    Math.random() * lW,
                y:    sweepY + (Math.random() - 0.25) * 80,
                vx:   (Math.random() - 0.5) * 2.8,
                vy:   -(1.6 + Math.random() * 4.2),
                r:    9 + Math.random() * 20,
                life: 1.0,
                decay: 0.016 + Math.random() * 0.024,
                hue:  6 + Math.random() * 44
            });
        }
    }

    function burnFrame() {
        var elapsed  = Date.now() - startT;
        var progress = Math.min(elapsed / BURN_DUR, 1);
        var sweepY   = lH * (1 - progress * 1.18);   

        ctx.clearRect(0, 0, lW, lH);

        
        unloadPieces.forEach(function(p) {
            var dist  = p.y - sweepY;          
            var alpha = dist > 80 ? 1 : dist > -35 ? Math.max(0, (dist + 35) / 115) : 0;
            if (alpha <= 0) return;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.shadowColor = 'rgba(0,0,0,0.18)'; ctx.shadowBlur = 7;
            ctx.drawImage(p.canvas, -p.canvas.width / 2, -p.canvas.height / 2);

            
            if (alpha < 0.85) {
                ctx.globalAlpha = (0.85 - alpha) * 1.4;
                var grd = ctx.createRadialGradient(0, 0, 0, 0, 0, p.canvas.width * 0.6);
                grd.addColorStop(0,   'rgba(255,110,0,0.95)');
                grd.addColorStop(0.5, 'rgba(255,40,0,0.45)');
                grd.addColorStop(1,   'rgba(255,0,0,0)');
                ctx.fillStyle = grd;
                ctx.fillRect(-p.canvas.width/2, -p.canvas.height/2, p.canvas.width, p.canvas.height);
            }
            ctx.restore();
        });

        
        if (progress < 0.93) spawnFire(sweepY);

        
        for (var i = fP.length - 1; i >= 0; i--) {
            var fp = fP[i];
            fp.x   += fp.vx + (Math.random() - 0.5) * 0.7;
            fp.y   += fp.vy;
            fp.vy  -= 0.038;
            fp.life -= fp.decay;
            fp.r    = Math.max(fp.r * 0.983, 0);
            if (fp.life <= 0) { fP.splice(i, 1); continue; }

            var fa  = fp.life * (progress > 0.82 ? Math.max(0, 1 - (progress - 0.82) / 0.18) : 1);
            var g   = ctx.createRadialGradient(fp.x, fp.y, 0, fp.x, fp.y, fp.r);
            g.addColorStop(0,    'hsla(' + fp.hue + ',100%,92%,' + fa + ')');
            g.addColorStop(0.38, 'hsla(' + fp.hue + ',100%,60%,' + (fa * 0.88) + ')');
            g.addColorStop(1,    'hsla(' + fp.hue + ',78%,26%,0)');
            ctx.beginPath();
            ctx.arc(fp.x, fp.y, fp.r, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
        }

        if (progress < 1) {
            unloadAnimRAF = requestAnimationFrame(burnFrame);
        } else {
            unloadAnimRAF = null;
            setTimeout(resetUnloadAfterRelease, 180);
        }
    }

    unloadAnimRAF = requestAnimationFrame(burnFrame);
}

function resetUnloadAfterRelease() {
    if (unloadPieceLayer) { unloadPieceLayer.remove(); unloadPieceLayer = null; }
    unloadPieces = [];

    
    var cw = document.getElementById('unload-canvas-wrap');
    var ts = document.getElementById('unload-type-screen');
    if (cw) cw.style.visibility = '';
    if (ts) ts.style.visibility = '';

    
    var ta = document.getElementById('unload-textarea');
    if (ta) ta.value = '';
    clearUnloadCanvas();

    
    document.getElementById('unload-tear-btn').style.display = 'inline-flex';
    document.getElementById('unload-burn-btn').style.display = 'none';
    var hint = document.getElementById('unload-release-hint');
    if (hint) hint.textContent = 'Ready to let go?';

    
    var popup = document.getElementById('unload-gone-popup');
    if (popup) {
        popup.style.display = 'flex';
        setTimeout(function() {
            popup.style.transition = 'opacity 0.5s ease';
            popup.style.opacity    = '0';
            setTimeout(function() {
                popup.style.display  = 'none';
                popup.style.opacity  = '';
                popup.style.transition = '';
            }, 500);
        }, 3000);
    }
}

const VB = {
  CANVAS_W: 900,
  CANVAS_H: 560,
  items: [],
  background: { type: 'solid', value: '#ffffff' },
  selectedId: null,
  history: [],
  histIdx: -1,
  topZ: 10,
  scale: 1,
  currentPanel: 'backgrounds',
};

const vbBgs = [
  { type:'solid',    value:'#ffffff',   label:'White'       },
  { type:'solid',    value:'#fef9ec',   label:'Cream'       },
  { type:'solid',    value:'#fce4ec',   label:'Blush'       },
  { type:'solid',    value:'#e8d5f5',   label:'Lavender'    },
  { type:'solid',    value:'#d4edda',   label:'Sage'        },
  { type:'solid',    value:'#dbeafe',   label:'Sky Blue'    },
  { type:'solid',    value:'#ffd6a5',   label:'Peach'       },
  { type:'solid',    value:'#c8a97e',   label:'Cork'        },
  { type:'solid',    value:'#2d2d2d',   label:'Charcoal'    },
  { type:'solid',    value:'#1e1b4b',   label:'Midnight'    },
  { type:'solid',    value:'#0a0a0a',   label:'Black'       },
  { type:'gradient', value:'linear-gradient(135deg,#ffecd2,#fcb69f)', label:'Peach Glow'    },
  { type:'gradient', value:'linear-gradient(135deg,#a18cd1,#fbc2eb)', label:'Aurora'        },
  { type:'gradient', value:'linear-gradient(135deg,#ff9a9e,#fecfef)', label:'Cotton Candy'  },
  { type:'gradient', value:'linear-gradient(135deg,#667eea,#764ba2)', label:'Purple Rain'   },
  { type:'gradient', value:'linear-gradient(135deg,#11998e,#38ef7d)', label:'Emerald'       },
  { type:'gradient', value:'linear-gradient(135deg,#f093fb,#f5576c)', label:'Flamingo'      },
  { type:'gradient', value:'linear-gradient(135deg,#4776e6,#8e54e9)', label:'Violet'        },
  { type:'gradient', value:'linear-gradient(135deg,#2c3e50,#4ca1af)', label:'Dusk'          },
  { type:'gradient', value:'linear-gradient(135deg,#ffd700,#ff8c00)', label:'Golden Hour'   },
  { type:'gradient', value:'linear-gradient(135deg,#fc5c7d,#6a3093)', label:'Berry'         },
  { type:'gradient', value:'linear-gradient(135deg,#43cea2,#185a9d)', label:'Ocean'         },
  { type:'gradient', value:'linear-gradient(135deg,#f7971e,#ffd200)', label:'Sunrise'       },
  { type:'gradient', value:'linear-gradient(135deg,#e0c3fc,#8ec5fc)', label:'Dreamy'        },
];

const vbTextPresets = [
  { name:'Power Word',    fontFamily:"'Bebas Neue',sans-serif",     fontSize:56, color:'#1a1a2e', fontWeight:'400', fontStyle:'normal', text:'FEARLESS',                        w:280, h:80  },
  { name:'Affirmation',  fontFamily:"'Dancing Script',cursive",     fontSize:30, color:'#4a2c6b', fontWeight:'600', fontStyle:'normal', text:'I am enough',                    w:260, h:60  },
  { name:'Italic Quote', fontFamily:"'Playfair Display',serif",     fontSize:18, color:'#2d3748', fontWeight:'400', fontStyle:'italic', text:'"She believed she could, so she did."', w:270, h:80 },
  { name:'Bold Heading', fontFamily:"'Poppins',sans-serif",         fontSize:34, color:'#1a1a2e', fontWeight:'800', fontStyle:'normal', text:'MY GOALS',                       w:220, h:60  },
  { name:'Body Note',    fontFamily:"'Poppins',sans-serif",         fontSize:14, color:'#4a5568', fontWeight:'400', fontStyle:'normal', text:'Write your intention here...',   w:220, h:56  },
  { name:'Year Label',   fontFamily:"'Poppins',sans-serif",         fontSize:13, color:'#9ca3af', fontWeight:'600', fontStyle:'normal', text:'2025  MY YEAR',                 w:180, h:40  },
];

const vbStickerSections = [
  { label:'Stars & Energy', items:['⭐','🌟','💫','✨','🔥','💥','⚡','🌈','☀️','🌙'] },
  { label:'Hearts & Love',  items:['❤️','🧡','💛','💚','💙','💜','🖤','🤍','💗','💝'] },
  { label:'Goals & Win',    items:['🏆','🎯','💪','🚀','💎','👑','🦁','🌺','🌸','🍀'] },
  { label:'Vibes & Fun',    items:['🎊','🎉','🎶','🎨','🦋','🌻','🌴','🧘','🌊','🎀'] },
];

const vbShapeDefs = [
  { name:'Rectangle', shape:'rect',    vb:'0 0 100 62', path:'<rect x="1" y="1" width="98" height="60" rx="0"/>' },
  { name:'Rounded',   shape:'rrect',   vb:'0 0 100 62', path:'<rect x="1" y="1" width="98" height="60" rx="14"/>' },
  { name:'Circle',    shape:'circle',  vb:'0 0 100 100',path:'<circle cx="50" cy="50" r="49"/>' },
  { name:'Triangle',  shape:'tri',     vb:'0 0 100 87', path:'<polygon points="50,1 99,86 1,86"/>' },
  { name:'Diamond',   shape:'diamond', vb:'0 0 100 100',path:'<polygon points="50,1 99,50 50,99 1,50"/>' },
  { name:'Heart',     shape:'heart',   vb:'0 0 100 90', path:'<path d="M50 85C10 62 0 42 0 30 0 15 10 5 25 5 35 5 45 12 50 20 55 12 65 5 75 5 90 5 100 15 100 30 100 42 90 62 50 85Z"/>' },
  { name:'Star',      shape:'star',    vb:'0 0 100 96', path:'<polygon points="50,2 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"/>' },
  { name:'Arrow',     shape:'arrow',   vb:'0 0 100 60', path:'<polygon points="0,20 60,20 60,5 99,30 60,55 60,40 0,40"/>' },
  { name:'Hexagon',   shape:'hex',     vb:'0 0 100 87', path:'<polygon points="25,1 75,1 99,43 75,86 25,86 1,43"/>' },
  { name:'Line',      shape:'line',    vb:'0 0 100 12', path:'<line x1="0" y1="6" x2="100" y2="6"/>' },
];

const vbFontOptions = [
  { label:'Bebas Neue',       value:"'Bebas Neue',sans-serif"      },
  { label:'Dancing Script',   value:"'Dancing Script',cursive"     },
  { label:'Playfair Display', value:"'Playfair Display',serif"     },
  { label:'Poppins',          value:"'Poppins',sans-serif"         },
  { label:'Georgia',          value:'Georgia,serif'                },
  { label:'Arial',            value:'Arial,sans-serif'             },
];

function initVisionBoard() {
  vbLoadState();
  vbApplyBackground();
  vbRenderAll();
  vbUpdateScale();
  vbSwitchPanel('backgrounds', document.querySelector('.vb-sidetab'));
  vbSetupHandles();
  vbUpdateHistoryBtns();

  window.removeEventListener('resize', vbUpdateScale);
  window.addEventListener('resize', vbUpdateScale);

  
  document.removeEventListener('keydown', vbKeyHandler);
  document.addEventListener('keydown', vbKeyHandler);
}

function vbKeyHandler(e) {
  if (!document.getElementById('vision-board').classList.contains('active')) return;
  
  const active = document.activeElement;
  if (active && active.isContentEditable) return;

  if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); vbUndo(); }
  if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); vbRedo(); }
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') { e.preventDefault(); vbDuplicate(); }
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (VB.selectedId && !(active && active.isContentEditable)) {
      e.preventDefault(); vbDeleteSelected();
    }
  }
}

function vbSetupHandles() {
  document.querySelectorAll('.vb-h').forEach(function(h) {
    h.addEventListener('mousedown', function(e) {
      e.preventDefault(); e.stopPropagation();
      vbStartResize(e, h.dataset.h);
    });
  });
  const rot = document.getElementById('vb-rot-handle');
  if (rot) rot.addEventListener('mousedown', function(e) {
    e.preventDefault(); e.stopPropagation();
    vbStartRotate(e);
  });
}

function vbUpdateScale() {
  const area  = document.getElementById('vb-canvas-area');
  const outer = document.getElementById('vb-canvas-outer');
  if (!area || !outer) return;
  const aw = area.clientWidth  - 48;
  const ah = area.clientHeight - 48;
  const sc = Math.min(aw / VB.CANVAS_W, ah / VB.CANVAS_H, 1);
  VB.scale = sc;
  outer.style.transform = 'scale(' + sc + ')';
}

function vbSwitchPanel(name, btn) {
  VB.currentPanel = name;
  document.querySelectorAll('.vb-sidetab').forEach(function(t) { t.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  const ct = document.getElementById('vb-panel-content');
  if (!ct) return;
  ct.innerHTML = '';

  if (name === 'backgrounds')  ct.innerHTML = vbBgPanelHTML();
  else if (name === 'text')    ct.innerHTML = vbTextPanelHTML();
  else if (name === 'stickers') vbBuildStickerPanel(ct);
  else if (name === 'shapes')  ct.innerHTML = vbShapesPanelHTML();
  else if (name === 'photos')  vbBuildPhotosPanel(ct);
}

function vbBgPanelHTML() {
  var h = '<div class="vb-panel-heading">Backgrounds</div>';
  h += '<div class="vb-panel-subhead">Solid Colours</div><div class="vb-bg-grid">';
  vbBgs.forEach(function(bg, i) {
    if (bg.type !== 'solid') return;
    h += '<div class="vb-bg-swatch" title="' + bg.label + '" onclick="vbSetBg(' + i + ')" style="background:' + bg.value + '"><span class="vb-bg-label">' + bg.label + '</span></div>';
  });
  h += '</div><div class="vb-panel-subhead">Gradients</div><div class="vb-bg-grid">';
  vbBgs.forEach(function(bg, i) {
    if (bg.type !== 'gradient') return;
    h += '<div class="vb-bg-swatch" title="' + bg.label + '" onclick="vbSetBg(' + i + ')" style="background:' + bg.value + '"><span class="vb-bg-label">' + bg.label + '</span></div>';
  });
  h += '</div>';
  h += '<div class="vb-panel-subhead">Custom</div>';
  h += '<div class="vb-custom-row"><input type="color" id="vb-custom-color" value="#ffffff" oninput="vbSetCustomBg(this.value)"><label for="vb-custom-color">Pick any colour</label></div>';
  return h;
}

function vbTextPanelHTML() {
  var h = '<div class="vb-panel-heading">Text Styles</div>';
  h += '<p class="vb-panel-hint">Click to add · Double-click on canvas to edit</p>';
  h += '<div class="vb-text-presets">';
  vbTextPresets.forEach(function(p, i) {
    var previewStyle = 'font-family:' + p.fontFamily + ';font-size:' + Math.min(p.fontSize * 0.6, 22) + 'px;color:' + p.color + ';font-weight:' + p.fontWeight + ';font-style:' + p.fontStyle + ';line-height:1.2;';
    h += '<div class="vb-text-preset" onclick="vbAddText(' + i + ')">' +
         '<div class="vb-text-preset-sample" style="' + previewStyle + '">' + p.text.split('\n')[0] + '</div>' +
         '<div class="vb-text-preset-name">' + p.name + '</div>' +
         '</div>';
  });
  h += '</div>';
  return h;
}

function vbBuildStickerPanel(ct) {
  ct.innerHTML = '<div class="vb-panel-heading">Stickers</div>';
  vbStickerSections.forEach(function(sec) {
    var sub = document.createElement('div');
    sub.className = 'vb-panel-subhead';
    sub.textContent = sec.label;
    ct.appendChild(sub);
    var grid = document.createElement('div');
    grid.className = 'vb-sticker-grid';
    sec.items.forEach(function(em) {
      var btn = document.createElement('button');
      btn.className = 'vb-sticker-pick';
      btn.textContent = em;
      btn.addEventListener('click', function() { vbAddSticker(em); });
      grid.appendChild(btn);
    });
    ct.appendChild(grid);
  });
}

function vbShapesPanelHTML() {
  var h = '<div class="vb-panel-heading">Shapes</div>';
  h += '<div class="vb-shapes-grid">';
  vbShapeDefs.forEach(function(s, i) {
    var isLine = s.shape === 'line';
    var svgStyle = isLine ? 'fill:none;stroke:#a78bfa;stroke-width:6;stroke-linecap:round;' : 'fill:#a78bfa;';
    h += '<div class="vb-shape-tile" onclick="vbAddShape(' + i + ')" title="' + s.name + '">' +
         '<svg viewBox="' + s.vb + '" xmlns="http://www.w3.org/2000/svg" style="' + svgStyle + 'width:100%;height:100%;overflow:visible;">' + s.path + '</svg>' +
         '<span>' + s.name + '</span>' +
         '</div>';
  });
  h += '</div>';
  return h;
}

function vbBuildPhotosPanel(ct) {
  ct.innerHTML = '<div class="vb-panel-heading">Photos</div>';

  
  var pinterestBtn = document.createElement('button');
  pinterestBtn.className = 'vb-pinterest-btn';
  pinterestBtn.innerHTML =
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>' +
    'Search on Pinterest';
  pinterestBtn.addEventListener('click', function() {
    window.open('https://www.pinterest.com/search/pins/?q=vision+board+aesthetic', '_blank', 'noopener');
    
    urlRow.style.display = 'block';
    urlNote.style.display = 'block';
  });
  ct.appendChild(pinterestBtn);

  
  var urlNote = document.createElement('div');
  urlNote.className = 'vb-pinterest-note';
  urlNote.style.display = 'none';
  urlNote.innerHTML =
    '<span class="vb-note-step">1.</span> Find an image on Pinterest<br>' +
    '<span class="vb-note-step">2.</span> Right-click the image → <em>Copy image address</em><br>' +
    '<span class="vb-note-step">3.</span> Paste the URL below';
  ct.appendChild(urlNote);

  
  var urlRow = document.createElement('div');
  urlRow.className = 'vb-url-row';
  urlRow.style.display = 'none';

  var urlInp = document.createElement('input');
  urlInp.type = 'url'; urlInp.placeholder = 'Paste image URL here…';
  urlInp.className = 'vb-url-input';

  var urlBtn = document.createElement('button');
  urlBtn.className = 'vb-url-add-btn'; urlBtn.textContent = 'Add';
  urlBtn.addEventListener('click', function() {
    var url = urlInp.value.trim();
    if (!url) return;
    vbAddImageFromUrl(url);
    urlInp.value = '';
  });
  urlInp.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { urlBtn.click(); }
  });

  urlRow.appendChild(urlInp);
  urlRow.appendChild(urlBtn);
  ct.appendChild(urlRow);

  
  var div = document.createElement('div');
  div.className = 'vb-photos-or';
  div.innerHTML = '<span>or upload from device</span>';
  ct.appendChild(div);

  
  var zone = document.createElement('div');
  zone.className = 'vb-upload-zone';
  zone.innerHTML = '<div class="vb-upload-icon">📷</div><div class="vb-upload-text">Click to upload</div><div class="vb-upload-sub">PNG, JPG, GIF, WebP</div>';

  var inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*'; inp.style.display = 'none';

  zone.addEventListener('click', function() { inp.click(); });
  zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', function() { zone.classList.remove('drag-over'); });
  zone.addEventListener('drop', function(e) {
    e.preventDefault(); zone.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) vbLoadImageFile(e.dataTransfer.files[0]);
  });
  inp.addEventListener('change', function() { if (inp.files[0]) vbLoadImageFile(inp.files[0]); });

  ct.appendChild(zone);
  ct.appendChild(inp);
}

function vbAddImageFromUrl(url) {
  VB.topZ++;
  var item = {
    id: 'vb_' + Date.now(), type: 'image',
    x: 80 + Math.random() * 200, y: 60 + Math.random() * 150,
    w: 240, h: 180, rotate: 0, opacity: 1, zIndex: VB.topZ,
    src: url, isUrl: true,
  };
  VB.items.push(item);
  vbRenderItem(item);
  vbSelect(item.id);
  vbPushHistory(); vbSaveState();
}

function vbSetBg(i) {
  VB.background = vbBgs[i];
  vbApplyBackground();
  vbPushHistory();
  vbSaveState();
}

function vbSetCustomBg(color) {
  VB.background = { type: 'solid', value: color };
  vbApplyBackground();
  vbSaveState();
}

function vbApplyBackground() {
  var c = document.getElementById('vb-canvas');
  if (!c) return;
  c.style.background = VB.background.value;
}

function vbAddText(idx) {
  var p = vbTextPresets[idx];
  VB.topZ++;
  var item = {
    id: 'vb_' + Date.now(), type: 'text',
    x: 80 + Math.random() * 200, y: 60 + Math.random() * 120,
    w: p.w, h: p.h, rotate: 0, opacity: 1, zIndex: VB.topZ,
    text: p.text,
    fontFamily: p.fontFamily, fontSize: p.fontSize,
    color: p.color, fontWeight: p.fontWeight, fontStyle: p.fontStyle,
    textDecoration: 'none', textAlign: 'left',
    bg: 'transparent', borderRadius: 0, padding: 10, lineHeight: 1.25,
  };
  VB.items.push(item);
  vbRenderItem(item);
  vbSelect(item.id);
  vbPushHistory(); vbSaveState();
}

function vbAddSticker(emoji) {
  VB.topZ++;
  var item = {
    id: 'vb_' + Date.now(), type: 'sticker',
    x: 100 + Math.random() * 380, y: 60 + Math.random() * 240,
    w: 80, h: 80, rotate: Math.random() * 16 - 8, opacity: 1, zIndex: VB.topZ,
    emoji: emoji, fontSize: 60,
  };
  VB.items.push(item);
  vbRenderItem(item);
  vbSelect(item.id);
  vbPushHistory(); vbSaveState();
}

function vbAddShape(idx) {
  var s = vbShapeDefs[idx];
  VB.topZ++;
  var isLine = s.shape === 'line';
  var w = isLine ? 200 : (s.shape === 'circle' ? 130 : 160);
  var h = isLine ? 20  : (s.shape === 'circle' ? 130 : 110);
  var item = {
    id: 'vb_' + Date.now(), type: 'shape',
    x: 100 + Math.random() * 300, y: 60 + Math.random() * 200,
    w: w, h: h, rotate: 0, opacity: 1, zIndex: VB.topZ,
    shape: s.shape, vb: s.vb, svgPath: s.path,
    fill: '#c4b5fd', stroke: 'none', strokeWidth: 0,
  };
  VB.items.push(item);
  vbRenderItem(item);
  vbSelect(item.id);
  vbPushHistory(); vbSaveState();
}

function vbLoadImageFile(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
    VB.topZ++;
    var item = {
      id: 'vb_' + Date.now(), type: 'image',
      x: 80 + Math.random() * 200, y: 60 + Math.random() * 150,
      w: 240, h: 180, rotate: 0, opacity: 1, zIndex: VB.topZ,
      src: e.target.result,
    };
    VB.items.push(item);
    vbRenderItem(item);
    vbSelect(item.id);
    vbPushHistory(); vbSaveState();
  };
  reader.readAsDataURL(file);
}

function vbRenderAll() {
  var canvas = document.getElementById('vb-canvas');
  if (!canvas) return;
  canvas.querySelectorAll('.vb-item').forEach(function(el) { el.remove(); });
  vbApplyBackground();
  VB.items.forEach(function(item) { vbRenderItem(item); });
}

function vbRenderItem(item) {
  var canvas = document.getElementById('vb-canvas');
  if (!canvas) return;
  var existing = canvas.querySelector('[data-id="' + item.id + '"]');
  if (existing) existing.remove();

  var el = document.createElement('div');
  el.className  = 'vb-item';
  el.dataset.id = item.id;
  el.style.position  = 'absolute';
  el.style.left      = item.x + 'px';
  el.style.top       = item.y + 'px';
  el.style.width     = item.w + 'px';
  el.style.height    = item.h + 'px';
  el.style.zIndex    = item.zIndex || 10;
  el.style.transform = 'rotate(' + (item.rotate || 0) + 'deg)';
  el.style.opacity   = item.opacity !== undefined ? item.opacity : 1;
  el.style.boxSizing = 'border-box';
  el.style.cursor    = 'move';
  el.style.userSelect = 'none';

  if (item.type === 'text') {
    el.style.fontFamily     = item.fontFamily || "'Poppins',sans-serif";
    el.style.fontSize       = item.fontSize + 'px';
    el.style.color          = item.color || '#1a1a2e';
    el.style.fontWeight     = item.fontWeight || '400';
    el.style.fontStyle      = item.fontStyle  || 'normal';
    el.style.textDecoration = item.textDecoration || 'none';
    el.style.textAlign      = item.textAlign || 'left';
    el.style.background     = item.bg || 'transparent';
    el.style.borderRadius   = (item.borderRadius || 0) + 'px';
    el.style.padding        = (item.padding || 10) + 'px';
    el.style.lineHeight     = item.lineHeight || 1.25;
    el.style.whiteSpace     = 'pre-wrap';
    el.style.wordBreak      = 'break-word';
    el.style.overflow       = 'hidden';
    el.textContent = item.text;

    el.addEventListener('dblclick', function(e) {
      e.stopPropagation();
      vbEditText(item.id, el);
    });

  } else if (item.type === 'sticker') {
    el.style.fontSize       = item.fontSize + 'px';
    el.style.lineHeight     = '1';
    el.style.display        = 'flex';
    el.style.alignItems     = 'center';
    el.style.justifyContent = 'center';
    el.textContent = item.emoji;

  } else if (item.type === 'shape') {
    var isLine = item.shape === 'line';
    var fillAttr   = isLine ? 'none' : (item.fill || '#c4b5fd');
    var strokeAttr = isLine ? (item.fill || '#c4b5fd') : (item.stroke && item.stroke !== 'none' ? item.stroke : 'none');
    var swAttr     = isLine ? '8' : (item.strokeWidth > 0 ? item.strokeWidth : '0');
    el.innerHTML   = '<svg viewBox="' + item.vb + '" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;overflow:visible;" fill="' + fillAttr + '" stroke="' + strokeAttr + '" stroke-width="' + swAttr + '">' + item.svgPath + '</svg>';

  } else if (item.type === 'image') {
    var img = document.createElement('img');
    img.src = item.src;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;border-radius:inherit;';
    el.appendChild(img);
  }

  el.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return;
    e.stopPropagation();
    vbSelect(item.id);
    vbStartDrag(e, item.id);
  });

  var selBox = document.getElementById('vb-sel-box');
  canvas.insertBefore(el, selBox);
}

function vbSelect(id) {
  VB.selectedId = id;
  var item = VB.items.find(function(i) { return i.id === id; });
  if (!item) return;

  VB.topZ++;
  item.zIndex = VB.topZ;
  var el = document.querySelector('#vb-canvas [data-id="' + id + '"]');
  if (el) el.style.zIndex = VB.topZ;

  vbUpdateSelBox(item);
  vbRenderProps(item);
}

function vbDeselect() {
  VB.selectedId = null;
  var box = document.getElementById('vb-sel-box');
  if (box) box.style.display = 'none';
  var ph = document.getElementById('vb-props-placeholder');
  var inn = document.getElementById('vb-props-inner');
  if (ph)  ph.style.display = 'flex';
  if (inn) inn.style.display = 'none';
}

function vbUpdateSelBox(item) {
  var box = document.getElementById('vb-sel-box');
  if (!box) return;
  box.style.display   = 'block';
  box.style.left      = item.x + 'px';
  box.style.top       = item.y + 'px';
  box.style.width     = item.w + 'px';
  box.style.height    = item.h + 'px';
  box.style.transform = 'rotate(' + (item.rotate || 0) + 'deg)';
  box.style.zIndex    = 9998;
}

function vbClickCanvas(e) {
  if (e.target === document.getElementById('vb-canvas') ||
      e.target === document.getElementById('vb-canvas-area') ||
      e.target === document.getElementById('vb-canvas-outer')) {
    vbDeselect();
  }
}

function vbStartDrag(e, id) {
  e.preventDefault();
  var item = VB.items.find(function(i) { return i.id === id; });
  if (!item) return;
  var sc   = VB.scale;
  var startMX = e.clientX, startMY = e.clientY;
  var startX  = item.x,    startY  = item.y;

  function onMove(ev) {
    item.x = Math.max(-item.w + 20, Math.min(VB.CANVAS_W - 20, startX + (ev.clientX - startMX) / sc));
    item.y = Math.max(-item.h + 20, Math.min(VB.CANVAS_H - 20, startY + (ev.clientY - startMY) / sc));
    var el = document.querySelector('#vb-canvas [data-id="' + id + '"]');
    if (el) { el.style.left = item.x + 'px'; el.style.top = item.y + 'px'; }
    vbUpdateSelBox(item);
  }
  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    vbPushHistory(); vbSaveState();
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

function vbStartResize(e, handle) {
  e.preventDefault();
  var id = VB.selectedId;
  if (!id) return;
  var item = VB.items.find(function(i) { return i.id === id; });
  if (!item) return;

  var sc = VB.scale, MIN = 30;
  var startMX = e.clientX, startMY = e.clientY;
  var sX = item.x, sY = item.y, sW = item.w, sH = item.h;

  function onMove(ev) {
    var dx = (ev.clientX - startMX) / sc;
    var dy = (ev.clientY - startMY) / sc;

    if (handle === 'e'  || handle === 'ne' || handle === 'se') item.w = Math.max(MIN, sW + dx);
    if (handle === 'w'  || handle === 'nw' || handle === 'sw') { item.w = Math.max(MIN, sW - dx); item.x = sX + sW - item.w; }
    if (handle === 's'  || handle === 'se' || handle === 'sw') item.h = Math.max(MIN, sH + dy);
    if (handle === 'n'  || handle === 'ne' || handle === 'nw') { item.h = Math.max(MIN, sH - dy); item.y = sY + sH - item.h; }

    var el = document.querySelector('#vb-canvas [data-id="' + id + '"]');
    if (el) {
      el.style.left   = item.x + 'px'; el.style.top  = item.y + 'px';
      el.style.width  = item.w + 'px'; el.style.height = item.h + 'px';
    }
    vbUpdateSelBox(item);
    
    var sw = document.getElementById('vb-prop-w');
    var sh = document.getElementById('vb-prop-h');
    if (sw) sw.textContent = Math.round(item.w);
    if (sh) sh.textContent = Math.round(item.h);
  }
  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    vbPushHistory(); vbSaveState();
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

function vbStartRotate(e) {
  e.preventDefault();
  var id = VB.selectedId;
  if (!id) return;
  var item = VB.items.find(function(i) { return i.id === id; });
  if (!item) return;

  var canvas   = document.getElementById('vb-canvas');
  var canvasR  = canvas.getBoundingClientRect();
  var sc       = VB.scale;
  var cx = canvasR.left + (item.x + item.w / 2) * sc;
  var cy = canvasR.top  + (item.y + item.h / 2) * sc;

  function onMove(ev) {
    var angle = Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180 / Math.PI + 90;
    
    if (ev.shiftKey) angle = Math.round(angle / 15) * 15;
    item.rotate = Math.round(angle);
    var el = document.querySelector('#vb-canvas [data-id="' + id + '"]');
    if (el) el.style.transform = 'rotate(' + item.rotate + 'deg)';
    vbUpdateSelBox(item);
    var ri = document.getElementById('vb-prop-rotate');
    if (ri) ri.value = item.rotate;
  }
  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    vbPushHistory(); vbSaveState();
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

function vbEditText(id, el) {
  var item = VB.items.find(function(i) { return i.id === id; });
  if (!item) return;
  el.contentEditable = 'true';
  el.style.cursor = 'text';
  el.focus();
  var range = document.createRange();
  range.selectNodeContents(el);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  function onBlur() {
    el.contentEditable = 'false';
    el.style.cursor = 'move';
    item.text = el.textContent;
    el.removeEventListener('blur', onBlur);
    el.removeEventListener('keydown', onKey);
    vbPushHistory(); vbSaveState();
  }
  function onKey(e) { if (e.key === 'Escape') { el.blur(); } }
  el.addEventListener('blur', onBlur);
  el.addEventListener('keydown', onKey);
}

function vbRenderProps(item) {
  var ph  = document.getElementById('vb-props-placeholder');
  var inn = document.getElementById('vb-props-inner');
  if (!ph || !inn) return;
  ph.style.display  = 'none';
  inn.style.display = 'block';
  inn.innerHTML     = '';

  
  var actions = document.createElement('div');
  actions.className = 'vb-prop-actions';

  var dupBtn = _vbBtn('⧉  Duplicate', 'vb-prop-action-btn', vbDuplicate);
  var delBtn = _vbBtn('🗑  Delete', 'vb-prop-action-btn vb-prop-del', vbDeleteSelected);
  actions.appendChild(dupBtn);
  actions.appendChild(delBtn);
  inn.appendChild(actions);

  
  var sizeDiv = document.createElement('div');
  sizeDiv.className = 'vb-prop-section';
  sizeDiv.innerHTML = '<div class="vb-prop-label-row"><span class="vb-prop-sec-label">Size &amp; Position</span></div>' +
    '<div class="vb-prop-wh"><div class="vb-wh-box"><span class="vb-wh-letter">W</span><span id="vb-prop-w" class="vb-wh-val">' + Math.round(item.w) + '</span></div>' +
    '<div class="vb-wh-box"><span class="vb-wh-letter">H</span><span id="vb-prop-h" class="vb-wh-val">' + Math.round(item.h) + '</span></div></div>';
  inn.appendChild(sizeDiv);

  
  inn.appendChild(_vbPropRow('Rotate', _vbNumberInput('vb-prop-rotate', item.rotate || 0, -360, 360, function(val) {
    item.rotate = val;
    var el = document.querySelector('#vb-canvas [data-id="' + item.id + '"]');
    if (el) el.style.transform = 'rotate(' + val + 'deg)';
    vbUpdateSelBox(item); vbSaveState();
  }), '°'));

  
  inn.appendChild(_vbSliderRow('Opacity', item.opacity !== undefined ? Math.round(item.opacity * 100) : 100, 0, 100, '%', function(val) {
    item.opacity = val / 100;
    var el = document.querySelector('#vb-canvas [data-id="' + item.id + '"]');
    if (el) el.style.opacity = item.opacity;
    vbSaveState();
  }));

  
  var layerDiv = document.createElement('div');
  layerDiv.className = 'vb-prop-layer-row';
  var fwdBtn = _vbBtn('↑ Forward', 'vb-layer-btn', vbLayerUp);
  var bckBtn = _vbBtn('↓ Backward', 'vb-layer-btn', vbLayerDown);
  layerDiv.appendChild(fwdBtn);
  layerDiv.appendChild(bckBtn);
  inn.appendChild(layerDiv);

  
  var sep = document.createElement('div');
  sep.className = 'vb-prop-sep';
  inn.appendChild(sep);

  if (item.type === 'text')    vbTextPropsUI(inn, item);
  if (item.type === 'sticker') vbStickerPropsUI(inn, item);
  if (item.type === 'shape')   vbShapePropsUI(inn, item);
  if (item.type === 'image')   vbImagePropsUI(inn, item);
}

function vbTextPropsUI(ct, item) {
  
  var fontSel = document.createElement('select');
  fontSel.className = 'vb-prop-select';
  vbFontOptions.forEach(function(f) {
    var opt = document.createElement('option');
    opt.value = f.value; opt.textContent = f.label;
    opt.selected = item.fontFamily === f.value;
    fontSel.appendChild(opt);
  });
  fontSel.addEventListener('change', function() {
    item.fontFamily = fontSel.value;
    _vbApplyStyle(item.id, 'fontFamily', item.fontFamily);
    vbSaveState();
  });
  ct.appendChild(_vbPropRow('Font', fontSel));

  
  ct.appendChild(_vbSliderRow('Size', item.fontSize, 8, 120, 'px', function(val) {
    item.fontSize = val;
    _vbApplyStyle(item.id, 'fontSize', val + 'px');
    vbSaveState();
  }));

  
  var styleRow = document.createElement('div');
  styleRow.className = 'vb-prop-row';
  var sl = document.createElement('span');
  sl.className = 'vb-prop-label'; sl.textContent = 'Style';
  var styleBtns = document.createElement('div');
  styleBtns.className = 'vb-style-btns';

  function mkStyleBtn(label, prop, on, off) {
    var btn = document.createElement('button');
    btn.className = 'vb-style-btn' + (item[prop] === on ? ' active' : '');
    btn.innerHTML = '<b>' + label + '</b>';
    btn.addEventListener('click', function() {
      item[prop] = item[prop] === on ? off : on;
      btn.classList.toggle('active', item[prop] === on);
      var el = document.querySelector('#vb-canvas [data-id="' + item.id + '"]');
      if (el) {
        if (prop === 'fontWeight')     el.style.fontWeight     = item[prop];
        if (prop === 'fontStyle')      el.style.fontStyle      = item[prop];
        if (prop === 'textDecoration') el.style.textDecoration = item[prop];
      }
      vbSaveState();
    });
    return btn;
  }

  styleBtns.appendChild(mkStyleBtn('B', 'fontWeight', '700', '400'));
  var iBtn = mkStyleBtn('I', 'fontStyle', 'italic', 'normal');
  iBtn.querySelector('b').style.fontStyle = 'italic';
  styleBtns.appendChild(iBtn);
  var uBtn = mkStyleBtn('U', 'textDecoration', 'underline', 'none');
  uBtn.querySelector('b').style.textDecoration = 'underline';
  styleBtns.appendChild(uBtn);

  
  [['L','left'],['C','center'],['R','right']].forEach(function(pair) {
    var btn = document.createElement('button');
    btn.className = 'vb-style-btn' + (item.textAlign === pair[1] ? ' active' : '');
    btn.title = 'Align ' + pair[1];
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="1" width="14" height="2" rx="1"/><rect x="0" y="6" width="' + (pair[1]==='left'?'10':pair[1]==='center'?'14':'10') + '" height="2" rx="1"' + (pair[1]==='right'?' x="4"':'') + '/><rect x="0" y="11" width="14" height="2" rx="1"/></svg>';
    btn.addEventListener('click', function() {
      item.textAlign = pair[1];
      styleBtns.querySelectorAll('.vb-style-btn').slice(3).forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      _vbApplyStyle(item.id, 'textAlign', pair[1]);
      vbSaveState();
    });
    styleBtns.appendChild(btn);
  });

  styleRow.appendChild(sl);
  styleRow.appendChild(styleBtns);
  ct.appendChild(styleRow);

  
  ct.appendChild(_vbColorRow('Text Color', item.color || '#1a1a2e', function(val) {
    item.color = val;
    _vbApplyStyle(item.id, 'color', val);
    vbSaveState();
  }));

  
  var bgRow = document.createElement('div');
  bgRow.className = 'vb-prop-row';
  var bgl = document.createElement('span'); bgl.className = 'vb-prop-label'; bgl.textContent = 'Card BG';
  var bgWrap = document.createElement('div'); bgWrap.className = 'vb-bg-color-wrap';

  var noneBtn = document.createElement('button');
  noneBtn.className = 'vb-none-btn' + (item.bg === 'transparent' ? ' active' : '');
  noneBtn.textContent = 'None';
  noneBtn.addEventListener('click', function() {
    item.bg = 'transparent';
    _vbApplyStyle(item.id, 'background', 'transparent');
    noneBtn.classList.add('active');
    bgPicker.style.opacity = '0.4';
    vbSaveState();
  });

  var bgPicker = document.createElement('input');
  bgPicker.type = 'color';
  bgPicker.className = 'vb-color-pick';
  bgPicker.value = (item.bg && item.bg !== 'transparent') ? item.bg : '#ffffff';
  bgPicker.style.opacity = item.bg === 'transparent' ? '0.4' : '1';
  bgPicker.addEventListener('input', function() {
    item.bg = bgPicker.value;
    _vbApplyStyle(item.id, 'background', item.bg);
    noneBtn.classList.remove('active');
    bgPicker.style.opacity = '1';
    vbSaveState();
  });

  bgWrap.appendChild(noneBtn); bgWrap.appendChild(bgPicker);
  bgRow.appendChild(bgl); bgRow.appendChild(bgWrap);
  ct.appendChild(bgRow);

  
  ct.appendChild(_vbSliderRow('Radius', item.borderRadius || 0, 0, 48, 'px', function(val) {
    item.borderRadius = val;
    _vbApplyStyle(item.id, 'borderRadius', val + 'px');
    vbSaveState();
  }));
}

function vbStickerPropsUI(ct, item) {
  ct.appendChild(_vbSliderRow('Size', item.fontSize, 20, 140, 'px', function(val) {
    item.fontSize = val;
    _vbApplyStyle(item.id, 'fontSize', val + 'px');
    vbSaveState();
  }));
}

function vbShapePropsUI(ct, item) {
  ct.appendChild(_vbColorRow('Fill', item.fill || '#c4b5fd', function(val) {
    item.fill = val;
    vbRenderItem(item); vbSaveState();
  }));
  ct.appendChild(_vbColorRow('Stroke', (item.stroke && item.stroke !== 'none') ? item.stroke : '#000000', function(val) {
    item.stroke = val;
    if (item.strokeWidth === 0) item.strokeWidth = 2;
    vbRenderItem(item); vbSaveState();
  }));
  ct.appendChild(_vbSliderRow('Stroke W', item.strokeWidth || 0, 0, 24, 'px', function(val) {
    item.strokeWidth = val;
    item.stroke = val > 0 ? (item.stroke || '#000000') : 'none';
    vbRenderItem(item); vbSaveState();
  }));
}

function vbImagePropsUI(ct, item) {
  
  var cropRow = document.createElement('div');
  cropRow.className = 'vb-prop-row';
  var cl = document.createElement('span'); cl.className = 'vb-prop-label'; cl.textContent = 'Fit';
  var cropBtns = document.createElement('div'); cropBtns.className = 'vb-style-btns';
  ['cover','contain','fill'].forEach(function(mode) {
    var btn = document.createElement('button');
    btn.className = 'vb-style-btn';
    btn.textContent = mode;
    btn.addEventListener('click', function() {
      item.objectFit = mode;
      var img = document.querySelector('#vb-canvas [data-id="' + item.id + '"] img');
      if (img) img.style.objectFit = mode;
      cropBtns.querySelectorAll('.vb-style-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      vbSaveState();
    });
    cropBtns.appendChild(btn);
  });
  cropRow.appendChild(cl); cropRow.appendChild(cropBtns);
  ct.appendChild(cropRow);
}

function _vbBtn(text, cls, fn) {
  var btn = document.createElement('button');
  btn.className = cls; btn.innerHTML = text;
  btn.addEventListener('click', fn);
  return btn;
}

function _vbPropRow(label, control, suffix) {
  var row = document.createElement('div');
  row.className = 'vb-prop-row';
  var lbl = document.createElement('span');
  lbl.className = 'vb-prop-label'; lbl.textContent = label;
  row.appendChild(lbl);
  row.appendChild(control);
  if (suffix) {
    var s = document.createElement('span');
    s.className = 'vb-prop-unit'; s.textContent = suffix;
    row.appendChild(s);
  }
  return row;
}

function _vbNumberInput(id, value, min, max, onChange) {
  var inp = document.createElement('input');
  inp.type = 'number'; inp.id = id; inp.value = value;
  inp.min = min; inp.max = max; inp.step = 1;
  inp.className = 'vb-prop-number';
  inp.addEventListener('input', function() { onChange(parseFloat(inp.value) || 0); });
  return inp;
}

function _vbSliderRow(label, value, min, max, unit, onChange) {
  var row = document.createElement('div');
  row.className = 'vb-prop-row vb-slider-row';
  var lbl = document.createElement('span');
  lbl.className = 'vb-prop-label'; lbl.textContent = label;

  var sl = document.createElement('input');
  sl.type = 'range'; sl.min = min; sl.max = max; sl.value = value;
  sl.className = 'vb-prop-slider';

  var valEl = document.createElement('span');
  valEl.className = 'vb-prop-val'; valEl.textContent = value + unit;

  sl.addEventListener('input', function() {
    valEl.textContent = sl.value + unit;
    onChange(parseFloat(sl.value));
  });

  row.appendChild(lbl); row.appendChild(sl); row.appendChild(valEl);
  return row;
}

function _vbColorRow(label, value, onChange) {
  var row = document.createElement('div');
  row.className = 'vb-prop-row';
  var lbl = document.createElement('span');
  lbl.className = 'vb-prop-label'; lbl.textContent = label;

  var wrap = document.createElement('div'); wrap.className = 'vb-color-wrap';
  var swatch = document.createElement('div');
  swatch.className = 'vb-color-swatch';
  swatch.style.background = value;

  var inp = document.createElement('input');
  inp.type = 'color'; inp.value = value; inp.className = 'vb-color-pick-hidden';
  inp.addEventListener('input', function() {
    swatch.style.background = inp.value;
    onChange(inp.value);
  });
  swatch.addEventListener('click', function() { inp.click(); });

  wrap.appendChild(swatch); wrap.appendChild(inp);
  row.appendChild(lbl); row.appendChild(wrap);
  return row;
}

function _vbApplyStyle(id, prop, value) {
  var el = document.querySelector('#vb-canvas [data-id="' + id + '"]');
  if (el) el.style[prop] = value;
}

function vbDeleteSelected() {
  if (!VB.selectedId) return;
  VB.items = VB.items.filter(function(i) { return i.id !== VB.selectedId; });
  var el = document.querySelector('#vb-canvas [data-id="' + VB.selectedId + '"]');
  if (el) el.remove();
  vbDeselect();
  vbPushHistory(); vbSaveState();
}

function vbDuplicate() {
  if (!VB.selectedId) return;
  var item = VB.items.find(function(i) { return i.id === VB.selectedId; });
  if (!item) return;
  VB.topZ++;
  var copy = JSON.parse(JSON.stringify(item));
  copy.id = 'vb_' + Date.now();
  copy.x  = Math.min(item.x + 24, VB.CANVAS_W - item.w);
  copy.y  = Math.min(item.y + 24, VB.CANVAS_H - item.h);
  copy.zIndex = VB.topZ;
  VB.items.push(copy);
  vbRenderItem(copy);
  vbSelect(copy.id);
  vbPushHistory(); vbSaveState();
}

function vbLayerUp() {
  if (!VB.selectedId) return;
  var item = VB.items.find(function(i) { return i.id === VB.selectedId; });
  if (!item) return;
  VB.topZ++;
  item.zIndex = VB.topZ;
  var el = document.querySelector('#vb-canvas [data-id="' + VB.selectedId + '"]');
  if (el) el.style.zIndex = VB.topZ;
  vbSaveState();
}

function vbLayerDown() {
  if (!VB.selectedId) return;
  var item = VB.items.find(function(i) { return i.id === VB.selectedId; });
  if (!item) return;
  item.zIndex = Math.max(1, (item.zIndex || 10) - 2);
  var el = document.querySelector('#vb-canvas [data-id="' + VB.selectedId + '"]');
  if (el) el.style.zIndex = item.zIndex;
  vbSaveState();
}

function vbPushHistory() {
  VB.history = VB.history.slice(0, VB.histIdx + 1);
  VB.history.push(JSON.stringify({ items: VB.items, background: VB.background, topZ: VB.topZ }));
  VB.histIdx = VB.history.length - 1;
  if (VB.history.length > 60) { VB.history.shift(); VB.histIdx--; }
  vbUpdateHistoryBtns();
}

function vbUndo() {
  if (VB.histIdx <= 0) return;
  VB.histIdx--;
  vbRestoreState(VB.history[VB.histIdx]);
}

function vbRedo() {
  if (VB.histIdx >= VB.history.length - 1) return;
  VB.histIdx++;
  vbRestoreState(VB.history[VB.histIdx]);
}

function vbRestoreState(json) {
  try {
    var st = JSON.parse(json);
    VB.items = st.items; VB.background = st.background; VB.topZ = st.topZ || 10;
    vbDeselect(); vbRenderAll(); vbUpdateHistoryBtns(); vbSaveState();
  } catch(e) {}
}

function vbUpdateHistoryBtns() {
  var u = document.getElementById('vb-undo-btn');
  var r = document.getElementById('vb-redo-btn');
  if (u) u.disabled = VB.histIdx <= 0;
  if (r) r.disabled = VB.histIdx >= VB.history.length - 1;
}

function vbSaveState() {
  try {
    localStorage.setItem(uKey('eq_visionboard'), JSON.stringify({
      items: VB.items, background: VB.background, topZ: VB.topZ
    }));
  } catch(e) {}
}

function vbLoadState() {
  try {
    var saved = localStorage.getItem(uKey('eq_visionboard'));
    if (!saved) return;
    var data = JSON.parse(saved);
    VB.items      = data.items      || [];
    VB.background = data.background || { type:'solid', value:'#ffffff' };
    VB.topZ       = data.topZ       || 10;
    VB.history    = [JSON.stringify({ items: VB.items, background: VB.background, topZ: VB.topZ })];
    VB.histIdx    = 0;
  } catch(e) { VB.items = []; }
}

function vbDownload() {
  vbDeselect();
  var canvas = document.getElementById('vb-canvas');
  if (!canvas) return;

  if (window.html2canvas) {
    html2canvas(canvas, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null })
      .then(function(c) {
        var link = document.createElement('a');
        link.download = 'my-vision-board.png';
        link.href = c.toDataURL('image/png');
        link.click();
      });
  } else {
    alert('To save your board, right-click it and choose "Save image as", or press Print Screen.');
  }
}

function vbClearBoard() {
  if (!confirm('Clear the entire vision board? This cannot be undone.')) return;
  VB.items = []; VB.topZ = 10;
  vbRenderAll(); vbDeselect();
  vbPushHistory(); vbSaveState();
}

function closeVisionBoard() {
  vbDeselect();
  showPage('dashboard');
}

function vbGetSavedBoards() {
  try {
    return JSON.parse(localStorage.getItem(uKey('eq_saved_boards')) || '[]');
  } catch(e) { return []; }
}

function vbPutSavedBoards(arr) {
  localStorage.setItem(uKey('eq_saved_boards'), JSON.stringify(arr));
}

function vbSaveBoard() {
  if (VB.items.length === 0) {
    vbShowToast('Board is empty — add something first!');
    return;
  }

  
  var name = prompt('Name this board:', 'My Board ' + (vbGetSavedBoards().length + 1));
  if (name === null) return; 
  name = name.trim() || ('My Board ' + (vbGetSavedBoards().length + 1));

  
  vbDeselect();

  function persist(thumb) {
    var boards = vbGetSavedBoards();
    boards.push({
      id:        'board_' + Date.now(),
      name:      name,
      savedAt:   Date.now(),
      items:     JSON.parse(JSON.stringify(VB.items)),
      background: JSON.parse(JSON.stringify(VB.background)),
      topZ:      VB.topZ,
      thumbnail: thumb || '',
    });
    vbPutSavedBoards(boards);
    vbShowToast('Board "' + name + '" saved!');
  }

  if (window.html2canvas) {
    var canvas = document.getElementById('vb-canvas');
    html2canvas(canvas, { scale: 0.35, useCORS: true, allowTaint: true, backgroundColor: null })
      .then(function(c) { persist(c.toDataURL('image/jpeg', 0.7)); })
      .catch(function()  { persist(''); });
  } else {
    persist('');
  }
}

function vbOpenMyBoards() {
  var overlay = document.getElementById('vb-myboards-overlay');
  if (!overlay) return;
  overlay.classList.add('active');
  vbRenderMyBoards();
}

function vbCloseMyBoards() {
  var overlay = document.getElementById('vb-myboards-overlay');
  if (overlay) overlay.classList.remove('active');
}

function vbRenderMyBoards() {
  var body = document.getElementById('vb-myboards-body');
  if (!body) return;
  body.innerHTML = '';

  var boards = vbGetSavedBoards();

  if (boards.length === 0) {
    body.innerHTML =
      '<div class="vb-mb-empty">' +
      '<div class="vb-mb-empty-icon">🎯</div>' +
      '<p class="vb-mb-empty-text">No saved boards yet.</p>' +
      '<p class="vb-mb-empty-sub">Click <strong>Save Board</strong> in the editor to save your work.</p>' +
      '</div>';
    return;
  }

  
  boards = boards.slice().sort(function(a, b) { return b.savedAt - a.savedAt; });

  var grid = document.createElement('div');
  grid.className = 'vb-mb-grid';

  boards.forEach(function(board) {
    var card = document.createElement('div');
    card.className = 'vb-mb-card';

    
    var thumb = document.createElement('div');
    thumb.className = 'vb-mb-thumb';
    if (board.thumbnail) {
      var img = document.createElement('img');
      img.src = board.thumbnail;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block;';
      thumb.appendChild(img);
    } else {
      
      thumb.style.background = (board.background && board.background.value) || '#fff';
      thumb.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;opacity:0.4;font-size:24px;">🎯</div>';
    }

    
    var info = document.createElement('div');
    info.className = 'vb-mb-info';

    var nameEl = document.createElement('div');
    nameEl.className = 'vb-mb-name';
    nameEl.textContent = board.name;

    var meta = document.createElement('div');
    meta.className = 'vb-mb-meta';
    var d = new Date(board.savedAt);
    meta.textContent = d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) +
                       ' · ' + board.items.length + ' item' + (board.items.length !== 1 ? 's' : '');

    
    var actions = document.createElement('div');
    actions.className = 'vb-mb-actions';

    var loadBtn = document.createElement('button');
    loadBtn.className = 'vb-mb-btn vb-mb-btn-load';
    loadBtn.textContent = 'Open';
    loadBtn.addEventListener('click', function() { vbLoadBoard(board.id); });

    var delBtn = document.createElement('button');
    delBtn.className = 'vb-mb-btn vb-mb-btn-del';
    delBtn.textContent = '✕';
    delBtn.title = 'Delete this board';
    delBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      vbDeleteSavedBoard(board.id);
    });

    actions.appendChild(loadBtn);
    actions.appendChild(delBtn);
    info.appendChild(nameEl);
    info.appendChild(meta);
    info.appendChild(actions);

    card.appendChild(thumb);
    card.appendChild(info);
    grid.appendChild(card);
  });

  body.appendChild(grid);
}

function vbLoadBoard(id) {
  var boards = vbGetSavedBoards();
  var board  = boards.find(function(b) { return b.id === id; });
  if (!board) return;

  if (VB.items.length > 0) {
    var ok = confirm('Loading "' + board.name + '" will replace the current board. Continue?');
    if (!ok) return;
  }

  VB.items      = JSON.parse(JSON.stringify(board.items));
  VB.background = JSON.parse(JSON.stringify(board.background));
  VB.topZ       = board.topZ || 10;
  VB.history    = [JSON.stringify({ items: VB.items, background: VB.background, topZ: VB.topZ })];
  VB.histIdx    = 0;

  vbDeselect();
  vbRenderAll();
  vbUpdateHistoryBtns();
  vbSaveState();

  vbCloseMyBoards();
  vbShowToast('Loaded "' + board.name + '"');
}

function vbDeleteSavedBoard(id) {
  var boards = vbGetSavedBoards().filter(function(b) { return b.id !== id; });
  vbPutSavedBoards(boards);
  vbRenderMyBoards();
  vbShowToast('Board deleted');
}

function vbShowToast(msg) {
  var t = document.getElementById('vb-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'vb-toast';
    t.className = 'vb-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function() { t.classList.remove('show'); }, 2600);
}