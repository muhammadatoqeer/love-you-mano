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
.floating-heart {
    position: fixed;
    width: 20px;
    height: 20px;
    background: #ff6b81;
    border-radius: 50%;
    pointer-events: none;
    animation: float 5s ease-in-out infinite;
    z-index: 110;
}
@keyframes float {
    0% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-10px) scale(1.2); }
    100% { transform: translateY(0) scale(1); }
}
.compliment-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #43e97b;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    z-index: 130;
    transition: background 0.3s;
}
.compliment-btn:hover {
    background: #36b76d;
}
.sparkle {
    position: fixed;
    width: 8px;
    height: 8px;
    background: radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
    border-radius: 50%;
    pointer-events: none;
    animation: sparkle 0.7s forwards;
    z-index: 140;
}
@keyframes sparkle {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
}
.pulse-yes {
    animation: pulse 1.5s infinite;
}
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}
.emoji-rain {
    position: fixed;
    top: -10%;
    font-size: 2rem;
    pointer-events: none;
    z-index: 200;
    animation: emoji-fall 5s linear infinite;
}
@keyframes emoji-fall {
    0% { top: -10%; opacity: 1; }
    100% { top: 100vh; opacity: 0; }
}
.day-night-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255,255,255,0.8);
    color: #333;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
    z-index: 150;
    transition: background 0.3s, color 0.3s;
}
.day-night-btn:hover {
    background: rgba(255,255,255,1);
}
.secret-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255,255,255,0.9);
    color: #333;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 250;
    animation: slide-in 0.5s forwards;
}
@keyframes slide-in {
    0% { transform: translate(-50%, -60%); opacity: 0; }
    100% { transform: translate(-50%, -50%); opacity: 1; }
}
.firework {
    position: fixed;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    pointer-events: none;
    animation: firework-explode 1.2s forwards;
    z-index: 160;
}
@keyframes firework-explode {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(3); opacity: 0; }
}
.bg-burst {
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    pointer-events: none;
    animation: burst-animation 0.9s forwards;
    z-index: 170;
}
@keyframes burst-animation {
    0% { transform: scale(0); opacity: 0.8; }
    100% { transform: scale(1.2); opacity: 0; }
}
.float-text {
    position: fixed;
    font-size: 2rem;
    color: #fff;
    pointer-events: none;
    z-index: 180;
    animation: float-text-animation 1.8s forwards;
}
@keyframes float-text-animation {
    0% { transform: translateY(0) rotate(0); opacity: 1; }
    100% { transform: translateY(-20px) rotate(-10deg); opacity: 0; }
}
.love-counter {
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(255,255,255,0.9);
    color: #333;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 16px;
    z-index: 190;
}
`;
document.head.appendChild(style);

// Typewriter effect for main question
function typeWriter(element, text, speed = 80) {
    let i = 0;
    element.innerHTML = '';
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    typing();
}
window.addEventListener('DOMContentLoaded', () => {
    const h1 = document.querySelector('.rainbow-text');
    if (h1) typeWriter(h1, 'Do you love me?');
});

// Floating hearts animation
function spawnFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (2 + Math.random() * 3) + 's';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 5000);
}
setInterval(spawnFloatingHeart, 1200);

// Compliment generator button
const complimentBtn = document.createElement('button');
complimentBtn.textContent = '💌 More Compliments';
complimentBtn.className = 'compliment-btn';
complimentBtn.onclick = showPopup;
document.querySelector('.container').appendChild(complimentBtn);

// Sparkle trail on mouse move
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 700);
}
document.addEventListener('mousemove', e => {
    if (Math.random() < 0.5) createSparkle(e.clientX, e.clientY);
});

// Custom heart cursor
const cursorStyle = document.createElement('style');
cursorStyle.innerHTML = `
body, button, input {
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><text y="24" font-size="24">❤️</text></svg>') 0 24, auto;
}
`;
document.head.appendChild(cursorStyle);

// Emoji rain effect
function spawnEmojiRain() {
    const emojis = ['😍','🥰','😘','💖','💘','💝','💕','😻','🌈','✨'];
    const emoji = document.createElement('div');
    emoji.className = 'emoji-rain';
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.left = Math.random() * 100 + 'vw';
    emoji.style.fontSize = (2 + Math.random() * 2) + 'rem';
    emoji.style.animationDuration = (2.5 + Math.random() * 2) + 's';
    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 5000);
}
setInterval(spawnEmojiRain, 1800);

// Day/Night toggle
const dayNightBtn = document.createElement('button');
dayNightBtn.textContent = '🌙 Night Mode';
dayNightBtn.className = 'day-night-btn';
let isNight = false;
dayNightBtn.onclick = () => {
    isNight = !isNight;
    if (isNight) {
        document.body.classList.add('night');
        dayNightBtn.textContent = '☀️ Day Mode';
    } else {
        document.body.classList.remove('night');
        dayNightBtn.textContent = '🌙 Night Mode';
    }
};
document.querySelector('.container').appendChild(dayNightBtn);

// Secret message (Easter egg)
document.body.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        showSecretMessage();
    }
});
function showSecretMessage() {
    const secret = document.createElement('div');
    secret.className = 'secret-message';
    secret.innerHTML = 'Pssst... I love you more than words can say! 💌';
    document.body.appendChild(secret);
    setTimeout(() => secret.remove(), 4000);
}

// Firework effect
function launchFirework() {
    const colors = ['#ff6a00', '#ee0979', '#00c3ff', '#f7971e', '#a8ff78', '#f953c6', '#43e97b', '#ffd200'];
    const count = 18 + Math.floor(Math.random() * 8);
    const x = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
    const y = Math.random() * window.innerHeight * 0.3 + window.innerHeight * 0.1;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.setProperty('--angle', (i * (360 / count)) + 'deg');
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1200);
    }
}
setInterval(launchFirework, 5000);

// Love counter
let loveCount = 0;
const loveCounter = document.createElement('div');
loveCounter.className = 'love-counter';
loveCounter.innerHTML = '❤️ Love Clicks: <span id="loveCount">0</span>';
document.querySelector('.container').appendChild(loveCounter);
yesBtn.addEventListener('click', () => {
    loveCount++;
    document.getElementById('loveCount').textContent = loveCount;
});

// Move love counter below buttons
const container = document.querySelector('.container');
const buttonGroup = document.querySelector('.button-group');
container.insertBefore(loveCounter, buttonGroup.nextSibling);

// Secret heart rain on love count 8
let loveRainTriggered = false;
function triggerSecretHeartRain() {
    for (let i = 0; i < 40; i++) setTimeout(spawnFloatingHeart, i * 60);
}
yesBtn.addEventListener('click', () => {
    if (!loveRainTriggered && loveCount === 8) {
        triggerSecretHeartRain();
        loveRainTriggered = true;
    }
});

// Random background color burst on YES
function burstBackground() {
    const burst = document.createElement('div');
    burst.className = 'bg-burst';
    burst.style.background = `radial-gradient(circle at ${Math.random()*100}% ${Math.random()*100}%, #${Math.floor(Math.random()*16777215).toString(16)} 0%, transparent 80%)`;
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 900);
}
yesBtn.addEventListener('click', burstBackground);

