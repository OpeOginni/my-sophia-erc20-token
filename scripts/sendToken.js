const { ethers } = require("hardhat");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_GOERLI_URL
);

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const weiAmount = (await deployer.getBalance()).toString();

  console.log("Account balance:", await ethers.utils.formatEther(weiAmount));

  // make sure to replace the "GoofyGoober" reference with your own ERC-20 name!
  const Token = await ethers.getContractFactory("Sophia");
  const token = await Token.deploy();

  // const Address = await ethers.getContractAt();

  console.log("Token address:", token.address);

  // Approving a contract to use the token
  const spenderAddress = "0x873289a1aD6Cf024B927bd13bd183B264d274c68";
  const spenderABI = [
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: "address", name: "", type: "address" },
      ],
      name: "Winner",
      type: "event",
    },
    {
      inputs: [
        { internalType: "address", name: "erc20", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "drop",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const amount = ethers.utils.parseEther("1");
  await token.approve(spenderAddress, amount);
  console.log("Token Approved");
  // Token Transfer Approved

  // Tranfering the token
  const bucketContract = new ethers.Contract(
    spenderAddress,
    spenderABI,
    deployer
  );

  await bucketContract.drop(token.address, amount);
  console.log("Token Transfered");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
