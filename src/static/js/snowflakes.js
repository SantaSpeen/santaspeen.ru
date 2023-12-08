document.addEventListener('DOMContentLoaded', function () {
    // Определение типа устройства
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Количество снежинок
    var numberOfSnowflakes = isMobile ? 80 : 150;

    for (var i = 0; i < numberOfSnowflakes; i++) {
        createSnowflake();
    }

    function createSnowflake() {
        var snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        document.body.appendChild(snowflake);

        // Начальные координаты и скорость для каждой снежинки
        var startX = Math.random() * window.innerWidth;
        var startY = -800;
        var speed = Math.random() * 2 + 1;

        snowflake.style.left = startX + 'px';
        snowflake.style.animationDuration = 5 / speed + 's';

        // Запуск анимации снежинки
        snowflake.animate([
            { transform: 'translateY(' + startY + 'px) rotate(0deg)' },
            { transform: 'translateY(' + window.innerHeight + 'px) rotate(360deg)' }
        ], {
            duration: 5000 / speed,
            iterations: Infinity
        });
    }
});
