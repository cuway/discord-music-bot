let demoVolume = 50;
let prevDemoVolume = 50;
let ytPlayer = null;
let isYtPlaying = false;
let currentSongIndex = 0;

const demoSongs = [
  { id: 'SlQR9iu09bQ', title: 'SON TUNG M-TP x TYGA | COME MY WAY | OFFICIAL MUSIC VIDEO', artist: 'Kênh: Sơn Tùng M-TP Official • Thời lượng: 03:55 • Dev bởi @cuway98' },
  { id: '8mZqQ0m9m6g', title: 'Sơn Tùng M-TP - ĐỪNG LÀM TRÁI TIM ANH ĐAU', artist: 'Kênh: Sơn Tùng M-TP Official • Thời lượng: 05:12' },
  { id: 'abPmZCZZrGQ', title: 'BINZ - HIT ME UP (ft. NOMOVODKA) | OFFICIAL MV', artist: 'Kênh: SpaceSpeakers • Thời lượng: 05:36' }
];

function onYouTubeIframeAPIReady() {
  try {
    ytPlayer = new YT.Player('yt-iframe-player', {
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  } catch (e) {
    console.log('YouTube iFrame API init:', e);
  }
}

function onPlayerReady(event) {
  if (event && event.target) {
    try { event.target.setVolume(demoVolume); } catch (e) {}
  }
}

function onPlayerStateChange(event) {
  const disc = document.getElementById('demo-disc');
  const playIcon = document.getElementById('play-icon');
  const heroPlayIcon = document.getElementById('hero-play-icon');
  const playText = document.getElementById('play-text');

  if (window.YT && event.data === YT.PlayerState.PLAYING) {
    isYtPlaying = true;
    if (disc) disc.classList.add('spinning');
    if (playIcon) playIcon.className = 'fa-solid fa-pause';
    if (heroPlayIcon) heroPlayIcon.className = 'fa-solid fa-pause';
    if (playText) playText.innerText = 'Tạm Dừng Live';
    updateDemoUI('▶️ Đang phát trực tiếp bài COME MY WAY (Sơn Tùng M-TP x TYGA) từ YouTube!');
  } else {
    isYtPlaying = false;
    if (disc) disc.classList.remove('spinning');
    if (playIcon) playIcon.className = 'fa-solid fa-play';
    if (heroPlayIcon) heroPlayIcon.className = 'fa-solid fa-play';
    if (playText) playText.innerText = 'Phát Live Nhạc';
  }
}

function toggleYtPlay() {
  if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
    if (isYtPlaying) {
      ytPlayer.pauseVideo();
    } else {
      ytPlayer.playVideo();
    }
  } else {
    const disc = document.getElementById('demo-disc');
    const iframe = document.getElementById('yt-iframe-player');
    if (iframe) {
      iframe.src = "https://www.youtube.com/embed/SlQR9iu09bQ?enablejsapi=1&autoplay=1";
    }
    isYtPlaying = true;
    if (disc) disc.classList.add('spinning');
    updateDemoUI('▶️ Đã bật trình phát nhạc trực tiếp trên video YouTube!');
  }
}

function stopYtPlay() {
  if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
    ytPlayer.stopVideo();
  } else {
    const iframe = document.getElementById('yt-iframe-player');
    if (iframe) {
      iframe.src = "https://www.youtube.com/embed/SlQR9iu09bQ?enablejsapi=1&autoplay=0";
    }
  }
  const disc = document.getElementById('demo-disc');
  if (disc) disc.classList.remove('spinning');
  isYtPlaying = false;
  updateDemoUI('⏹️ Đã dừng phát nhạc hoàn toàn.');
}

function changeDemoVol(delta) {
  demoVolume = Math.min(100, Math.max(0, demoVolume + delta));
  if (demoVolume > 0) prevDemoVolume = demoVolume;

  if (ytPlayer && typeof ytPlayer.setVolume === 'function') {
    ytPlayer.setVolume(demoVolume);
    if (demoVolume > 0 && typeof ytPlayer.isMuted === 'function' && ytPlayer.isMuted()) {
      ytPlayer.unMute();
    }
  }

  updateDemoUI(`🔉 Đã thay đổi âm lượng Live YouTube thành ${demoVolume}%`);
}

function toggleDemoMute() {
  if (demoVolume > 0) {
    prevDemoVolume = demoVolume;
    demoVolume = 0;
    if (ytPlayer && typeof ytPlayer.mute === 'function') ytPlayer.mute();
    updateDemoUI('🔇 Đã tắt tiếng YouTube (0%)');
  } else {
    demoVolume = prevDemoVolume || 50;
    if (ytPlayer && typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
    if (ytPlayer && typeof ytPlayer.setVolume === 'function') ytPlayer.setVolume(demoVolume);
    updateDemoUI(`🔊 Đã bật lại tiếng YouTube (${demoVolume}%)`);
  }
}

function nextDemoSong() {
  currentSongIndex = (currentSongIndex + 1) % demoSongs.length;
  const song = demoSongs[currentSongIndex];
  document.getElementById('demo-song-title').innerText = song.title;
  document.getElementById('demo-artist').innerText = song.artist;

  const iframe = document.getElementById('yt-iframe-player');
  if (iframe) {
    iframe.src = `https://www.youtube.com/embed/${song.id}?enablejsapi=1&autoplay=1`;
  }
  updateDemoUI(`⏭️ Đã chuyển bài: ${song.title}`);
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
