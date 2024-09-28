
export function extractIpfsHash(ipfsString) {
  if (typeof ipfsString !== 'string' || !ipfsString.startsWith('ipfs:/')) {
      throw new Error('Invalid IPFS URI format');
  }

  const ipfsHash = ipfsString.replace('ipfs:/', '');
  
  return ipfsHash;
}

