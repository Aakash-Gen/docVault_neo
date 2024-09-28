
export async function fetchJsonFromIPFS(ipfsHash) {
  try {
      console.log("doing it");
      const response = await fetch(`https://ipfs.io/ipfs/QmSxWzVwpTsQEDy8KxGXLbJhTf9W81irnaNbgXM4E1TDCp`, {
          headers: { Accept: 'application/json' }
      });
      
      console.log("Response from IPFS:", response);
      console.log("doing it again");
      
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log("doing it again 2");

      const jsonData = await response.json();
      console.log("JSON data fetched from IPFS:", jsonData);
      return jsonData;
  } catch (error) {
      console.error("Error fetching JSON from IPFS:", error);
  }
}