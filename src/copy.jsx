import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Web3 from 'web3'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogInIcon, Users } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Copy() {
  const navigate = useNavigate()
  const [isConnecting, setIsConnecting] = useState(false)

  // const connectWallet = async (userType: 'user' | 'organization') => {
  //   setIsConnecting(true)
  //   try {
  //     if (typeof window.ethereum !== 'undefined') {
  //       const web3 = new Web3(window.ethereum)
  //       await window.ethereum.request({ method: 'eth_requestAccounts' })
  //       const accounts = await web3.eth.getAccounts()
  //       console.log('Connected account:', accounts[0])
  //       toast.success('Wallet connected successfully!')
  //       setTimeout(() => {
  //         navigate(userType === 'user' ? '/user-dashboard' : '/org-dashboard')
  //       }, 2000)
  //     } else {
  //       toast.error('Please install MetaMask!')
  //     }
  //   } catch (error) {
  //     console.error('Failed to connect wallet:', error)
  //     toast.error('Failed to connect wallet. Please try again.')
  //   } finally {
  //     setIsConnecting(false)
  //   }
  // }
  const connectWallet = async (userType) => {
    setIsConnecting(true);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        console.log('Connected account:', accounts[0]);
        toast.success('Wallet connected successfully!');
        setTimeout(() => {
          navigate(userType === 'user' ? '/user-dashboard' : '/org-dashboard');
        }, 2000);
      } else {
        toast.error('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row px-8">
      {/* Left side - Image and Title */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-8">
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

      {/* Right side - Login Form */}
      <div className="md:w-1/2 flex justify-center items-center p-8">
        <Card className="w-full max-w-md bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Welcome to docVault</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Connect your wallet to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => connectWallet('user')}
              disabled={isConnecting}
            >
              <LogInIcon className="mr-2 h-4 w-4" /> 
              {isConnecting ? 'Connecting...' : 'Login as User'}
            </Button>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => connectWallet('organization')}
              disabled={isConnecting}
            >
              <Users className="mr-2 h-4 w-4" /> 
              {isConnecting ? 'Connecting...' : 'Login as Organization'}
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-400 text-center w-full">
              Not registered?{' '}
              <span 
                className="text-emerald-500 hover:underline cursor-pointer"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </span>
            </p>
          </CardFooter>
        </Card>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  )
}