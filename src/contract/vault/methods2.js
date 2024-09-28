import {  abi, contractAddress } from './constants'
import { ethers } from 'ethers';

export async function registerUserSendMethod(signer, name) {
  try {
      const newContract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await newContract.registerUser(name);
      await tx.wait();
      console.log("registerUserSendMethod successful. Transaction hash:", tx.hash);
  } catch (error) {
      console.error("registerUserSendMethod error", error);
  }
}

export async function registerOrganizationSendMethod(signer, name) {
  try {
      const newContract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await newContract.registerOrganization(name);
      await tx.wait();
      console.log("registerOrganizationSendMethod successful. Transaction hash:", tx.hash);
  } catch (error) {
      console.error("registerOrganizationSendMethod error", error);
  }
}

export async function updateJoinRequestSendMethod(signer, memberAddress, acceptanceStatus, hashedMessage, v, r, s) {
  try {
      const newContract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await newContract.updateJoinRequest(memberAddress, acceptanceStatus, hashedMessage, v, r, s);
      await tx.wait();
      console.log("updateJoinRequestSendMethod successful. Transaction hash:", tx.hash);
  } catch (error) {
      console.error("updateJoinRequestSendMethod error", error);
  }
}

export async function addVerificationRequestSendMethod(signer, orgAddress, id, ipsfHash, title, description, metadata, docType) {
  try {
      const newContract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await newContract.addVerificationRequest(orgAddress, id, ipsfHash, title, description, metadata, docType);
      await tx.wait();
      console.log("addVerificationRequestSendMethod successful. Transaction hash:", tx.hash);
  } catch (error) {
      console.error("addVerificationRequestSendMethod error", error);
  }
}

export async function addNewDocumentRequestSendMethod(signer, orgAddress, id, title, description, metadata, docType) {
  try {
      const newContract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await newContract.addNewDocumentRequest(orgAddress, id, title, description, metadata, docType);
      await tx.wait();
      console.log("addNewDocumentRequestSendMethod successful. Transaction hash:", tx.hash);
  } catch (error) {
      console.error("addNewDocumentRequestSendMethod error", error);
  }
}


export async function deleteVerificationRequestSendMethod(signer, id) {
    try {
      const newContract = new ethers.Contract(contractAddress, abi, signer);
    
      const tx = await newContract.deleteVerificationRequest(id);

      await tx.wait();
      console.log("deleteVerificationRequestSendMethod successful. Transaction hash:", tx.hash);
    
    } catch(error) {
        console.error("deleteVerificationRequestSendMethod error", error);
    }
}

export async function deleteNewDocumentRequestSendMethod(signer, id) {
    try {
      const newContract = new ethers.Contract(contractAddress, abi, signer);
    
      const tx = await newContract.deleteNewDocumentRequest(id);

      await tx.wait();
      console.log("deleteNewDocumentRequestSendMethod successful. Transaction hash:", tx.hash);
    } catch(error) {
        console.error("deleteNewDocumentRequestSendMethod error", error);
    }
}

export const requestToJoinOrgSendMethod = async (signer, orgAddress, description) => {
    try {
      const newContract = new ethers.Contract(contractAddress, abi, signer);
    
      const tx = await newContract.requestToJoinOrg(orgAddress, description);
      
      await tx.wait();
      console.log("requestToJoinOrgSendMethod successful. Transaction hash:", tx.hash);
    } catch (error) {
      console.error("requestToJoinOrgSendMethod failed:", error);
    }
};

export async function getMembersSendFormalMethod() {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
  const newContract = new ethers.Contract(contractAddress, abi, provider);
  
  const result = await newContract.getMembers();
  console.log("getMembersSendFormalMethod successful. Result:", result);
      return result;
  } catch(error) {
      console.error(" there was an error", error);
  }
}