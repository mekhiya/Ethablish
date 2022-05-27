import React from 'react';
import logo from './logo.svg';
import biconomylogo from './biconomylogo.png';
import chainlinklogo from './chainlinklogo.png';
import './App.css';
import { Box, Button, Card, Grid, Input, TextField } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { Biconomy } from "@biconomy/mexa";
//import Ethablish from './artifacts/contracts/Ethablish.sol/Ethablish.json';
import Ethablish from './Ethablish.json';
import emailjs from '@emailjs/browser';
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { textAlign } from '@mui/system';

const ethablishAddress = "0x12dcAB13fc39485Bf396EeD70f910C08e5cCaC88";

// For Biconomy - EIP 2771 - Gasless transaction
let config = {
  contract: {
    address: "0x12dcAB13fc39485Bf396EeD70f910C08e5cCaC88",
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_trustedForwarder",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "have",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "want",
            "type": "address"
          }
        ],
        "name": "OnlyCoordinatorCanFulfill",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "requestId",
            "type": "uint256"
          }
        ],
        "name": "RequestedVRFKey",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "vrfKey",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "bytes32",
            "name": "emailHash",
            "type": "bytes32"
          }
        ],
        "name": "VRFKeyGenerated",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "licKey",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_email",
            "type": "string"
          }
        ],
        "name": "CreateEmailProfile",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_email",
            "type": "string"
          }
        ],
        "name": "SendFundViaEmailProfileCall",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "emailProfileCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_email",
            "type": "string"
          }
        ],
        "name": "getVRFLicenseKey",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "forwarder",
            "type": "address"
          }
        ],
        "name": "isTrustedForwarder",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "licenseKeyCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "requestId",
            "type": "uint256"
          },
          {
            "internalType": "uint256[]",
            "name": "randomWords",
            "type": "uint256[]"
          }
        ],
        "name": "rawFulfillRandomWords",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_trustedForwarder",
            "type": "address"
          }
        ],
        "name": "setTrustForwarder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "trustedForwarder",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_email",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "_accountAddress",
            "type": "address"
          }
        ],
        "name": "verifyEmailProfile",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "versionRecipient",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      }
    ]
  },
  apiKey: {
    test: "58kr0KlcW.a4f5f5c3-dd1a-4fc4-a8af-6dac83b3722b",
    prod: "58kr0KlcW.a4f5f5c3-dd1a-4fc4-a8af-6dac83b3722b"
  }
}//For Mumbai

let walletProvider, walletSigner;
let contractMeta, contractInterfaceMeta;
let biconomy, userAddress;

