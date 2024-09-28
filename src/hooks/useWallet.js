import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

const useWallet = () => {
  const [ address, setAddress ] = useState(null);
  const [ signer, setSigner ] = useState(null);

  const navigate = useNavigate();

  // const getSigner = async () => {
  //   if (window.ethereum) {
  //     try {
  //       await window.ethereum.request({ method: "eth_requestAccounts" });
  //       const provider = new ethers.BrowserProvider(window.ethereum);
  //       const signer = await provider.getSigner();
  //       signer.getAddress().then((address) => {
  //         setAddress(address);
  //         localStorage.setItem('walletAddress', address);
  //         localStorage.setItem('signer', signer);
  //       });
  //       setSigner(signer);
  //     } catch (error) {
  //       console.error("User denied account access or there is an issue with MetaMask:", error);
  //     }
  //   } else {
  //     console.error("MetaMask not detected. Please install MetaMask.");
  //   }
  // }

  const getSigner2 = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({method: 'eth_accounts'});       
        if (!accounts.length) {
          navigate('/login');
          return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        signer.getAddress().then((address) => {
          setAddress(address);
          localStorage.setItem('walletAddress', address);
          localStorage.setItem('signer', signer);
        });
        setSigner(signer);
      } catch (error) {
        console.error("User denied account access or there is an issue with MetaMask:", error);
      }
    } else {
      console.error("MetaMask not detected. Please install MetaMask.");
    }
  }

  // const getAddress = async () => {
  //   localStorage.getItem('walletAddress') && setAddress(localStorage.getItem('walletAddress'));
  // };

  useEffect(() => {
    getSigner2();
  });

  return { address, signer };
};

export default useWallet;