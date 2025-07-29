// Web Audio API 設置
let audioContext;
let currentTimeout;
let isPlaying = false;

// 生日快樂歌歌詞
const lyrics = [
    "祝你生日快樂 🎵",
    "祝你生日快樂 🎶", 
    "祝你生日快樂 🎵",
    "祝你生日快樂 🎉"
];

// 音符頻率對應表 (Hz)
const notes = {
    'C4': 261.63,
    'D4': 293.66,
    'E4': 329.63,
    'F4': 349.23,
    'G4': 392.00,
    'A4': 440.00,
    'B4': 493.88,
    'C5': 523.25
};

// 生日快樂歌的音符序列
const happyBirthdayNotes = [
    // 祝你生日快樂
    {note: 'C4', duration: 0.75}, {note: 'C4', duration: 0.25}, 
    {note: 'D4', duration: 1}, {note: 'C4', duration: 1}, 
    {note: 'F4', duration: 1}, {note: 'E4', duration: 2},
    
    // 祝你生日快樂
    {note: 'C4', duration: 0.75}, {note: 'C4', duration: 0.25}, 
    {note: 'D4', duration: 1}, {note: 'C4', duration: 1}, 
    {note: 'G4', duration: 1}, {note: 'F4', duration: 2},
    
    // 祝你生日快樂
    {note: 'C4', duration: 0.75}, {note: 'C4', duration: 0.25}, 
    {note: 'C5', duration: 1}, {note: 'A4', duration: 1}, 
    {note: 'F4', duration: 1}, {note: 'E4', duration: 1}, {note: 'D4', duration: 2},
    
    // 祝你生日快樂
    {note: 'B4', duration: 0.75}, {note: 'B4', duration: 0.25}, 
    {note: 'A4', duration: 1}, {note: 'F4', duration: 1}, 
    {note: 'G4', duration: 1}, {note: 'F4', duration: 2}
];

// 創建音頻上下文
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// 播放單個音符
function playNote(frequency, duration) {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    // 音量包絡
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// 播放生日快樂歌
function playHappyBirthday() {
    if (isPlaying) return;
    
    initAudioContext();
    isPlaying = true;
    
    const playButton = document.getElementById('playButton');
    const stopButton = document.getElementById('stopButton');
    const lyricsDiv = document.getElementById('lyrics');
    
    playButton.style.display = 'none';
    stopButton.style.display = 'inline-block';
    
    let currentTime = 0;
    let lyricIndex = 0;
    let noteIndex = 0;
    
    // 播放音符和顯示歌詞的函數
    function playNextNote() {
        if (!isPlaying || noteIndex >= happyBirthdayNotes.length) {
            stopSong();
            return;
        }
        
        const currentNote = happyBirthdayNotes[noteIndex];
        const frequency = notes[currentNote.note];
        const duration = currentNote.duration * 500; // 調整播放速度
        
        // 播放音符
        playNote(frequency, duration / 1000);
        
        // 更新歌詞顯示
        if (noteIndex % 6 === 0 && lyricIndex < lyrics.length) {
            lyricsDiv.textContent = lyrics[lyricIndex];
            lyricsDiv.classList.add('singing');
            lyricIndex++;
        }
        
        noteIndex++;
        currentTimeout = setTimeout(playNextNote, duration);
    }
    
    // 開始播放
    lyricsDiv.textContent = "🎵 開始播放... 🎵";
    lyricsDiv.classList.add('singing');
    
    currentTimeout = setTimeout(() => {
        lyricIndex = 0;
        noteIndex = 0;
        playNextNote();
    }, 500);
}

// 停止播放
function stopSong() {
    isPlaying = false;
    
    if (currentTimeout) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
    }
    
    const playButton = document.getElementById('playButton');
    const stopButton = document.getElementById('stopButton');
    const lyricsDiv = document.getElementById('lyrics');
    
    playButton.style.display = 'inline-block';
    stopButton.style.display = 'none';
    lyricsDiv.textContent = '';
    lyricsDiv.classList.remove('singing');
}

// 添加按鈕事件監聽器
document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.getElementById('playButton');
    const stopButton = document.getElementById('stopButton');
    
    playButton.addEventListener('click', playHappyBirthday);
    stopButton.addEventListener('click', stopSong);
    
    // 添加鍵盤快捷鍵
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            event.preventDefault();
            if (isPlaying) {
                stopSong();
            } else {
                playHappyBirthday();
            }
        }
    });
});

// 添加一些視覺效果
function addConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            confetti.style.animation = 'fall 3s linear forwards';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 100);
    }
}

// 添加下落動畫的CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// 在播放開始時添加彩帶效果
const originalPlayHappyBirthday = playHappyBirthday;
playHappyBirthday = function() {
    addConfetti();
    originalPlayHappyBirthday.call(this);
};