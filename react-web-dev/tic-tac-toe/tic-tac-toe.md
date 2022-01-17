<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>/f0c1s/blog/react-web-dev/tic-tac-toe</title>
    <link rel="stylesheet" href="../../index.css"/>
    <link rel="stylesheet" href="../../highlight/styles/monokai.min.css"/>
    <script src="../../setup.js"></script>
    <script src="../../highlight/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>
</head>

<body onload="setup()">
<h1>/f0c1s/blog/react-web-dev/tic-tac-toe</h1>
<nav>
    <a href="../../index.html">/blog</a>
    <a href="../../react-web-dev/index.html">react web dev</a>
    <a href="../../react-web-dev/tic-tac-toe/tic-tac-toe.html">+ tic tac toe in React</a>
</nav>

```shell
yarn create react-app tic-tac-toe --template typescript
```

## Basic setup

### App.css

```css
.App {
    padding: 1vh 1vw;
}

h1 {
    padding: .6vh 0;
    font-size: 48px;
}
```

### App.tsx

```typescript
import React from 'react';
import './App.css';
import Game from "./features/game/Game";

function App() {
    return (
        <div className="App">
            <h1>Tic Tac Toe</h1>
            <Game/>
        </div>
    );
}

export default App;

```

### Game.tsx

```typescript
import React from "react";
import "./game.css";

export default function Game() {
    return <div className={"game"}>Game</div>;
}

```

### game.css

```css
.game {
    padding: 1vh 1vw;
    border: thin solid grey;
    min-height: 30vw;
}
```

And there is a reset.css added to public/index.html

![0.project-structure](0.project-structure.png)

![1.running-app](1.running-app.png)

## Basic grid

### grid.css

```css
.grid {
    width: 30vw;
    padding: 1vh 1vw;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1vh;
}

.grid-cell {
    width: 10vw;
    height: 10vh;
    border: thin solid grey;
    cursor: pointer;
}

.grid-cell:hover {
    box-shadow: 0 0 2px black;
}
```

### Grid.tsx

```typescript
import React from "react"
import "./grid.css"

interface GridProps {
    rows: number;
    cols: number;
}

export default function Grid({rows, cols}: GridProps) {
    const grid = Array(rows)
        .fill(0)
        .map((_, r) =>
            Array(cols)
                .fill(0)
                .map((_, c) => <div className={"grid-cell"} key={`grid-cell-${r}-${c}`}>&nbsp;</div> )
        )

    return (
        <div className={"grid"}>
            {grid}
        </div>
    )
}

```

### game.css

```css
.game {
    /*padding: 1vh 1vw;*/
    /*border: thin solid silver;*/
    /*min-height: 30vw;*/
}
```

### Game.tsx

```typescript
import React from "react";
import "./game.css";
import Grid from "../grid/Grid";

export default function Game() {
    return <div className={"game"}>
        <Grid rows={3} cols={3}/>
    </div>;
}

```

![2.basic-grid](2.basic-grid.png)

![3.design-so-far](3.design-so-far.png)

## Cell

### cell.css

```css
.cell {
    line-height: 10vh;
    text-align: center;
    font-size: 56px;
    user-select: none;
    cursor: initial;
    width: inherit;
    height: inherit;
}

.cell-empty {
    cursor: pointer;
}

.cell-empty:hover {
    box-shadow: 0 0 2px black;
}

.cell-X {
    color: red;
}

.cell-O {
    color: blue;
}
```

### Cell.tsx

```typescript
import React from "react";
import "./cell.css"

export enum CellRenderOptions {
    empty = 0,
    X = 1,
    O = 2
}

export interface CellProps {
    render: CellRenderOptions;
}

export default function Cell({render}: CellProps) {
    let toRender;
    switch (render) {
        case CellRenderOptions.empty:
            toRender = <div className={"cell cell-empty"}>&nbsp;</div>;
            break;
        case CellRenderOptions.X:
            toRender = <div className={"cell cell-X"}>X</div>;
            break;
        case CellRenderOptions.O:
            toRender = <div className={"cell cell-O"}>O</div>;
            break;
    }
    return toRender;
}
```

### grid.css

```css
.grid-container {
    display: inline-block;
    margin: 2vh 3vw;
}

.grid {
    width: 30vw;
    padding: 1vh 1vw;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1vh;
}

.grid-cell {
    width: 10vw;
    height: 10vh;
    border: thin solid grey;
}

```

### Grid.tsx

```typescript
import React from "react";
import "./grid.css";
import Cell, {CellRenderOptions} from "../cell/Cell";

interface GridProps {
    rows: number;
    cols: number;
    fillWith: CellRenderOptions;
}

export default function Grid({rows, cols, fillWith}: GridProps) {
    const grid = Array(rows)
        .fill(0)
        .map((_, r) =>
            Array(cols)
                .fill(0)
                .map((_, c) => {
                        return <div className={"grid-cell"} key={`grid-cell-${r}-${c}`}>
                            <Cell render={fillWith}/>
                        </div>;
                    }
                )
        );

    return (
        <div className={"grid-container"}>
            <div className={"grid"}>
                {grid}
            </div>
        </div>
    );
}

```