function App() {

  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  //  const [signer, setSigner] = useState(undefined);

  const [accountAddressLicCreator, setAccountAddressLicCreatorValue] = useState("");
  //const [emailLic, setEmailLicValue] = useState("");
  const emailLicGen = useRef("");

  const [licKey, setLicKey] = useState("");

  const [emailCreateProfile, setEmailCreateProfileValue] = useState("");
  const [accountAddress, setAccountAddressValue] = useState("");
  const [licKeyCreateProfile, setLicKeyCreateProfile] = useState("");
  // const [isOpen, setisOpenValue] = useState(false);

  const [verifyEmail, setVerifyEmailValue] = useState("");
  const [verifyAccountAddress, setVerifyAccountAddressValue] = useState("");
  // const [isVerified, setIsVerifiedValue] = useState(false);

  const [sendFundEmail, setSendFundEmailValue] = useState("");
  const [fundAmount, setFundAmountValue] = useState("");


  const [transactionHash, setTransactionHash] = useState("");
  const [vrfReqId, setVrfReqId] = useState("");
  const [vrfKeyLic, setVrfKeyLic] = useState("");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner()
  const contract = new ethers.Contract(ethablishAddress, Ethablish.abi, signer)

  //Flag used to decide if want to send Gasless or normal transaction
  const [metaTxEnabled] = useState(true);
  // const [newQuote, setNewQuote] = useState("");
  // const [quote, setQuote] = useState("This is a default quote");

  useEffect(() => {

    window.ethereum.on('chainChanged', () => {
      window.location.reload();
      console.log("chainChanged called");
    });
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
      console.log("accountsChanged called");
    });

    async function init() {
      if (typeof window.ethereum !== "undefined") {
        setHasMetamask(true);

        contract.on("RequestedVRFKey", handleRequestedVRFKey);
        contract.on("VRFKeyGenerated", handleVRFKeyGenerated);

        return () => {
          contract.removeAllListeners("RequestedVRFKey");
          contract.removeAllListeners("KeyPicked");
          //setTxs([]);
        };
      }
    }
    init();
  }, []);

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        //await window.ethereum.request({ method: "eth_requestAccounts" });
        await requestAccount();
        setIsConnected(true);
        //const provider = new ethers.providers.Web3Provider(window.ethereum);
        //const signer = provider.getSigner();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(accounts)
        console.log("connect method called" + accounts[0]);
        setAccountAddressValue(accounts[0]);
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  //calls payable method (gasless functioning)
  //call vrf to get random key
  //save hash of key & email to filecoin
  //send email with key (readable)
  async function generateLicenseKeyAndSendEmail() {

    //PENDING ::::
    // Start CIRCULAR
    //Enable buttons - Fund gas & GenerateLicense

    //setTransactionHash("");
    console.log("Sending VRF Request transaction");

    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner()
    // const contract = new ethers.Contract(ethablishAddress, Ethablish.abi, signer)

    if (emailLicGen !== "" && contract) {
      console.log("contact address is : " + contract.address);
      await requestAccount()

      console.log("calling getVRFLicenseKey");
      const transaction = await contract.getVRFLicenseKey(emailLicGen.current);
      await transaction.wait()

      console.log("Transaction hash : ", transaction.hash);
      showInfoMessage(`VRF Request Transaction sent with hash ${transaction.hash}`);
      let confirmation = await transaction.wait();
      console.log(confirmation);
      setTransactionHash(transaction.hash);
      console.log("emailLicGen : " + emailLicGen.current);
      //showInfoMessage("Waiting for Chainlink VRF to fullfil License Key");
    } else {
      console.log("Email absent or contract not defined yet")
    }
  }

  const handleRequestedVRFKey = (requestId, email) => {
    showSuccessMessage("Request to Chainlink VRF sent succesfully")
    setVrfReqId(requestId);
    console.log("requestId, email : " + vrfReqId + " " + email);
    console.log("emailGenLic : " + emailLicGen.current);
  }

  const handleVRFKeyGenerated = (vrfKey, emailHash) => {
    showSuccessMessage("Generated Lic key from VRF succesfully")
    setVrfKeyLic(vrfKey);
    console.log("requestIvrfKey, emailHash : " + vrfKeyLic + " " + emailHash);
    console.log("Sending Email now");
    showInfoMessage("Sending Email with Lic key now")

    console.log("emailGenLic : " + emailLicGen.current);
    var templateParams = {
      name: 'Nitin@Ethablish',
      email: emailLicGen.current,
      message: 'New License key is ' + vrfKey
    };

    emailjs.init('KEjyd3KYe3MVr3pY3')
    emailjs.send('service_2sanwql', 'template_3sm809r', templateParams)
      .then(function (response) {
        console.log('SUCCESS!', response.status, response.text);
      }, function (error) {
        console.log('FAILED...', error);
      });
    showSuccessMessage("Email with License Key sent");
  }

  const onFundGasTankGetLicense = async () => {

    let gasTankConfig = {
      gasTankAddress: '0x295609fDCa9C61D0362DA36020E02fdc0164D86b',
      abi: [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "fundingKey",
              "type": "uint256"
            }
          ],
          "name": "Deposit",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "actor",
              "type": "address"
            }
          ],
          "name": "DepositTokenAdded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "account",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "actor",
              "type": "address"
            }
          ],
          "name": "MasterAccountChanged",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "minDeposit",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "actor",
              "type": "address"
            }
          ],
          "name": "MinimumDepositChanged",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "truestedForwarder",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "actor",
              "type": "address"
            }
          ],
          "name": "TrustedForwarderChanged",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "actor",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "receiver",
              "type": "address"
            }
          ],
          "name": "Withdraw",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "_trustedForwarder",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "allowedTokens",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "dappBalances",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_fundingKey",
              "type": "uint256"
            }
          ],
          "name": "depositFor",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "depositorBalances",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "trustedForwarder",
              "type": "address"
            }
          ],
          "name": "initialize",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "forwarder",
              "type": "address"
            }
          ],
          "name": "isTrustedForwarder",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "masterAccount",
          "outputs": [
            {
              "internalType": "address payable",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "minDeposit",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "renounceOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address payable",
              "name": "_newAccount",
              "type": "address"
            }
          ],
          "name": "setMasterAccount",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_newMinDeposit",
              "type": "uint256"
            }
          ],
          "name": "setMinDeposit",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "allowed",
              "type": "bool"
            }
          ],
          "name": "setTokenAllowed",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address payable",
              "name": "_forwarder",
              "type": "address"
            }
          ],
          "name": "setTrustedForwarder",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "tokenPriceFeed",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
            }
          ],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "stateMutability": "payable",
          "type": "receive"
        }
      ]
    };

    const walletProviderGastTank = new ethers.providers.Web3Provider(window.ethereum);
    const walletSignerGasTank = walletProviderGastTank.getSigner();

    userAddress = await walletSignerGasTank.getAddress();

    let gasTankContract = new ethers.Contract(
      gasTankConfig.gasTankAddress,
      gasTankConfig.abi,
      walletSignerGasTank);

    let fundingKey = '1653548918239';
    // replace with your desired funding amount (in wei) 
    let tx = await gasTankContract.depositFor(fundingKey, { from: userAddress, value: '1000000000000000000' });

    let receipt = await tx.wait(1);
    console.log('receipt', receipt);
    showSuccessMessage("Gas Tank funded with 1 Matic");
  }


  /*
    CREATE EMAIL PROFILE (GASLESS)
    EIP 712 using trusted forwarder.
    This is Gasless (Meta) transaction. 
    Biconomy Meta transaction
  */
  async function onSubmitWithEIP712Sign() {
    if (!licKeyCreateProfile && !emailCreateProfile) return
    if (
      typeof window.ethereum !== "undefined" &&
      window.ethereum.isMetaMask
    ) {

      console.log("Gasless Method started");

      // Ethereum user detected. You can now use the provider.
      const provider = window["ethereum"];
      await provider.enable();

      //for Mumbai
      let jsonRpcProvider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/kwDkVGahinYBakz22FjbxKTvQ0LWmNrS");

      biconomy = new Biconomy(jsonRpcProvider, {
        walletProvider: window.ethereum,
        apiKey: config.apiKey.prod,
        debug: true
      });

      walletProvider = new ethers.providers.Web3Provider(window.ethereum);
      walletSigner = walletProvider.getSigner();

      userAddress = await walletSigner.getAddress();
      biconomy.onEvent(biconomy.READY, async () => {

        // Initialize your dapp here like getting user accounts etc
        contractMeta = new ethers.Contract(
          config.contract.address,
          config.contract.abi,
          biconomy.getSignerByAddress(userAddress)
        );

        contractInterfaceMeta = new ethers.utils.Interface(config.contract.abi);
        //getQuoteFromNetwork();
      }).onEvent(biconomy.ERROR, (error, message) => {
        // Handle error while initializing mexa
        console.log(message);
        console.log(error);
      });

    } else {
      showErrorMessage("Metamask not installed");
    }
    //Added delay for biconomy network to establish
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 sec

    if (contractMeta) {

      setTransactionHash("");

      console.log(metaTxEnabled);
      if (metaTxEnabled) {
        showInfoMessage(`Getting user signature`);
        sendTransaction(userAddress, licKeyCreateProfile, emailCreateProfile);
      } else {
        console.log("Sending normal transaction");
        let tx = await contractMeta.CreateEmailProfile(licKeyCreateProfile, emailCreateProfile);
        console.log("Transaction hash : ", tx.hash);
        showInfoMessage(`Transaction sent by relayer with hash ${tx.hash}`);
        let confirmation = await tx.wait();
        console.log(confirmation);
        setTransactionHash(tx.hash);

        showSuccessMessage("Transaction confirmed on chain");
      }
    } else {
      showErrorMessage("Lic Key or Email not entered...");
    }
  }

  async function sendTransaction(userAddress, arg1, arg2) {
    console.log("sendTransaction called now");
    if (contractMeta) {
      try {
        //CreateEmailProfile(licKeyCreateProfile, emailCreateProfile);
        let { data } = await contractMeta.populateTransaction.CreateEmailProfile(arg1, arg2);
        let provider = biconomy.getEthersProvider();
        // let gasLimit = await provider.estimateGas({
        //   to: config.contract.address,
        //   from: userAddress,
        //   data: data
        // });
        console.log("data is : ", data);
        let txParams = {
          data: data,
          to: config.contract.address,
          from: userAddress,
          //gasLimit: gasLimit,
          signatureType: "EIP712_SIGN"
        };
        let tx;
        try {
          tx = await provider.send("eth_sendTransaction", [txParams]);
        }
        catch (err) {
          console.log("handle errors like signature denied here");
          console.log(err);
        }

        console.log("Transaction hash : ", tx);
        console.log("Transaction sent. Waiting for confirmation ..");
        showInfoMessage(`Transaction sent. Waiting for confirmation ..`)

        //event emitter methods
        provider.once(tx, (transaction) => {
          // Emitted when the transaction has been mined
          showSuccessMessage("Transaction confirmed on chain");
          console.log(transaction);
          console.log("Transaction confirmed on chain");
          setTransactionHash(tx);
        })

      } catch (error) {
        console.log('error message is : ');
        console.log(error);
      }
    }
  };

  // function verifyEmailProfile(string memory _email, address _accountAddress)
  // external view returns (bool)
  async function verifyEmailProfile() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(ethablishAddress, Ethablish.abi, provider)
      try {
        const data = await contract.verifyEmailProfile(verifyEmail, verifyAccountAddress);
        if (data) {
          showSuccessMessage("Verified! Email & Account are linked");
        } else {
          showErrorMessage("Not Verified! Email & Account not linked");
        }
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  // function SendFundViaEmailProfileCall(string memory _email)
  // public
  // payable
  // returns (bool)
  async function sendFundWithEmailProfile() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ethablishAddress, Ethablish.abi, signer);

      try {
        const data = await contract.SendFundViaEmailProfileCall(sendFundEmail, { value: fundAmount });
        if (data) {
          showSuccessMessage("Amount sent succesfully!");
        } else {
          showErrorMessage("Amount not sent!");
        }
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  const showErrorMessage = message => {
    NotificationManager.error(message, "Error", 5000);
  };

  const showSuccessMessage = message => {
    NotificationManager.success(message, "Message", 5000);
  };

  const showInfoMessage = message => {
    NotificationManager.info(message, "Info", 3000);
  };


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logoNew" alt="logo" />
      </header>
      <main>
        <div>
          <div>
            {hasMetamask ? (
              isConnected ? (
                "Connected! "
              ) : (
                <Button variant="contained" color='primary' onClick={() => connect()}>Connect</Button>
              )
            ) : (
              "Please install metamask"
            )}
            {isConnected ? accountAddress : ""}
          </div>
        </div>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Box
              marginY="20px"
              padding="20px"
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
                border: 1,
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <Alert severity="info">
                  <AlertTitle>For Employers</AlertTitle>
                  <strong>Calls Chainlink VRF - </strong>to get license key
                </Alert>
                <h3>Generate License Key</h3>
                <TextField
                  onChange={event => (emailLicGen.current = event.target.value)}
                  type='email'
                  placeholder='test@test.com'
                  id="outlined-basic" label="Email" variant="outlined" size='small' />
              </div>
              {/* <div>
                <TextField
                  value={accountAddress}
                  disabled
                  id="outlined-basic" label="Account Address" variant="outlined" size='small' />
              </div> */}
              <div>
                <Button
                  variant="contained"
                  onClick={generateLicenseKeyAndSendEmail}>Generate License key. Send Email</Button>
              </div>
              <img src={chainlinklogo} className="partner-logoNew" alt="logo" />

            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              marginY="20px"
              padding="20px"
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
                border: 1,
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <Alert severity="info">
                  <AlertTitle>For Employers</AlertTitle>
                  <strong>Fund Gas Tank - </strong>Send 1 Matic to Gas Tank
                </Alert>
                <h2>Fund Gas Tank with 1 Matic</h2>
                <Button
                  variant="contained"
                  onClick={onFundGasTankGetLicense}>Fund Gas Tank with 1 Matic</Button>
              </div>
              <img src={biconomylogo} className="partner-logoNew" alt="logo" />
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Box
              marginY="20px"
              padding="20px"
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
                border: '3px dashed grey',
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <Alert severity="success">
                  <AlertTitle>For New Employees (Freelancers) Onboarding</AlertTitle>
                </Alert>
                <Alert severity="info">
                  <AlertTitle>GASLESS Transaction - No Gas required</AlertTitle>
                </Alert>
                <Alert severity="success">
                  <strong>Step 1 - </strong>Check your email for licenses key<br />
                  <strong>Step 2 - </strong>Connect Metamask Account<br />
                  <strong>Step 3 - </strong>Create Email Profile
                </Alert>

                <h2></h2>
                <h3>Create Email Profile</h3>
                <TextField
                  onChange={e => setEmailCreateProfileValue(e.target.value)}
                  type='email'
                  placeholder='test@test.com'
                  id="outlined-basic" label="Email" variant="outlined" size='small' />
              </div>
              <div>
                <TextField
                  //value={licKey}
                  onChange={e => setLicKeyCreateProfile(e.target.value)}
                  id="outlined-basic" label="License Key" variant="outlined" size='small' />
              </div>
              <div>
                <TextField
                  value={accountAddress}
                  disabled
                  id="outlined-basic" label="Account Address" variant="outlined" size='small' />
              </div>
              <div>
                <Button
                  variant="contained"
                  onClick={onSubmitWithEIP712Sign}>Create My Email Profile</Button>
              </div>
            </Box>

          </Grid>
          <Grid item xs={4}>
            <Box
              marginY="20px"
              padding="20px"
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
                border: 1,
              }}
              noValidate
              autoComplete="off"
            >
              <h2><strong><i>ETH</i></strong>ablish.io</h2>
              Replace cryptocurrency addresses with your email address on Ethablish. COMING SOON...
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box
              marginY="20px"
              padding="20px"
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
                border: 1,
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <Alert severity="info">
                  <AlertTitle>Enter Email & Account address to verify.</AlertTitle>
                </Alert>
                <div>
                  <h3>Verify Email Profile</h3>
                  <TextField
                    onChange={e => setVerifyEmailValue(e.target.value)}
                    type='email'
                    placeholder='test@test.com'
                    id="outlined-basic" label="Email" variant="outlined" size='small' />
                  <TextField
                    onChange={e => setVerifyAccountAddressValue(e.target.value)}
                    id="outlined-basic" label="Account Address" variant="outlined" size='small' />

                  <Button
                    variant="contained"
                    onClick={verifyEmailProfile}>Verify Email Profile</Button>
                </div>
              </div>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              marginY="20px"
              padding="20px"
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
                border: 1,
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <Alert severity="info">
                  <AlertTitle>Send Funds using Email</AlertTitle>
                  To send cryptocurrency, all you need to know is the recipient’s Email address.
                </Alert>
                <div>
                  <TextField
                    onChange={e => setSendFundEmailValue(e.target.value)}
                    type='email'
                    placeholder='test@test.com'
                    id="outlined-basic" label="Email" variant="outlined" size='small' />
                  <TextField
                    placeholder='Amount in WEI (MATIC)'
                    onChange={e => setFundAmountValue(e.target.value)}
                    id="outlined-basic" label="Amount" variant="outlined" size='small' />

                  <Button
                    variant="contained"
                    onClick={sendFundWithEmailProfile}
                  >Send Funds</Button>
                </div>
              </div>
            </Box>
          </Grid>
        </Grid>
      </main>
      <NotificationContainer />
    </div >
  );
}


export default App;