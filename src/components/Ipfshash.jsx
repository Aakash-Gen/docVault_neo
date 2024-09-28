
import { useState } from 'react'
import axios from 'axios';

function IpfsHash() {
  const[fileUrl, setFileUrl] =useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const fileData = new FormData();
      fileData.append("file", file); 

      const responseData = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: fileData,
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,  

        }
      })
      const fileUrl = "https://gateway.pinata.cloud/ipfs/" + responseData.data.IpfsHash;
      setFileUrl(fileUrl);

    } catch(err){
      console.log(err)

    }
  }


  return (
    <>
    <div className='p-20'>
      <h1>IPFS: Upload File</h1>
     
      {fileUrl && (
        <a href= {fileUrl} target ="blank" >Check the image here</a>
      )}
    </div>


    </>
  )
}

export default IpfsHash