### Game.tsx

```typescript
import React from "react";
import "./game.css";
import Grid from "../grid/Grid";
import {CellRenderOptions} from "../cell/Cell";

export default function Game() {
    return <div className={"game"}>
        <Grid rows={3} cols={3} fillWith={CellRenderOptions.empty}/>
        <Grid rows={3} cols={3} fillWith={CellRenderOptions.X}/>
        <Grid rows={3} cols={3} fillWith={CellRenderOptions.O}/>
    </div>;
}

```

![4.running-app](4.running-app.png)

![5.project-structure](5.project-structure.png)

![6.design-so-far](6.design-so-far.png)

## Working game

This working game is incomplete, and it doesn't stop until all of the cells are full.

The structure is same, except that code has moved around a bit.

### Game.tsx

```typescript
import React, {useState} from "react";
import "./game.css";
import Grid from "../grid/Grid";
import {CellRenderOptions} from "../cell/Cell";

export default function Game() {
    const rows: number = 3;
    const cols: number = 3;
    const initialGridState = Array(rows).fill(0)
        .map(_ => Array(cols).fill(0)
            .map(_ => CellRenderOptions.empty)
        );
    const [gridState, setGridState] = useState(initialGridState);
    const [turn, setTurn] = useState(CellRenderOptions.X);

    function toggleTurn() {
        if (turn === CellRenderOptions.X) {
            setTurn(CellRenderOptions.O);
        } else {
            setTurn(CellRenderOptions.X);
        }
    }

    function onEmptyCellClick(row: number, col: number) {
        console.log(row, col, turn);
        // generate new state
        const newGridState = gridState.map((values, rowIndex) => values.map((value, colIndex) => {
            return row === rowIndex && col === colIndex ? turn : value
        }))
        setGridState(newGridState)
        // finally toggle turn
        toggleTurn();
    }

    return <div className={"game"}>
        <Grid onEmptyCellClick={onEmptyCellClick} grid={gridState}/>
    </div>;
}

```

In Game, we have moved rows, columns and initialGridState out of Grid itself. Via `initialGridState` we are passing the grid to display to `Grid` component.

This dumbs down the `Grid` component a bit. There is no logic in `Grid`, and it basically just renders out the `Cell` component with appropriate grid-cell value passed to it.

Let's take a look at `initialGridState`

#### `initialGridState`

```typescript
const initialGridState = Array(rows).fill(0)
        .map(_ => Array(cols).fill(0)
            .map(_ => CellRenderOptions.empty)
        );
```

This code is generating rows and columns containing `CellRenderOptions.empty`, which renders an empty cell when rendering `Cell` component.

#### `turn` and `toggleTurn`

A `turn` keeps track of the turn of the player. First turn is always of `X` and after the turn, next turn is `O`. We are not keeping track of when the game is over yet.

```typescript
const [turn, setTurn] = useState(CellRenderOptions.X);

function toggleTurn() {
    if (turn === CellRenderOptions.X) {
        setTurn(CellRenderOptions.O);
    } else {
        setTurn(CellRenderOptions.X);
    }
}

```

The toggleTurn function code can be shortened to:

```typescript
const newTurn = turn === CellRenderOptions.X ? CellRenderOptions.O : CellRenderOptions.X
setTurn(newTurn)
```

#### Click an empty cell

We are allowing to click only the empty cell, this way, users cannot overwrite the written cell and we don't need to keep track of whether the cell was empty or not.

```typescript
function onEmptyCellClick(row: number, col: number) {
    console.log(row, col, turn);
    // generate new state
    const newGridState = gridState.map((values, rowIndex) => values.map((value, colIndex) => {
        return row === rowIndex && col === colIndex ? turn : value
    }))
    setGridState(newGridState)
    // finally toggle turn
    toggleTurn();
}
```

`onEmptyCellClick` accepts `row` and `col`, which get passed to it from `Grid` component.

On clicking the cell, this function gets executed, and it generates a new grid state, since we have this function in the `Game`, we have access to `gridState`.

This was Game.tsx.

### Grid.tsx

```typescript
import React from "react";
import "./grid.css";
import Cell, {CellRenderOptions} from "../cell/Cell";

interface GridProps {
    onEmptyCellClick: Function;
    grid: any[]
}

export default function Grid({onEmptyCellClick, grid}: GridProps) {

    const renderGrid = grid
        .map((row, rowIndex) =>
            row.map((fillWith: CellRenderOptions, colIndex: number) => {
                        return <div className={"grid-cell"} key={`grid-cell-${rowIndex}-${colIndex}`}>
                            <Cell render={fillWith} onEmptyCellClick={() => onEmptyCellClick(rowIndex, colIndex)}/>
                        </div>;
                    }
                )
        );

    return (
        <div className={"grid-container"}>
            <div className={"grid"}>
                {renderGrid}
            </div>
        </div>
    );
}

```

