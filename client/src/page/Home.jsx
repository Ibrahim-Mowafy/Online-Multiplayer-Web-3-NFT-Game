import React, { useState } from 'react';
import { usGlobalContent } from '../context';
import { PageHOC, CustomInput, CustomButton } from '../components';
const Home = () => {
  const { contract, walletAddress } = usGlobalContent();
  const [playerName, setPlayerName] = useState('');
  return (
    <div className="flex flex-col">
      <CustomInput
        label="Name"
        placeholder="Enter your player name"
        value={playerName}
        handleValueChange={setPlayerName}
      />
      <CustomButton title="Register" handleClick={() => {}} restStyles="mt-6" />
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
