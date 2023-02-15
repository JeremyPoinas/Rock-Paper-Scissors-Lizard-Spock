import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useEth from "../../contexts/EthContext/useEth";
import { Player1 } from './Player1.jsx';
import { Player2 } from './Player2.jsx';

function OngoingGame() {
  const { rpcAddress } = useParams();
	const { state: {web3, artifacts, accounts} } = useEth();
	const [rpcContract, setRpcContract] = useState({});
	const [gameInfo, setGameInfo] = useState({});

  const getRpcContract = () => {
    const { abi: rpcAbi } = artifacts.rpcArtifact;
    const newRpcContract = new web3.eth.Contract(rpcAbi, rpcAddress);
    setRpcContract(newRpcContract);
  }
  
  const getGameInfo = async(rpcAddress) => {
    try {
      
      const player1 = rpcContract.methods.j1().call();
      const player2 = rpcContract.methods.j2().call();
      const player2Move = rpcContract.methods.c2().call();
      const stake = rpcContract.methods.stake().call();

      const newGameInfo = {
        player1,
        player2,
        player2Move,
        stake,
      };

      setGameInfo(newGameInfo);
    } catch (err) {
      alert(err);
    }
  }

  useEffect(() => {
    getRpcContract();
    getGameInfo(rpcAddress);
  }, [rpcAddress])

  console.log(gameInfo);

  return (
    <>
      {gameInfo && gameInfo.player1 === accounts[0] && <Player1 rpcContract={rpcContract} gameInfo={gameInfo} getGameInfo={getGameInfo} />}
      {gameInfo && gameInfo.player2 === accounts[0] && <Player2 rpcContract={rpcContract} gameInfo={gameInfo} getGameInfo={getGameInfo} />}
    </>
  );
}

export default OngoingGame;
