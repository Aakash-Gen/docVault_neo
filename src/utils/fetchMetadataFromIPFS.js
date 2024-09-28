
export const fetchMetadataFromIPFS = async (ipfsHash) => {
  try {
    const metadataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    // console.log('Fetching metadata from IPFS:', metadataUrl);

    const response = await fetch(metadataUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }

    const metadata = await response.json();
    return metadata; 
  } catch (error) {
    console.error('Error fetching metadata from IPFS:', error);
    return null;
  }
};