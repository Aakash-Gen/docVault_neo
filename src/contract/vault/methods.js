import { Web3 } from 'web3';
import { providerUrl, abi, contractAddress } from './constants'

const web3 = new Web3(providerUrl);
const contract = new web3.eth.Contract(abi, contractAddress);


export async function getJoinRequestsMethod(address,) {
    try {
    const result = await contract.methods.getJoinRequests()
        .call({ from: address , gas : 2000000});
    return result;
    } catch(error) {
        console.error(" there was an error", error);
    }
}

export async function getMembersMethod(address,) {
    try {
    const result = await contract.methods.getMembers()
        .call({ from: address , gas : 2000000});
        return result;
    } catch(error) {
        console.error(" there was an error", error);
    }
}

export async function getOrgNameMethod(address, orgAddress) {
    try {
        const result = await contract.methods.getOrgName(orgAddress).call({ from: address , gas : 2000000});
        if (result == "") {
            return null;
        }
        return result;
    } catch(error) {
        console.error(" there was an error", error);
    }
}

export async function getUserNameMethod(address, userAddress) {
    try {
      const result = await contract.methods.getUserName(userAddress).call({ from: address , gas : 3000000});
      if (result == "") {
          return null;
      }
      return result;
    
    } catch(error) {
        console.error(" there was an error", error);
    }
}

export async function getVerificationRequestsMethod(address) {
    try {
      const result = await contract.methods.getVerificationRequests().call({ from: address , gas : 2000000});

      return result;
    
    } catch(error) {
        console.error(" there was an error", error);
    }
}


export async function getNewDocumentRequestsMethod(address) {
    try {
      const result = await contract.methods.getNewDocumentRequests().call({ from: address , gas : 2000000});

      return result;
    
    } catch(error) {
        console.error(" there was an error", error);
    }
}

export async function getUserOrganizationsMethod(address) {
    try {
      const result = await contract.methods.getUserOrganizations().call({ from: address , gas : 5000000});
        return result;
    
    } catch(error) {
        console.error(" there was an error", error);
    }
}

// export const getitbro = async (signer, orgAddress, description) => {
//     try {
//       const newContract = new ethers.Contract(contractAddress, abi, signer);
//     //   const result = await contract.methods.registerUser(name)
//     //   .send({ from: address , gas : 2000000});
//     //   console.log('user registered: ', result);
    
//       const tx = await newContract.requestToJoinOrg(orgAddress, description);
      
//       await tx.wait();
//       console.log("Minting successful. Transaction hash:", tx.hash);
//     } catch (error) {
//       console.error("Minting failed:", error);
//     }
// };