The `Grid` component now deals with only the `grid` state which is managed by `Game`.

If you notice, `grid` type is `CellRenderOptions[][]`.

![7.working-app-but-incomplete](7.working-app-but-incomplete.png)

As you can see, we can click the cells, and the cell gets rendered correctly, but we are not tracking when the game is over.

![8.design-so-far](8.design-so-far.png)

You can see that I am keeping function params in member list. That's because our components depend upon it.

### grid.css

```css
.grid-container {
    display: inline-block;
    margin: 30px;
    /*background-color: navy;*/
}

.grid {
    min-width: 30vw;
    padding: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
}

.grid-cell {
    width: 100px;
    height: 100px;
    border: thin solid grey;
    /*background-color: white;*/
}

```

### cell.css

```css
.cell {
    line-height: 100px;
    text-align: center;
    font-size: 72px;
    user-select: none;
    cursor: initial;
    width: inherit;
    height: inherit;
}

.cell-empty {
    cursor: pointer;
}

.cell-empty:hover {
    box-shadow: 0 0 2px black;
}

.cell-X {
    color: red;
}

.cell-O {
    color: blue;
}
```

Design has changed a little bit to keep the height and width of cell to `100px`. This removes dependency over height and width of visual area of the browser.

## Working game

### Game.tsx

```typescript
import React, {useEffect, useState} from "react";
import "./game.css";
import Grid from "../grid/Grid";
import {CellRenderOptions} from "../cell/Cell";
import GameOver from "../gameover/GameOver";
import GameDraw from "../gamedraw/GameDraw";

export default function Game() {
    const rows: number = 3;
    const cols: number = 3;
    const initialGridState = Array(rows).fill(0)
        .map(_ => Array(cols).fill(0)
            .map(_ => CellRenderOptions.empty)
        );
    const [gridState, setGridState] = useState(initialGridState);
    const [turn, setTurn] = useState(CellRenderOptions.X);
    const [gameState, setGameState] = useState("running");

    function toggleTurn() {
        if (turn === CellRenderOptions.X) {
            setTurn(CellRenderOptions.O);
        } else {
            setTurn(CellRenderOptions.X);
        }
    }

    function isGameOver(array: CellRenderOptions[][]) {
        const row = (i: number) => [array[i][0], array[i][1], array[i][2]];
        const col = (i: number) => [array[0][i], array[1][i], array[2][i]];
        const diagonals = [[array[0][0], array[1][1], array[2][2]],
            [array[2][0], array[1][1], array[0][2]]];
        const values = [row(0), row(1), row(2), col(0), col(1), col(2), ...diagonals];
        return values.some(v => v.every(i => i === CellRenderOptions.X)) || values.some(v => v.every(i => i === CellRenderOptions.O));
    }

    useEffect(() => {
        // check game state
        const gameover = isGameOver(gridState);

        if (gameover) {
            setGameState("over");
        }

        if(gridState.every(row => row.every(col => col !== CellRenderOptions.empty))) {
            setGameState("draw")
        }
    }, [gridState]);

    function onEmptyCellClick(row: number, col: number) {
        // console.log(row, col, turn);

        if (gameState === "running") {
            // generate new state
            const newGridState = gridState.map((values, rowIndex) => values.map((value, colIndex) => {
                return row === rowIndex && col === colIndex ? turn : value;
            }));
            setGridState(newGridState);

            // finally toggle turn
            toggleTurn();
        }
    }

    function resetGame() {
        setGameState("running");
        setGridState(initialGridState);
        setTurn(CellRenderOptions.X);
    }

    return <div className={"game"}>
        <div className={"game-controls"}>
            <button type={"button"} onClick={() => resetGame()}>reset</button>
        </div>
        <Grid onEmptyCellClick={onEmptyCellClick} grid={gridState}/>
        {gameState === "over" && <GameOver turn={turn}/>}
        {gameState === "draw" && <GameDraw />}
    </div>;
}

```

### GameOver.tsx

```typescript
import React from "react";
import {CellRenderOptions} from "../cell/Cell";

interface GameOverProps {
    turn: CellRenderOptions;
}

export default function GameOver({turn}: GameOverProps) {
    return <div className={"game-over"}>
        <h2>Game over</h2>
        <h3>{turn === CellRenderOptions.X ? "O" : "X"} won</h3>
    </div>;
}
```

### GameDraw.tsx

```typescript
import React from "react"

export default function GameDraw() {
    return <div className={"game-draw"}>
        <h2>Game ends in a draw!</h2>
    </div>
}
```

![9.game-ends-in-a-draw](9.game-ends-in-a-draw.png)

![10.x-won](10.x-won.png)

![11.o-won](11.o-won.png)

## redux

to be continued...

</body>
</html>
