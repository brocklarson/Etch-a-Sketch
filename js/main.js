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
let colorState = 'black';

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

function getSliderValue() {
    sliderValueText.innerText = `${slider.value} \u00D7 ${slider.value}`;
    makeGrid(slider.value);
}

function fillInGrid(event) {
    pixelColor = getColor(event);
    event.target.style.setProperty('background-color', pixelColor);
}

function getColor(event) {
    if (colorState === 'black') return 'black';
    if (colorState === 'rainbow') return `#${Math.floor(Math.random()*16777215).toString(16)}`;
    if (colorState === 'eraser') return 'transparent';
    if (colorState === 'color') return selectColorButton.value;
    if (colorState === 'greyscale') {
        let filterValue = event.target.style.filter;
        let brightnessValue;
        if (filterValue === '') {
            brightnessValue = 1.0;
        } else {
            brightnessValue = filterValue.substring(filterValue.indexOf('(') + 1, filterValue.indexOf(')'));
        }
        if (brightnessValue > 0) brightnessValue -= 0.1;
        event.target.style.filter = `brightness(${brightnessValue})`;
        return 'var(--screen-color)';
    }
}

function clearGrid() {
    let cells = document.querySelectorAll('.grid-cell');
    for (i = 0; i < cells.length; i++) {
        cells[i].style.setProperty('background-color', 'transparent');
    }
}
//DONT FILL IN GRID WHEN USING COLOR PICKER//
//commit changes!!!//
makeGrid(16);

slider.oninput = getSliderValue;
gameGridContainer.addEventListener('mouseover', fillInGrid);
clearButton.addEventListener('click', clearGrid);
eraserButton.addEventListener('click', () => { colorState = 'eraser' });
blackButton.addEventListener('click', () => { colorState = 'black' });
rainbowButton.addEventListener('click', () => { colorState = 'rainbow' });
greyscaleButton.addEventListener('click', () => { colorState = 'greyscale' });
selectColorButton.addEventListener('click', () => { colorState = 'color' });



/*
//OBJECTIVE: Create Etch-A-Sketch that "colors in" when mouse hovers over
//HIGH LEVEL FEATURES:
    1) Choose pixel size (slider)
    2) Clear Screen [Shake Tablet] (Button)

    3) Select color (Button)
        3a) Color Display window
    4) Select black (Button)
    5) Rainbow mode (Button)
    6) Grey scale mode (Button)
    



    

*/