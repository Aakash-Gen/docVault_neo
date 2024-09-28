/* eslint-disable react/prop-types */
import { User, Check, X , WalletMinimal} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { getUserNameMethod, getNewDocumentRequestsMethod, getVerificationRequestsMethod } from '@/contract/vault/methods'
import {  deleteVerificationRequestSendMethod } from '@/contract/vault/methods2'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useWallet from '@/hooks/useWallet';
import { CheckIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom';

export default function Requests() {

  const fetchNewDocRequests = async () => {
    const walletAddress = localStorage.getItem('walletAddress');
    const result = await getNewDocumentRequestsMethod(walletAddress);
    console.log('new doc requests:', result);
    return result;
  }

  const { data: newDocRequests, isLoading: newDocLoading, refetch: refetchNewDoc } = useQuery('new-doc-requests', fetchNewDocRequests);
  
  const fetchVerificationRequests = async () => {
    const walletAddress = localStorage.getItem('walletAddress');
    const result = await getVerificationRequestsMethod(walletAddress);
    console.log('verification requests:', result);
    return result;
  }

  const { data: verifyRequests, isLoading: verifyLoading, refetch: refetchVerify } = useQuery('org-verification-requests', fetchVerificationRequests);

  return (
    <div className='bg-gray-900 min-h-screen p-8 flex justify-center pt-12'>
      <div className='w-full max-w-4xl pl-20'>
          <Tabs defaultValue="newdoc" className="w-full">
            <div className="flex justify-start mb-8">
              <TabsList className="grid  h-min grid-cols-2 bg-gray-600 text-white">
                <TabsTrigger value="newdoc" className="py-1.5 text-sm flex items-center justify-center">
                  New Document Requests
                </TabsTrigger>
                <TabsTrigger value="verify" className="py-1.5 text-sm flex items-center justify-center">
                  Verification Requests
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="newdoc">
              <div className='grid gap-6'>
                  {
                    newDocLoading && (
                      <div className='w-full rounded-2xl px-3 py-4 text-gray-400 gap-2 justify-between flex'>
                        <span className='font-bold text-2xl'>Loading...</span>
                      </div>
                    ) 
                  }
                  {
                    newDocLoading || newDocRequests === undefined 
                    ? null
                    : newDocRequests.length === 0
                      ? (
                        <div className='w-full rounded-2xl px-3 py-4 text-gray-400 gap-2 justify-between flex'>
                          <span className='font-bold text-2xl'>No requests</span>
                        </div>
                      ): (
                        newDocRequests.map((request, index) => (
                          <RequestCard 
                            key={index}
                            id={request.id}
                            title={request.title}
                            description={request.description}
                            docType={request.docType}
                            publisher={request.publisher}
                            newDoc={true}
                          />
                        ))
                      )
                  }
              </div>
            </TabsContent>
            <TabsContent value="verify">
              <div className='grid gap-6'>
                  {
                    verifyLoading && (
                      <div className='w-full rounded-2xl px-3 py-4 text-gray-400 gap-2 justify-between flex'>
                        <span className='font-bold text-2xl'>Loading...</span>
                      </div>
                    ) 
                  }
                  {
                    verifyLoading || verifyRequests === undefined 
                    ? null
                    : verifyRequests.length === 0
                      ? (
                        <div className='w-full rounded-2xl px-3 py-4 text-gray-400 gap-2 justify-between flex'>
                          <span className='font-bold text-2xl'>No requests</span>
                        </div>
                      ): (
                        verifyRequests.map((request, index) => (
                          <RequestCard 
                            key={index}
                            id={request.id}
                            title={request.title}
                            description={request.description}
                            docType={request.docType}
                            publisher={request.publisher}
                            newDoc={true}
                            refetchVerify={refetchVerify}
                            refetchNewDoc={refetchNewDoc}
                          />
                        ))
                      )
                  }
              </div>
            </TabsContent>
          </Tabs>
          
      </div>
    </div>
  )
}

// function RequestCard2({ name, requester, address }) {
//   return (
//     <div className='bg-[#1C1F2E] rounded-lg p-4 px-6 shadow-lg w-[700px]'>
//       <div className='flex justify-between items-start mb-4'>
//         <div>
//           <h1 className='text-2xl font-semibold text-white mb-2'>{name}</h1>
//         </div>
//       </div>
//       <div className='flex items-center text-gray-400 mb-2'>
//         <User size={18} className='mr-2' />
//         <span>{requester}</span>
//       </div>
//       <div className='flex items-center text-gray-400 mb-5'>
//         <WalletMinimal size={18} className='mr-2' />
//         <span>{address}</span>
//       </div>
//       <div className='flex justify-end space-x-3'>
//         <button className='px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center'>
//           <X size={18} className='mr-2' />
//           Reject
//         </button>
//         <button className='px-3 py-1.5 bg-[#27E8A7] text-black rounded-md hover:bg-[#20C08F] transition-colors flex items-center'>
//           <Check size={18} className='mr-2' />
//           Approve
//         </button>
//       </div>
//     </div>
//   )
// }

function RequestCard(props) {
  const { address, signer } = useWallet(); 
  const navigate = useNavigate();

  const [ name, setName ] = useState('');

  const getNameFromAddress = async () => {
    const name2 = await getUserNameMethod(address, props.address);
    setName(name2);
  }

  useEffect(() => {
    getNameFromAddress();
  },[]);

  const handleUpdate = async (update) => {
    if (props.newDoc) {
      if (update === 'REJECTED') {
        await deleteVerificationRequestSendMethod(signer, props.id);
      } else {
        navigate(`/certificate/${props.publisher}/${props.id}/type/${props.docType}`);
      }
    } else {
      // TODO: handle new doc request
    }
    props.refetchVerify();
    props.refetchNewDoc();
  }

  return (
    <div className="w-full bg-gray-800 rounded-2xl px-6 py-4 text-gray-100 gap-2 flex-col flex">
      <div className='flex gap-2 items-baseline'>
        <span className='font-black text-lg'>{props.title}</span>
        <span className='text-gray-400 font-semibold text-md'>({String(props.address).slice(0, 10)}...)</span>
      </div>
      <span className='text-gray-400 text-sm font-semibold mb-3'>{props.description}</span>
      <div className='flex justify-end items-center'>
        {/* <Button 
          onClick={() => handleUpdate('BLOCKED')}
          variant="ghost" 
          size="sm"
          className="text-red-400 hover:text-red-300 hover:bg-red-900/30 px-3 py-1"
        >
          Block User
        </Button> */}
        <div className='flex gap-3'>
          <Button 
            onClick={() => handleUpdate('REJECTED')}
            variant="ghost" 
            size="icon"
            className="p-0 h-8 w-8 bg-gray-600 hover:bg-gray-500 text-white"
            aria-label="Reject"
          >
            <XIcon className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => handleUpdate('ACCEPTED')}
            variant="ghost" 
            size="icon"
            className="p-0 h-8 w-8 bg-primaryGreen hover:bg-primaryGreen/70 text-black"
            aria-label="Accept"
          >
            <CheckIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
