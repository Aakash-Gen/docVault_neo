/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { connectWallet } from '@/utils/connectWallet';
import { getUserNameMethod, getOrgNameMethod } from '@/contract/vault/methods';
import { registerUserSendMethod, registerOrganizationSendMethod } from '@/contract/vault/methods2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center md:flex-row px-8">
      <div className="flex flex-col justify-center items-center p-8 pt-2">
        <img 
          className="rounded-lg shadow-2xl mb-8 max-w-md w-full" 
          src="https://nanonets.com/blog/content/images/2022/06/shutterstock_1785042593.jpg" 
          alt="Document Verification"
        />
        <h1 className="text-4xl font-bold text-white mb-4">docVault</h1>
        <p className="text-xl text-gray-300 text-center">
          Blockchain and AI based Document Verification System
        </p>
      </div>
      
      <div className="md:w-1/2 flex justify-center items-center p-8 pt-2 ">
        <Card className="w-full max-w-md py-2 bg-gray-800 text-white border-gray-700 h-min">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Welcome to docVault</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Connect your wallet to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Tabs defaultValue="user" className="w-3/4 pt-4">
              <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="user" 
                className="text-black data-[state=active]:text-white data-[state=active]:bg-gray-600">
                User
              </TabsTrigger>
              <TabsTrigger 
                value="organization" 
                className="text-black data-[state=active]:text-white data-[state=active]:bg-gray-600">
                Organization
              </TabsTrigger>
              </TabsList>
              <TabsContent value="user">
                <UserForm navigate={navigate} />
              </TabsContent>
              <TabsContent value="organization">
                <OrganizationForm navigate={navigate} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
}

function UserForm({ navigate }) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async (isSignUp) => {
    setIsLoading(true);
    try {
      const { account, signer } = await connectWallet();

      if (!account) {
        toast.error("Failed to connect wallet. Please try again.");
        return;
      }
      
      if (isSignUp) {

        if (!name || name == "") {
          toast.error("Please enter your name.");
          return;
        }

        await toast.promise(
          registerUserSendMethod(signer, name),
          {
            pending: 'Creating user..',
            success: 'User created successfully. Redirecting to dashboard..',
          }
        )

        localStorage.setItem('role', 'user');
        localStorage.setItem('walletAddress', account);
        navigate('/myfiles'); 

      } else {

        const userName = await getUserNameMethod(account, account);

        if (userName == null) {
          toast.error("User not registered. Please sign up.");
          return;
        }

        localStorage.setItem('role', 'user');
        localStorage.setItem('walletAddress', account);
        navigate('/myfiles'); 

      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <Input 
        type="text" 
        placeholder="Name" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
      />
      <Button 
        onClick={() => handleConnect(true)}
        className="w-full bg-gray-800 border border-primaryGreen hover:bg-gray-700 text-primaryGreen"
        disabled={isLoading}
      >
        {isLoading ? 'Connecting...' : 'Connect and Sign Up'}
      </Button>
      <div className="relative">
        <Separator className="my-4" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-gray-800 px-2 text-gray-400 text-sm">OR</span>
        </div>
      </div>
      <Button 
        // variant="outline"
        onClick={() => handleConnect(false)}
        className="w-full  bg-primaryGreen hover:bg-emerald-700 text-black"
        disabled={isLoading}
      >
        {isLoading ? 'Connecting...' : 'Connect and Sign In'}
      </Button>
    </div>
  );
}

function OrganizationForm({ navigate }) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async (isSignUp) => {
    setIsLoading(true);
    try {
      const { account, signer } = await connectWallet();

      if (!account) {
        toast.error("Failed to connect wallet. Please try again.");
        return;
      }
      
      if (isSignUp) {

        if (!name || name == "") {
          toast.error("Please enter your organization's name.");
          return;
        }

        await toast.promise(
          registerOrganizationSendMethod(signer, name),
          {
            pending: 'Creating organization..',
            success: 'Ogranization created successfully. Redirecting to dashboard..',
          }
        )

        localStorage.setItem('role', 'org');
        localStorage.setItem('walletAddress', account);
        navigate('/members'); 

      } else {

        const orgName = await getOrgNameMethod(account, account);

        if (orgName == null) {
          toast.error("Organization not registered. Please sign up.");
          return;
        }

        localStorage.setItem('role', 'org');
        localStorage.setItem('walletAddress', account);
        navigate('/members'); 

      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-4'>

      <Input 
        type="text" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Organization Name" 
        className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
      />
      <Button 
        onClick={() => handleConnect(true)}
        className="w-full bg-gray-800 border border-primaryGreen hover:bg-gray-700 text-primaryGreen"
        disabled={isLoading}
      >
        {isLoading ? 'Connecting...' : 'Connect and Sign Up'}
      </Button>

      <div className="relative">
        <Separator className="my-4" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-gray-800 px-2 text-gray-400 text-sm">OR</span>
        </div>
      </div>

      <Button 
        onClick={() => handleConnect(false)}
        // variant="outline"
        className="w-full bg-primaryGreen hover:bg-emerald-700 text-black"
        disabled={isLoading}
      >
        {isLoading ? 'Connecting...' : 'Connect and Sign In'}
      </Button>
     
    </div>
  );
}

export default Login;
