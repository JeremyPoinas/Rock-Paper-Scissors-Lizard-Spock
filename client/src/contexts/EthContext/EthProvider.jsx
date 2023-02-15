import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async artifacts => {
      if (artifacts) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi: HasherAbi } = artifacts.hasherArtifact;
        let hasherAddress, hasherContract, rpsContract;
        try {
          hasherAddress = artifacts.hasherArtifact.networks[networkID].address;
          hasherContract = new web3.eth.Contract(HasherAbi, hasherAddress);
        } catch (err) {
          console.error(err);
        }
  
        dispatch({
          type: actions.init,
          data: { artifacts, web3, accounts, networkID, hasherContract, rpsContract }
        });
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const rpsArtifact = require("../../contracts/RPS.json");
        const hasherArtifact = require("../../contracts/Hasher.json");
        const artifacts = {rpsArtifact, hasherArtifact};
        init(artifacts);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifacts);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifacts]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
