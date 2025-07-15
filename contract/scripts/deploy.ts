import { ethers, run } from "hardhat";

async function main() {
  const kyc_factory = await ethers.getContractFactory("KYCVerification");

  const kyc_reference = await kyc_factory.deploy();
  await kyc_reference.deployed();

  console.log("KYCVericiation:", kyc_reference.address);

  await sleep(10000);

  await run("verify:verify", {
    address: kyc_reference.address,
    constructorArguments: [],
  });

}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
