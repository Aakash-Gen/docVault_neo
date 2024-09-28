import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FileIcon, MoreVertical, UserIcon, UserPlusIcon, PlusIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog"; // Assuming these components exist

function MyFiles() {
  const [activeTab, setActiveTab] = useState("tab1");
  const [popup, setPopup] = useState(false);
  const [popupTab, setPopupTab] = useState("requestNewFile");
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [success, setSuccess] = useState("")
  const[fileUrl, setFileUrl] =useState("");


  const [ files, setFiles ] = useState([
    { id: 1, name: 'Example File.pdf', type: 'PDF', size: '2.5 MB', url:'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg' },
    { id: 2, name: 'Document.docx', type: 'DOCX', size: '1.8 MB',  url:'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg'},
    { id: 3, name: 'Image.jpg', type: 'JPG', size: '3.2 MB',  url:'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg' },
    { id: 4, name: 'Spreadsheet.xlsx', type: 'XLSX', size: '1.1 MB',  url:'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg' },
    { id: 5, name: 'Presentation.pptx', type: 'PPTX', size: '4.7 MB',  url:'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg'},
  ]);

  const handlePopup = () => {
    setPopup(!popup);
  };
  const handleTabChange =(tabName)=>{
    setActiveTab(tabName);
}

// Handle file change and validation logic
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

    const maxSizeInBytes = 50 * 1024; // 50KB
    if (file.size > maxSizeInBytes) {
      toast.error("File size must be less than 50KB.");
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

// Handle submit for IPFS upload
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



  return (
    <div className="bg-[#0D111D] h-screen px-12">
    <div className="flex justify-between pt-12 pl-14 pr-14 items-center mb-4">
      <h1 className="text-white font-bold text-3xl">My Files</h1>
      <ToastContainer />
      <button
        onClick={handlePopup}
        className="mt-8 bg-[#27E8A7] w-auto text-black font-bold py-2 px-6 rounded-md hover:bg-[#20C08F] transition-colors"
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
                      fileUrl?<img src={fileUrl} />:  
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

    <div className="grid grid-cols-4 gap-4 px-14">
      {files.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  </div>
);
}


function FileCard({ file, deleteFile }) {
  const [showOptions, setShowOptions] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleDelete = () => {
    deleteFile(file.id);
    setDeletePopup(false); 
    setShowOptions(false); 
  };

  return (
    <div className="relative bg-[#1C1F2E] p-4 rounded-lg text-white">

    <img src={file.url} className="rounded mb-2" />

    <div className="flex justify-between items-start ">
    <h3 className="font-semibold  truncate">{file.name}</h3>
      <MoreVertical className="w-5 h-5 cursor-pointer" onClick={toggleOptions} />
    </div>
      

      {showOptions && (
        <div className="absolute right-4 top-18 z-30 bg-gray-800 text-white rounded-md shadow-lg">
          <button
            className="block px-4 py-2 text-left w-full hover:bg-red-600 hover:rounded-md"
            onClick={() => {setDeletePopup(true),setShowOptions(false)}} 
          >
            Delete
          </button>
        </div>
      )}

      {deletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 py-8 px-10 w-96 rounded-lg shadow-lg">
            <h2 className="text-white font-semibold text-lg mb-4">Confirm Delete</h2>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete this file?
            </p>
            <div className="flex justify-end">
              <Button
                onClick={() => setDeletePopup(false)} 
                variant="secondary"
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyFiles