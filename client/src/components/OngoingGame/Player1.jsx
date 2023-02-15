import { useState } from "react";
import { NavLink } from "react-router-dom";
import useEth from "../../contexts/EthContext/useEth";

function Player1({ gameInfo, rpsContract, getGameInfo }) {
	const { state: {accounts, saltRecorded} } = useEth();
	const [move, setMove] = useState(0);
	const [salt, setSalt] = useState(0);

  const handleMoveChange = e => {
    setMove(e.target.value);
  };

  const handleSaltChange = e => {
    setSalt(e.target.value);
  };

  // Declare a timeout for player 2
  const handleTimeOut = async() => {
    try {
      await rpsContract.methods.j2Timeout().call({ from: accounts[0] });
      await rpsContract.methods.j2Timeout().send({ from: accounts[0] });
      getGameInfo();
    } catch (err) {
      alert(err);
    }
  };

  // Solve the game using the salt recorded if the page has not been refreshed, or the salt 
  const handleSolving = async() => {
    try {
      const saltInput = saltRecorded ? saltRecorded : salt;
      
      await rpsContract.methods.solve(move, saltInput).call({ from: accounts[0] });
      await rpsContract.methods.solve(move, saltInput).send({ from: accounts[0] });
      getGameInfo();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="player1">
      {gameInfo?.stake === '0' && 
        <>
          <h5>Game Over</h5>
          <NavLink to="/" >
            Start a new Game
          </NavLink>
        </>
      }
      {gameInfo?.stake !== '0' && gameInfo.player2Move === '0' && 
        <>
          <h5>Waiting for Player 2 ({gameInfo.player2})</h5>

          {saltRecorded && <p>Please save the salt: {saltRecorded}</p>}

          <button type="button" style={{marginTop: '10px'}} onClick={handleTimeOut}>
              Declare timeout and claim back your stack
          </button>
        </>
      }
      {gameInfo?.stake !== '0' && gameInfo.player2Move !== '0' && 
        <>
          <h5>Player 2 has played, please solve the game to see the winner:</h5>

          <div style={{marginTop: '10px'}}>
            <label htmlFor="move">Select the move you played: </label>

            <select name="move" id="move" value={move} required onChange={handleMoveChange}>
                <option value="">--Please choose an option--</option>
                <option value="1">Rock</option>
                <option value="2">Paper</option>
                <option value="3">Scissors</option>
                <option value="4">Lizard</option>
                <option value="5">Spock</option>
            </select>
          </div>

          <div style={{marginTop: '20px'}}>
            <label htmlFor="salt">Add the salt: </label>
            <input
              type="text" id="salt" name="salt" required value={saltRecorded ? saltRecorded : salt}
              size="40" onChange={handleSaltChange}>
            </input>
          </div>

          <button type="button" style={{marginTop: '10px'}} onClick={handleSolving}>
              Solve the game
          </button>
        </>
      }
    </div>
  );
}

export default Player1;
