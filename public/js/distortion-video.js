// Minimal autoplay for Distortion video
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('distortion-video');
    if (video) {
        video.play().catch(e => console.log('Autoplay prevented:', e));
    }
});
