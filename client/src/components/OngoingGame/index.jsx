import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useEth from "../../contexts/EthContext/useEth";
import Player1 from './Player1';
import Player2 from './Player2';
import './countdown.css';


function OngoingGame() {
  const { rpsAddress } = useParams();
	const { state: {web3, artifacts, accounts} } = useEth();
	const [rpsContract, setRpsContract] = useState();
	const [gameInfo, setGameInfo] = useState();

  // Get the RPS Contract that will be used for function calls from the address in the URL
  const getRpsContract = (rpsAddress) => {
    const { abi: rpcAbi } = artifacts.rpsArtifact;
    const newRpsContract = new web3.eth.Contract(rpcAbi, rpsAddress);
    setRpsContract(newRpsContract);
  }
  
  // Get the game information in order to render the page dynamically
  const getGameInfo = async() => {
    try {
      const player1 = await rpsContract.methods.j1().call();
      const player2 = await rpsContract.methods.j2().call();
      const player2Move = await rpsContract.methods.c2().call();
      const stake = await rpsContract.methods.stake().call();
      const lastAction = await rpsContract.methods.lastAction().call();
      const timeOut = await rpsContract.methods.TIMEOUT().call();

      const newGameInfo = {
        player1,
        player2,
        player2Move,
        stake,
        lastAction,
        timeOut
      };

      setGameInfo(newGameInfo);
    } catch (err) {
      alert(err);
    }
  }

  useEffect(() => {
    if (web3 && artifacts && accounts) {
      getRpsContract(rpsAddress);
      if (rpsContract) {
        getGameInfo();
      }
    }
  }, [rpsAddress, web3, artifacts])



  useEffect(() => {
    if (rpsContract) {
      getGameInfo();
    }
  }, [rpsContract])

  return (
    <>
      {accounts && accounts[0] === gameInfo?.player1 && <Player1 rpsContract={rpsContract} gameInfo={gameInfo} getGameInfo={getGameInfo} />}
      {accounts && accounts[0] === gameInfo?.player2  && <Player2 rpsContract={rpsContract} gameInfo={gameInfo} getGameInfo={getGameInfo} />}
    </>
  );
}

export default OngoingGame;
