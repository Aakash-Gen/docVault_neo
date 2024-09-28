import useWallet from '@/hooks/useWallet';
import { Button } from '../components/ui/button'
import { connectWallet, getBalance }  from '../utils/connectWallet'
import { connectToGanache, connectToSepolia }  from '../utils/walletAdapter'
// import useWallet from '../hooks/useWallet'
// import { testFunction  } from '../contract/methods'
import { useState } from 'react';
import { ethers } from 'ethers';

const TestPage = () => {
  const { address, refetchAddress } = useWallet();
  const [balance, setBalance] = useState();

  const getBalanceFromAddress = async () => {
    const balance2 = await getBalance(address);
    setBalance(balance2);
  }

  const something  = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
  const signer = provider.getSigner();
  console.log(signer)
  }

  async function isConnected() {
    const accounts = await window.ethereum.request({method: 'eth_accounts'});       
    if (accounts.length) {
       console.log(`You're connected to: ${accounts[0]}`);
    } else {
       console.log("Metamask is not connected");
    }
 }

  return (
    <div className='flex flex-col gap-10'>
      <p>Connected Address: {address}</p>
      <Button onClick={connectWallet}>Connect</Button>
      <Button onClick={refetchAddress}>Refresh</Button>
      {/* <Button onClick={testFunction}>test 1</Button> */}
      <Button onClick={getBalanceFromAddress}>show balance</Button>
      <Button onClick={something}>show something</Button>
      <Button onClick={isConnected}>is connected</Button>
      <h5>Your Balance: {String(balance)}</h5>
      <button onClick={() => getBalance()}>Show My Balance</button>
    </div>
  );
};

export default TestPage