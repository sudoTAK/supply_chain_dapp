# Supply chain & data auditing

This repository containts an Ethereum DApp that demonstrates a Supply Chain flow between a Seller and Buyer. The user story is similar to any commonly used supply chain process. A Seller can add items to the inventory system stored in the blockchain. A Buyer can purchase such items from the inventory system. Additionally a Seller can mark an item as Shipped, and similarly a Buyer can mark an item as Received.

## Tools & Libraries

- [ipfs-http-client@30.1.3](https://unpkg.com/ipfs-http-client@30.1.3/dist/index.js) - The JavaScript HTTP client library for IPFS implementations
- [buffer](https://bundle.run/buffer@5.2.1) - Buffer library used to handle file upload from browser
- [ipfs-api](https://www.npmjs.com/package/ipfs-api) - Used to upload, load file to,from ipfs. It is used for test cases only.
- web3 1.2.1
- Solidity 0.4.26
- Truffle v5.1.58
- Node v12.18.3

## IPFS

IPFS is used to upload and read product image. Farmer, while harvesting coffee, can upload product image and image is uploaded
to IPFS via ipfs-http-client library with infura gateway. Once image is uploaded, a file hash is returned and this file hash is
along with other product info is thus stored in ethereum blockchain test platform, Rinkeby.

## Smart Contract Info

The contract is deployed on Rinkeby test network using Truffle and truffle-hdwallet-provider node package.

- Contract address : 0x950BbF9eB5B0eA1473684e07fBd340c75bA64cD3
- Tx id : 0xabc1f540da3ac868a22090f5fddca5a1cfc1a264a3e4cc059848b1c306b786ab

## Built With

- [Ethereum](https://www.ethereum.org/) - Ethereum is a decentralized platform that runs smart contracts
- [IPFS](https://ipfs.io/) - IPFS is the Distributed Web | A peer-to-peer hypermedia protocol
  to make the web faster, safer, and more open.
- [Truffle Framework](http://truffleframework.com/) - Truffle is the most popular development framework for Ethereum with a mission to make your life a whole lot easier.

## Acknowledgments

- Solidity
- Ganache-cli
- Truffle
- IPFS

## License

MIT