// Floating animated text on YES
function floatText() {
    const texts = ['I ❤️ U', 'So Cute!', 'Forever!', 'XOXO', '💖', '😍', '🥰', 'You + Me'];
    const colors = ['#ff6a00', '#ee0979', '#00c3ff', '#f7971e', '#a8ff78', '#f953c6', '#43e97b', '#ffd200'];
    const txt = document.createElement('div');
    txt.className = 'float-text';
    txt.textContent = texts[Math.floor(Math.random() * texts.length)];
    txt.style.left = (40 + Math.random() * 20) + 'vw';
    txt.style.top = (60 + Math.random() * 10) + 'vh';
    txt.style.color = colors[Math.floor(Math.random() * colors.length)]; // Set random color
    document.body.appendChild(txt);
    setTimeout(() => txt.remove(), 1800);
}
yesBtn.addEventListener('click', floatText);

// Secret heart rain on triple click YES
let yesClickTimes = [];
yesBtn.addEventListener('click', () => {
    const now = Date.now();
    yesClickTimes = yesClickTimes.filter(t => now - t < 1200);
    yesClickTimes.push(now);
    if (yesClickTimes.length >= 3) {
        for (let i = 0; i < 40; i++) setTimeout(spawnFloatingHeart, i * 60);
        yesClickTimes = [];
    }
});
