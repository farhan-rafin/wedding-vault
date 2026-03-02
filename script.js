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
