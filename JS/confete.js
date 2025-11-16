function soltarConfetes() {
  const confettiCount = 150;
  const colors = ['#bb0000', '#ffffff', '#00bb00', '#0000bb', '#ffdd00', '#00dddd', '#dd00dd'];

  for (let i = 0; i < confettiCount; i++) {
    const confetto = document.createElement('div');
    confetto.style.position = 'fixed';
    confetto.style.width = '8px';
    confetto.style.height = '8px';
    confetto.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetto.style.top = '-10px';
    confetto.style.left = Math.random() * window.innerWidth + 'px';
    confetto.style.opacity = Math.random();
    confetto.style.borderRadius = '50%';
    confetto.style.zIndex = '9999';
    confetto.style.pointerEvents = 'none';
    document.body.appendChild(confetto);

    const animationDuration = Math.random() * 3 + 2; // 2-5s
    const endX = Math.random() * 200 - 100;
    const endY = window.innerHeight + 20;

    confetto.animate([
      { transform: 'translate(0,0)', opacity: 1 },
      { transform: `translate(${endX}px, ${endY}px)`, opacity: 0 }
    ], { duration: animationDuration * 1000, easing: 'ease-out' });

    setTimeout(() => confetto.remove(), animationDuration * 1000);
  }
}
