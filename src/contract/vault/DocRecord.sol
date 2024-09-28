// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract TokenContract {
    string public name = "DocRecord";
    string public symbol = "DRD";

    address[] public orgsId;
    address[] public users;
    mapping(address => address[]) public orgMembers;
    mapping(address => address[]) public blockedAddresses;

    mapping(address => string) public userNames;
    mapping(address => string) public orgNames;



    struct VerificationRequest {
        string id;
        address orgAddress;
        string ipfsHash;
        address publisher;
        string title;
        string description;
        string metadata;
        string docType;
    }

    struct NewDocumentRequests {
        string id;
        address orgAddress;
        address publisher;
        string title;
        string description;
        string metadata;
        string docType;
    }

    struct JoinRequest {
        address publisher;
        string description;
    }

    mapping(address => VerificationRequest[]) public verificationRequests;

    mapping(address => NewDocumentRequests[]) public newDocumentRequests;

    mapping(address => JoinRequest[]) public joinRequests;


    function myAddress() private view returns (address) {
        return msg.sender;
    }

    
    // ORGANISATION SIDE
    function registerOrganization(string memory orgName) public {
        orgsId.push(msg.sender);
        orgNames[msg.sender] = orgName;
    }

    function getVerificationRequests() public view returns (VerificationRequest[] memory) {
        return verificationRequests[msg.sender];
    }

    function getNewDocumentRequests() public view returns (NewDocumentRequests[] memory) {
        return newDocumentRequests[msg.sender];
    }

    function getOrgName(address orgId) public view returns (string memory) {
        return orgNames[orgId];
    }
    
    function getJoinRequests() public view returns (JoinRequest[] memory) {
        return joinRequests[msg.sender];
    }

    function getMembers() public view returns (address[] memory) {
        return orgMembers[msg.sender];
    }

    function updateJoinRequest(address member, string memory acceptanceStatus, bytes32 _hashedMessage, uint8 _v, bytes32 _r, bytes32 _s) public returns (uint) {
        address signer = verifyMessage(_hashedMessage, _v, _r, _s);
        if (signer != msg.sender) {
            return 403;
        } else {
            if (compareStrings(acceptanceStatus, "ACCEPTED")) {
                orgMembers[msg.sender].push(member);
                removeJoinRequest(member);
            } else if (compareStrings(acceptanceStatus, "BLOCKED")) {
                removeJoinRequest(member);
                blockedAddresses[msg.sender].push(member);
            } else {
                removeJoinRequest(member);
            }
            return 200;
        }
    }
    
    function removeJoinRequest(address publisherToRemove) public {
        JoinRequest[] storage requests = joinRequests[msg.sender];
        uint256 length = requests.length;

        for (uint256 i = 0; i < length; i++) {
            if (requests[i].publisher == publisherToRemove) {
                requests[i] = requests[length - 1];
                requests.pop();
                break;
            }
        }
    }

    function deleteVerificationRequest(string memory requestId) public returns (bool) {
        VerificationRequest[] storage requests = verificationRequests[msg.sender];
        uint256 length = requests.length;

        for (uint256 i = 0; i < length; i++) {
            if (compareStrings(requests[i].id, requestId)) {
                requests[i] = requests[length - 1];
                requests.pop();
                return true;
            }
        }

        return false;
    }

    function deleteNewDocumentRequest(string memory requestId) public returns (bool) {
        NewDocumentRequests[] storage requests = newDocumentRequests[msg.sender];
        uint256 length = requests.length;

        for (uint256 i = 0; i < length; i++) {
            if (compareStrings(requests[i].id, requestId)) {
                requests[i] = requests[length - 1];
                requests.pop();
                return true;
            }
        }

        return false;
    }


    // USER SIDE
    function registerUser(string memory userName) public {
        users.push(msg.sender);
        userNames[msg.sender] = userName;
    }

    function getUserName(address user) public view returns (string memory) {
        return userNames[user];
    }

    function getUserOrganizations() public view returns (address[] memory) {
        address[] memory tempOrgs = new address[](orgsId.length);
        uint count = 0;

        for (uint i = 0; i < orgsId.length; i++) {
            address org = orgsId[i];

            if (isMember(org, msg.sender)) {
                tempOrgs[count] = org;
                count++;
            }
        }

        address[] memory result = new address[](count);

        for (uint j = 0; j < count; j++) {
            result[j] = tempOrgs[j];
        }

        return result;
    }


    function requestToJoinOrg(address orgAddress, string memory description) public returns (uint256) {
        bool isAddressUser = isUser(msg.sender);
        if (!isAddressUser) {
            return 401;
        }
        bool isCurrentSenderBlocked = isUserBlocked(orgAddress, msg.sender);

        if (isCurrentSenderBlocked) {
            return 403;
        }
        JoinRequest memory newRequest = JoinRequest({
            publisher: msg.sender,
            description: description
        });
        
        joinRequests[orgAddress].push(newRequest);
        return 200;
    }

    
    function addVerificationRequest(
        address orgAddress,
        string memory id,
        string memory ipfsHash,
        string memory title,
        string memory description,
        string memory metadata,
        string memory docType
    ) public returns (uint256) {
        bool isUserMember = isMember(orgAddress, msg.sender);
        if (!isUserMember) {
            return 403;
        }
        VerificationRequest memory newRequest = VerificationRequest({
            id: id,
            orgAddress: orgAddress,
            ipfsHash: ipfsHash,
            publisher: msg.sender,
            title: title,
            description: description,
            metadata: metadata,
            docType: docType
        });

        verificationRequests[orgAddress].push(newRequest);
        return 200;
    }

    function addNewDocumentRequest(
        address orgAddress,
        string memory id,
        string memory title,
        string memory description,
        string memory metadata,
        string memory docType
    ) public returns (uint256) {
        bool isUserMember = isMember(orgAddress, msg.sender);
        if (!isUserMember) {
            return 403;
        }
        NewDocumentRequests memory newRequest = NewDocumentRequests({
            id: id,
            orgAddress: orgAddress,
            publisher: msg.sender,
            title: title,
            description: description,
            metadata: metadata,
            docType: docType
        });

        newDocumentRequests[orgAddress].push(newRequest);
        return 200;
    }

    function isMember(address orgAddress, address member) public view returns (bool) {
        address[] memory members = orgMembers[orgAddress];
        uint256 length = members.length;
        
        for (uint256 i = 0; i < length; i++) {
            if (members[i] == member) {
                return true;
            }
        }

        return false;
    }

    function isUserBlocked(address orgAddress, address userAddress) public view returns (bool) {
        address[] memory blockedUsers = blockedAddresses[orgAddress];
        uint256 length = blockedUsers.length;

        for (uint256 i = 0; i < length; i++) {
            if (blockedUsers[i] == userAddress) {
                return true;
            }
        }

        return false;
    }

    function isUser(address user) public view returns (bool) {
        for (uint256 i = 0; i < users.length; i++) {
            if (users[i] == user) {
                return true;
            }
        }
        return false;
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b)));
    }

    function verifyMessage(bytes32 _hashedMessage, uint8 _v, bytes32 _r, bytes32 _s) private pure returns (address) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHashMessage = keccak256(abi.encodePacked(prefix, _hashedMessage));
        address signer = ecrecover(prefixedHashMessage, _v, _r, _s);
        return signer;
    }
 }