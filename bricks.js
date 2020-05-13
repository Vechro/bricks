const canvasSketch = require('canvas-sketch');
const rough = require('roughjs/bundled/rough.cjs');

const settings = {dimensions: [1000, 1000]};

// Return random integer, overloaded to also accept randomInt(max)
const randomInt = (min, max) => {
    if (!max && max !== 0) [min, max] = [0, min];
    return Math.floor(Math.random() * (max - min) + min);
};

const randomCell = (a, b) => [randomInt(a), randomInt(b)];

// Todo: Add alpha value
const randomColor = () => {
    // [`hsl(355, ${65 + randomInt(-5, 6)}%, ${65 + randomInt(-5, 6)}%)`, `hsl(184, ${20 + randomInt(-5, 6)}%, ${54 + randomInt(-5, 6)}%)`, `hsl(69, ${28 + randomInt(-5, 6)}%, ${64 + randomInt(-5, 6)}%)`, `hsl(32, ${52 + randomInt(-5, 6)}%, ${74 + randomInt(-5, 6)}%)`];
    const colors = [
        'hsl(355, 65%, 65%)',
        'hsl(184, 20%, 54%)',
        'hsl(69, 28%, 64%)',
        'hsl(32, 52%, 74%)'
    ];
    return colors[randomInt(colors.length)];
};
const drawSpots = (context, size) => {
    context.save();
    context.fillStyle = `rgba(0, 0, 0, 0.0${randomInt(1, 7)})`;

    const nrOfSpots = size * size / 2;
    for (let i = 0; i < nrOfSpots; i++) {
        const x = Math.random() * size - size / 2;
        const y = Math.random() * size - size / 2;
        context.fillRect(x, y, Math.random() + 0.35, Math.random() + 0.35);
    }
    context.restore();
};

const strokeColor = '#555';
const backgroundColor = '#efefef';

const sketch = () => ({ context, width, height }) => {
    const roughCanvas = rough.canvas(context.canvas);

    // Padding on the left and rigth side of the image
    const horizontalPadding = width / 24;
    // Amount of blocks in both directions
    const blockNumber = 16;
    // Calculate how big a cell is
    const cellSize = (width - horizontalPadding * 2) / blockNumber;
    // Calculate the number of rows
    const rowNumber = Math.floor((height - horizontalPadding * 2) / cellSize);
    // Calculate the top and bottom padding
    const verticalPadding = (height - cellSize * rowNumber) / 2;

    const padding = cellSize / 5;

    const blockSize = cellSize - 2 * padding;

    // How much randomness the blocks have
    const blockOffset = blockSize / 5;

    const strokeSize = blockSize / 6;

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
        roughCanvas.polygon(
            [
                randomPoint(x, y),
                randomPoint(x + w, y),
                randomPoint(x + w, y + h),
                randomPoint(x, y + h)
            ],
            {stroke: strokeColor, strokeWidth: strokeSize, bowing: 6}
        );
    };

    const drawCircle = (x, y, r) => {

        // Block
        context.strokeStyle = 'transparent';
        context.fillStyle = randomColor();
        context.beginPath();
        context.ellipse(...randomPoint(x + r, y + r), r, r, 0, 0, 2 * Math.PI);
        context.closePath();
        context.fill();

        // Border
        roughCanvas.circle(
            ...randomPoint(x + r, y + r), r * 2,
            {stroke: strokeColor, strokeWidth: strokeSize, bowing: 6}
        );
    };

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);

    context.lineWidth = strokeSize;

    const cells = Array(blockNumber).fill()
        .map(() => Array(blockNumber).fill(false));

    for (let row = 0; row < rowNumber; row++) {
        for (let col = 0; col < blockNumber; col++) {
            // 2x2 rect
            if (Math.random() < 0.25) {
                const [i, j] = randomCell(rowNumber - 1, blockNumber - 1);
                if (!cells[i][j] && !cells[i + 1][j] && !cells[i][j + 1] && !cells[i + 1][j + 1]) {
                    const y = i * cellSize + padding + verticalPadding;
                    const x = j * cellSize + padding + horizontalPadding;
                    drawBlock(x, y, blockSize * 2 + 2 * padding, blockSize * 2 + 2 * padding);
                    [
                        cells[i][j],
                        cells[i + 1][j],
                        cells[i][j + 1],
                        cells[i + 1][j + 1]
                    ] = [
                        true,
                        true,
                        true,
                        true
                    ];
                }
            }
            // 2x1 rect
            if (Math.random() < 0.33) {
                const [i, j] = randomCell(rowNumber, blockNumber - 1);
                if (!cells[i][j] && !cells[i][j + 1]) {
                    const y = i * cellSize + padding + verticalPadding;
                    const x = j * cellSize + padding + horizontalPadding;
                    drawBlock(x, y, blockSize * 2 + 2 * padding, blockSize);
                    [cells[i][j], cells[i][j + 1]] = [true, true];
                }
            }
            // 1x2 rect
            if (Math.random() < 0.33) {
                const [i, j] = randomCell(rowNumber - 1, blockNumber);
                if (!cells[i][j] && !cells[i + 1][j]) {
                    const y = i * cellSize + padding + verticalPadding;
                    const x = j * cellSize + padding + horizontalPadding;
                    drawBlock(x, y, blockSize, blockSize * 2 + 2 * padding);
                    [cells[i][j], cells[i + 1][j]] = [true, true];
                }
            }
            // 2x2 circle
            if (Math.random() < 0.25) {
                const [i, j] = randomCell(rowNumber - 1, blockNumber - 1);
                if (!cells[i][j] && !cells[i + 1][j] && !cells[i][j + 1] && !cells[i + 1][j + 1]) {
                    const y = i * cellSize + padding + verticalPadding;
                    const x = j * cellSize + padding + horizontalPadding;
                    drawCircle(x, y, blockSize + padding);
                    [
                        cells[i][j],
                        cells[i + 1][j],
                        cells[i][j + 1],
                        cells[i + 1][j + 1]
                    ] = [
                        true,
                        true,
                        true,
                        true
                    ];
                }
            }
        }
    }

    for (let row = 0; row < rowNumber; row++) {
        for (let col = 0; col < blockNumber; col++) {
            if (!cells[row][col]) {
                if (Math.random() < 0.5) {
                    // 1x1 rect
                    const y = row * cellSize + padding + verticalPadding;
                    const x = col * cellSize + padding + horizontalPadding;
                    drawBlock(x, y, blockSize, blockSize);
                } else {
                    // 1x1 circle
                    const y = row * cellSize + padding + verticalPadding;
                    const x = col * cellSize + padding + horizontalPadding;
                    drawCircle(x, y, blockSize / 2);
                }
            }
        }
    }

    drawSpots(context, width + height);

};

canvasSketch(sketch, settings);