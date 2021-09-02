const root = document.documentElement;
const gameGridContainer = document.getElementById('gameGridContainer');
const slider = document.getElementById('slider');
const sliderValueText = document.getElementById('sliderValue');
const clearButton = document.getElementById('clearButton');
const eraserButton = document.getElementById('eraserButton');
const blackButton = document.getElementById('blackButton');
const rainbowButton = document.getElementById('rainbowButton');
const greyscaleButton = document.getElementById('greyscaleButton');
const selectColorButton = document.getElementById('selectColorButton');
const selectColorButtonContainer = document.getElementById('selectColorButtonContainer');
let colorMode = 'blackButton';

function makeGrid(gridSize = 16) {
    removeAllChildNodes();
    root.style.setProperty('--grid-size', gridSize);
    for (i = 0; i < (gridSize * gridSize); i++) {
        let cell = document.createElement('div');
        gameGridContainer.appendChild(cell).className = 'grid-cell';
    }
}

function removeAllChildNodes() {
    while (gameGridContainer.firstChild) {
        gameGridContainer.removeChild(gameGridContainer.firstChild);
    }
}

function clearGrid() {
    let cells = document.querySelectorAll('.grid-cell');
    for (i = 0; i < cells.length; i++) {
        cells[i].style.setProperty('background-color', 'transparent');
    }
    clearButton.blur();
}

function fillInGrid(event) {
    pixelColor = getColor();

    if (event.target.className === 'grid-cell') {
        if (colorMode !== 'greyscaleButton') {
            event.target.style.setProperty('filter', 'brightness(1)');
            event.target.style.setProperty('background-color', pixelColor);
        } else {
            let filterValue = event.target.style.filter;
            let brightnessValue;
            if (filterValue === '') {
                brightnessValue = 1.0;
            } else {
                brightnessValue = filterValue.substring(filterValue.indexOf('(') + 1, filterValue.indexOf(')'));
            }
            if (brightnessValue > 0) brightnessValue -= 0.1;
            event.target.style.setProperty('filter', `brightness(${brightnessValue})`);
            event.target.style.setProperty('background-color', pixelColor);
        }
    }
}

function getColor() {
    if (colorMode === 'blackButton') return 'black';
    if (colorMode === 'rainbowButton') return `#${Math.floor(Math.random()*16777215).toString(16)}`;
    if (colorMode === 'eraserButton') return 'transparent';
    if (colorMode === 'selectColorButton') return selectColorButton.value;
    if (colorMode === 'greyscaleButton') return 'var(--screen-color)';
}

function getSliderValue() {
    sliderValueText.innerText = `${slider.value}\u00D7${slider.value}`;
    makeGrid(slider.value);
}

function setButtonBackground() {
    selectColorButtonContainer.style.setProperty('background-color', selectColorButton.value);
}

function setMode(event) {
    colorMode = event.target.id;
    if (colorMode === "selectColorButton") {
        setButtonFocus(selectColorButtonContainer);
        return;
    }
    setButtonFocus(event.target);
}

function setButtonFocus(currentButton) {
    let buttons = document.querySelectorAll('.buttons');
    for (i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('current');
    }
    currentButton.classList.add('current');
}

//SHAKE FOR CLEAR

makeGrid(16);

slider.oninput = getSliderValue;
selectColorButton.onchange = setButtonBackground;

gameGridContainer.addEventListener('mouseover', fillInGrid);
clearButton.addEventListener('click', clearGrid);
eraserButton.addEventListener('click', setMode);
blackButton.addEventListener('click', setMode);
rainbowButton.addEventListener('click', setMode);
greyscaleButton.addEventListener('click', setMode);
selectColorButton.addEventListener('click', setMode);