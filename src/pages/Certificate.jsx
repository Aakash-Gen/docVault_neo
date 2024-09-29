import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { useParams } from 'react-router-dom';
import { pinJsonToIPFS } from '@/utils/uploadJsonToIpfs';
import { mintNFT } from '@/contract/methods';
import { payToMint2 } from '@/contract/methods';
import { create } from 'ipfs-http-client';
import useWallet from '@/hooks/useWallet';
import { ToastContainer,toast } from 'react-toastify';
import { deleteNewDocumentRequestSendMethod } from '@/contract/vault/methods2';
import { getUserNameMethod, getOrgNameMethod } from '@/contract/vault/methods';
import 'react-toastify/dist/ReactToastify.css'
import { fetchMetadataFromIPFS } from '@/utils/fetchMetadataFromIPFS';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const CertificateForm = () => {
  const { userAddress, requestId, docType } = useParams();
  const walletAddress = localStorage.getItem('walletAddress');
  const [metadataUri, setMetadataUri] = useState('');
  const {signer} = useWallet();
  const navigate = useNavigate();

  const address = localStorage.getItem('walletAddress');
  const getNameFromAddress = async () => {
    console.log('Address:', address);
    console.log('User Address:', userAddress);
    const nameUser = await getUserNameMethod(address, userAddress);
    const nameOrg = await getOrgNameMethod(address, address);
    console.log({nameUser, nameOrg});
    return { ...formData, 'recipientName': nameUser, 'authorizedName': nameOrg };
  }
  // useEffect(() => {
  //   getNameFromAddress();
  // },[]);


  const [formData, setFormData] = useState({
    documentType: `${docType}`,
    dateOfIssue: '',
    recipientName: '',
    course: '',
    duration: '',
    position: '',
    field: '',
    jobTitle: '',
    reason: '',
    authorizedName: '',
  });

  const [imageUrl, setImageUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const finalFormData= await getNameFromAddress();
      const response = await axios.post('https://9c9f1t91-5001.inc1.devtunnels.ms/generate-certificate', finalFormData);
      console.log('Certificate generated:', response);
      setImageUrl(`https://shoulder-possible-can.quicknode-ipfs.com/ipfs/${response.data.hash}`);
      return response.data.hash;
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };
  
  const handleGenerateAndUpload = async () => {
    try {
      const ipfsHash = await handleSubmit();
      
      // Step 2: Convert the generated image (from localhost) to a blob
      // const imageBlob = await axios.get(imageUrl);
      // console.log('Image Blob:', imageBlob);
  
      // // Step 3: Create a FormData object to upload the image blob to IPFS
      // const fileData = new FormData();
      // const uniqueId = uuidv4();
      // // fileData.append('file', imageBlob.data, `generatedImage-${uniqueId}.png`);
      // fileData.append('file', new Blob([imageBlob.data], { type: 'image/png' }), `generatedImage-${uniqueId}.png`);

  
      // // Step 4: Upload the image to IPFS
      // const imageUploadResponse = await axios({
      //   method: 'post',
      //   url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
      //   data: fileData,
      //   headers: {
      //     Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      // }      
      // });
  
      // const imageIpfsUrl = 'https://gateway.pinata.cloud/ipfs/' + imageUploadResponse.data.IpfsHash;
      // Step 1: Generate the certificate and get the image URL from the localhost server
      // await handleSubmit();
  
      // // Step 2: Convert the generated image (from localhost) to a blob
      // const imageBlob = await axios.get(imageUrl, { responseType: 'blob' });
  
      // // Step 3: Create a FormData object to upload the image blob to IPFS
      // const formData = new FormData();
      // const uniqueId = uuidv4();
      // formData.append("Body", imageBlob.data, `generatedImage-${uniqueId}.png`);
      // formData.append("Key", `generatedImage-${uniqueId}.png`);
      // formData.append("ContentType", 'image/png');
  
      // // Step 4: Use QuickNode API to upload the image to IPFS
      // const requestOptions = {
      //   method: 'POST',
      //   headers: {
      //     'x-api-key': import.meta.env.VITE_QUICKNODE_API_KEY,  // Your QuickNode API key here
      //   },
      //   body: formData,
      //   redirect: 'follow'
      // };
  
      // const response = await fetch("https://api.quicknode.com/ipfs/rest/v1/s3/put-object", requestOptions);
      // const result = await response.json();
      // console.log('IPFS Response:', result);
  
      // if (imageUploadResponse.ok) {
        const imageIpfsUrl = `https://shoulder-possible-can.quicknode-ipfs.com/ipfs/${ipfsHash}`;
        setFileUrl(imageIpfsUrl);
        console.log('Image uploaded to IPFS:', imageIpfsUrl);
  
        // Step 5: Update metadata JSON with the IPFS URL of the uploaded image
        const finalData = await getNameFromAddress();
        const updatedJsonData = {
          description: `This is a ${docType} issued by ${finalData.authorizedName}`,
          image: imageIpfsUrl,  // Use the IPFS URL instead of the localhost URL
          name: formData.documentType,
          attributes: [
            { trait_type: "Creator", value: "docVault" },
            { trait_type: "Owner", value: formData.recipientName },
            { trait_type: "Date Of Issue", value: formData.dateOfIssue },
            { trait_type: "Org ID", value: walletAddress },
          ],
        };
  
        // Step 6: Upload the updated metadata JSON to IPFS (using your existing pinJsonToIPFS method)
        const ipfsResponse = await pinJsonToIPFS(updatedJsonData);
        console.log('IPFS Hash of Metadata:', ipfsResponse);
  
        // Fetch and log the metadata to confirm it's correctly uploaded
        const metadata = await fetchMetadataFromIPFS(ipfsResponse);
        console.log('Fetched Metadata from IPFS:', metadata);
        console.log('setting metadata uri to', ipfsResponse);
        setMetadataUri(ipfsResponse);
        toast.success('Certificate generated and uploaded successfully.');
  
      // } else {
      //   console.error('Error uploading image to IPFS:', imageUploadResponse);
      // }
  
    } catch (error) {
      console.error('Error generating or uploading image and metadata:',error);
    }
  };
  

  const handleMint = async () => {
    try {
      if (!metadataUri || metadataUri === '') {
        toast.error('Please generate and upload the certificate first.');
        return;
      }
      await toast.promise(
        payToMint2(signer, userAddress, metadataUri),
        {
          pending: 'minting NFT...',
          success: 'NFT minted successfully',
        }
      );
      await toast.promise(
        deleteNewDocumentRequestSendMethod(signer, requestId),{
          pending: 'Deleting request...',
          success: 'Request deleted successfully',
        }
      );
      navigate('/requests');
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast.error('Error minting NFT. Please try again.');
    }
  }
  

 


  return (
    // <></>
    <div className="p-6 max-h-6xl h-full max-w-4xl mx-auto bg-gray-50 shadow-lg rounded-lg mt-10 flex flex-col">
      <h1 className="text-3xl font-bold mb-8 text-center text-primaryGreen">Generate Certificate</h1>
      <ToastContainer />
      {/* Form */}
      <form className="space-y-8">     
      

        {docType==="Bonafide" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-gray-700 font-semibold">Course</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            />
          </div>

          {/* Recipient Name */}
          <div>
            <label className="block text-gray-700 font-semibold">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            />
          </div>
        </div>
        )}
        

        {docType==="Merit" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Certificate Number */}
          <div>
            <label className="block text-gray-700 font-semibold">Position</label>
            <input
              type="text"
              name="certificateNumber"
              value={formData.position}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            />
          </div>

          {/* Recipient Name */}
          <div>
            <label className="block text-gray-700 font-semibold">Field</label>
            <input
              type="text"
              name="recipientName"
              value={formData.field}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            />
          </div>
        </div>
        )}
         {docType==="Employment-Proof" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-gray-700 font-semibold">Job Title</label>
            <input
              type="text"
              name="certificateNumber"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            />
          </div>

          {/* Recipient Name */}
          <div>
            <label className="block text-gray-700 font-semibold">Duration</label>
            <input
              type="text"
              name="recipientName"
              value={formData.duration}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            />
          </div>
        </div>
        )}
        {docType==="Medical" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-gray-700 font-semibold">Reason</label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            />
          </div>

          {/* Recipient Name */}
          <div>
            <label className="block text-gray-700 font-semibold">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            />
          </div>
        </div>
        )}
        {/* Submit Button */}
        {/* <div className="flex justify-center">
          <Button type="submit" className="w-full bg-primaryGreen text-white">Generate Certificate</Button>
        </div> */}
      </form>

      {/* Display certificate */}
      {imageUrl && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Generated Certificate</h2>
          <img src={imageUrl} alt="Generated Certificate" className="mx-auto border border-gray-300 shadow-lg rounded-lg" />
          {fileUrl && (
            <div className="mt-4">
              <a href={fileUrl} className="text-blue-500" target="_blank" rel="noopener noreferrer">View on IPFS</a>
            </div>
          )}
        </div>
      )}

      <Button className="w-full mb-4 bg-primaryGreen text-white" onClick={handleGenerateAndUpload}> Generate Certificate </Button>
      <Button onClick={handleMint} disable={metadataUri == ''}> Mint NFT </Button>
    </div>
  );
};

export default CertificateForm;


