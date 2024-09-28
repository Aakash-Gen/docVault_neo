import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { useParams } from 'react-router-dom';
import { pinJsonToIPFS } from '@/utils/uploadJsonToIpfs';
import { mintNFT } from '@/contract/methods';
import { payToMint2 } from '@/contract/methods';
import useWallet from '@/hooks/useWallet';
import { toast } from 'react-toastify';
import { deleteNewDocumentRequestSendMethod } from '@/contract/vault/methods2';
import 'react-toastify/dist/ReactToastify.css'

const jsonData = {

  description: "For testing docVault",
  image: "https://media.disneylandparis.com/d4th/en-usd/images/HD13302_2_2050jan01_world_disneyland-park-dlp-website-visual_5-2_tcm1861-248638.jpg?w=1920&f=webp",
  name: "Disney Castle",
  attributes: [
    { trait_type: "Creator", value: "Starfish" },
    { trait_type: "Company", value: "Disney" },
    { trait_type: "Mouth", value: "Surprised" },
  ]
};

const CertificateForm = () => {
  const { userAddress, requestId, docType } = useParams();
  const walletAddress = localStorage.getItem('walletAddress');
  const [metadataUri, setMetadataUri] = useState('');
  const {signer} = useWallet();

  const [formData, setFormData] = useState({
    documentType: `${docType}`,
    organization: '',
    institutionName: '',
    dateOfIssue: '',
    certificateNumber: '',
    recipientName: '',
    course: '',
    duration: '',
    purpose: '',
    authorizedName: '',
    authorizedDesignation: '',
    signatureDate: '',
  });

  const [imageUrl, setImageUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchMetadataFromIPFS = async (ipfsHash) => {
    try {
      const metadataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      console.log('Fetching metadata from IPFS:', metadataUrl);
  
      // Fetch the metadata JSON directly and parse it
      const response = await fetch(metadataUrl);
      
      // Check if the response is okay, then parse it as JSON
      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }
  
      const metadata = await response.json();  // This is the parsed JSON
      return metadata;  // Return the parsed JSON metadata
    } catch (error) {
      console.error('Error fetching metadata from IPFS:', error);
      return null;
    }
  };


  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5001/generate-certificate', formData, {
        responseType: 'blob',
      });
      console.log('Certificate generated:', response);
  
      const url = URL.createObjectURL(response.data);
      console.log('Generated Certificate URL:', url);
      setImageUrl(url);
      setDownloadUrl(url); // Set the URL for download
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };
  
  const handleGenerateAndUpload = async () => {
    try {
      // Step 1: Generate the certificate and get the image URL from the localhost server
      await handleSubmit();
      
      // Step 2: Convert the generated image (from localhost) to a blob
      const imageBlob = await axios.get(imageUrl, { responseType: 'blob' });
  
      // Step 3: Create a FormData object to upload the image blob to IPFS
      const fileData = new FormData();
      fileData.append('file', imageBlob.data, 'generatedImage.png');
  
      // Step 4: Upload the image to IPFS
      const imageUploadResponse = await axios({
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        data: fileData,
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      }      
      });
  
      const imageIpfsUrl = 'https://gateway.pinata.cloud/ipfs/' + imageUploadResponse.data.IpfsHash;
      setFileUrl(imageIpfsUrl);
      console.log('Image uploaded to IPFS:', imageIpfsUrl);
  
      // Step 5: Update metadata JSON with the IPFS URL of the uploaded image
      const updatedJsonData = {
        description: `This is a ${docType} issued by ${formData.organization}`,
        image: imageIpfsUrl,  // Use the IPFS URL instead of the localhost URL
        name: formData.documentType,
        attributes: [
          { trait_type: "Creator", value: "docVault" },
          { trait_type: "Owner", value: formData.recipientName },
          { trait_type: "Date Of Issue", value: formData.dateOfIssue },
          { trait_type: "Org ID", value: walletAddress
           },
        ],
      };
  
      // Step 6: Upload the updated metadata JSON to IPFS
      const ipfsResponse = await pinJsonToIPFS(updatedJsonData);
      console.log('IPFS Hash of Metadata:', ipfsResponse);
  
      // Fetch and log the metadata to confirm it's correctly uploaded
      const metadata = await fetchMetadataFromIPFS(ipfsResponse);
      console.log('Fetched Metadata from IPFS:', metadata);
      setMetadataUri(ipfsResponse);
  
      // You can handle further steps or UI updates here if needed.
  
    } catch (error) {
      console.error('Error generating or uploading image and metadata:', error);
    }
  };
  const handleMint = async () => {
    try {
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
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast.error('Error minting NFT. Please try again.');
    }
  }
  

  return (
    // <></>
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 shadow-lg rounded-lg mt-10 flex flex-col">
      <h1 className="text-3xl font-bold mb-8 text-center text-primaryGreen">Generate Certificate</h1>
      
      {/* Form */}
      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Document Type */}
          <div>
            <label className="block text-gray-700 font-semibold">Document Type</label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            >
              <option value="">{docType}</option>
              <option value="bonafide">Bonafide Certificate</option>
              <option value="merit-award">Merit Award Certificate</option>
            </select>
          </div>

          {/* Organization */}
          <div>
            <label className="block text-gray-700 font-semibold">Organization</label>
            <select
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            >
              <option value="">Select Organization</option>
              <option value="nsut">Netaji Subhas University of Technology</option>
              <option value="iitd">Indian Institute of Technology Delhi</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Institution Name */}
          <div>
            <label className="block text-gray-700 font-semibold">Institution Name</label>
            <input
              type="text"
              name="institutionName"
              value={formData.institutionName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            />
          </div>

          {/* Date of Issue */}
          <div>
            <label className="block text-gray-700 font-semibold">Date of Issue</label>
            <input
              type="date"
              name="dateOfIssue"
              value={formData.dateOfIssue}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Certificate Number */}
          <div>
            <label className="block text-gray-700 font-semibold">Certificate Number</label>
            <input
              type="text"
              name="certificateNumber"
              value={formData.certificateNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            />
          </div>

          {/* Recipient Name */}
          <div>
            <label className="block text-gray-700 font-semibold">Recipient Name</label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Course */}
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

          {/* Duration */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Purpose */}
          <div>
            <label className="block text-gray-700 font-semibold">Purpose</label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            />
          </div>

          {/* Authorized Name */}
          <div>
            <label className="block text-gray-700 font-semibold">Authorized Name</label>
            <input
              type="text"
              name="authorizedName"
              value={formData.authorizedName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Authorized Designation */}
          <div>
            <label className="block text-gray-700 font-semibold">Authorized Designation</label>
            <input
              type="text"
              name="authorizedDesignation"
              value={formData.authorizedDesignation}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Signature Date</label>
            <input
              type="date"
              name="signatureDate"
              value={formData.signatureDate}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 mt-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primaryGreen"
            />
          </div>
        </div>

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

      <Button className="w-full bg-primaryGreen text-white" onClick={handleGenerateAndUpload}> Generate Certificate </Button>
      <Button onClick={handleMint}> Mint NFT </Button>
    </div>
  );
};

export default CertificateForm;


