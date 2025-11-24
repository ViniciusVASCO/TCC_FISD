document.addEventListener("DOMContentLoaded", () => {
    const settings = JSON.parse(localStorage.getItem('newton-app-settings') || '{}');

    // Contraste
    if (settings.highContrast) {
        document.body.classList.add('high-contrast');
        const contrastText = document.getElementById('contrast-text');
        if (contrastText) contrastText.textContent = 'Desativar Alto Contraste';
    }

    // Som
    if (settings.isMuted) {
        // aqui você pode chamar toggleSound() ou aplicar o estado direto
    }

    // Fonte
    if (settings.fontSize && settings.fontSize !== 'normal') {
        // aplicar font size direto, sem chamar toggle functions que invertam
    }
});
