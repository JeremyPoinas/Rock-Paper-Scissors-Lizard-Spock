import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { actions } from "../contexts/EthContext/state";
import useEth from "../contexts/EthContext/useEth";

function StartGame() {
  const navigate = useNavigate();
	const { state: { artifacts, web3, hasherContract, accounts }, dispatch } = useEth();
	const [commitment, setCommitment] = useState({address: '', move: null, bet: 0});

  useEffect(() => {
    /* To connect using MetaMask */
    async function connect() {
      if (window.ethereum) {
      
      await window.ethereum.request({ method: "eth_requestAccounts" });
      window.web3 = new web3(window.ethereum);
      
      } else {
      console.log("No wallet");
      }
    }

    if (!accounts && web3) {
      connect();
    }
  }, [])

  // Create controlled fields for the player's commitment
  const handleCommitmentChange = e => {
    switch (e.target.id) {
      case 'P2Address':
        setCommitment({...commitment, address: e.target.value });
        break;
        case 'move':
          setCommitment({...commitment, move: e.target.value });
          break;
      case 'bet':
        setCommitment({...commitment, bet: e.target.value });
        break;
      default:
    }
  };

  // Hash the player's move with the salt using the Hasher contract
  // Then deploy a new RPS contract with the hash and the address of player 2
  const handleCommit = async() => {
    try {
      if (commitment.address && commitment.move && commitment.bet > 0) {
        const saltRecorded = web3.utils.randomHex(32);
        const c1hash = await hasherContract.methods.hash(commitment.move, saltRecorded).call({ from: accounts[0] });

        if (c1hash) {
          if (artifacts && web3) {
            const { abi: rpsAbi } = artifacts.rpsArtifact;
            const { bytecode: RPSbytecode } = artifacts.rpsArtifact;
            const rpsContract = new web3.eth.Contract(rpsAbi);
            
            rpsContract
              .deploy({ data: RPSbytecode, arguments: [c1hash, commitment.address] })
              .send({ from: accounts[0], value: commitment.bet * 10**18, gas: 5000000 })
              .on("receipt", async(receipt) => {
        
                  // Contract Address will be returned here
                  console.log("Contract Address:", receipt.contractAddress);
                  rpsContract._address = receipt.contractAddress;
                  navigate(`/game/${rpsContract._address}`);
              });
            dispatch({ type: actions.init, data: {rpsContract, saltRecorded} });
          }
        }
      }
      else {
        throw new Error('Please fill all the fields.');
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="player1">
      <h5>Select a player you want to challenge, a move and the amount of ETH you want to bet</h5>

      <div style={{marginTop: '20px'}}>
        <label htmlFor="P2Address">Player 2 Address (ETH) : </label>
        <input
          type="text" id="P2Address" name="P2Address" required value={commitment.address}
          minLength="44" maxLength="44" size="40" onChange={handleCommitmentChange}>
        </input>
      </div>

      <div style={{marginTop: '10px'}}>
        <label htmlFor="move">Choose a move: </label>

        <select name="move" id="move" value={commitment.move} required onChange={handleCommitmentChange}>
            <option value="">--Please choose an option--</option>
            <option value="1">Rock</option>
            <option value="2">Paper</option>
            <option value="3">Scissors</option>
            <option value="4">Lizard</option>
            <option value="5">Spock</option>
        </select>
      </div>

      <div style={{marginTop: '10px'}}>
        <label htmlFor="bet">Amount to bet (ETH) : </label>
        <input
          type="number" id="bet" name="bet" value={commitment.bet} required onChange={handleCommitmentChange}>
        </input>
      </div>

      {
        commitment.address && commitment.move && commitment.bet > 0 &&
        <button type="button" style={{marginTop: '10px'}} onClick={handleCommit}>
            Commit
        </button>
      }

    </div>
  );
}

export default StartGame;
