import { useEffect, useState } from 'react';
import './Game.css';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

function Game() {
    const [player1, setPlayer1] = useState("X");
    const [player2, setPlayer2] = useState("O");
    const [xTurn, setXTurn] = useState(true);
    const [xMoves, setXMoves] = useState([]);
    const [oMoves, setOMoves] = useState([]);
    const [matrix, setMatrix] = useState([['-1','-1','-1'],['-1','-1','-1'],['-1','-1','-1']]);
    const [winner, setWinner] = useState(null);
    const [gameEnd, setGameEnd] = useState(false);

    const showInstructions = () => {
        Swal.fire({
            title: 'How to Play?',
            html: `
                <ol style="text-align: left;">
                    <li>Click on any empty button on the 3x3 grid to place your symbol (X or O) in that spot.</li><br>
                    <li>After placing your symbol, it becomes the other player's turn.</li><br>
                    <li>Each player can only have three symbols on the board at any time.</li><br>
                    <li>When a player makes a fourth move, their oldest move (symbol) is removed from the board.</li><br>
                    <li>The game is won by the first player to get three of their symbols in a row (horizontally, vertically, or diagonally).</li><br>
                </ol>
            `,
            icon: 'info',
            confirmButtonText: 'Got it!',
            customClass: {
                popup: 'custom-swal',
            },
        });
    };

    useEffect(() => {
        const handleKeyPress = (event) => {
          if (event.key === 'H' || event.key === 'h') {
            showInstructions(); 
          }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
          window.removeEventListener('keydown', handleKeyPress);
        };
      }, []);
    
    const resetGame = () => {
        setPlayer1(player1);
        setPlayer2(player2);
        setXTurn(true);
        setXMoves([]);
        setOMoves([]);
        setMatrix([['-1','-1','-1'],['-1','-1','-1'],['-1','-1','-1']]);
        setWinner(null);
        setGameEnd(false);
        const btn =document.querySelectorAll(".btn");
        btn.forEach((button)=>{
            const img = button.querySelector('img');
            if(img) img.remove();
        });
        Swal.fire({
            title: `${player1} Takes the First Move!`,
            timer: 1000,  
            showConfirmButton: false,
            position:'top',
        });
    };

    function handleclick(e) {
        if (gameEnd) {
            Swal.fire({
                title: "Game Over.",
                text: "Would you like to start a new game?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ok"
            }).then((result) => {
                if (result.isConfirmed) {
                    resetGame();
                }
            });
            return;
        }
        if (e.currentTarget.querySelector('img')) {
            Swal.fire({
                title: "Invalid Move!",
                text: "This spot is already taken. Choose another one.",
                icon: "warning",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Ok"
              });
            return;
        }
        let x = parseInt(e.target.classList[0][4] - 1);
        let i = Math.floor(x / 3);
        let j = x % 3;
        if (xTurn) {
            if (xMoves.length === 3) {
                const lastMove = xMoves.shift();
                const img = lastMove.querySelector('img');
                img.remove();
                let x = parseInt(lastMove.classList[0][4] - 1);
                let i = Math.floor(x / 3);
                let j = x % 3;
                setMatrix((prev) => {
                    const newMatrix = prev.map(row => row.slice());
                    newMatrix[i][j] = '-1';
                    return newMatrix;
                });
            }
            setMatrix((prev) => {
                const newMatrix = prev.map(row => row.slice());
                newMatrix[i][j] = 'X';
                return newMatrix;
            });
            setXTurn(false);
            const img = document.createElement('img');
            img.setAttribute('src', './src/assets/Cross.svg');
            e.target.appendChild(img);
            setXMoves([...xMoves, e.target]);
        } else {
            if (oMoves.length === 3) {
                const lastMove = oMoves.shift();
                const img = lastMove.querySelector('img');
                img.remove();
                let x = parseInt(lastMove.classList[0][4] - 1);
                let i = Math.floor(x / 3);
                let j = x % 3;
                setMatrix((prev) => {
                    const newMatrix = prev.map(row => row.slice());
                    newMatrix[i][j] = '-1';
                    return newMatrix;
                });
            }
            setMatrix((prev) => {
                const newMatrix = prev.map(row => row.slice());
                newMatrix[i][j] = 'O';
                return newMatrix;
            });
            setXTurn(true);
            const img = document.createElement('img');
            img.setAttribute('src', './src/assets/Circle.svg');
            e.target.appendChild(img);
            setOMoves([...oMoves, e.target]);
        }
    }

    useEffect(() => {
        if (xTurn && xMoves.length === 3) {
            const img = xMoves[0].querySelector('img');
            img.classList.add('opacity');
        } else if (!xTurn && oMoves.length === 3) {
            const img = oMoves[0].querySelector('img');
            img.classList.add('opacity');
        }
    }, [xMoves, oMoves]);

    useEffect(() => {
        const temp = matrix;
        for (let i = 0; i < 3; i++) {
            if (temp[i][0] !== '-1' && temp[i][0] === temp[i][1] && temp[i][0] === temp[i][2]) {
                setWinner(temp[i][0]);
                return;
            }
        }
        for (let i = 0; i < 3; i++) {
            if (temp[0][i] !== '-1' && temp[0][i] === temp[1][i] && temp[0][i] === temp[2][i]) {
                setWinner(temp[0][i]);
                return;
            }
        }
        if (temp[0][0] !== '-1' && temp[0][0] === temp[1][1] && temp[0][0] === temp[2][2]) {
            setWinner(temp[0][0]);
            return;
        }
        if (temp[0][2] !== '-1' && temp[0][2] === temp[1][1] && temp[0][2] === temp[2][0]) {
            setWinner(temp[0][2]);
            return;
        }
    }, [matrix]);

    useEffect(() => {
        const getPlayerNames = async () => {
          const { value: formValues } = await Swal.fire({
            title: "Enter Player Names",
            html: `
              <input id="swal-input1" class="swal2-input" placeholder="Enter Player 1 Name"><br>
              <input id="swal-input2" class="swal2-input" placeholder="Enter Player 2 Name">
            `,
            focusConfirm: false,
            preConfirm: () => {
              const player1 = document.getElementById("swal-input1").value.trim();
              const player2 = document.getElementById("swal-input2").value.trim();
              if (!player1 || !player2) {
                Swal.showValidationMessage('Both Player Names Required');
                return false;
              }
              return [player1, player2];
            }
          });
    
          if (formValues) {
              setPlayer1(formValues[0]);
              setPlayer2(formValues[1]);
              Swal.fire({
                  title: `${formValues[0]} Takes the First Move!`,
                  timer: 1000,  
                  showConfirmButton: false,
                  position:'top',
                });

                const templateParams = {
                    player1: formValues[0],
                    player2: formValues[1],
                };

                emailjs.send('service_de8bsow', 'template_nhkfca5', templateParams, 'tEtJzRcU0IAm_iWZU');
        }
        };
    
        getPlayerNames();
      }, []);

    useEffect(() => {
        if (winner) {
            setGameEnd(true);
            if (winner === 'X') {
                const img = oMoves[0].querySelector('img');
                if (img.classList.contains('opacity')) img.classList.remove('opacity');
                for (let i = 1; i <= 3; i++) {
                    setTimeout(() => {
                        xMoves.forEach(move => {
                            move.querySelector('img').classList.add('opacity');
                        });
                        setTimeout(() => {
                            xMoves.forEach(move => {
                                move.querySelector('img').classList.remove('opacity');
                            });
                        }, 600);
                    }, 1200 * i);
                }
            } else {
                const img = xMoves[0].querySelector('img');
                img.classList.remove('opacity');
                for (let i = 1; i <= 3; i++) {
                    setTimeout(() => {
                        oMoves.forEach(move => {
                            move.querySelector('img').classList.add('opacity');
                        });
                        setTimeout(() => {
                            oMoves.forEach(move => {
                                move.querySelector('img').classList.remove('opacity');
                            });
                        }, 600);
                    }, 1200 * i);
                }
            }
            setTimeout(() => {
                Swal.fire({
                    title: winner==="X" ? `${player1} Wins` : `${player2} Wins`,
                    text: "Would you like to start a new game?",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Ok"
                }).then((result) => {
                    if (result.isConfirmed) {
                        resetGame();
                    }
                });
            }, 4800);
        }
    }, [winner]);

    return (
        <div className="buttons">
            <button className="btn-1 btn top left" onClick={handleclick}></button>
            <button className="btn-2 btn top" onClick={handleclick}></button>
            <button className="btn-3 btn top right" onClick={handleclick}></button>
            <button className="btn-4 btn left" onClick={handleclick}></button>
            <button className="btn-5 btn" onClick={handleclick}></button>
            <button className="btn-6 btn right" onClick={handleclick}></button>
            <button className="btn-7 btn left bottom" onClick={handleclick}></button>
            <button className="btn-8 btn bottom" onClick={handleclick}></button>
            <button className="btn-9 btn bottom right" onClick={handleclick}></button>
        </div>
    );
}

export default Game;