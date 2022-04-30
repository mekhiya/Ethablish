// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Ethablish {
    struct Deposit {
        uint256 depositId;
        address depositorAddress;
        uint256 amount;
        uint256 creationTime;
        uint256 maturityTime;
    }

    //Each struct represents a profile created for user.
    // if isOpen is true, means no pubKey required to verify by others.
    //if false means it is restricted, only is valid pubKey, verification can b done
    struct EmailProfile {
        string email;
        address accountAddress;
        bool isOpen;
        bytes32 pubKey;
    }

    //user's account address mapped to user's Email profile
    mapping(address => EmailProfile) public accountToEmailProfile;
    address[] public profileAccts;

    //User trying to access his/her own email profile
    function getMyEmailProfile() public view returns (EmailProfile memory) {
        return accountToEmailProfile[msg.sender];
    }

    //PAYABLE : Profile are created by user themself
    //Check is account address is unique
    // verify(keyReceivedOnEmail)
    //create struct - msg.sender will be accountAddress
    // add to mapping

    //0x0000000000000000000000000000000000000000000000000000000000000000

    function createEmailProfile(
        string memory _email,
        bool _isOpen,
        bytes32 _pubKey
    ) public payable {
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
            _email,
            msg.sender,
            _isOpen,
            _pubKey
        );
        profileAccts.push(msg.sender);
        // accountToEmailProfile[msg.sender].push(
        //     EmailProfile(
        //         _email,
        //         msg.sender,
        //         _isOpen,
        //         _pubKey
        //     )
        // );

        // if isOpen is true, means no pubKey required to verify by others.
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
        if (keccak256(bytes(em.email)) == keccak256(bytes(_email))) {
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
