import Player from "./components/Player.jsx";
import GameBoard from "./components/GameBoard.jsx";
import {useState} from "react";
import Log from "./components/Log.jsx";
import {WINNING_COMBINATIONS} from "./winning-combinations.js";
import GameOver from "./components/GameOver.jsx";


const INITIAL_GAME_BOARD = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
];
const INITIAL_PLAYERS = {
    X: "Player 1",
    O: "Player 2",
}

function deriveActivePlayer(gameTurns) {
    return (gameTurns.length > 0 && gameTurns[0].player === "X") ? "O" : "X";
}

function deriveGameBoard(gameTurns) {
    const gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])]
    for (const {square: {row, col}, player} of gameTurns) {
        gameBoard[row][col] = player;
    }
    return gameBoard;
}

function updateMatchStatus(gameTurns, gameBoard, players, matchStatus) {
    for (const combination of WINNING_COMBINATIONS) {
        const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
        const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
        const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];
        if (firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol) {
            matchStatus.winner = players[firstSquareSymbol];
            return;
        }
        if (!matchStatus.winner && gameTurns.length === 9) {
            matchStatus.isDraw = true;
        }
    }
}

function App() {
    const [gameTurns, setGameTurns] = useState([]);
    const [players, setPlayers] = useState(INITIAL_PLAYERS)
    const matchStatus = {
        winner: null, isDraw: false, isGameFinished: () => matchStatus.winner || matchStatus.isDraw, reset: () => {
            matchStatus.winner = null;
            matchStatus.isDraw = false
        }
    }
    const activePlayer = deriveActivePlayer(gameTurns);
    const gameBoard = deriveGameBoard(gameTurns);

    updateMatchStatus(gameTurns, gameBoard, players, matchStatus)

    function handleSelectSquare(rowIndex, colIndex) {
        setGameTurns(prevState => [{
            square: {row: rowIndex, col: colIndex}, player: deriveActivePlayer(prevState)
        }, ...prevState])
    }

    function handleRestart() {
        setGameTurns([]);
        matchStatus.reset();
    }

    function handlePlayerNameChange(symbol, newName) {
        console.log("editing...")
        setPlayers(prevState => ({
            ...prevState, [symbol]: newName,
        }))
    }


    return (<main>
        <div id="game-container">
            <ol id="players" className="highlight-player">
                <Player name={INITIAL_PLAYERS.X} symbol="X" isActive={activePlayer === "X"}
                        onNameChnage={handlePlayerNameChange}/>
                <Player name={INITIAL_PLAYERS.O} symbol="O" isActive={activePlayer === "O"}
                        onNameChnage={handlePlayerNameChange}/>
            </ol>
            {matchStatus.isGameFinished() && <GameOver matchStatus={matchStatus} onRestart={handleRestart}/>}
            <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard}/>
        </div>
        <Log turns={gameTurns}/>
    </main>)
}

export default App
