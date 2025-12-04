document.addEventListener('DOMContentLoaded', () => {
  // Load saved favorites from localStorage
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  
  // Apply saved favorites on page load
  favorites.forEach(id => {
    const btn = document.querySelector(`[data-project-id="${id}"]`);
    if (btn) {
      btn.querySelector('i').classList.replace('far', 'fas');
      btn.style.background = 'rgba(220, 53, 69, 0.8)'; // Red background
    }
  });
  
  // Add click handlers to all favorite buttons
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // Stop card link from triggering
      e.stopPropagation(); // Stop click from bubbling up
      
      const projectId = btn.dataset.projectId;
      const icon = btn.querySelector('i');
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      if (icon.classList.contains('far')) {
        // Add to favorites
        icon.classList.replace('far', 'fas');
        btn.style.background = 'rgba(220, 53, 69, 0.8)';
        favorites.push(projectId);
      } else {
        // Remove from favorites
        icon.classList.replace('fas', 'far');
        btn.style.background = 'rgba(0,0,0,0.5)';
        const index = favorites.indexOf(projectId);
        if (index > -1) favorites.splice(index, 1);
      }
      
      localStorage.setItem('favorites', JSON.stringify(favorites));
    });
  });
});
  