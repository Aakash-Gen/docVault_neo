export const UserProfile = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-20 text-black">
      <div className=" w-full h-96 max-w-screen py-10">
        <h1 className="font-bold text-4xl">Harshit RV</h1>
        <h3 className="mt-2 text-gray-500">0x7EC8e6614A2E3A1E4d6e321376a608666C8B6f8d</h3>
        
        <p className="text-sm font-bold text-gray-400 mt-5">EDUCATION</p>
        <div className="flex gap-2 mt-2">
          <NFTCard2/>
          <NFTCard2/>
          <NFTCard2/>
          <NFTCard2/>
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

const NFTCard2 = () => {
  return (
    <div className="border-2 flex flex-col rounded-lg gap-2">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 w-56 h-40 rounded-t-md"></div>
      <div className="flex flex-col px-2 pb-2 justify-center">
        <h3 className="font-semibold text-sm">Bonafide Certificate</h3>
        <p className="text-gray-500 text-xs">Issues By: 0x7EC...</p>
      </div>
    </div>
  );
}