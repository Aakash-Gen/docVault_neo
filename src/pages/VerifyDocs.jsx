import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button"



function VerifyDocs() {
    const [ activeTab, setActiveTab ] =  useState("tab1");
    const [ walletAddress, setWalletAddress ] = useState("");
    const [ nftId, setNftId ] = useState("");
    const [loading, setLoading] = useState(false);
    const [nftMetadata, setNftMetadata] = useState(null);
    const [nftsByWallet, setNftsByWallet] = useState([]);

    const handleTabChange =(tabName)=>{
        setActiveTab(tabName);
        setNftMetadata(null);
        setNftsByWallet([]);
    }
    const handleVerifySubmit = () => {
        setLoading(true);
        
        setTimeout(() => {
            const fetchedMetadata = {
                name: "Example NFT",
                description: "This is a sample NFT",
                image: "https://i.pinimg.com/736x/29/90/0f/29900f2295b5331c95eef740d1dfc9e8.jpg",
                attributes: [
                    { trait_type: "Background", value: "Blue" },
                    { trait_type: "Eyes", value: "Green" },
                ],
            };
            setNftMetadata(fetchedMetadata);
            setLoading(false);
        }, 2000);
    };
    const handleGetNftsSubmit = () => {
        setLoading(true);
        setTimeout(() => {
            const fetchedNfts = [
                { id: 1, name: "NFT 1", image: "https://example.com/nft1.png" },
                { id: 2, name: "NFT 2", image: "https://example.com/nft2.png" },
                { id: 3, name: "NFT 3", image: "https://example.com/nft3.png" },
            ];
            setNftsByWallet(fetchedNfts);
            setLoading(false);
        }, 2000);
    };

  return (
    <div className='bg-gray-900 flex flex-col h-screen items-center pt-16 gap-8 overflow-y-auto pb-16'>
        <h1 className='text-white text-4xl font-bold mb-2'>Verify Documents</h1>
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className='w-full flex flex-col items-center'>
        <div className='flex gap-4 bg-[#1C1F2E] rounded-lg p-1.5 w-[330px] justify-center'>
        <TabsList className='flex gap-2 bg-[#1C1F2E] rounded-lg '>
          <TabsTrigger value="tab1" className={`py-1.5 pr-4 rounded-md ${activeTab === "tab1" ? 'bg-[#27E8A7] text-black' : 'text-white'}`}>
            Verify NFT by ID
          </TabsTrigger>
          <TabsTrigger value="tab2" className={`py-1.5 pl-4 rounded-md ${activeTab === "tab2" ? 'bg-[#27E8A7] text-black' : 'text-white'}`}>
            Get all NFTs of Address
          </TabsTrigger>
        </TabsList>
        </div>

        <TabsContent value="tab1" className='flex flex-col gap-4 mt-12 w-1/3 items-center'>
                <div className='w-full'>
                    <input 
                        type="text" 
                        className='w-full p-3 bg-[#1C1F2E] text-white rounded-md border-none outline-none focus:ring-2 focus:ring-[#3B82F6]' 
                        placeholder="Enter Recipient's Wallet Address" 
                        onChange={(e) => setWalletAddress(e.target.value)} 
                    />
                </div>
                <div className='w-full'>
                    <input 
                        type="text" 
                        className='w-full p-3 bg-[#1C1F2E] text-white rounded-md border-none outline-none focus:ring-2 focus:ring-[#3B82F6]' 
                        placeholder="Enter ID of NFT" 
                        onChange={(e) => setNftId(e.target.value)} 
                    />
                </div>
                <button 
                    onClick={handleVerifySubmit}
                    className='mt-4 bg-[#27E8A7] w-28 text-black font-bold py-3 px-6 rounded-md hover:bg-[#20C08F] transition-colors'>
                    {loading ? <Loader /> : "Submit"}
                </button>
                {nftMetadata && (
                    <div className='flex gap-12 mt-8 justify-center'>
                    {/* JSON Metadata Section */}
                    <div className='w-[40%] h-1/2 text-white bg-[#1C1F2E] p-4 rounded-md overflow-y-auto'>
                        <h2 className='text-2xl mb-4'>NFT Metadata</h2>
                        <pre className='whitespace-pre-wrap break-words w-full max-w-full'>
                            {JSON.stringify(nftMetadata, null, 2)}
                        </pre>
                    </div>

                    {/* NFT Image Section */}
                    <div className='w-[40%] h-1/2 flex justify-center items-center bg-[#1C1F2E] rounded-md'>
                        <img src={nftMetadata.image} alt="NFT" className='w-full h-full object-cover rounded-md' />
                    </div>
                </div>

                )}
        </TabsContent>

        <TabsContent value="tab2" className='flex flex-col gap-4 w-full items-center'>
            <div className='w-1/3'>
                <input 
                        type="text" 
                        className='w-full p-3 bg-[#1C1F2E] text-white rounded-md border-none outline-none focus:ring-2 focus:ring-[#3B82F6]' 
                        placeholder="Enter Recipient's Wallet Address" 
                        onChange={(e) => setWalletAddress(e.target.value)} 
                    />
                </div>
                <button 
                    onClick={handleGetNftsSubmit}
                    className='mt-4 bg-[#27E8A7] w-28 text-black font-bold py-3 px-6 rounded-md hover:bg-[#20C08F] transition-colors'>
                    {loading ? <Loader /> : "Submit"}
                </button>
                {nftsByWallet.length > 0 && (
                <div className='grid grid-cols-3 gap-4 mt-8 pb-8'>
                    {nftsByWallet.map((nft) => (
                        <div key={nft.id} className='bg-[#1C1F2E] p-4 rounded-md'>
                            <img src={nft.image} alt={nft.name} className='w-40 h-40 object-contain' />
                            <h3 className='text-white text-lg mt-2'>{nft.name}</h3>
                        </div>
                    ))}
                </div>
            )}
        </TabsContent>
        </Tabs>
    </div>
  )
}

const Loader = () => (
    <div className="flex items-center justify-center">
      <div className="border-t-4 border-blue-500 border-solid w-6 h-6 px-2 rounded-full animate-spin"></div>
    </div>
);
const Tab =(props)=> {
    const tabClass = props.active ? 'bg-white' : 'bg-gray-500';
    return(
        <div className={`w-48 py-1.5 text-[15px] font-medium flex items-center justify-center rounded-md cursor-pointer ${tabClass}`} onClick={props.onClick}>
            {props.name}
        </div>

    )
}

export default VerifyDocs