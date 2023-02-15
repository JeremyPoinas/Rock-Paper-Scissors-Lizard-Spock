import { useState } from "react";
import { NavLink } from "react-router-dom";
import useEth from "../../contexts/EthContext/useEth";

function Player2({ gameInfo, rpsContract, getGameInfo }) {
	const { state: {accounts} } = useEth();
	const [move, setMove] = useState(0);

  const handleMoveChange = e => {
    setMove(e.target.value);
  }

  const handleTimeOut = async() => {
    try {
      await rpsContract.methods.j1Timeout().call({ from: accounts[0] });
      await rpsContract.methods.j1Timeout().send({ from: accounts[0] });
      getGameInfo();
    } catch (err) {
      alert(err);
    }
  };


  const handleCommit = async() => {
    try {
      await rpsContract.methods.play(move).call({ from: accounts[0], value: gameInfo.stake });
      await rpsContract.methods.play(move).send({ from: accounts[0], value: gameInfo.stake });
      getGameInfo();
    } catch (err) {
      alert(err);
    }
  };

  console.log(gameInfo);

  return (
    <div className="player1">
      {gameInfo && gameInfo.stake === '0' && 
        <>
          <h5>Game Over</h5>
          <NavLink to="/" >
            Start a new Game
          </NavLink>
        </>
      }
      {gameInfo && gameInfo.stake !== '0' && gameInfo.player2Move !== '0' && 
        <>
          <h5>Waiting for Player 1 to solve the game ({gameInfo.player1})</h5>

          <button type="button" style={{marginTop: '10px'}} onClick={handleTimeOut}>
              Declare timeout and claim back your stack
          </button>
        </>
      }
      {gameInfo && gameInfo.stake !== '0' && gameInfo.player2Move === '0' && 
        <>
          <h5>Player 1 ({gameInfo.player1}) has created a game for {gameInfo.stake / 10**18} ETH, please make a move.</h5>

          <div style={{marginTop: '10px'}}>
            <label htmlFor="move">Select the move you want to play: </label>

            <select name="move" id="move" value={move} required onChange={handleMoveChange}>
                <option value="">--Please choose an option--</option>
                <option value="1">Rock</option>
                <option value="2">Paper</option>
                <option value="3">Scissors</option>
                <option value="4">Lizard</option>
                <option value="5">Spock</option>
            </select>
          </div>
          <button type="button" style={{marginTop: '10px'}} onClick={handleCommit}>
              Commit
          </button>
        </>
      }
    </div>
  );
}

export default Player2;
