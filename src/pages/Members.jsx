/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckIcon, XIcon, UserIcon, UserPlusIcon } from 'lucide-react'
import { useQuery } from 'react-query'
import useWallet from '@/hooks/useWallet';
import { getMembersMethod, getJoinRequestsMethod, getUserNameMethod } from '@/contract/vault/methods'
import { getMembersSendFormalMethod} from '@/contract/vault/methods2'
import { updateJoinRequestSendMethod } from '@/contract/vault/methods2'
import { useEffect, useState } from 'react'
import { signMessage } from '@/utils/signMessage';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Members() {  
  // const { address } = useWallet();
  
  const fetchMembers = async () => {
    const walletAddress = localStorage.getItem('walletAddress');
    const result = await getMembersMethod(walletAddress);
    console.log('result', result);
    return result;
  }

  const { data: members, isLoading: membersLoading, refetch: refetchMembers } = useQuery('orgmembers', fetchMembers, { enabled: false });

  const fetchRequests = async () => {
    const walletAddress = localStorage.getItem('walletAddress');
    const result = await getJoinRequestsMethod(walletAddress);
    console.log('requests:', result);
    return result;
  }

  const { data: requests, isLoading: requestsLoading, refetch: refetchRequests } = useQuery('requests', fetchRequests , {
    enabled: false
  });

  useEffect(() => {
    refetchMembers();
    refetchRequests();
  },[]);

  return (
    <div className="bg-gray-900 min-h-screen min-w-full flex flex-col">
      {/* <nav className="bg-gray-800 w-full py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div href="/recent" className="text-gray-300 hover:text-white flex items-center">
            <ClockIcon className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Recent</span>
          </div>
          <div href="/" className="text-gray-300 hover:text-white flex items-center">
            <HomeIcon className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Home</span>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <FileTextIcon className="h-5 w-5 mr-2" />
          Verify Doc
        </Button>
      </nav> */}

      <div className="flex-grow flex flex-col items-center mt-10">
        {/* {address} */}
        <div className="flex-col w-full max-w-[600px] flex items-center">
          <Tabs defaultValue="members" className="w-full">
            <div className="flex justify-start mb-8">
              <TabsList className="grid w-[300px] h-min grid-cols-2 bg-gray-800 text-white">
                <TabsTrigger value="members" className="py-1.5 text-sm flex items-center justify-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Members
                </TabsTrigger>
                <TabsTrigger value="requests" className="py-1.5 text-sm flex items-center justify-center">
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Requests
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="members">
              <div className='w-full flex-col flex gap-4'>
                {
                  membersLoading && (
                    <div className='w-full rounded-2xl px-3 py-4 text-gray-400 gap-2 justify-between flex'>
                      <span className='font-bold text-2xl'>Loading...</span>
                    </div>
                  ) 
                }
                {/* {
                  membersList.map((member, index) => (
                    <MemberElement 
                      key={index}
                      address={member}
                    /> 
                  ))
                } */}
                {
                  membersLoading || members === undefined 
                  ? null
                  : members.length === 0
                    ? (
                      <div className='w-full rounded-2xl px-3 py-4 text-gray-400 gap-2 justify-between flex'>
                        <span className='font-bold text-2xl'>No Members</span>
                      </div>
                    ): (
                      members.map((member, index) => (
                        <MemberElement 
                          key={index}
                          address={member}
                        /> 
                      ))
                    )
                }
              </div>
            </TabsContent>
            <TabsContent value="requests">
              <div className='w-full flex-col flex gap-4'>
                {
                  requestsLoading && (
                    <div className='w-full rounded-2xl px-3 py-4 text-gray-400 gap-2 justify-between flex'>
                      <span className='font-bold text-2xl'>Loading...</span>
                    </div>
                  ) 
                }
                {
                  requestsLoading || requests === undefined 
                  ? null
                  : requests.length === 0
                    ? (
                      <div className='w-full rounded-2xl px-3 py-4 text-gray-400 gap-2 justify-between flex'>
                        <span className='font-bold text-2xl'>No join requests</span>
                      </div>
                    ): (
                      requests.map((request, index) => (
                        <JoinRequestElement 
                          key={index}
                          name={request.address}
                          address={request.publisher}
                          description={request.description}
                          refetchMembers={refetchMembers}
                          refetchRequests={refetchRequests}
                        />
                      ))
                    )
                }
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function JoinRequestElement(props) {
  const { address, signer } = useWallet();

  const [ name, setName ] = useState('');

  const getNameFromAddress = async () => {
    const name2 = await getUserNameMethod(address, props.address);
    setName(name2);
  }

  useEffect(() => {
    getNameFromAddress();
  },[]);

  const handleUpdate = async (update) => {
    const { r, s, v, hashedMessage } = await signMessage();
    await toast.promise(
      updateJoinRequestSendMethod(signer, props.address, update, hashedMessage, v, r, s),
      {
        pending: 'Processing...',
        success: `User ${String(update).toLowerCase()}`,
      }
    );
    props.refetchMembers();
    props.refetchRequests();
  }

  return (
    <div className="w-full bg-gray-800 rounded-2xl px-6 py-4 text-gray-100 gap-2 flex-col flex">
      <div className='flex gap-2 items-baseline'>
        <span className='font-black text-lg'>{name}</span>
        <span className='text-gray-400 font-semibold text-md'>({String(props.address).slice(0, 10)}...)</span>
      </div>
      <span className='text-gray-400 text-sm font-semibold mb-3'>{props.description}</span>
      <div className='flex justify-between items-center'>
        <Button 
          onClick={() => handleUpdate('BLOCKED')}
          variant="ghost" 
          size="sm"
          className="text-red-400 hover:text-red-300 hover:bg-red-900/30 px-3 py-1"
        >
          Block User
        </Button>
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

function MemberElement(props) {
  const { address } = useWallet(); 

  const [ name, setName ] = useState('');

  const getNameFromAddress = async () => {
    const name2 = await getUserNameMethod(address, props.address);
    setName(name2);
  }

  useEffect(() => {
    getNameFromAddress();
  },[]);

  return (
    <div className="w-full bg-gray-800 rounded-2xl px-6 py-4 text-gray-100 gap-2 justify-between flex">
      <div className='flex gap-2 items-baseline'>
        <span className='font-bold text-lg'>{name}</span>
        <span className='text-gray-400 font-semibold text-md'>({String(props.address).slice(0, 10)}...)</span>
      </div>
    </div>
  )
}