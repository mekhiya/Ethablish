// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Ethablish {
    //**  ASSUMPTION : For Hackathon purpose expiry is set to 365 days,
    //but can be made dynamic in future*/
    uint256 expiryDurationDays = 365;

    //Each struct represents a profile created for user.
    struct EmailProfile {
        string emailHash;
        address accountAddress;
        uint256 expiryTime;
    }

    //**  ASSUMPTION : Using two mappings (may be redundant) because project is still evolving
    //might be useful in future use cases...*/

    //user's account address mapped to user's Email profile
    mapping(address => EmailProfile) public accountToEmailProfile;
    //Email hash mapped to user's Email profile
    mapping(string => EmailProfile) public emailToEmailProfile;

    //to keep count of how many profiles created...
    uint256 emailProfileCount;

    //Not used...may be in future
    //User trying to access his/her own email profile
    // function getMyEmailProfileByAddress()
    //     public
    //     view
    //     returns (EmailProfile memory)
    // {
    //     return accountToEmailProfile[msg.sender];
    // }

    //PAYABLE : Profile are created by user themself
    //Licenses can be created by self or sponsors
    //Check if account address is unique
    //check if email hash is unique
    // check if license is valid
    //create struct - msg.sender will be accountAddress
    // add to mapping

    //0x0000000000000000000000000000000000000000000000000000000000000000

    function createEmailProfile(string memory _emailHash) public payable {
        // myArray.push(1);     // add an element to the array
        // myArray[0];          // get the element at key 0 or first element in the array
        // myArray[0] = 20;     // update the first element in the array

        //we can also get the element in the array using the for loop
        //for (uint j = 0; j < myArray.length; j++) {
        //    myArray[j];
        //}

        //if some mapping doesnt exist, it will be equal to 0
        //addressName[address]!=0

        accountToEmailProfile[msg.sender] = EmailProfile(
            _emailHash,
            msg.sender,
            block.timestamp + expiryDurationDays
        );

        emailToEmailProfile[_emailHash] = EmailProfile(
            _emailHash,
            msg.sender,
            block.timestamp + expiryDurationDays
        );

        emailProfileCount++;

        //if false means it is restricted, only is valid pubKey, verification can b done
    }

    //Verify EmailProfile can be called by any one outside of Contract
    function verifyEmailProfile(
        string memory _email,
        address _accountAddress,
        bytes32 _pubKey
    ) external view returns (bool) {
        //if not isOpen, verify pub key
        // if pubKey does not verify return

        // confirm if address is linked to email
        // return true/false
        bool isVerified = false;
        if (_pubKey == keccak256("Nitin")) {}
        // for (uint256 i=0; i < profileAccts.length; i++){

        // }
        EmailProfile memory em = accountToEmailProfile[_accountAddress];
        if (keccak256(bytes(em.emailHash)) == keccak256(bytes(_email))) {
            isVerified = true;
        }

        return isVerified;
    }

    //PAYABLE : Profile are created by user themself
    //function deleteEmailProfile(string memory _email) public payable {
    //find Email Profile in mapping using _email
    // if msg.address is same as account address inside EmailProfile
    //delete

    //}

    //PENDING QUESTIONS / Optional
    //Are emails or address unique or both or pair is unique
    //Can we provide update pair mechanism
    //get list of accounts linked to address
    //get list of emails linked to an account

    //Future
    // More items can be verified - Phone, Age, etc...
    // gasless using biconomy
    // alchemy alerts
    // chainlink pricefeed or vrf scope ????
    // chainlink keeper or Cross chain.
}
