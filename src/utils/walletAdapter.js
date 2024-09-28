
const ganacheNetwork = {
  chainId: '0x539',
  chainName: 'Ganache Test Network',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://9c9f1t91-8545.inc1.devtunnels.ms'],
  blockExplorerUrls: [],
};

export const connectToGanache = async () => {
  const { ethereum } = window;

  if (!ethereum) {
    window.alert("MetaMask is not installed!");
    return;
  }

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x539' }],
    });
  } catch (switchError) {
    // if (switchError.code === 4902) {
    //   // try {
    //   //   await ethereum.request({
    //   //     method: 'wallet_addEthereumChain',
    //   //     params: [ganacheNetwork],
    //   //   });
    //   // } catch (addError) {
    //   //   console.error("Failed to add the network:", addError.message);
    //   // }
    // } else {
      console.error("Failed to switch network:", switchError.message);
    // }
  }
};

const sepoliaNetwork = {
  chainId: '0xAA36A7',
  chainName: 'Sepolia Test Network',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.sepolia.org/'],
  blockExplorerUrls: ['https://sepolia.etherscan.io/'],
};

export const connectToSepolia = async () => {
  const { ethereum } = window;

  if (!ethereum) {
    window.alert("MetaMask is not installed!");
    return;
  }

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: sepoliaNetwork.chainId }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [sepoliaNetwork],
        });
      } catch (addError) {
        console.error("Failed to add the network:", addError.message);
      }
    } else {
      console.error("Failed to switch network:", switchError.message);
    }
  }
};