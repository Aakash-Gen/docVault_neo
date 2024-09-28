/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusIcon } from 'lucide-react'
import { getUserOrganizationsMethod, getOrgNameMethod } from "../contract/vault/methods"
import { requestToJoinOrgSendMethod } from "../contract/vault/methods2"
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import useWallet from '@/hooks/useWallet';

export default function Component() {
  const { signer } = useWallet(); 

  const [ orgAddress, setOrgAddress ] = useState('')
  const [ message, setMessage ] = useState('')

  // const navigate = useNavigate();

  const handleJoin = async () => {
    if (!orgAddress || orgAddress == "") {
      toast.error('Please enter a valid organization address.');
      return;
    }
    if (!message || message == "") {
      toast.error('Please enter a message.');
      return;
    }

    if (signer) {
      await toast.promise(
          requestToJoinOrgSendMethod(signer, orgAddress, message),
          {
            pending: 'Requesting to join the organisation',
            success: 'Request Sent',
          }
      )
    } else {
      toast.error('Please enter a valid wallet address.');
    }
  };

  const fetchOrgs = async () => {
    const walletAddress = localStorage.getItem('walletAddress');
    const result = await getUserOrganizationsMethod(walletAddress);
    console.log('result: ', result);
    return result;
  }

  const { data: orgs, isLoading: orgsLoading } = useQuery('user-orgs2', fetchOrgs);

  // const getNameFromAddress = async () => {
  //   const name = await getUserNameMethod(address, address);
  //   console.log('name', name);
  //   return name;
  // }

  return (
    <div className="min-h-screen w-full bg-gray-900 px-5 flex justify-center">
      <div className='flex flex-col gap-6 my-10 w-full max-w-[900px]'>
        <div className="flex justify-between items-center">
          <h1 className="text-white font-bold text-xl ml-1">My Organizations</h1>

          <Dialog>
            <DialogTrigger>
              <Button 
                className='bg-primaryGreen text-black font-bold hover:bg-primaryGreen/70 transition-colors'
              >
                <PlusIcon className=" h-4 w-4 " /> Join New
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-none text-white py-7 px-8">
              <DialogHeader>
                <DialogTitle className="mb-6 text-xl">Request to Join New Organisation</DialogTitle>
                <DialogDescription>
                  <input 
                    type="text" 
                    placeholder="Organization's Address" 
                    className="w-full p-2 mb-4 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-primaryColor" 
                    value={orgAddress}
                    onChange={(e) => setOrgAddress(e.target.value)} 
                  />
                  <input 
                    type="text" 
                    placeholder="Message" 
                    className="w-full mt-3 p-2 mb-4 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-primaryColor" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)} 
                  />
                  <div className='w-full flex justify-end mt-2'>
                    <Button 
                      onClick={handleJoin}
                      className="bg-primaryGreen text-black font-medium hover:bg-emerald-600 transition-colors"
                    >
                      Send Request
                    </Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {
            orgsLoading && (
              <div className='w-full rounded-2xl px-3 py-4 text-gray-400 gap-2 justify-between flex'>
                <span className='font-bold text-2xl'>Loading...</span>
              </div>
            ) 
          }
          {
            orgsLoading || orgs === undefined 
            ? null
            : orgs.length === 0
              ? (
                <div className='w-full rounded-2xl px-3 py-4 text-gray-400 gap-2 justify-between flex'>
                  <span className='font-bold text-2xl'>No organisations joined</span>
                </div>
              ): (
                orgs.map((org, index) => (
                  <OrgElement key={index} orgAddress={org} />
                ))
              )
          }
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

const OrgElement = ({ orgAddress }) => {
  const { address } = useWallet(); 
  const navigate = useNavigate();

  const [ name, setName ] = useState('');

  const getNameFromAddress = async () => {
    const name2 = await getOrgNameMethod(address, orgAddress);
    setName(name2);
  }

  useEffect(() => {
    getNameFromAddress();
  },[]);

  return (
    <Card
      onClick={() => navigate(`/org/${orgAddress}`)}
      className="bg-gray-800 hover:cursor-pointer hover:shadow-3xl text-white border-none flex flex-col justify-between w-full h-min"
    >
      <CardContent className="pt-6">
        <h2 className="text-[2.5vh] font-semibold text-gray-200 mb-4">{name}</h2>
        <p className="text-md text-gray-500">({String(orgAddress).slice(0, 20)}...)</p>
      </CardContent>
      <CardFooter className="flex justify-between">
      </CardFooter>
    </Card>
  )
}