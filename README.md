# Ethablish - establish that Email belongs to you
Chainlink Hackathon 2022

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

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