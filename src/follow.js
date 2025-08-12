document.addEventListener("mousemove", (e) => {
    const boxes = document.querySelectorAll('.follow-box');

    boxes.forEach((box) => {
        const rect = box.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        const rotateY = deltaX / 10; // eixo Y = gira pros lados
        const rotateX = -deltaY / 20; // eixo X = gira pra cima/baixo

        // se for a da direita, inverte a rotação horizontal
        const adjustedRotateY = box.classList.contains("") ? -rotateY : rotateY;

        box.style.transform = `
        translateY(-50%)
        perspective(600px)
        rotateX(${rotateX}deg)
        rotateY(${adjustedRotateY}deg)
    `;
    });
});
