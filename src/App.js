import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Box, Button, Card, Grid, Input, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Ethablish from './arifacts/contracts/Ethablish.sol/Ethablish.json';

const ethablishAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {

  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState(undefined);


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
            3
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
