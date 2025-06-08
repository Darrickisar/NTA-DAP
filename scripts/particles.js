// 初始化粒子背景
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 120 },
            color: { value: ["#40e0d0", "#a0d2ff", "#ff9a76"] },
            shape: { type: "circle" },
            opacity: { value: 0.7, random: true },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#a0d2ff",
                opacity: 0.3,
                width: 1
            },
            move: {
                enable: true,
                speed: 1.5,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 1 } },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });
}

// 在页面加载完成后初始化粒子
window.addEventListener('DOMContentLoaded', initParticles);