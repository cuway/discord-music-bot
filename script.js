let demoVolume = 50;
let prevDemoVolume = 50;
let isAudioPlaying = false;
let currentSongIndex = 0;

const demoSongs = [
  { title: 'Sơn Tùng M-TP - Come My Way (Live Stream Web Test)', artist: 'Ca sĩ: Sơn Tùng M-TP • Tối ưu âm thanh bởi @cuway98' },
  { title: 'Sơn Tùng M-TP - ĐỪNG LÀM TRÁI TIM ANH ĐAU', artist: 'Kênh: Sơn Tùng M-TP Official • Thời lượng: 05:12' },
  { title: 'BINZ - HIT ME UP (ft. NOMOVODKA) | OFFICIAL MV', artist: 'Kênh: SpaceSpeakers • Thời lượng: 05:36' }
];

const audioPlayer = document.getElementById('web-audio-player');

function toggleWebAudio() {
  const audio = document.getElementById('web-audio-player');
  const playIcon = document.getElementById('play-icon');
  const heroPlayIcon = document.getElementById('hero-play-icon');
  const playText = document.getElementById('play-text');
  const disc = document.getElementById('demo-disc');

  if (!audio) return;

  if (audio.paused) {
    audio.volume = demoVolume / 100;
    audio.play().then(() => {
      isAudioPlaying = true;
      if (playIcon) playIcon.className = 'fa-solid fa-pause';
      if (heroPlayIcon) heroPlayIcon.className = 'fa-solid fa-pause';
      if (playText) playText.innerText = 'Tạm Dừng Live';
      if (disc) disc.classList.add('spinning');
      updateDemoUI('▶️ Đang phát trực tiếp bài "Come My Way" của Sơn Tùng M-TP trên Web!');
    }).catch(err => {
      console.log('Autoplay error:', err);
      // Fallback simulation if browser blocks autoplay without user interaction
      isAudioPlaying = true;
      if (playIcon) playIcon.className = 'fa-solid fa-pause';
      if (playText) playText.innerText = 'Tạm Dừng Live';
      if (disc) disc.classList.add('spinning');
      updateDemoUI('▶️ Đã bật trình phát nhạc trực tiếp trên Web!');
    });
  } else {
    audio.pause();
    isAudioPlaying = false;
    if (playIcon) playIcon.className = 'fa-solid fa-play';
    if (heroPlayIcon) heroPlayIcon.className = 'fa-solid fa-play';
    if (playText) playText.innerText = 'Phát Live Nhạc';
    if (disc) disc.classList.remove('spinning');
    updateDemoUI('⏸️ Đã tạm dừng phát nhạc trên Web!');
  }
}

function stopWebAudio() {
  const audio = document.getElementById('web-audio-player');
  const playIcon = document.getElementById('play-icon');
  const playText = document.getElementById('play-text');
  const disc = document.getElementById('demo-disc');

  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  isAudioPlaying = false;
  if (playIcon) playIcon.className = 'fa-solid fa-play';
  if (playText) playText.innerText = 'Phát Live Nhạc';
  if (disc) disc.classList.remove('spinning');
  updateDemoUI('⏹️ Đã dừng phát nhạc hoàn toàn!');
}

function changeDemoVol(delta) {
  demoVolume = Math.min(100, Math.max(0, demoVolume + delta));
  if (demoVolume > 0) prevDemoVolume = demoVolume;

  const audio = document.getElementById('web-audio-player');
  if (audio) {
    audio.volume = demoVolume / 100;
  }

  updateDemoUI(`🔉 Đã thay đổi âm lượng Live Web thành ${demoVolume}%`);
}

function toggleDemoMute() {
  const audio = document.getElementById('web-audio-player');

  if (demoVolume > 0) {
    prevDemoVolume = demoVolume;
    demoVolume = 0;
    if (audio) audio.volume = 0;
    updateDemoUI('🔇 Đã tắt tiếng Web (0%)');
  } else {
    demoVolume = prevDemoVolume || 50;
    if (audio) audio.volume = demoVolume / 100;
    updateDemoUI(`🔊 Đã bật lại tiếng Web (${demoVolume}%)`);
  }
}

function nextDemoSong() {
  currentSongIndex = (currentSongIndex + 1) % demoSongs.length;
  const song = demoSongs[currentSongIndex];
  document.getElementById('demo-song-title').innerText = song.title;
  document.getElementById('demo-artist').innerText = song.artist;
  updateDemoUI(`⏭️ Đã chuyển sang bài: ${song.title}`);
}

function showQueueInfo() {
  updateDemoUI('📜 Hàng đợi hiện tại: 3 bài hát đang chờ (Yêu cầu bởi @cuway98)');
}

function updateDemoUI(feedbackText) {
  const volFill = document.getElementById('vol-fill');
  const volText = document.getElementById('vol-percent-text');
  const demoVolText = document.getElementById('demo-vol-text');
  const volIcon = document.getElementById('vol-status-icon');
  const feedback = document.getElementById('demo-feedback');

  if (volFill) volFill.style.width = `${demoVolume}%`;
  if (volText) volText.innerText = `${demoVolume}%`;
  if (demoVolText) demoVolText.innerText = `${demoVolume}%`;

  if (volIcon) {
    if (demoVolume === 0) volIcon.className = 'fa-solid fa-volume-xmark';
    else if (demoVolume < 40) volIcon.className = 'fa-solid fa-volume-low';
    else volIcon.className = 'fa-solid fa-volume-high';
  }

  if (feedback && feedbackText) {
    feedback.innerText = feedbackText;
  }
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Đã sao chép "${text}" vào bộ nhớ tạm!`);
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
}

function filterCommands() {
  const input = document.getElementById('command-search-input').value.toLowerCase();
  const cards = document.querySelectorAll('.command-card');

  cards.forEach(card => {
    const cmdName = card.getAttribute('data-cmd').toLowerCase();
    const desc = card.querySelector('.cmd-desc').innerText.toLowerCase();
    if (cmdName.includes(input) || desc.includes(input)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}
