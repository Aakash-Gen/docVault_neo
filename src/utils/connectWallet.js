import Web3 from 'web3';
import { connectToGanache, connectToSepolia }  from './walletAdapter'
import { ethers } from 'ethers';

export const connectWallet = async () => {
  try {
    await connectToSepolia();
    const currentProvider = detectCurrentProvider();
    if (currentProvider) {
      await currentProvider.request({ method: 'eth_requestAccounts' });

      const web3 = new Web3(currentProvider);
      const userAccount = await web3.eth.getAccounts();

      const account = userAccount[0];

      localStorage.setItem('walletAddress', account);
      console.log(`Connected wallet: ${account}`);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      return { account, signer };
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

const detectCurrentProvider = () => {
  let provider;
  if (window.ethereum) {
    provider = window.ethereum;
  } else if (window.web3) {
    provider = window.web3.currentProvider;
  } else {
    console.log("Non-ethereum browser detected. You should install Metamask");
  }
  return provider;
};

export const getBalance = async (account) => {
    try {
        await connectToSepolia();
        const currentProvider = detectCurrentProvider();
        if (currentProvider) {
          const web3 = new Web3(currentProvider);
          const balance = await web3.eth.getBalance(account);
          return balance;
        }
      } catch (err) {
        console.log(err);
      }
};
