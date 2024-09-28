
// // SPDX-License-Identifier: MIT
// // Compatible with OpenZeppelin Contracts ^5.0.0
// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";

// contract DocVault is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
//     uint256 private _nextTokenId;
//     mapping(string => uint8) existingURIs;
//     using Counters for Counters.Counter;

//     Counters.Counter private _tokenIdCounter;

//     constructor(address initialOwner)
//         ERC721("DocVault", "DVT")
//         Ownable(initialOwner)
//     {}

//     function _baseURI() internal pure override returns (string memory) {
//         return "ipfs://";
//     }

//     function safeMint(address to, string memory uri) public onlyOwner {
//         require(existingURIs[uri] != 1, 'NFT already minted!');
//         uint256 tokenId = _nextTokenId++;
//         _safeMint(to, tokenId);
//         _setTokenURI(tokenId, uri);
//         existingURIs[uri] = 1;
//     }

    

//     // The following functions are overrides required by Solidity.

//     function _update(address to, uint256 tokenId, address auth)
//         internal
//         override(ERC721, ERC721Enumerable)
//         returns (address)
//     {
//         return super._update(to, tokenId, auth);
//     }

//     function _increaseBalance(address account, uint128 value)
//         internal
//         override(ERC721, ERC721Enumerable)
//     {
//         super._increaseBalance(account, value);
//     }

//     function tokenURI(uint256 tokenId)
//         public
//         view
//         override(ERC721, ERC721URIStorage)
//         returns (string memory)
//     {
//         return super.tokenURI(tokenId);
//     }
    
//     function supportsInterface(bytes4 interfaceId)
//         public
//         view
//         override(ERC721, ERC721Enumerable, ERC721URIStorage)
//         returns (bool)
//     {
//         return super.supportsInterface(interfaceId);
//     }

//     function isContentOwned(string memory uri) public view returns (bool) {
//         return existingURIs[uri] == 1;
//     }

//     function payToMint(
//         address recipient,
//         string memory metadataURI
//     ) public payable returns (uint256) {
//         require(existingURIs[metadataURI] != 1, 'NFT already minted!');
//         require (msg.value >= 0.00001 ether, 'Need to pay up!');

//         uint256 newItemId = _tokenIdCounter.current();
//         _tokenIdCounter.increment();
//         existingURIs[metadataURI] = 1;

//         _mint(recipient, newItemId);
//         _setTokenURI(newItemId, metadataURI);

//         return newItemId;
//     }
// }