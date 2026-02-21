// 1. Estado inicial del jugador
const defaultState = {
    coins: 100,
    energy: 100,
    level: 1,
    affinity: 0,
    selectedChar: 'marin.glb' // ¡NUEVO! Guarda el personaje actual
};

let playerState = {};

// 2. Cargar datos al iniciar
function loadProgress() {
    const savedData = localStorage.getItem('archinimeUserData');
    if (savedData) {
        playerState = JSON.parse(savedData);
        // Compatibilidad por si es un jugador viejo y no tiene el atributo
        if (!playerState.selectedChar) playerState.selectedChar = 'marin.glb'; 
    } else {
        playerState = { ...defaultState };
        saveProgress();
    }
    
    updateHUD();
    // Cargar el personaje guardado en el visor 3D
    document.getElementById('waifu-placeholder').src = playerState.selectedChar;
}

// 3. Guardar progreso
function saveProgress() {
    localStorage.setItem('archinimeUserData', JSON.stringify(playerState));
}

// 4. Actualizar la interfaz
function updateHUD() {
    document.getElementById('coins-val').innerText = playerState.coins;
    document.getElementById('energy-val').innerText = playerState.energy;
    document.getElementById('level').innerText = `Nivel: ${playerState.level}`;
    document.getElementById('affinity-val').innerText = playerState.affinity;
}

// --- SISTEMA DE SELECCIÓN DE PERSONAJES ---

// Abrir/Cerrar menú
function toggleCharModal(show) {
    const modal = document.getElementById('character-modal');
    if (show) {
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

// Cambiar personaje y guardarlo
function changeCharacter(modelName) {
    const viewer = document.getElementById('waifu-placeholder');
    viewer.src = modelName; // Cambia el archivo 3D
    
    playerState.selectedChar = modelName; // Actualiza el estado
    saveProgress(); // Guarda en localStorage
    
    toggleCharModal(false); // Cierra el menú automáticamente
    
    // Opcional: Pequeña animación/feedback visual
    viewer.style.transform = 'scale(1.05)';
    setTimeout(() => viewer.style.transform = 'scale(1)', 300);
}

// ------------------------------------------

// 5. Interacción básica con el personaje
document.getElementById('waifu-placeholder').addEventListener('click', () => {
    if (playerState.energy >= 5) {
        playerState.affinity += 1;
        playerState.energy -= 5;
        
        // Simulación de pequeña recompensa aleatoria
        if (Math.random() > 0.8) {
            playerState.coins += 10;
            alert("¡El personaje se alegró y encontraste 10 monedas!");
        }
        
        saveProgress();
        updateHUD();
    } else {
        alert("El personaje tiene demasiado sueño para jugar... (Energía insuficiente)");
        // Aquí entraría tu mecánica de recarga o "Minijuego Despertador"
    }
});

// Arrancar el sistema cuando carga la página
window.onload = loadProgress;