const root = document.documentElement;
const gameContainer = document.getElementById('gameContainer');
const gameGridContainer = document.getElementById('gameGridContainer');
const gameGridOverlay = document.getElementById('gameGridShadow');
const slider = document.getElementById('slider');
const bubble = document.getElementById('bubble');
const clearButton = document.getElementById('clearButton');
const eraserButton = document.getElementById('eraserButton');
const blackButton = document.getElementById('blackButton');
const rainbowButton = document.getElementById('rainbowButton');
const greyscaleButton = document.getElementById('greyscaleButton');
const selectColorButton = document.getElementById('selectColorButton');
const selectColorButtonContainer = document.getElementById('selectColorButtonContainer');
let colorMode = 'blackButton';

function makeGrid(gridSize = 16) {
    removeAllGridCells();
    root.style.setProperty('--grid-size', gridSize);
    for (i = 0; i < (gridSize * gridSize); i++) {
        let cell = document.createElement('div');
        gameGridContainer.appendChild(cell).className = 'grid-cell';
    }
}

function removeAllGridCells() {
    while (gameGridContainer.firstChild) {
        gameGridContainer.removeChild(gameGridContainer.firstChild);
    }
}

function clearGrid() {
    //So the clear button doesn't remain in focus on click
    clearButton.blur();

    gameContainer.classList.add('shake-horizontal');
    gameContainer.addEventListener('animationend', function() {
        gameContainer.classList.remove('shake-horizontal');
    });

    //Use an overlay div for fade animation rather than individually fading each cell 
    gameGridOverlay.classList.add('color-fade');
    gameGridOverlay.addEventListener('animationend', function() {
        makeGrid(slider.value);
        gameGridOverlay.classList.remove('color-fade');
    });
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
    setSliderBubblePosition(slider, bubble);
    makeGrid(slider.value);
}

function setSliderBubblePosition(slider, bubble) {
    const val = slider.value;
    const min = slider.min ? slider.min : 2;
    const max = slider.max ? slider.max : 60;
    const newVal = Number(((val - min) * 100) / (max - min));
    bubble.innerText = slider.value;
    bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
}

function setColorButtonBackground() {
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

//Keeps button focused even after clicking the clear button
function setButtonFocus(currentButton) {
    let buttons = document.querySelectorAll('.buttons');
    for (i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('current');
    }
    currentButton.classList.add('current');
}

makeGrid(16);
setSliderBubblePosition(slider, bubble);

slider.oninput = getSliderValue;
selectColorButton.onchange = setColorButtonBackground;

gameGridContainer.addEventListener('mouseover', fillInGrid);
clearButton.addEventListener('click', clearGrid);
eraserButton.addEventListener('click', setMode);
blackButton.addEventListener('click', setMode);
rainbowButton.addEventListener('click', setMode);
greyscaleButton.addEventListener('click', setMode);
selectColorButton.addEventListener('click', setMode);