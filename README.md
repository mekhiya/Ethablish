# Ethablish - establish that Email belongs to you
Chainlink Hackathon 2022

 ##End Date Based Licensing 

VERY IMPORTANT THAT LICENSE KEY IS SENT TO EMAIL ADDRESS.
FOR EXAMPLE : if I am creating license key for nitin@mywebsite.com
license key(vrf combination) is sent to same email...
license key in readable format is availble only inside email..
license key (hash) & Email hash are stored inside filecoin

I will check my email for license key
goto website, connect account, add license key, enter email
generate profile
license key (hash) to email hash is cross cheked with filecoin


14th May ====================

method generateLicenseKey

Payable method
Enter no. of license
Enter email addresses
per email/12 months pay 365 gwei (show pricefeed data usd cost)
vrf method used to create key
key hash & email hash saved inside filecoin
email is sent with key

major challenges:
gasless working
vrf oracle
pricefeed oracle
sending email
save hash to filecoin


End user - gasless method

method createEmailProfile
Enter email & license key
hash of both verified with filecoin
on chain hash of email & account address saved
license creator gets alchemy alerts

major challenges:
gasless working
alchemy alert
chainlink keeper sends alert

VerifyEmailProfile
Email & Account address entered
hash of both checked on chain
if verified return true


JOB Method ???
chainlink keeper can keep regular checks ????
send email to people who are still pedning to create profile
send email to people who's license about to expire
alchemy alert when licenses expiring 



15th May ====================

Biconomy EIP 2771, copy few lines, show diagram from 
https://docs.biconomy.io/products/enable-gasless-transactions


TODO

UI
- create componenets
- use tabs
- tab - For employers (Create Liecense), For New Joinees (Create Email Profile), for people (Verify Email Profile)

Biconomy setup

Chainlink
- VRF setup
- pricefeed setup 

Save to Filecoin/IPFS

Alchemy explore

impement env, remove emailjs public key from code


16th May ====================


Emailjs command
```
npm install @emailjs/browser --save
```


1st May Notes


uint256 expiryTime; // by default 365 days / 12 months

expiryTime = block.timestamp + 12 months;

require(!isRegistered[_email], 'This e-mail is already registered');
require(!isRegistered[addressAccount], 'This e-mail is already registered');
require(expiryTime < block.timestamp)        


License buying fees
36500 gwei (0.0000365 ETH) for 12 months duration
~ 10 cents (in USD) / per EmailProfile for 12 months
If time permists use pricefeed. Charge people 10 cents insted of gwei amount.
Or charge in gwei but display Cents/USd value.

hash email address...

Amazing project idea..
chain external adapter starts....
Corporate create licenses for email profile creation for 100 people. Each license costs. 10 gwei... They can but n number of licenses..
Each license is VRF key...
lic generator stores hash of email & vrf key inside IPFS
VRF key is sent to emails....
chainlink EA ends....

Ethablish Website....
Individuals take this lic key & enter it..
Box to create email & address displays...
Enter email address
if email hash matches...call made to ipfs...
It alllows use to create email profile..
...........
100 people create gasless Email profile
.........
Alchemy sends notification alert




```shell
npx hardhat compile
npx hardhat node
node scripts/sample-script.js
```
Emailjs email 
npm i emailjs-com


ETHablish - Establish Trustless Identity


TODO
create-react-app material ui video
send email from create react usig sendgrid
save otp somewhere



Proove your Digital Identity securely

Trsutless & Secured Digital Identity Proof
- Create proof of your identity 

Links address to identity

Any state change & subscription will cost gas + money
Any view/reads will be free

view/Reads - Owner can decide if wants to share in open or with public key.


Characters

1) Signer 
2) Viewers
3) DAO



===Future use cases - what can be verified
email
phone number
Age
bank account number
address
vaccine status
passport number
aadhar number
etc etc...


Who pays for creating ID Profile
Self pay
Viewer pays to keep watch
Sponsors pay for someone to create profile. (A company can buy 100 licenses, share these address with people, whom it wants to create ID Profile)

Only one address linked to Email. If you want to change this pair - either address or email , only owner(first time creator) can request, pay fees & make change.


------------------------------
27th April
8.25 am

subscribers can get alchemy alerts
chainlink keeper can keep regular checks
filecoin + ipfs can store screenshot



Also think about One time Identifier

Contract VerifyContract{

mapping addressToEmail
- mapping will never have actual email, but will have hash of email
- has created using priv-pub key strategy
- where do user keep priv key??? Wallet signs it...

mapping - address to public key
- has mapping of address to pub key

	
}


UI

Create Profile

[email address] <send otp>

[enter otp][radio: restricted/Open]<verify>
- signs message
- contract receives address, email, pub key,
- stores it

<Fetch my own Profile>
- view request
- only for owner 
- metamask sends signed request
- contract find profile using msg.sender address

if restricted
- returns [email, pubkey,address] <copy button>

if open
- returns [email, address]

FOR VIEWERS=======

[address]
[Email]
[pubkey] 
<VerifyProfile>

In above UI pubkey required if restrcited mode

---------------------
Create Watchers
- alert watchers using alchemy
- keeper using chainlink

-------------------

gasless aspect - biconomy

-----------

same code can be launched on Polygon, BNB, avalanche etc... ???

-----------
Future
can it verify across chains ????


----------------------

for chainlink installed
```
npm install @chainlink/contracts --save
```
For OpenGSN
```
npm i @opengsn/contracts
```

For biconomy install
```
npm install @biconomy/mexa
```



    //PAYABLE : Profile are created by user themself
    //Licenses can be created by self or sponsors
    //Check if account address is unique
    //check if email hash is unique
    // check if license is valid
    //create struct - msg.sender will be accountAddress
    // add to mapping

    //0x0000000000000000000000000000000000000000000000000000000000000000


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


Command to deploy contract to mumbai polygon
```
npx hardhat run scripts/deploy.js --network mumbai
```

For contract verification used libraray 
```
npm i @nomiclabs/hardhat-etherscan
```
verify contract on mumbai polygon (param is trusted forwarder)
npx hardhat verify "<contract address>" --network mumbai "0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b"

npx hardhat verify "0xb7ba3B37D9122FAD635ABb53Fe8D4a33217D7bF3" --network mumbai "0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b"

FOr Create React to work with BICONOMY , OPENGSN, CHAINLINK
```
yarn add cipher-base

npm i react-notifications
--- npm i cipher-base (didnt work)
npm i stream-browserify
npm i ethereumjs-util
npm i assert
```