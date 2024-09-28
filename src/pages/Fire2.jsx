import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import FiredGuys from '../artifacts/contracts/MyNFT.sol/MyNFT.json';

const contractAddress = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';

// get the smart contract
const contract = new ethers.Contract(contractAddress, FiredGuys.abi, signer);