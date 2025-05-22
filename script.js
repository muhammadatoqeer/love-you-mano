const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const message = document.getElementById('message');
const popup = document.getElementById('popup');
const popSound = document.getElementById('popSound');
const confettiCanvas = document.getElementById('confetti');

// Fun facts, jokes, and compliments
const popups = [
    "You're the peanut butter to my jelly!",
    "You're my sweet mano billa!",
    "You light up my world like nobody else!",
    "Why did the cookie go to the doctor? Because it felt crummy!",
    "You're my favorite notification!",
    "If kisses were snowflakes, I'd send you a blizzard!",
    "You make my heart do a happy dance!",
    "You're the reason I believe in magic!",
    "If I had a flower for every time I thought of you, I'd have a garden!",
    "You are my sunshine on a cloudy day!"
];

// Confetti setup
const confettiCtx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiAnimationId = null;
let confettiActive = false;
function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function randomColor() {
    const colors = ['#ff6a00', '#ee0979', '#00c3ff', '#f7971e', '#a8ff78', '#f953c6', '#43e97b', '#ffd200'];
    return colors[Math.floor(Math.random() * colors.length)];
}
function createConfetti() {
    confettiPieces = [];
    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            r: Math.random() * 8 + 4,
            d: Math.random() * 40 + 10,
            color: randomColor(),
            tilt: Math.random() * 10 - 10,
            tiltAngle: 0,
            tiltAngleIncremental: (Math.random() * 0.07) + .05
        });
    }
}
function drawConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach(c => {
        confettiCtx.beginPath();
        confettiCtx.lineWidth = c.r;
        confettiCtx.strokeStyle = c.color;
        confettiCtx.moveTo(c.x + c.tilt + (c.r / 3), c.y);
        confettiCtx.lineTo(c.x + c.tilt, c.y + c.d);
        confettiCtx.stroke();
    });
    updateConfetti();
}
function updateConfetti() {
    for (let i = 0; i < confettiPieces.length; i++) {
        let c = confettiPieces[i];
        c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
        c.x += Math.sin(0.01 * c.d);
        c.tiltAngle += c.tiltAngleIncremental;
        c.tilt = Math.sin(c.tiltAngle) * 15;
        if (c.y > confettiCanvas.height) {
            c.x = Math.random() * confettiCanvas.width;
            c.y = -10;
        }
    }
}
function animateConfetti() {
    if (!confettiActive) return;
    drawConfetti();
    confettiAnimationId = requestAnimationFrame(animateConfetti);
}
function startConfetti() {
    confettiActive = true;
    createConfetti();
    animateConfetti();
}
function stopConfetti() {
    confettiActive = false;
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
        confettiAnimationId = null;
    }
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

// Party popper effect
let partyPopperInterval = null;
function createPartyPopper() {
    const popper = document.createElement('div');
    popper.className = 'popper';
    popper.style.left = (10 + Math.random() * 80) + 'vw';
    popper.style.top = (80 + Math.random() * 10) + 'vh';
    document.body.appendChild(popper);
    setTimeout(() => popper.remove(), 1200);
}
function startPartyPoppers() {
    if (partyPopperInterval) return;
    partyPopperInterval = setInterval(() => {
        for (let i = 0; i < 2; i++) createPartyPopper();
    }, 600);
}
function stopPartyPoppers() {
    clearInterval(partyPopperInterval);
    partyPopperInterval = null;
    document.querySelectorAll('.popper').forEach(p => p.remove());
}

// YES button fun
yesBtn.addEventListener('click', () => {
    message.innerHTML = '<span style="font-size:2rem; color:#43e97b;">Yay! I love you too! 💖</span>';
    message.style.display = 'block';
    message.style.cursor = 'pointer';
    popSound.play();
    burstHearts();
    showPopup();
    stopThunderstorm(); // Stop thunderstorm and rain
    document.body.classList.remove('gloomy');
    stopConfetti(); // Prevent confetti speedup by stopping before starting
    startConfetti();
    stopPartyPoppers(); // Prevent popper speedup
    startPartyPoppers();
});

// Message click to hide
message.addEventListener('click', () => {
    message.style.display = 'none';
});

