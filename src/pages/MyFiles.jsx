/* eslint-disable react/prop-types */
import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getAllNFTs } from '../contract/methods';
import { useQuery } from 'react-query';
import { useEffect } from 'react';
import { fetchMetadataFromIPFS } from '../utils/fetchMetadataFromIPFS';
import { extractIpfsHash } from '../utils/extractIpfsHash';

function MyFiles() {
  const [ activeTab, setActiveTab ] = useState("tab1");
  const [ popup, setPopup ] = useState(false);
  const [ popupTab, setPopupTab ] = useState("requestNewFile");
  const [ selectedFile, setSelectedFile ] = useState(null);
  const [ predictionResult, setPredictionResult ] = useState(null);
  const [success, setSuccess] = useState("")

  const handlePopup = () => {
    setPopup(!popup);
  };

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
    <div className="flex justify-between pt-12 lg:px-6 items-center mb-4">
      <h1 className="text-white font-bold text-3xl">My Files</h1>
      <ToastContainer />
      <button
        onClick={handlePopup}
        className="bg-[#27E8A7] w-auto text-black font-bold py-2 px-6 rounded-md hover:bg-[#20C08F] transition-colors"
      >
        New File
      </button>
    </div>

    {popup && (
      <Dialog open={popup} onOpenChange={setPopup}>
        <DialogTitle></DialogTitle>
        <DialogContent className="bg-gray-900 border-none text-white py-7 px-8 max-w-[52vh] overflow-auto">
          <div className="flex mb-8 gap-2 h-80">
            <Tabs defaultValue={popupTab}>
              <TabsList className="grid h-min grid-cols-2 mb-[5vh] bg-gray-600 text-white">
                <TabsTrigger value="requestNewFile" className=" text-sm flex items-center justify-center">
                  Request New File
                </TabsTrigger>
                <TabsTrigger value="requestVerification" className=" text-sm flex items-center justify-center">
                  Request Verification
                </TabsTrigger>
              </TabsList>

              <TabsContent value="requestNewFile">
                <form>
                  <div className="mb-8 w-[40vh]">
                    <label className="block text-gray-300 font-semibold">Document Type</label>
                    <select className="w-full border border-gray-300 p-2 mt-2 px-2 rounded-md">
                      <option value="">Select Document</option>
                      <option value="document1">Bonafide Certificate</option>
                      <option value="document2">Merit Award Certificate</option>
                    </select>
                  </div>

                  <div className="mb-8">
                    <label className="block text-gray-300 font-semibold">Organization</label>
                    <select className="w-full border border-gray-300 p-2 mt-2 rounded-md">
                      <option value="">Select Organization</option>
                      <option value="org1">Netaji Subhas University of Technology</option>
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" className="bg-primaryGreen text-black font-medium px-4 py-2 rounded">
                      Request
                    </button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="requestVerification">
                <form>
                  <div className="mb-4  w-[40vh]">
                  
                  
                    {
                      // fileUrl?<img src={fileUrl} />:  
                      <div className="flex justify-between justify-content items-center">
                      <label className="block text-gray-300 font-semibold">Upload File</label>
                      <FileUpload type="file" onChange={handleFileChange} />
                      </div>
                      }
                      
                 
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" className="bg-primaryGreen text-black font-medium px-4 py-2 rounded">
                      Submit
                    </button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    )}

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