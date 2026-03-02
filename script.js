// --- 1. Connection Keys ---
const SUPABASE_URL = "https://oxdugsfhvfcvlrqzrcez.supabase.co";
const SUPABASE_KEY = "sb_publishable_MuYLFIc-kuuRUReskXD0RQ_064HMKFE";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 2. Landing Page Logic ---
const wishes = [
    "May our love grow deeper with every question answered.",
    "Counting down to March 27, in sha Allah...",
    "Every answer is a brick in the home we are building.",
    "I can't wait to start our forever journey together."
];

window.onload = () => {
    const wishElement = document.getElementById('wish-text');
    if (wishElement) {
        const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
        wishElement.innerText = randomWish;
    }
};

// --- 3. Login Logic ---
function login() {
    const user = document.getElementById('username').value.trim().toLowerCase();
    if (user === "momi" || user === "farhan") {
        localStorage.setItem('currentUser', user);
        window.location.href = "dashboard.html";
    } else {
        alert("Please enter Momi or Farhan");
    }
}

// --- 4. Dashboard Navigation ---
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId + '-section').style.display = 'block';
    
    if(sectionId === 'answer') loadNextQuestion();
    if(sectionId === 'history') loadHistory();
}

// --- 5. Ask Logic ---
async function submitQuestion() {
    const text = document.getElementById('new-question').value;
    const user = localStorage.getItem('currentUser');
    if(!text) return alert("Write something first!");

    const { error } = await _supabase
        .from('vault')
        .insert([{ question_text: text, asked_by: user }]);

    if (error) alert("Error saving!");
    else {
        alert("Question sent to the vault! ❤️");
        document.getElementById('new-question').value = "";
    }
}

// --- 6. Answer Logic (One at a time) ---
async function loadNextQuestion() {
    const user = localStorage.getItem('currentUser');
    const answerField = user === 'momi' ? 'momi_answer' : 'farhan_answer';

    const { data } = await _supabase
        .from('vault')
        .select('*')
        .is(answerField, null) 
        .limit(1);

    if (data && data.length > 0) {
        document.getElementById('question-display').innerText = data[0].question_text;
        document.getElementById('question-display').dataset.qid = data[0].id;
    } else {
        document.getElementById('question-display').innerText = "You've answered everything for now! ❤️";
    }
}

async function submitAnswer() {
    const user = localStorage.getItem('currentUser');
    const qId = document.getElementById('question-display').dataset.qid;
    const answerText = document.getElementById('answer-text').value;
    const answerField = user === 'momi' ? 'momi_answer' : 'farhan_answer';

    if(!qId || !answerText) return alert("Write an answer!");

    let updates = { is_answered: true };
    updates[answerField] = answerText;

    await _supabase.from('vault').update(updates).eq('id', qId);
    alert("Answer saved!");
    document.getElementById('answer-text').value = "";
    loadNextQuestion();
}

// --- 7. History Logic (For the Wedding Book) ---
async function loadHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = "Gathering our memories...";

    const { data, error } = await _supabase
        .from('vault')
        .select('*')
        .order('created_at', { ascending: true });

    if (data && data.length > 0) {
        historyList.innerHTML = "";
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'history-card';
            card.innerHTML = `
                <div class="history-question">✨ ${item.question_text}</div>
                <div class="history-grid">
                    <div class="ans-col"><strong>Momi:</strong><p>${item.momi_answer || "<i>Waiting...</i>"}</p></div>
                    <div class="ans-col"><strong>Farhan:</strong><p>${item.farhan_answer || "<i>Waiting...</i>"}</p></div>
                </div>
            `;
            historyList.appendChild(card);
        });
    } else {
        historyList.innerHTML = "No history yet. Start asking questions!";
    }
}
