const SUPABASE_URL = "https://oxdugsfhvfcvlrqzrcez.supabase.co";
const SUPABASE_KEY = "sb_publishable_MuYLFIc-kuuRUReskXD0RQ_064HMKFE";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const wishes = [
    "May our love grow deeper with every question answered.",
    "Counting down to March 27, in sha Allah...",
    "Every answer is a brick in the home we are building.",
    "I can't wait to start our forever journey together."
];

window.onload = () => {
    if (document.getElementById('wish-text')) {
        const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
        document.getElementById('wish-text').innerText = randomWish;
    }
};

function login() {
    const user = document.getElementById('username').value.trim().toLowerCase();
    if (user === "momi" || user === "farhan") {
        localStorage.setItem('currentUser', user);
        window.location.href = "dashboard.html";
    } else {
        alert("Please enter Momi or Farhan");
    }
}
// Navigation logic
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId + '-section').style.display = 'block';
    
    if(sectionId === 'answer') loadNextQuestion();
    if(sectionId === 'history') loadHistory();
}

// Ask a question
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

// Answer logic (Finds questions YOU haven't answered yet)
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
        document.getElementById('question-display').innerText = "You've answered everything for now! Check back later. ❤️";
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

// Navigation logic to switch between Ask, Answer, and History
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId + '-section').style.display = 'block';
    
    if(sectionId === 'answer') loadNextQuestion();
    if(sectionId === 'history') loadHistory();
}

// Sending a new question to Supabase
async function submitQuestion() {
    const text = document.getElementById('new-question').value;
    const user = localStorage.getItem('currentUser');
    if(!text) return alert("Please write a question!");

    const { error } = await _supabase
        .from('vault')
        .insert([{ question_text: text, asked_by: user }]);

    if (error) alert("Error saving!");
    else {
        alert("Question sent to the vault! ❤️");
        document.getElementById('new-question').value = "";
    }
}

// Logic to load one question YOU haven't answered yet
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
async function loadHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = "Gathering our memories...";

    // Fetch all questions that have been answered by at least one person
    const { data, error } = await _supabase
        .from('vault')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        historyList.innerHTML = "Error loading our story. Please try again.";
        return;
    }

    if (data && data.length > 0) {
        historyList.innerHTML = ""; // Clear loading text
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'history-card';
            
            card.innerHTML = `
                <div class="history-question">Q: ${item.question_text}</div>
                <div class="history-answers">
                    <div class="answer-box">
                        <strong>Momi:</strong> ${item.momi_answer || "<i>Waiting...</i>"}
                    </div>
                    <div class="answer-box">
                        <strong>Farhan:</strong> ${item.farhan_answer || "<i>Waiting...</i>"}
                    </div>
                </div>
                <hr class="divider">
            `;
            historyList.appendChild(card);
        });
    } else {
        historyList.innerHTML = "Our story hasn't started yet. Ask a question to begin! ❤️";
    }
}
// Function to load every Q&A for the "Our Story" tab
async function loadHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = "<p>Walking down memory lane...</p>";

    // Fetch all rows from the vault, ordered by the date they were created
    const { data, error } = await _supabase
        .from('vault')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error("History Error:", error);
        historyList.innerHTML = "<p>Could not load the vault right now.</p>";
        return;
    }

    if (data && data.length > 0) {
        historyList.innerHTML = ""; // Clear the loading message
        
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'history-card';
            
            // This creates a side-by-side view of your answers
            card.innerHTML = `
                <div class="history-question">✨ ${item.question_text}</div>
                <div class="history-grid">
                    <div class="ans-col">
                        <strong>Momi:</strong> 
                        <p>${item.momi_answer || "<i>Still thinking...</i>"}</p>
                    </div>
                    <div class="ans-col">
                        <strong>Farhan:</strong> 
                        <p>${item.farhan_answer || "<i>Still thinking...</i>"}</p>
                    </div>
                </div>
            `;
            historyList.appendChild(card);
        });
    } else {
        historyList.innerHTML = "<p>The vault is empty. Ask the first question! ❤️</p>";
    }
}
