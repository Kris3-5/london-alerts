const buttons = document.querySelectorAll('.filter-btn');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    const sections = document.querySelectorAll('.alert-section');
    sections.forEach(sec => {
      if (target === 'all') sec.style.display = 'block';
      else if (sec.id.startsWith(target)) sec.style.display = 'block';
      else sec.style.display = 'none';
    });
  });
});
