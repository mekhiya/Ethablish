// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "hardhat/console.sol";
import "@opengsn/contracts/src/BaseRelayRecipient.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract Ethablish is BaseRelayRecipient, VRFConsumerBaseV2 {
    // PENDING : TO DO : Delete this
    // dummy test variable to be deleted later
    string data;

    // FOR CHAINLINK VRF V2
    // PENDING TO DO: Read values from configurable file, avoid hardcoding
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    address vrfCoordinatorV2 = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed;
    address link_token_contract = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    bytes32 keyHash =
        0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
    uint32 callbackGasLimit = 100000;
    uint64 subscriptionId = 312;
    uint256 s_key;

    //// EVENTS FOR CHAINLINK VRF V2
    event RequestedVRFKey(uint256 indexed requestId, string email);
    event VRFKeyGenerated(uint256 indexed vrfKey, bytes32 emailHash);

    // Contract Owner
    address s_owner;

    // License Status
    // GENERATED - when License key is created & emai lis sent
    // ACTIVE - once email owner completes email & address verification
    // EXPIRED - Once Active, expires after 365 days
    enum LicenseStatus {
        GENERATED,
        ACTIVE,
        EXPIRED
    }

    //requestId mapped to emailHash
    mapping(uint256 => bytes32) private requestIdToEmailHash;

    //Each struct represents a profile created for user.
    struct EmailProfile {
        bytes32 emailHash;
        address accountAddress;
        uint256 licKey; // filled during license generation. Confirmed during Profile creation
        LicenseStatus licenseStatus; // GENE
        uint256 expiryTime;
    }

    /**  ASSUMPTION : Using two mappings (may be redundant) because project is still evolving
    /* might be useful in future use cases...*/

    //user's account address mapped to user's Email profile
    mapping(address => EmailProfile) private accountToEmailProfile;

    //Email-hash mapped to user's Email profile
    mapping(bytes32 => EmailProfile) private emailHashToEmailProfile;

    // to keep count of how many License keys generated...
    uint256 private licenseKeyCount;

    // to keep count of how many profiles created...
    uint256 private emailProfileCount;

    //**  ASSUMPTION : For Hackathon purpose expiry is set to 365 days,
    // but can be made dynamic in future*/
    uint256 private expiryDurationDays = 365;

    constructor(address _trustedForwarder) VRFConsumerBaseV2(vrfCoordinatorV2) {
        // For Biconomy Meta (Gasless) Transaction
        _setTrustedForwarder(_trustedForwarder);

        // FOR CHAINLINK VRF
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = keyHash;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;

        // Assigning Contract Owner
        s_owner = msg.sender;
    }

    // Method calls chainlink vrf to get decentralised random number
    // License key generated using vrf
    function getVRFLicenseKey(string memory _email) public {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        bytes32 _emailHash = keccak256(bytes(_email));
        emit RequestedVRFKey(requestId, _email);

        //PENDING : TO DO
        // Create EmailProfile, fill EmailHash & Lic status
        // Update Mapping
        // Update array

        //Find EMailProfile & Update Values
        emailHashToEmailProfile[_emailHash] = EmailProfile(
            _emailHash,
            0x0000000000000000000000000000000000000000,
            0,
            LicenseStatus.GENERATED,
            0
        );
        //add to address to emailHash mapping
        requestIdToEmailHash[requestId] = _emailHash;
    }

    // OVERRIDE called by CHAINLINK VRF
    // emits event with key & request id
    // frontend catches event & sends email with key
    function fulfillRandomWords(
        uint256 requestId, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        uint256 vrfKey = randomWords[0];

        bytes32 _emailHash = requestIdToEmailHash[requestId];
        // update Lic key inside EmailProfile
        emailHashToEmailProfile[_emailHash].licKey = vrfKey;
        licenseKeyCount++;
        emit VRFKeyGenerated(vrfKey, _emailHash);
    }

    /**
     * FOR OPENGSN BICONOMY GASLESS TRANSACTION
     * OPTIONAL
     * You should add one setTrustedForwarder(address _trustedForwarder)
     * method with onlyOwner modifier so you can change the trusted
     * forwarder address to switch to some other meta transaction protocol
     * if any better protocol comes tomorrow or current one is upgraded.
     */
    function setTrustForwarder(address _trustedForwarder) public onlyOwner {
        _setTrustedForwarder(_trustedForwarder);
    }

    /**
     * OPENGSN BICONOMY GASLESS TRANSACTION
     * Override this function.
     * This version is to keep track of BaseRelayRecipient you are using
     * in your contract.
     */
    function versionRecipient() external pure override returns (string memory) {
        return "1";
    }

    /**
     * OPENGSN BICONOMY GASLESS TRANSACTION
     * GASLESS METHOD - BICONOMY
     * META TRANSACTION
     */
    function CreateEmailProfile(uint256 licKey, string memory _email) public {
        bytes32 _emailHash1 = keccak256(bytes(_email));

        require(
            emailHashToEmailProfile[_emailHash1].licKey == licKey,
            "Wrong License Key"
        );

        emailHashToEmailProfile[_emailHash1].accountAddress = msg.sender;
        emailHashToEmailProfile[_emailHash1].licenseStatus = LicenseStatus
            .ACTIVE;
        emailHashToEmailProfile[_emailHash1].expiryTime =
            block.timestamp +
            expiryDurationDays;

        accountToEmailProfile[msg.sender] = emailHashToEmailProfile[
            _emailHash1
        ];

        emailProfileCount++;
    }

    //Verify EmailProfile can be called by any one outside of Contract
    function verifyEmailProfile(string memory _email, address _accountAddress)
        external
        view
        returns (bool)
    {
        // confirm if user address is linked to email
        // return true/false
        bool isVerified = false;
        bytes32 _emailHashVer = keccak256(bytes(_email));
        if (
            emailHashToEmailProfile[_emailHashVer].accountAddress ==
            _accountAddress
        ) {
            isVerified = true;
        }
        return isVerified;
    }

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }

    // PENDING : TO DO : Delete this
    // dummy test method to be deleted later
    function getStorage()
        public
        view
        returns (string memory currentQuote, address currentOwner)
    {
        return (data, s_owner);
    }

    // PENDING : TO DO : Delete this
    // dummy test method to be deleted later
    function setStorage(string memory _newData) public {
        data = _newData;
    }
}
