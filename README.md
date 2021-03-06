# Ethablish - establish that Email belongs to you
## Project submit for Chainlink Hackathon 2022

![Project - ETHablish](https://user-images.githubusercontent.com/8952786/170780919-c2bebfdd-9d47-42bc-91a3-0b8ff94f1fbe.png)

This was a solo project. Fullstack Hardhat Dapp using Chainlink VRF for license key generation. Biconomy for Gasless transaction. Integrating different systems was challenging, but leaned a lot.


# What it does
**Ethablish Dapp** allows one to link Email & Wallet address in a secured manner. On-Chain Email profile is created which proves that email belongs to wallet address owner. 

**As an example - Employee & New Joinee :**
_Employer_ - pays Gas & sends license key to email address of a new joinee. 
_New Joinee_ - uses Gasless transaction to link wallet address & email address. 

**Verification -** Once On-Chain Email profile is created, anyone can verify it. 

**Send crypto using Email instead of Wallet address** Ethablish allows a user to use their email address instead of alphanumeric wallet address. Email address can then be used instead of a wallet address to send funds via Ethablish.

**Polygon - Mumbai** Contract is deployed on Mumbai (Polygon testnet). Polygon network due to its very low fees and instant finality helps.

![Polygon - Mumbai](https://user-images.githubusercontent.com/8952786/170780866-08fc6c9a-2f65-45f6-904b-ddffd3b0b779.jpg)

**Chainlink VRF V2** subscription was setup and smart contract was added consumer. Random key is generated by vrf contract. This is used as license key. 

![Chainlink VRF V2](https://user-images.githubusercontent.com/8952786/170780870-bde70d1f-1f58-478f-b88e-f0f56f36aa61.png)

**Biconomy Meta transaction** EIP 2771 protocol was used to create Trusted Relayer. This allows to have gasless transaction. We can also fund Gas tank programmatically.

![Biconomy](https://user-images.githubusercontent.com/8952786/170780868-293a98dc-e6b6-443d-8ed5-5bafbac153e6.png)

**Alchemy** RPC was used to connect to blockchain. This

**Front End** 
- Employers can Fund Gas Tank
- Employers can generate License key. This key is sent in email
- New Joinee can use this key received in email to link wallet address to email.
- New Joinee creates Email Profile in Gasless transaction
- Anyone can verify if email belongs to particular wallet address & vice versa
- Anyone can send / transfer funds/crypto using Email instead of Wallet address

## Live DEMO

Contract on Mumbai Polygon
https://mumbai.polygonscan.com/address/0x12dcAB13fc39485Bf396EeD70f910C08e5cCaC88

Frontend Demo
https://dark-pine-6394.on.fleek.co/

## DEMO VIDEO

[![ETHablish Demo Video on Youtube](https://user-images.githubusercontent.com/8952786/170785690-9a156ff1-dc50-4b6f-a6aa-6de6160c4b13.jpg)](https://www.youtube.com/watch?v=aTXmCYxTbWA)


## What I learned
**Mumbai Polygon** polygon team had extremely to the point documentation on EIP 2771 (Gasless transaction). This helped in designing software. I wanted to use Polygon & kovan, but with limited time Polygon turned out to be best option. It worked every time. 

**Hardhat** hardhat stack is one of the best stack option for creating web3 Dapp. I created several side projects along with Ethablish. Each side project was created to break complex project in to parts. In past I have used Brownie, but honestly Hardhat is best stack option.

![Hardhat Stack](https://user-images.githubusercontent.com/8952786/170780871-1ada35b2-da74-4045-935a-db1ce64152d9.jpg)


**Chainlink VRF V2 -** In past I had used VRF 1. Chainlink VRF 2 is amazing. Easy to subscribe. Add consumer. From start of this project till complete, always worked for me. We used VRF contract to generate Random License Key.

![Chainlink](https://user-images.githubusercontent.com/8952786/170781309-8624e5a1-8faa-4a7c-9666-570bd3ec5434.png)

**Biconomy Meta -** I started project with learning of OpenGSN. With lot of research figured out that EIP 2771 with Trusted Relayer option was way to go. Biconomy has good documentation and support.  Took me while to understand and make it work. But once concepts were clear, it was very smooth * quick to integrate. 

![EIP - 2771 - Gasless Meta Transaction](https://user-images.githubusercontent.com/8952786/170781316-4964ab10-88aa-4098-ae1d-13c5997cb3b8.png)


**fleek** decentralised way of website hosting in a trustless manner. Internally it used filecoin & ipfs for hosting files.

**EmailJs -** Sending instant Emails to user with license key. First time Integrated web2 service (EMailjs) & web3 service (blockchain, Chainlink, Biconomy)
 
**Create React App + Ether.js** is best option for creating front end rapidly. There is lot of reference documentation and help articles.

## What's next for Ethablish
- Ethablish helps one link email & wallet address. Same can be applied for Phone numbers & many other digital identities.
- Project works on Mumbai-Polygon. But can be made multi-chain.
- Lot of room for improvements as far as Solidity Storage & security are concern
- I coudn't merge Funding of Gas Tank & Creation of License Key in to one call. Whole flow was becoming very big to handle with my limited knowledge. 
- Frontend (UX) created by me is below average. Lot of improvement required here.
- There is bug in Send Fund method. Due to limitation of time, I couldn't fix it. Fund are going to contract instead of email owner.
- Whitelist access to people who have license key.
- wanted to use Chainlink keeper service to delete old data, Email Profiles that are expired or incomplete. But due to time limitation could not complete it.

