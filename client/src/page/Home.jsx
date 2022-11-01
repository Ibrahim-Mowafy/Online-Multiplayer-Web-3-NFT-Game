import React, { useState } from 'react';
import { usGlobalContent } from '../context';
import { PageHOC, CustomInput, CustomButton } from '../components';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const { contract, walletAddress, setShowAlert } = usGlobalContent();
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const playerExists = await contract.isPlayer(walletAddress);
      if (!playerExists) {
        await contract.registerPlayer(playerName, playerName);
        setShowAlert({
          status: true,
          type: 'info',
          message: `${playerName} is being summoned!`,
        });
      }
    } catch (error) {
      setShowAlert({
        status: true,
        type: 'failure',
        message: 'Something went wrong!',
      });
    }
  };

  useEffect(() => {
    const checkForPlayerToken = async () => {
      const playerExists = await contract.isPlayer(walletAddress);
      const playerTokenExists = await contract.isPlayerToken(walletAddress);

      if (playerExists && playerTokenExists) navigate('/create-battle');
    };
    if (contract) checkForPlayerToken();
  }, [contract]);

  return (
    <div className="flex flex-col">
      <CustomInput
        label="Name"
        placeholder="Enter your player name"
        value={playerName}
        handleValueChange={setPlayerName}
      />
      <CustomButton
        title="Register"
        handleClick={handleClick}
        restStyles="mt-6"
      />
    </div>
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to Avax Gods <br />a Web3 NFT Game
  </>,
  <>
    Connect your wallet to start playing <br />
    the ultimate Web3 Battle Card Game
  </>
);
