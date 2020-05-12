const canvasSketch = require('canvas-sketch');

const settings = {dimensions: [800, 800]};

// Return random integer, overloaded to also accept randomInt(max)
const randomInt = (min, max) => {
    if (!max && max !== 0) [min, max] = [0, min];
    return Math.floor(Math.random() * (max - min) + min);
};

const randomCell = (a, b) => [randomInt(a), randomInt(b)];

// Todo: Add alpha value
const randomColor = () => {
    const colors = ['#E06C75', '#98C379', '#E5C07B', '#61AFEF'];
    return colors[randomInt(colors.length)];
};

const strokeColor = '#ABB2BF';
const backgroundColor = '#282C34';

const sketch = () => ({ context, width, height }) => {

    // Padding on the left and rigth side of the image
    const horizontalPadding = width / 30;
    // Amount of blocks in each direction
    const blockNumber = 18;
    // Calculate how big a cell is
    const cellSize = (width - horizontalPadding * 2) / blockNumber;
    // Calculate the number of rows
    const rowNumber = Math.floor((height - horizontalPadding * 2) / cellSize);
    // Calculate the top and bottom padding
    const verticalPadding = (height - cellSize * rowNumber) / 2;

    const padding = cellSize / 4;

    const blockSize = cellSize - 2 * padding;

    // How much randomness the blocks have
    const blockOffset = blockSize / 5;

    const randomPoint = (x, y) => {
        x += randomInt(-blockOffset, blockOffset);
        y += randomInt(-blockOffset, blockOffset);
        return [x, y];
    };

    const drawBlock = (x, y, w, h) => {

        // Block
        context.strokeStyle = 'transparent';
        context.fillStyle = randomColor();
        context.beginPath();
        context.lineTo(...randomPoint(x, y));
        context.lineTo(...randomPoint(x + w, y));
        context.lineTo(...randomPoint(x + w, y + h));
        context.lineTo(...randomPoint(x, y + h));
        context.closePath();
        context.fill();

        // Border
        context.strokeStyle = strokeColor;
        context.beginPath();
        context.lineTo(...randomPoint(x, y));
        context.lineTo(...randomPoint(x + w, y));
        context.lineTo(...randomPoint(x + w, y + h));
        context.lineTo(...randomPoint(x, y + h));
        context.closePath();
        context.stroke();
    };

    const strokeSize = blockSize / 6;

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);

    context.lineWidth = strokeSize;

    const cells = Array(blockNumber).fill()
        .map(() => Array(blockNumber).fill(false));

    for (let row = 0; row < rowNumber; row++) {
        for (let col = 0; col < blockNumber; col++) {
            if (Math.random() < 0.2) {
                const [i, j] = randomCell(rowNumber - 1, blockNumber - 1);
                if (!cells[i][j] && !cells[i + 1][j] && !cells[i][j + 1] && !cells[i + 1][j + 1]) {
                    const y = i * cellSize + padding + verticalPadding;
                    const x = j * cellSize + padding + horizontalPadding;
                    drawBlock(x, y, blockSize * 2 + 2 * padding, blockSize * 2 + 2 * padding);
                    [cells[i][j], cells[i + 1][j], cells[i][j + 1], cells[i + 1][j + 1]] = [true, true, true, true];
                }
            }
            if (Math.random() < 0.3) {
                const [i, j] = randomCell(rowNumber, blockNumber - 1);
                if (!cells[i][j] && !cells[i][j + 1]) {
                    const y = i * cellSize + padding + verticalPadding;
                    const x = j * cellSize + padding + horizontalPadding;
                    drawBlock(x, y, blockSize * 2 + 2 * padding, blockSize);
                    [cells[i][j], cells[i][j + 1]] = [true, true];
                }
            }
            if (Math.random() < 0.3) {
                const [i, j] = randomCell(rowNumber - 1, blockNumber);
                if (!cells[i][j] && !cells[i + 1][j]) {
                    const y = i * cellSize + padding + verticalPadding;
                    const x = j * cellSize + padding + horizontalPadding;
                    drawBlock(x, y, blockSize, blockSize * 2 + 2 * padding);
                    [cells[i][j], cells[i + 1][j]] = [true, true];
                }
            }
        }
    }

    for (let row = 0; row < rowNumber; row++) {
        for (let col = 0; col < blockNumber; col++) {
            if (!cells[row][col]) {
                const y = row * cellSize + padding + verticalPadding;
                const x = col * cellSize + padding + horizontalPadding;
                drawBlock(x, y, blockSize, blockSize);
            }
        }
    }

};

canvasSketch(sketch, settings);