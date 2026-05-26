let rotSlider, thrustBtn;
let rotSliderValue = 0;
let thrustBtnDown  = false;

function initControls() {
    rotSlider = document.getElementById('rotSlider');
    thrustBtn = document.getElementById('thrustBtn');

    rotSlider.addEventListener('input', () => {
        rotSliderValue = parseInt(rotSlider.value, 10);
    });

    const snapSlider = () => {
        rotSliderValue = 0;
        rotSlider.value = 0;
    };
    rotSlider.addEventListener('pointerup',     snapSlider);
    rotSlider.addEventListener('pointerleave',  snapSlider);
    rotSlider.addEventListener('pointercancel', snapSlider);

    thrustBtn.addEventListener('pointerdown', e => {
        e.preventDefault();
        if (isGameOver && isPaused) { resetGame(); return; }
        thrustBtnDown = true;
        thrustBtn.classList.add('active');
    });

    const stopThrust = () => {
        thrustBtnDown = false;
        thrustBtn.classList.remove('active');
    };
    thrustBtn.addEventListener('pointerup',     stopThrust);
    thrustBtn.addEventListener('pointerleave',  stopThrust);
    thrustBtn.addEventListener('pointercancel', stopThrust);
}

// Called each frame before handleMovement() — merges slider/button state into game flags
function applyOnScreenControls() {
    if (rotSliderValue < -15) rotatingLeft  = true;
    if (rotSliderValue >  15) rotatingRight = true;
    if (thrustBtnDown)        accelerating  = true;
}

// Called on respawn to snap controls back to neutral
function resetControls() {
    rotSliderValue = 0;
    thrustBtnDown  = false;
    if (rotSlider) rotSlider.value = 0;
    if (thrustBtn) thrustBtn.classList.remove('active');
}
