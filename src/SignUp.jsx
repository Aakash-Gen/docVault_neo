import { useNavigate } from 'react-router-dom'
import Web3 from 'web3';
import {useState} from 'react';

function SignUp() {
    const navigate = useNavigate();
    

  return (
    <div>
    <div className='h-screen w-full grid md:grid-cols-7 grid-cols-2'>
      {/* Coloured Section */}
      <div className='md:col-span-4 hidden md:flex justify-end items-center'>
        <div className='bg-primaryBlack h-full w-full flex flex-col items-center justify-center pt-14 gap-16'>
          <img 
            className='rounded w-[60vh]' 
            src="https://nanonets.com/blog/content/images/2022/06/shutterstock_1785042593.jpg" 
            alt="Auction"
          />
          <div className='text-white text-center'>
            <h1 className='text-4xl font-bold mb-4'>docVault</h1>
            <p className='text-lg'>Blockchain and AI based Document Verification System</p>
          </div>
        </div>
      </div>
      
      {/* Main Section */}
      <div className='flex flex-col md:col-span-3 col-span-2'>
        <div className='h-full w-full flex flex-col items-center pt-36 gap-16'>
          <div className='text-center'>
            <h1 className='text-3xl font-semibold'>
              Welcome to
            </h1>
            <h1 className='text-5xl font-bold text-primaryGray p-3'>docVault</h1>
          </div>
          <div className='flex flex-col gap-2 text-center'>
            <button 
              type="button" 
             
              className="w-60 py-3 px-5 mt-10 text-sm font-medium rounded-xl border focus:z-10 focus:ring-4 focus:ring-gray-100 bg-primaryBlack text-white border-gray-600 hover:bg-gray-700"
            >
              Login As User
            </button>
            <button 
              type="button" 
 
              className="w-60 py-3 px-5 mt-4 text-sm font-medium rounded-xl border focus:z-10 focus:ring-4 focus:ring-gray-100 bg-primaryBlack text-white border-gray-600 hover:bg-gray-700"
            >
              Login As Organisation
            </button>
       
            <div 
         
              className='font-semibold mt-4 text-base hover:cursor-pointer hover:underline'
            >
              Not registered? Sign Up.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  )
}

export default SignUp