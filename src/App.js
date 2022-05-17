import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Box, Button, Card, Grid, Input, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Ethablish from './arifacts/contracts/Ethablish.sol/Ethablish.json';
import emailjs from '@emailjs/browser';

const ethablishAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

function App() {

  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState(undefined);

  const [accountAddressLicCreator, setAccountAddressLicCreatorValue] = useState("")
  const [emailLic1, setEmailLic1Value] = useState("")
  const [emailLic2, setEmailLic2Value] = useState("")
  const [emailLic3, setEmailLic3Value] = useState("")

  const [licKey, setLicKey] = useState("")

  const [email, setEmailValue] = useState("")
  const [accountAddress, setAccountAddressValue] = useState("")
  const [isOpen, setisOpenValue] = useState(false)

  const [verifyEmail, setVerifyEmailValue] = useState("")
  const [verifyAccount, setVerifyAccountValue] = useState("")


  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setIsConnected(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setSigner(provider.getSigner());
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(accounts)
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

  //function createEmailProfile(string memory _email, bool _isOpen,bytes32 _pubKey) public payable {
  // call the smart contract, send an update
  async function createEmailProfile() {
    if (!email) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(ethablishAddress, Ethablish.abi, signer)
      const transaction = await contract.createEmailProfile(email, isOpen, "0x0000000000000000000000000000000000000000000000000000000000000000")
      await transaction.wait()
    }
  }

  async function generateLicense() {
    //calls payable method (gasless functioning)
    //call vrf to get random key
    //save hash of key & email to filecoin
    //send email with key (readable)
  }

  async function sendEmailTest() {
    var templateParams = {
      name: 'Nitin@Ethablish',
      email: emailLic1,
      message: 'New License key is ' + licKey
    };

    emailjs.init('KEjyd3KYe3MVr3pY3')
    emailjs.send('service_2sanwql', 'template_3sm809r', templateParams)
      .then(function (response) {
        console.log('SUCCESS!', response.status, response.text);
      }, function (error) {
        console.log('FAILED...', error);
      });

  }

  //function verifyEmailProfile(string memory _email,address _accountAddress,bytes32 _pubKey
  //) external view returns (bool)
  async function verifyEmailProfile() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(ethablishAddress, Ethablish.abi, provider)
      try {
        const data = await contract.verifyEmailProfile(verifyEmail, verifyAccount, "0x0000000000000000000000000000000000000000000000000000000000000000")
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }


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
                  onChange={e => setEmailValue(e.target.value)}
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
                  onChange={e => setVerifyAccountValue(e.target.value)}
                  id="outlined-basic" label="Account Address" variant="outlined" size='small' />
              </div>
              <div>
                <Button
                  variant="contained"
                  onClick={verifyEmailProfile}>Verify Email Profile</Button>
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
                <TextField
                  onChange={e => setEmailLic1Value(e.target.value)}
                  type='email'
                  placeholder='test@test.com'
                  id="outlined-basic" label="Email" variant="outlined" size='small' />
              </div>
              <div>
                <TextField
                  value={licKey}
                  onChange={e => setLicKey(e.target.value)}
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
                  onClick={sendEmailTest}>Send Test Email</Button>
              </div>
            </Box>
          </Grid>
          <Grid item xs={6}>
            4
          </Grid>
        </Grid>
      </main>
    </div >
  );
}


export default App;
