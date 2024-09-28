import { Web3 } from 'web3';
import { providerUrl, abi, contractAddress } from './constants'
import { ethers } from 'ethers';

const web3 = new Web3(providerUrl);
export const testAddress = "0x3f871Af5F338D8467D70F606a8f51E118cd879dD"
const contract = new web3.eth.Contract(abi, contractAddress);


export async function testFunction(id, title, description, maxBid, createdAt, deadline, signerAuthority) {
    try {
    const result = await contract.methods.createWorkOrder(id, title, description, maxBid, createdAt, deadline, signerAuthority)
        .send({ from: testAddress , gas : 2000000});
        console.log(result);
    } catch(error) {
        console.error(" there was an error", error);
    }
}

export const getCount = async (address) => {
    try {
      
        const tx = await contract.methods.balanceOf(address).call({
            from: address,
            gas: 2000000
        });
        
        console.log("Your total NFT count:", tx);
      } catch (error) {
        console.error("Getting NFT total count failed:", error);
      }
};

export const getAllNFTs  = async (address) => {
    try {
        const balance = await contract.methods.balanceOf(address).call();
        const nfts = [];
    
        for (let i = 0; i < balance; i++) {
            const tokenId = await contract.methods.tokenOfOwnerByIndex(address, i).call();
            const tokenURI = await contract.methods.tokenURI(tokenId).call();
            nfts.push({ tokenId, tokenURI });
        }
        console.log(nfts);
        return nfts;

    } catch (err) {
        console.error(err);
        return [];
    }
};

export const mintNFT = async (address, recipient, metadataURI) => {
    try {
        const tx = await contract.methods.payToMint(recipient, metadataURI).send({
            from: address,
            gas: 2000000
        });
        console.log("Minting successful. Transaction hash:", tx.hash);
    } catch (error) {
        console.error("Minting failed:", error);
    }
}

export const safeMintNFT = async (address, recipient, metadataURI) => {
    try {
        const tx = await contract.methods.safeMint(recipient, metadataURI).send({
            from: address,
            gas: 2000000
        });
        console.log("Minting successful. Transaction hash:", tx.hash);
    } catch (error) {
        console.error("Minting failed:", error);
    }
}

const getContract = async (signer) => {
    return new ethers.Contract(contractAddress, abi, signer);
};


export const payToMint2 = async (signer, recipient, metadataURI) => {
    try {
      // const contract = getContract(signer);
      const newContract = new ethers.Contract(contractAddress, abi, signer);
    
      const tx = await newContract.payToMint(recipient, metadataURI, {
        value: ethers.parseEther("0.00001"),
      });
      // const tx = await newContract.safeMint(recipient, metadataURI);
      
      await tx.wait();
      console.log("Minting successful. Transaction hash:", tx.hash);
    } catch (error) {
      console.error("Minting failed:", error);
    }
};

export const getBalance = async (signer) => {
  try {
    const contract = getContract(signer);
  
    const tx = await contract.balanceOf(signer.getAddress());
    
    await tx.wait();
    console.log("Minting successful. Transaction hash:", tx);
  } catch (error) {
    console.error("Minting failed:", error);
  }
};