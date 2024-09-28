
export const pinJsonToIPFS = async (jsonContent) => {
  try {
    // const jsonContent = { hello: 'world' };

    const blob = new Blob([JSON.stringify(jsonContent, null, 2)], { type: 'application/json' });

    const file = new File([blob], 'metadata.json', { type: 'application/json' });

    const data = new FormData();
    data.append('file', file, file.name);

    const pinataMetadata = JSON.stringify({
      name: 'metadata.json'
    });
    data.append('pinataMetadata', pinataMetadata);

    const req = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
      body: data
    };

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', req);
    const resData = await res.json();

    console.log(resData);
    return resData.IpfsHash;
  } catch (error) {
    console.log(error);
  }
};