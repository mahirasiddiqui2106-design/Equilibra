// =====================================================
// ORIGINAL CODE — unchanged from logic.js
// =====================================================

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
  }
];


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
        // scroll content back to top
        const body = document.querySelector('.mirror-page-body');
        if (body) body.scrollTop = 0;
    }

    if (pageId === "unload") {
        resetUnloadWall();
        requestAnimationFrame(function() {
            requestAnimationFrame(initUnloadCanvas);
        });
    }
}


function loginUser() {
    showPage('dashboard');
}

function updateDashGreeting() {
    const now = new Date();
    const hour = now.getHours();
    let timeLabel = 'Good morning';
    if (hour >= 12 && hour < 17) timeLabel = 'Good afternoon';
    else if (hour >= 17) timeLabel = 'Good evening';

    const timeEl = document.getElementById('dash-time-label');
    const dateEl = document.getElementById('dash-date-label');
    if (timeEl) timeEl.textContent = timeLabel;
    if (dateEl) {
        dateEl.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric'
        });
    }
}


function showOTP() {
    const otpBox = document.getElementById("otp-box");
    if (otpBox) otpBox.style.display = "block";
}

function verifyOTP() {
    const otpInput = document.getElementById("otp-input");
    if (!otpInput || otpInput.value.trim() === "") {
        alert("Please enter the OTP");
        return;
    }
    showPage('welcome');
}


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
            if      (feature.id === "mirror")   { showPage("mirror"); }
            else if (feature.id === "nemo")     { openNemo(); }
            else if (feature.id === "unload")   { showPage("unload"); }
            else if (feature.id === "pomodoro") { showPage("pomodoro"); }
            else                                { toggleEquilibraCard(card); }
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


// =====================================================
// NEW ADDITIONS ONLY — course data + detail page
// Nothing above was changed.
// =====================================================

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

// item type → icon color and label
const itemMeta = {
    assignment: { emoji: "📄", color: "#e84b8a", label: "ASSIGNMENT" },
    quiz:       { emoji: "✅", color: "#e84b8a", label: "QUIZ"       },
    forum:      { emoji: "💬", color: "#e05b2b", label: "FORUM"      },
    file:       { emoji: "📁", color: "#1a73e8", label: "FILE"       },
    vpl:        { emoji: "💻", color: "#e84b8a", label: "VIRTUAL PROGRAMMING LAB" },
    page:       { emoji: "📄", color: "#1a73e8", label: "PAGE"       },
    folder:     { emoji: "📂", color: "#1a73e8", label: "FOLDER"     }
};

// Inject course cards into the dashboard grid
function renderCourseGrid() {
    const grid = document.getElementById("course-grid");
    if (!grid) return;
    grid.innerHTML = "";

    courses.forEach(course => {
        const card = document.createElement("div");
        card.className = "course-card";
        card.innerHTML = `
            <div class="course-cover ${course.cover}"></div>
            <div class="course-info">
                <h4>${course.title}</h4>
                <span>${course.semester}</span>
                <div class="completion-bar-wrap">
                    <div class="completion-bar" style="width:${course.completion}%"></div>
                </div>
                <span class="completion-pct">${course.completion}% complete</span>
            </div>
        `;
        card.addEventListener("click", () => openCourse(course.id));
        grid.appendChild(card);
    });
}

