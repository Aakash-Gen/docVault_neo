/* eslint-disable react/prop-types */
import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getAllNFTs } from '../contract/methods';
import { useQuery } from 'react-query';
import { useEffect } from 'react';
import { fetchMetadataFromIPFS } from '../utils/fetchMetadataFromIPFS';
import { extractIpfsHash } from '../utils/extractIpfsHash';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function MyFiles() {
  const [ selectedFile, setSelectedFile ] = useState(null);
  const [ predictionResult, setPredictionResult ] = useState(null);
  const [ success, setSuccess ] = useState("")
  const [ title, setTitle ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ documentType, setDocumentType ] = useState("");

  const handleTabChange =(tabName)=>{
    setActiveTab(tabName);
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);

    setSelectedFile(file); // Store the selected file

    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/pdf"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Only PNG, JPG, JPEG are allowed.");
        return;
      }

      const maxSizeInBytes = 1024 * 1024; // 50KB
      if (file.size > maxSizeInBytes) {
        toast.error("File size must be less than 1 MB.");
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      try {
        console.log("Uploading file for validation...");

        // Upload the file for blurriness and OCR test
        const response = await axios.post('http://localhost:5002/upload', formData);

        // Call the prediction endpoint for edge detection
        const predictionResponse = await axios.post('http://127.0.0.1:5000/predict', formData);

        // Handle response from backend validation
        if (response.data.error) {
          toast.error(`Backend Error: ${response.data.error}`);
          setSuccess(false);
          return;
        }

        const result = response.data.result;
        if (typeof result === 'string' && result.includes('blurry')) {
          toast.error('The image is blurry.');
          setSuccess(false);
          return;
        } else if (typeof result === 'string' && result.includes('rejected')) {
          toast.error('The image did not pass OCR test.');
          setSuccess(false);
          return;
        }

        // Handle edge detection prediction
        if (predictionResponse.data.prediction === 1) {
          setPredictionResult("Document passed edge detection test.");
          setSuccess(true);
          toast.success("Document passed all tests.");

          // Now call handleSubmit since all tests passed
          handleSubmit(file); // Pass the file to handleSubmit for IPFS upload
        } else {
          setPredictionResult("Document did not pass edge detection test.");
          toast.error("Document did not pass edge detection test.");
          setSuccess(false);
          return;
        }
      } catch (error) {
        toast.error('Error uploading the image.');
        setSuccess(false);
        console.error('Error:', error.response ? error.response.data : error.message);
        return;
      }

      console.log("File is valid", file);
    }
  };

  const handleSubmit = async (file) => {
    try {
      const fileData = new FormData();
      fileData.append("file", file); // Use the file passed from handleFileChange

      const responseData = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: fileData,
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,  
        }
      });

      const fileUrl = "https://gateway.pinata.cloud/ipfs/" + responseData.data.IpfsHash;
      setFileUrl(fileUrl);
      toast.success("File successfully uploaded to IPFS!");
      console.log(fileUrl)
    } catch (err) {
      console.error(err);
      toast.error("Error uploading file to IPFS.");
    }
  };

  const fetchFiles = async () => {
    const walletAddress = localStorage.getItem('walletAddress');
    const result = await getAllNFTs(walletAddress);
    const tokenPromises = result.map(async (token) => {
        const hash = extractIpfsHash(token.tokenURI)
        const metadata = await fetchMetadataFromIPFS(hash);
        console.log('metadata: ', metadata);
        return { ...token, metadata };
    });

    const tokensWithMetadata = await Promise.all(tokenPromises);
    console.log('all files: ', tokensWithMetadata);
    return tokensWithMetadata;
  }

  const { data: filesData, isLoading: filesLoading, refetch: filesRefetch } = useQuery(`my-user-orgs-`, fetchFiles, { enabled: false });

  useEffect(() => {
    filesRefetch();
  }, [])

  return (
    <div className="bg-[#0D111D] h-screen px-12">
    <ToastContainer />

    <div className="flex justify-between pt-12 lg:px-6 items-center mb-4">
      <h1 className="text-white font-bold text-3xl">My Files</h1>
        {/* <Dialog>
          <DialogTrigger>
            <button
              className="bg-[#27E8A7] text-black font-bold py-2 px-6 rounded-md hover:bg-[#20C08F] transition-colors"
            >
              New File
            </button>
          </DialogTrigger>
          <DialogTitle className="hidden"></DialogTitle>
          <DialogContent className="bg-gray-200">
              <Tabs defaultValue="new" className="w-full mt-4">
                <div className="flex justify-start mb-8">
                  <TabsList className="grid w-full h-min grid-cols-2 bg-gray-800 text-white">
                    <TabsTrigger value="new" className="py-1.5 text-sm flex items-center justify-center">
                      Members
                    </TabsTrigger>
                    <TabsTrigger value="verify" className="py-1.5 text-sm flex items-center justify-center">
                      Requests
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="new">
                    <div>
                      <input 
                        type="text" 
                        placeholder="Title" 
                        className="rounded-lg w-full p-2 mb-4 border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-primaryColor" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <input 
                        type="text" 
                        placeholder="Description" 
                        className="rounded-lg w-full p-2 mb-4 border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-primaryColor" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <Select value={documentType} onValueChange={setDocumentType}>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select Doc Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BONAFIDE">Bonafide Certificate</SelectItem>
                          <SelectItem value="MERIT">Merit Award Certificate</SelectItem>
                          <SelectItem value="MEDICAL">Medical Certificate</SelectItem>
                          <SelectItem value="SCHOOL">School leaving Certificate</SelectItem>
                          <SelectItem value="LOR">Letter of Recommendation</SelectItem>
                          <SelectItem value="APPOINTMENT">Appointment letter</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex justify-end mt-8">
                        <button
                          type="button"
                          className="bg-black text-white px-4 py-2 rounded mr-2"
                          onClick={handlePopup}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          onClick={onNewDocumentRequest}
                          className="bg-primaryGreen text-black font-medium px-4 py-2 rounded"
                        >
                          Request
                        </button>
                      </div>
                    </div>
                </TabsContent>
                <TabsContent value="verify">
                    <div>
                      <Select value={documentType} onValueChange={setDocumentType}>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select Doc Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BONAFIDE">Bonafide Certificate</SelectItem>
                          <SelectItem value="MERIT">Merit Award Certificate</SelectItem>
                          <SelectItem value="MEDICAL">Medical Certificate</SelectItem>
                          <SelectItem value="SCHOOL">School leaving Certificate</SelectItem>
                          <SelectItem value="LOR">Letter of Recommendation</SelectItem>
                          <SelectItem value="APPOINTMENT">Appointment letter</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="mb-4 mt-5">
                        <FileUpload onChange={handleFileChange} />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="bg-black text-white px-4 py-2 rounded mr-2"
                          onClick={handlePopup}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-primaryGreen text-black font-medium px-4 py-2 rounded"
                          onClick={onSubmitRequestVerification}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                </TabsContent>
              </Tabs>
          </DialogContent>
        </Dialog> */}
    </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {
          filesLoading && (
            <div className='w-full rounded-2xl px-3 py-4 text-gray-400 gap-2 justify-between flex'>
              <span className='font-bold text-2xl'>Loading...</span>
            </div>
          ) 
        }
        {
          filesLoading || filesData === undefined 
          ? null
          : filesData.length === 0
            ? (
              <div className='w-full rounded-2xl px-3 py-4 text-gray-400 gap-2 justify-between flex'>
                <span className='font-bold text-2xl'>No Members</span>
              </div>
            ): (
              filesData.map((file, index) => (
                <FileCard key={index} name={file.metadata.name} imageUrl={file.metadata.image} />
              ))
            )
        }
      </div>
    </div>
);
}


export function FileCard({ imageUrl, name }) {
  return (
    <div className="relative bg-[#1C1F2E] p-4 rounded-lg text-white">
      <img src={imageUrl} className="rounded mb-2" />

      <div className="flex justify-between items-start ">
        <h3 className="text-md truncate">{name}</h3>
      </div>
    </div>
  );
}

export default MyFiles