// NO button mischief
let noBtnTries = 0;
noBtn.addEventListener('mouseenter', () => {
    noBtnTries++;
    if (noBtnTries < 5) {
        // Move the button to a random position
        const x = Math.random() * 60 - 30;
        const y = Math.random() * 60 - 30;
        noBtn.style.transform = `translate(${x}px, ${y}px) scale(0.9)`;
        yesBtn.style.transform = 'scale(1.2)';
    } else {
        // Shrink and fade the NO button
        noBtn.style.transform = 'scale(0.1)';
        noBtn.style.opacity = '0.2';
        yesBtn.style.transform = 'scale(1.4)';
    }
    showPopup();
});
noBtn.addEventListener('mouseleave', () => {
    noBtn.style.transform = '';
    yesBtn.style.transform = '';
});
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Gloomy mode
    document.body.classList.add('gloomy');
    stopConfetti();
    stopPartyPoppers();
    message.innerHTML = '<span style="font-size:2rem; color:#555;">Oh no! 😢</span>';
    message.style.display = 'block';
    // Shrink NO button
    noBtn.style.transform = 'scale(0.1)';
    noBtn.style.opacity = '0.2';
    yesBtn.style.transform = 'scale(1.4)';
    // Add thunderstorm/crying effect
    startThunderstorm();
});

// Thunderstorm/crying effect
let thunderInterval = null;
function startThunderstorm() {
    if (thunderInterval) return;
    createRain();
    thunderInterval = setInterval(() => {
        flashLightning();
    }, 2000);
}
function stopThunderstorm() {
    clearInterval(thunderInterval);
    thunderInterval = null;
    document.querySelectorAll('.rain-drop').forEach(r => r.remove());
    document.querySelectorAll('.lightning').forEach(l => l.remove());
}
function createRain() {
    for (let i = 0; i < 60; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + 'vw';
        drop.style.animationDelay = (Math.random() * 2) + 's';
        document.body.appendChild(drop);
    }
}
function flashLightning() {
    const lightning = document.createElement('div');
    lightning.className = 'lightning';
    document.body.appendChild(lightning);
    setTimeout(() => lightning.remove(), 200);
}

// Fun popups
function showPopup() {
    popup.innerText = popups[Math.floor(Math.random() * popups.length)];
    popup.style.display = 'block';
    popup.style.opacity = '1';
    // Remove auto-hide, let user click to hide
    popup.style.cursor = 'pointer';
    popup.onclick = () => {
        popup.style.opacity = '0';
        setTimeout(() => popup.style.display = 'none', 500);
    };
}

// Heart burst animation
function burstHearts() {
    for (let i = 0; i < 30; i++) {
        createHeart();
    }
}
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = (50 + Math.random() * 30 - 15) + '%';
    heart.style.top = (60 + Math.random() * 10 - 5) + '%';
    heart.style.background = randomColor();
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2000);
}

// Add heart CSS and new effects
const style = document.createElement('style');
style.innerHTML = `
.heart {
    position: fixed;
    width: 30px;
    height: 30px;
    background: #f38181;
    left: 50%;
    top: 60%;
    transform: translate(-50%, -50%) scale(1);
    border-radius: 50% 50% 0 0;
    animation: heart-burst 2s ease-out forwards;
    z-index: 100;
}
.heart::before, .heart::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    background: inherit;
    border-radius: 50%;
}
.heart::before {
    left: -15px;
    top: 0;
}
.heart::after {
    left: 0;
    top: -15px;
}
@keyframes heart-burst {
    0% { opacity: 1; transform: scale(1) translateY(0); }
    100% { opacity: 0; transform: scale(2.5) translateY(-200px); }
}
.popper {
    position: fixed;
    width: 40px;
    height: 40px;
    background: url('data:image/svg+xml;utf8,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><g><ellipse cx="20" cy="30" rx="10" ry="7" fill="%23ffd200"/><rect x="15" y="10" width="10" height="20" rx="5" fill="%23f7971e"/><polygon points="20,0 25,10 15,10" fill="%23ee0979"/></g></svg>') no-repeat center/contain;
    animation: popper-pop 1.2s ease-out forwards;
    z-index: 120;
}
@keyframes popper-pop {
    0% { opacity: 0; transform: scale(0.5) translateY(0); }
    30% { opacity: 1; transform: scale(1.2) translateY(-30px); }
    100% { opacity: 0; transform: scale(0.7) translateY(-80px); }
}
.rain-drop {
    position: fixed;
    top: -10vh;
    width: 3px;
    height: 30px;
    background: #8ac6d1;
    opacity: 0.7;
    border-radius: 2px;
    animation: rain-fall 2.5s linear infinite;
    z-index: 200;
}
@keyframes rain-fall {
    0% { top: -10vh; }
    100% { top: 110vh; }
}
.lightning {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(255,255,255,0.7);
    z-index: 300;
    animation: lightning-flash 0.2s linear;
}
@keyframes lightning-flash {
    0% { opacity: 1; }
    100% { opacity: 0; }
}
body.gloomy {
    background: linear-gradient(135deg, #232526, #414345, #232526);
    transition: background 0.5s;
}
`;
document.head.appendChild(style);
