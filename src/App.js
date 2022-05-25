import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Box, Button, Card, Grid, Input, TextField } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { Biconomy } from "@biconomy/mexa";
import Ethablish from './artifacts/contracts/Ethablish.sol/Ethablish.json';
import emailjs from '@emailjs/browser';
import {
  NotificationContainer,
  NotificationManager
} from 'react-notifications';
import "react-notifications/lib/notifications.css";

const ethablishAddress = "0x705CA33CE93f5E05b2Db6cd986E1CE0C9Bbc5d8a";

let config = {
  contract: {
    address: "0x705CA33CE93f5E05b2Db6cd986E1CE0C9Bbc5d8a",
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
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "email",
            "type": "string"
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
        "inputs": [],
        "name": "getStorage",
        "outputs": [
          {
            "internalType": "string",
            "name": "currentQuote",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "currentOwner",
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
            "internalType": "string",
            "name": "_newData",
            "type": "string"
          }
        ],
        "name": "setStorage",
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
    test: "JHvKFKgNO.a7fd5a3d-470a-4124-a5ae-15877e6aefe0",
    prod: "JHvKFKgNO.a7fd5a3d-470a-4124-a5ae-15877e6aefe0"
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
  const [isOpen, setisOpenValue] = useState(false);

  const [verifyEmail, setVerifyEmailValue] = useState("");
  const [verifyAccountAddress, setVerifyAccountAddressValue] = useState("");
  const [isVerified, setIsVerifiedValue] = useState(false);

  const [transactionHash, setTransactionHash] = useState("");
  const [vrfReqId, setVrfReqId] = useState("");
  const [vrfKeyLic, setVrfKeyLic] = useState("");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner()
  const contract = new ethers.Contract(ethablishAddress, Ethablish.abi, signer)

  //Flag used to decide if want to send Gasless or normal transaction
  const [metaTxEnabled] = useState(true);
  const [newQuote, setNewQuote] = useState("");
  const [quote, setQuote] = useState("This is a default quote");

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

        //event RequestedVRFKey(uint256 indexed requestId, string email);
        //event VRFKeyGenerated(uint256 indexed vrfKey, bytes32 emailHash);
        //
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

    setTransactionHash("");
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
      showSuccessMessage("Transaction confirmed on chain");
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
  }

  //function CreateEmailProfile(uint256 licKey, string memory _email) public {
  // call the smart contract, send an update
  async function createEmailProfile() {
    if (!licKeyCreateProfile && !emailCreateProfile) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(ethablishAddress, Ethablish.abi, signer)
      const transaction = await contract.CreateEmailProfile(licKeyCreateProfile, emailCreateProfile);
      await transaction.wait()
      console.log("tx hash is " + transaction.hash);
    }
  }

  /*
    EIP 712 using trusted forwarder.
    This is Gasless (Meta) transaction. 
    Biconomy Meta transaction
  */
  async function onSubmitWithEIP712Sign() {
    if (!licKeyCreateProfile && !emailCreateProfile) return
    // if (typeof window.ethereum !== 'undefined') {
    //   await requestAccount()
    //   const provider = new ethers.providers.Web3Provider(window.ethereum);
    //   const signer = provider.getSigner()
    //   const contract = new ethers.Contract(ethablishAddress, Ethablish.abi, signer)
    //   const transaction = await contract.CreateEmailProfile(licKeyCreateProfile, emailCreateProfile);
    //   await transaction.wait()
    //   console.log("tx hash is " + transaction.hash);
    // }
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

      console.log("walletProvider is -- " + walletProvider);
      console.log("walletSigner is -- " + walletSigner);

      userAddress = await walletSigner.getAddress();
      biconomy.onEvent(biconomy.READY, async () => {

        // Initialize your dapp here like getting user accounts etc
        contractMeta = new ethers.Contract(
          config.contract.address,
          config.contract.abi,
          biconomy.getSignerByAddress(userAddress)
        );

        console.log("contractMeta check");
        console.log(contractMeta);

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
    console.log("reached part 2");
    console.log("newQuote is : " + newQuote);

    console.log("Wait start");

    //Added delay for biconomy network to establish
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 sec

    console.log("Wait end");

    // if (newQuote !== "" && contractMeta) {
    if (contractMeta) {
      console.log("reached part 3");
      setTransactionHash("");
      console.log('metaTxEnabled value is ');
      console.log(metaTxEnabled);
      if (metaTxEnabled) {
        showInfoMessage(`Getting user signature`);
        console.log('userAddress');
        console.log(userAddress);
        setQuote("Nitin 111 setQuote");
        setNewQuote("Nitin 111 setNewQuote");
        console.log('newQuote');
        console.log(newQuote);
        console.log('sendTransaction call enter');
        sendTransaction(userAddress, licKeyCreateProfile, emailCreateProfile);
      } else {
        console.log("Sending normal transaction");
        let tx = await contractMeta.CreateEmailProfile(licKeyCreateProfile, emailCreateProfile);
        //let tx = await contract.setQuote(newQuote);
        console.log("Transaction hash : ", tx.hash);
        showInfoMessage(`Transaction sent by relayer with hash ${tx.hash}`);
        let confirmation = await tx.wait();
        console.log(confirmation);
        setTransactionHash(tx.hash);

        showSuccessMessage("Transaction confirmed on chain");
        //getQuoteFromNetwork();
      }
    } else {
      showErrorMessage("Please enter the quote");
    }
  }

  async function sendTransaction(userAddress, arg1, arg2) {
    console.log("sendTransaction called now");
    if (contractMeta) {
      try {
        //CreateEmailProfile(licKeyCreateProfile, emailCreateProfile);
        console.log("start call contractMeta.populateTransaction.setStorage(arg)");
        let { data } = await contractMeta.populateTransaction.CreateEmailProfile(arg1, arg2);
        console.log("End call contractMeta.populateTransaction.setStorage(arg)");
        //let {data} = await contract.populateTransaction.setQuote(arg);
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
          console.log('Printing Nitin Params');
          console.log(txParams);
          tx = await provider.send("eth_sendTransaction", [txParams]);
          console.log('provider.send is sent');
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
          //getQuoteFromNetwork();
        })

      } catch (error) {
        console.log('XYZ Error reached');
        console.log('error message is : ');
        console.log(error);
      }
    }
  };

  async function setStorage() {
    console.log("setStorage called");
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      //const provider = new ethers.providers.Web3Provider(window.ethereum);
      //const signer = provider.getSigner()
      //const contract = new ethers.Contract(ethablishAddress, Ethablish.abi, signer)
      const transaction = await contract.setStorage(Date.now.toString());
      await transaction.wait()
    }
  }




  // function verifyEmailProfile(string memory _email, address _accountAddress)
  // external view returns (bool)
  async function verifyEmailProfile() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(ethablishAddress, Ethablish.abi, provider)
      try {
        const data = await contract.verifyEmailProfile(verifyEmail, verifyAccountAddress);
        if (data) {
          setIsVerifiedValue(true);
        } else {
          setIsVerifiedValue(false);
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
        <Grid justify="space-between" spacing={80} container>
          <Grid item>
            <img src={logo} className="App-logo" alt="logo" />
          </Grid>
          <Grid item>
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
          </Grid>
        </Grid>
      </header>
      <main>

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
                  onClick={createEmailProfile}>Create My Email Profile</Button>
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
                <h3>Verify Email Profile</h3>
                <TextField
                  onChange={e => setVerifyEmailValue(e.target.value)}
                  type='email'
                  placeholder='test@test.com'
                  id="outlined-basic" label="Email" variant="outlined" size='small' />
              </div>
              <div>
                <TextField
                  onChange={e => setVerifyAccountAddressValue(e.target.value)}
                  id="outlined-basic" label="Account Address" variant="outlined" size='small' />
              </div>
              <div>
                <Button
                  variant="contained"
                  onClick={verifyEmailProfile}>Verify Email Profile</Button>
              </div>
              <div>
                Verfication status of Email Profile is {isVerified}.
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
                <h3>Generate License Key</h3>
                {/* <TextField
                  onChange={e => setEmailLicValue(e.target.value)}
                  type='email'
                  placeholder='test@test.com'
                  id="outlined-basic" label="Email" variant="outlined" size='small' /> */}
                <TextField
                  onChange={event => (emailLicGen.current = event.target.value)}
                  type='email'
                  placeholder='test@test.com'
                  id="outlined-basic" label="Email" variant="outlined" size='small' />
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
                  onClick={generateLicenseKeyAndSendEmail}>Generate License key. Send Email</Button>
              </div>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <div>
              <Button
                variant="contained"
                onClick={onSubmitWithEIP712Sign}>Test gasless</Button>
            </div>
          </Grid>
        </Grid>
      </main>
    </div >
  );
}


export default App;