import { useState, useEffect } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button
      type="button"
      className="btn btn-outline-primary fw-bold fs-2 square"
      onClick={onSquareClick}
      style={{ width: '80px', height: '80px' }}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, onRestart }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const isBoardFull = squares.every((sq) => sq !== null);
  const isDraw = !winner && isBoardFull;

  let status;
  if (winner) {
    status = `🎉 Winner: ${winner}`;
  } else if (isDraw) {
    status = '🤝 Empate: nadie ganó';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="mb-3 h4">{status}</div>

      <div className="d-flex flex-column gap-2">
        <div className="d-flex gap-2">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="d-flex gap-2">
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="d-flex gap-2">
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
      </div>

      {(winner || isDraw) && (
        <button
          type="button"
          className="btn btn-primary mt-3"
          onClick={onRestart}
        >
          Restart game
        </button>
      )}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleRestart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    const winner = calculateWinner(squares);
    let description;

    if (winner) {
      description = `🏆 Winner: ${winner} (move ${move})`;
    } else if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button
          type="button"
          className="btn btn-sm p-0 text-white"
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  // Toast que aparece y desaparece con estilo Bootstrap
  useEffect(() => {
    if (history.length <= 1) return; // no mostrar al inicio

    setShowHistory(true);
    const timer = setTimeout(() => {
      setShowHistory(false);
    }, 3500); // 3.5s visible

    return () => clearTimeout(timer);
  }, [history, currentMove]);

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-auto text-center">
          <h1 className="mb-4">Tic Tac Toe</h1>

          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            onRestart={handleRestart}
          />

          <button
            type="button"
            className="btn btn-outline-secondary mt-4 position-fixed top-0 end-0 m-3"
            onClick={() => setShowModal(true)}
          >
            ?
          </button>
        </div>
      </div>

      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          className={'toast text-bg-dark ' + (showHistory ? 'show' : '')}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header bg-dark text-white">
            <strong className="me-auto">Historial de jugadas</strong>
            <button
              type="button"
              className="btn-close btn-close-white ms-2 mb-1"
              onClick={() => setShowHistory(false)}
            ></button>
          </div>
          <div className="toast-body">
            <ol className="mb-0 small">{moves}</ol>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: 'block' }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Creador</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body text-start">
                  <p className="mb-1">
                    <strong>Creador:</strong> Jose Manuel Castillo Queh
                  </p>
                  <p className="mb-0">
                    <strong>GitHub:</strong>{' '}
                    <a
                      href="https://github.com/CastilloDevX"
                      target="_blank"
                      rel="noreferrer"
                    >
                      CastilloDevX
                    </a>
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Backdrop del modal */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
