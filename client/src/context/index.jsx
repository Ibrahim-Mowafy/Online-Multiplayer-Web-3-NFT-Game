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

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [provider, setProvider] = useState('');
  const [contract, setContract] = useState('');

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

  return (
    <GlobalContext.Provider value={{ contract, walletAddress }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const usGlobalContent = () => useContext(GlobalContext);
