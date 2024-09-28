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

export const UserProfile = () => {

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-20 text-black">
      <div className=" w-full h-96 max-w-screen py-10">
        <h1 className="font-bold text-4xl">Harshit RV</h1>
        <h3 className="mt-2 text-gray-500">0x7EC8e6614A2E3A1E4d6e321376a608666C8B6f8d</h3>
        
        <p className="text-sm font-bold text-gray-400 mt-5">EDUCATION</p>
        <div className="flex gap-2 mt-2">
          {/* <NFTCard2/>
          <NFTCard2/>
          <NFTCard2/>
          <NFTCard2/> */}
        

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
                <NFTCard2 key={index} name={file.metadata.name} imageURL={file.metadata.image}/>
                // <FileCard key={index} name={file.metadata.name} imageUrl={file.metadata.image} />
              ))
            )
        }
        </div>
      </div>
    </div>
  );
}

const NFTCard = () => {
  return (
    <div className="border flex rounded-lg gap-4">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 w-24 h-20 rounded-md"></div>
      <div className="flex flex-col gap-1 justify-center">
        <h3 className="font-semibold text-md">Bonafide Certificate</h3>
        <p className="text-gray-500 text-sm">Issues By: 0x7EC8e6614A2E3A1E4d6e321376a608666C8B6f8d</p>
      </div>
    </div>
  );
}

const NFTCard2 = ({ imageURL, name }) => {
  const imageurl = 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D';
  return (
    <div className="flex flex-col rounded-lg gap-2">
      <img src={imageURL} className="w-56 h-40 rounded-t-md" alt="someting"/>
      <div className="flex flex-col px-2 pb-2 justify-center">
        <h3 className="font-semibold text-sm">{name}</h3>
        <p className="text-gray-500 text-xs">Issues By: 0x7EC...</p>
      </div>
    </div>
  );
}

export function FileCard({ imageUrl, name }) {
  return (
    <div className="border-2 flex flex-col rounded-lg gap-1">
      <img src={imageUrl} className="w-56 h-40 rounded-t-md" />

      <div className="flex flex-col px-2 pb-2 justify-center">
        <h3 className="font-semibold text-sm">{name}</h3>
        <p className="text-gray-500 text-xs">Issues By: 0x7EC...</p>
      </div>
    </div>
  );
}