import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ethers } from 'ethers';
import Web3modal from 'web3modal';
import { useNavigate } from 'react-router-dom';
import { ABI, ADDRESS } from '../contract';
import { createEventListener } from './createEventListener';

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [provider, setProvider] = useState('');
  const [contract, setContract] = useState('');
  const [battleName, setBattleName] = useState('');
  const [updateGameData, setUpdateGameData] = useState(0);
  const [battleground, setBattleground] = useState('bg-astral');
  const [gameData, setGameData] = useState({
    players: [],
    pendingBattles: [],
    activeBattle: null,
  });
  const [showAlert, setShowAlert] = useState({
    status: false,
    type: 'info',
    message: '',
  });
  const navigate = useNavigate();

  //* Set the wallet address to the state
  const updateCurrentWalletAddress = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    if (accounts) setWalletAddress(accounts[0]);
  };

  useEffect(() => {
    updateCurrentWalletAddress();
    window.ethereum.on('accountsChanged', updateCurrentWalletAddress);
  }, []);

  //* Set the smart contract the provider to the state
  useEffect(() => {
    const setSmartContractAndProvider = async () => {
      const web3Modal = new Web3modal();
      const connection = await web3Modal.connect();
      const newProvider = new ethers.providers.Web3Provider(connection);
      const signer = newProvider.getSigner();
      const newContract = new ethers.Contract(ADDRESS, ABI, signer);

      setContract(newContract);
      setProvider(newProvider);
    };
    setSmartContractAndProvider();
  }, []);

  useEffect(() => {
    if (contract) {
      createEventListener({
        navigate,
        contract,
        provider,
        walletAddress,
        setShowAlert,
        setUpdateGameData,
      });
    }
  }, [contract]);

  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: 'info', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  //* Set the game data to the state
  useEffect(() => {
    const fetchGameData = async () => {
      const fetchedBattles = await contract.getAllBattles();
      const pendingBattles = fetchedBattles.filter(
        (battle) => battle.battleStatus === 0
      );
      let activeBattle = null;

      fetchedBattles.forEach((battle) => {
        if (
          battle.players.find(
            (player) => player.toLowerCase() === walletAddress.toLowerCase()
          )
        ) {
          if (battle.winner.startsWith('0x00')) {
            activeBattle = battle;
          }
        }
      });
      setGameData({ pendingBattles: pendingBattles.slice(1), activeBattle });
    };
    if (contract) fetchGameData();
  }, [contract, updateGameData]);

  return (
    <GlobalContext.Provider
      value={{
        contract,
        walletAddress,
        showAlert,
        setShowAlert,
        battleName,
        setBattleName,
        gameData,
        battleground,
        setBattleground,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const usGlobalContext = () => useContext(GlobalContext);