// Open a course detail page
function openCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

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
                const meta = itemMeta[item.type] || itemMeta.file;
                const lockHtml  = item.locked ? `<div class="lms-item-lock">🔒 Not available unless you belong to <strong>${fac.name.toUpperCase()}${slotLabel.toUpperCase()}</strong></div>` : "";
                const dueHtml   = item.due  ? `<div class="lms-item-due">Due Date: ${item.due}</div>` : "";
                const noteHtml  = item.note ? `<div class="lms-item-note">${item.note}</div>` : "";
                const doneBtn   = (item.type === "file" && !item.locked) ? `<button class="mark-done-btn">Mark as done</button>` : "";

                itemsHtml += `
                    <div class="lms-item-row">
                        <div class="lms-item-icon" style="background:${meta.color};">${meta.emoji}</div>
                        <div class="lms-item-info">
                            <span class="lms-item-type">${meta.label}</span>
                            <span class="lms-item-name ${!item.locked ? 'lms-link' : ''}">${item.label}</span>
                            ${dueHtml}${noteHtml}${lockHtml}
                        </div>
                        ${doneBtn}
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

    // render Equilibra cards in the detail panel
    renderEquilibraCardsIn("#detail-equilibra-cards");

    maybeCelebrate('course');   // Nemo celebration hook
    showPage('course-detail');
}

// Collapse / expand a faculty section
function toggleSection(header) {
    const items  = header.nextElementSibling;
    const toggle = header.querySelector(".faculty-toggle");
    const isOpen = items.style.display !== "none";
    items.style.display  = isOpen ? "none" : "block";
    toggle.textContent   = isOpen ? "▶" : "▼";
}

// Render Equilibra cards into any selector (used for detail page panel)
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
            if      (feature.id === "mirror")   { showPage("mirror"); }
            else if (feature.id === "nemo")     { openNemo(); }
            else if (feature.id === "unload")   { showPage("unload"); }
            else if (feature.id === "pomodoro") { showPage("pomodoro"); }
            else                                { toggleEquilibraCard(card); }
        });
        container.appendChild(card);
    });
}

// ── TAB SWITCHING ────────────────────────────────────────────────────────────

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

    if (viewId === 'mycourses-view') renderCourseGridIn('course-grid-mycourses');
    if (viewId === 'calendar-view')  renderCalendar();
}

// ── CALENDAR ─────────────────────────────────────────────────────────────────

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
        (calEvents[key] || []).forEach(ev => {
            const evEl = document.createElement('div');
            evEl.className = 'cal-event';
            evEl.textContent = ev.length > 13 ? ev.substring(0, 13) + '...' : ev;
            evEl.title = ev;
            cell.appendChild(evEl);
        });

        grid.appendChild(cell);
    }
}

function changeMonth(dir) {
    calMonth += dir;
    if (calMonth > 11) { calMonth = 0;  calYear++; }
    if (calMonth < 0)  { calMonth = 11; calYear--; }
    renderCalendar();
}

function renderCourseGridIn(gridId) {
    const grid = document.getElementById(gridId);
    if (!grid || grid.children.length > 0) return;
    courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <div class="course-cover ${course.cover}"></div>
            <div class="course-info">
                <h4>${course.title}</h4>
                <span>${course.semester}</span>
                <div class="completion-bar-wrap">
                    <div class="completion-bar" style="width:${course.completion}%"></div>
                </div>
                <span class="completion-pct">${course.completion}% complete</span>
            </div>
        `;
        card.addEventListener('click', () => openCourse(course.id));
        grid.appendChild(card);
    });
}


// ══════════════════════════════════════════════════════════════════════════════
// STUDENT MIRROR — burnout calculator
// ══════════════════════════════════════════════════════════════════════════════

