const { Contract, Wallet, providers, ethers } = require("ethers");
const { KYCverifyABI } = require ("../constants/KYCverificationABI.js");


exports.verify = async (request, res) => {
  try {
    const userAddress = request.body.address;

    const KYCAddress = process.env.KYC_CONTRACT_ADDRESS;

    const provider = new providers.JsonRpcProvider(
      process.env.RPC_PROVIDER_URL
    );

    return res.status(200).json({ status: "status" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

exports.check = async (req, res) => {
  try {
    const address = req.body.address;

    const KYCAddress = process.env.KYC_CONTRACT_ADDRESS;

    const provider = new providers.JsonRpcProvider(
      process.env.RPC_PROVIDER_URL
    );

    return res.status(200).json({ status: "status" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

