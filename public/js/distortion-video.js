// Video and Audio control for Distortion project
let backgroundAudio = null;
let isAudioPlaying = false;
let video = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    video = document.getElementById('distortion-video');
    
    // Create audio element for background music
    backgroundAudio = new Audio('/audio/Poetry Love.mp3');
    backgroundAudio.loop = true;
    
    updateStatus('Video playing - Click Play Audio to start music');
    
    // Auto-play video (muted by default for autoplay policy)
    if (video) {
        video.play().catch(e => {
            console.log('Autoplay prevented:', e);
            updateStatus('Click anywhere to start video');
        });
    }
});

// Toggle background audio
function toggleAudio() {
    if (!backgroundAudio) return;
    
    if (isAudioPlaying) {
        backgroundAudio.pause();
        isAudioPlaying = false;
        document.getElementById('playAudioBtn').innerHTML = '<i class="fas fa-volume-up"></i> Play Audio';
        document.getElementById('playAudioBtn').style.display = 'flex';
        document.getElementById('pauseAudioBtn').style.display = 'none';
        updateStatus('Audio paused');
    } else {
        backgroundAudio.play().catch(e => console.log('Audio play error:', e));
        isAudioPlaying = true;
        document.getElementById('playAudioBtn').style.display = 'none';
        document.getElementById('pauseAudioBtn').innerHTML = '<i class="fas fa-volume-mute"></i> Mute Audio';
        document.getElementById('pauseAudioBtn').style.display = 'flex';
        updateStatus('Audio playing');
    }
}

// Pause audio
function pauseAudio() {
    if (!backgroundAudio) return;
    backgroundAudio.pause();
    isAudioPlaying = false;
    document.getElementById('playAudioBtn').style.display = 'flex';
    document.getElementById('pauseAudioBtn').style.display = 'none';
    updateStatus('Audio paused');
}

// Toggle video sound (mute/unmute)
function toggleVideoSound() {
    if (!video) return;
    
    video.muted = !video.muted;
    const btn = document.getElementById('muteVideoBtn');
    
    if (video.muted) {
        btn.innerHTML = '<i class="fas fa-volume-off"></i> Video Sound';
        updateStatus('Video muted');
    } else {
        btn.innerHTML = '<i class="fas fa-volume-up"></i> Video Sound';
        updateStatus('Video sound on');
    }
}

// Update status message
function updateStatus(msg) {
    const statusEl = document.getElementById('status');
    if (statusEl) {
        statusEl.textContent = msg;
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (backgroundAudio) {
        backgroundAudio.pause();
        backgroundAudio = null;
    }
});