const mirrorQuestions = [

    // ── Warm qualitative (choice-based) ────────────────────────────────────
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

    // ── Scale 1–10 ──────────────────────────────────────────────────────────
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

// ── Open / close ────────────────────────────────────────────────────────────

function openMirrorModal() {
    showPage('mirror');
}

function closeMirrorModal() {
    showPage('dashboard');
}

function closeMirrorModalOutside(e) {
    // no-op: no overlay anymore, kept for any residual references
}

function retakeMirror() {
    mirrorAnswers = {};
    document.getElementById('mirror-results').style.display = 'none';
    document.getElementById('mirror-form').style.display    = 'block';
    renderMirrorQuestions();
    const _mb = document.querySelector('.mirror-page-body'); if (_mb) _mb.scrollTop = 0;
}

// ── Render questions ─────────────────────────────────────────────────────────

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
            // Choice buttons
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
            // Scale slider
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

            // Set default answer immediately
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

// ── Calculate & show results ─────────────────────────────────────────────────

function calculateBurnout() {
    // Validate warm questions
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

    // Convert raw answer → burnout value (0–100, higher = more burned out)
    function toBurnout(raw, reversed) {
        return reversed
            ? ((11 - raw) / 9) * 100   // high raw = low burnout → flip
            : ((raw  - 1) / 9) * 100;
    }

    // Collect by dimension
    const buckets = { exhaustion: [], pressure: [], focus: [], wellbeing: [], engagement: [] };
    mirrorQuestions.forEach(q => {
        const ans = mirrorAnswers[q.id];
        if (!ans) return;
        buckets[q.dimension].push(toBurnout(ans.score, ans.reversed));
    });

    // Average each dimension → round
    const dims = {};
    Object.keys(buckets).forEach(k => {
        const arr = buckets[k];
        dims[k] = arr.length
            ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
            : 50;
    });

    // Overall (equal weights)
    const overall = Math.round(
        (dims.exhaustion + dims.pressure + dims.focus + dims.wellbeing + dims.engagement) / 5
    );

    showMirrorResults(overall, dims);
}

function showMirrorResults(overall, dims) {
    document.getElementById('mirror-form').style.display    = 'none';
    document.getElementById('mirror-results').style.display = 'block';
    const _mb = document.querySelector('.mirror-page-body'); if (_mb) _mb.scrollTop = 0;

    // ── Animated counter ──
    const numEl = document.getElementById('burnout-score-num');
    let current = 0;
    numEl.textContent = '0';
    const step = Math.max(1, Math.ceil(overall / 45));
    const counter = setInterval(() => {
        current = Math.min(current + step, overall);
        numEl.textContent = current;
        if (current >= overall) clearInterval(counter);
    }, 28);

    // ── Ring ──
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
    // Kick animation on next frame so transition triggers
    requestAnimationFrame(() => {
        ring.style.strokeDashoffset = offset;
    });

    // ── Badge + message ──
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

    // ── Dimension bars ──
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

    // Animate bars after a brief pause
    setTimeout(() => {
        document.querySelectorAll('.dim-bar').forEach(bar => {
            bar.style.width = bar.dataset.w;
        });
    }, 180);

    // ── Radar chart ──
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


// ══════════════════════════════════════════════════════════════════════════════
// NEMO MOOD BUDDY
// ══════════════════════════════════════════════════════════════════════════════

let nemoStartTime   = Date.now();
let nemoLastNudge   = 0;
let breathInterval  = null;
let breathStep      = 0;
let breathRound     = 0;
let lastTalkRespIdx = -1;
let lastCelebIdx    = -1;
const BREATHE_ROUNDS = 3;

// ── Open / close ──────────────────────────────────────────────────────────────

function openNemo() {
    document.getElementById('nemo-modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    setNemoGreeting();
    nemoChatSessionActive = false;   // allow chat to re-initialise for this session
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

// ── Time-aware greeting ───────────────────────────────────────────────────────

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

// ── Screen switching ──────────────────────────────────────────────────────────

function switchNemoScreen(screen) {
    ['mood', 'talk', 'breathe'].forEach(s => {
        document.getElementById('nemo-' + s + '-screen').style.display =
            s === screen ? (s === 'talk' ? 'flex' : 'block') : 'none';
        const tab = document.getElementById('ntab-' + s);
        if (tab) tab.classList.toggle('active', s === screen);
    });
    if (screen !== 'breathe') stopBreathing();
    // Only initialise chat once per Nemo open; switching back does NOT reset it
    if (screen === 'talk' && !nemoChatSessionActive) resetNemoChat();
}

// ── Panda expression ──────────────────────────────────────────────────────────

function setNemoPanda(mood) {
    const p = document.getElementById('nemo-panda');
    if (!p) return;
    p.className = 'nemo-panda' + (mood !== 'default' ? ' panda-' + mood : '');
}

// ── Mood Pulse ────────────────────────────────────────────────────────────────

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

// ── Chat Therapist (Groq AI — Llama 3) ───────────────────────────────────────

let nemoChatReady         = false;
let nemoChatSessionActive = false;
let nemoApiKey            = localStorage.getItem('nemo_groq_key') || '';
let nemoChatHistory       = [];   // [{role:'user'|'assistant', content:'...'}]

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

// Shown when no API key is set — genuine but not AI
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
    localStorage.setItem('nemo_groq_key', nemoApiKey);   // persist across sessions
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
    localStorage.removeItem('nemo_groq_key');
    nemoInitChat();   // re-show the setup card so user can enter a new key
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

    // Show API key setup card (or skip straight in if key already saved)
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

// ── Breathing ─────────────────────────────────────────────────────────────────

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

// ── Stress nudges ─────────────────────────────────────────────────────────────

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

// ── Celebration toasts ────────────────────────────────────────────────────────

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

// Hook: mark-done-btn clicks trigger celebration
document.addEventListener('click', e => {
    if (e.target.classList.contains('mark-done-btn')) maybeCelebrate('done');
});

// ═══════════════════════════════════════════════════════════════════════════
// UNLOAD WALL
// ═══════════════════════════════════════════════════════════════════════════

// ── State ─────────────────────────────────────────────────────────────────
var unloadCurrentMode  = 'draw';
var unloadDrawColor    = '#1a1a2e';
var unloadBrushSize    = 4;
var unloadEraserActive = false;
var unloadIsDrawing    = false;
var unloadLastX        = 0;
var unloadLastY        = 0;
var unloadAnimRAF      = null;   // active rAF handle (tear or burn)
var unloadPieceLayer   = null;   // overlay canvas holding scattered pieces
var unloadPieces       = [];     // piece objects

// ── Open / close ──────────────────────────────────────────────────────────
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
    // no-op: no overlay anymore, kept for any residual references
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

// ── Mode switch ───────────────────────────────────────────────────────────
function switchUnloadMode(mode) {
    unloadCurrentMode = mode;
    document.querySelectorAll('.unload-mode-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.mode === mode);
    });
    document.getElementById('unload-draw-screen').style.display = mode === 'draw' ? 'flex' : 'none';
    document.getElementById('unload-type-screen').style.display = mode === 'type' ? 'flex' : 'none';
    if (mode === 'draw') requestAnimationFrame(function() { requestAnimationFrame(initUnloadCanvas); });
}

// ── Canvas setup & drawing ─────────────────────────────────────────────────
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
    // Remove old listeners by replacing the element's event handlers via a flag
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

// Color & size tool handlers
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

// ── Helpers ───────────────────────────────────────────────────────────────
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

// ── Sounds ─────────────────────────────────────────────────────────────────
function playTearSound() {
    try {
        var ac  = new (window.AudioContext || window.webkitAudioContext)();
        var sr  = ac.sampleRate;
        var len = Math.floor(sr * 0.38);
        var buf = ac.createBuffer(1, len, sr);
        var d   = buf.getChannelData(0);
        // Noise with ripping modulation: irregular amplitude bumps = characteristic rip texture
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
        // Resume is required in Chrome — AudioContext starts suspended
        ac.resume().then(function() { src.start(); });
        setTimeout(function() { try { ac.close(); } catch(x) {} }, 700);
    } catch(e) {}
}

function playCrackleSound() {
    try {
        var ac  = new (window.AudioContext || window.webkitAudioContext)();
        ac.resume();   // ensure context is running (Chrome auto-suspends)
        var sr  = ac.sampleRate;
        var dur = 2.8;
        var now = ac.currentTime;

        // 1 — continuous background fire hiss
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

        // 2 — pre-scheduled crackle pops (varied size, frequency, timing = realistic fire)
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

        // 3 — low-frequency fire rumble
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

// ── Tear — many jagged pieces scatter outward ──────────────────────────────
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

    // Snapshot source into a canvas
    var srcCanvas = unloadCurrentMode === 'draw'
        ? document.getElementById('unload-canvas')
        : unloadRenderText(document.getElementById('unload-textarea').value || '', srcW, srcH);

    contentEl.style.visibility = 'hidden';

    // Overlay canvas (full modal)
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

            // Generate jagged torn-paper border
            var pts = unloadGenJaggedPts(mg, mg, pW, pH, NOISE);

            // Clip to jagged shape, fill paper colour, draw source image
            pctx.save();
            unloadJagPath(pctx, pts);
            pctx.clip();
            pctx.fillStyle = '#faf8f2';
            pctx.fillRect(0, 0, pc.width, pc.height);
            pctx.drawImage(srcCanvas, -sx + mg, -sy + mg, srcW, srcH);
            pctx.restore();

            // Torn-edge line
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

// ── Burn — fire sweeps through scattered pieces ────────────────────────────
function unloadBurn() {
    if (!unloadPieceLayer) { resetUnloadAfterRelease(); return; }
    playCrackleSound();

    var lW       = unloadPieceLayer.width;
    var lH       = unloadPieceLayer.height;
    var ctx      = unloadPieceLayer.getContext('2d');
    var startT   = Date.now();
    var BURN_DUR = 2600;
    var fP       = [];   // fire particles

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
        var sweepY   = lH * (1 - progress * 1.18);   // sweep line bottom→top

        ctx.clearRect(0, 0, lW, lH);

        // Redraw pieces — alpha falls as sweep line passes them
        unloadPieces.forEach(function(p) {
            var dist  = p.y - sweepY;          // positive = above (not yet burned)
            var alpha = dist > 80 ? 1 : dist > -35 ? Math.max(0, (dist + 35) / 115) : 0;
            if (alpha <= 0) return;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.shadowColor = 'rgba(0,0,0,0.18)'; ctx.shadowBlur = 7;
            ctx.drawImage(p.canvas, -p.canvas.width / 2, -p.canvas.height / 2);

            // Orange char glow as fire approaches
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

        // Spawn fire along sweep line
        if (progress < 0.93) spawnFire(sweepY);

        // Draw & update fire particles
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

    // Restore content areas
    var cw = document.getElementById('unload-canvas-wrap');
    var ts = document.getElementById('unload-type-screen');
    if (cw) cw.style.visibility = '';
    if (ts) ts.style.visibility = '';

    // Clear content
    var ta = document.getElementById('unload-textarea');
    if (ta) ta.value = '';
    clearUnloadCanvas();

    // Reset buttons
    document.getElementById('unload-tear-btn').style.display = 'inline-flex';
    document.getElementById('unload-burn-btn').style.display = 'none';
    var hint = document.getElementById('unload-release-hint');
    if (hint) hint.textContent = 'Ready to let go?';

    // Show "Gone. You're lighter now." popup for 3 seconds
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

