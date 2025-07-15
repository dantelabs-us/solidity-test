const { Contract, Wallet, providers, ethers } = require("ethers");
const { erc20ABI } = require("../constants/erc20ABI.js");
const { checkAuth } = require("theta-tv-charts")
const { isAddress, keccak256 } = require("ethers/lib/utils.js");

const Domain = "ObjectDomain";
const signVerion = "1";

const signForwardMessage = async (
    signer,
    forwarderAddress,
    recipientAddress,
    chainId,
    nonce,
    data
) => {
    const domain = {
        name: "MinimalForwarder",
        version: "0.0.1",
        chainId: chainId,
        verifyingContract: forwarderAddress,
    };

    const types = {
        ForwardRequest: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "value", type: "uint256" },
            { name: "gas", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "data", type: "bytes" },
        ],
    };

    const signerAddress = await signer.getAddress();
    const req = {
        from: signerAddress,
        to: recipientAddress,
        value: "0",
        gas: "1000000",
        nonce,
        data,
    };

    const sign = await signer._signTypedData(domain, types, req);

    return { sign, req };
};

const auth = checkAuth();

const signMessage = async (
    signer,
    contractAddress,
    user,
    chainId,
    verified
) => {
    const domain = {
        name: Domain,
        version: signVerion,
        chainId,
        verifyingContract: contractAddress,
    };

    const types = {
        VerifyRequest: [
            { name: "user", type: "address" },
            { name: "verified", type: "bool" },
        ],
    };

    const value = {
        user,
        verified,
    };

    const signature = await signer._signTypedData(domain, types, value);

    return { signature, value };
};

exports.verify = async (request, res) => {
    try {
        const userAddress = request.body.address;

        const Address = process.env.CONTRACT_ADDRESS;
        const chainId = process.env.CHAIN_ID;

        const provider = new providers.JsonRpcProvider(
            process.env.RPC_PROVIDER_URL
        );

        const signer = new Wallet(process.env.WALLET_PRIVATE_KEY, provider);

        const contract = new Contract(Address, erc20ABI, signer);

        const { signature, value } = await signMessage(
            signer,
            Address,
            userAddress,
            chainId,
            true
        );

        const checkTx = await contract.check(userAddress);
        const tx = await contract.verifyUser(value, signature);
        const resp = await tx.wait();
        const checkRes = await contract.check(userAddress);

        return res.status(200).json({ status: resp });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
};

exports.batchVerify = async (request, res) => {
    try {
        let userData = request.body.addressData;
        const verified = request.body.verified;

        const Address = process.env.CONTRACT_ADDRESS;
        const chainId = process.env.CHAIN_ID;

        const provider = new providers.JsonRpcProvider(
            process.env.RPC_PROVIDER_URL
        );

        if (!userData) {
            return res.status(400).json({ message: "No data found" });
        }

        userData = userData.filter((user) => isAddress(user));

        const signer = new Wallet(process.env.WALLET_PRIVATE_KEY, provider);

        const contract = new Contract(Address, erc20ABI, signer);

        const { signature, value } = await signMessage(
            signer,
            Address,
            userData[0],
            chainId,
            verified
        );

        const sendData = userData.map((user) => {
            return { user, verified: verified };
        });

        const tx = await contract.batchVerify(value, signature, sendData);
        const resp = await tx.wait();

        return res.status(200).json({ status: resp });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
};

exports.check = async (req, res) => {
    try {
        const address = req.body.address;

        const Address = process.env.CONTRACT_ADDRESS;

        const provider = new providers.JsonRpcProvider(
            process.env.RPC_PROVIDER_URL
        );

        const signer = new Wallet(process.env.WALLET_PRIVATE_KEY, provider);

        const contract = new Contract(Address, erc20ABI, signer);

        const tx = await contract.check(address);

        return res.status(200).json({ status: tx });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
};

exports.approvePendingVerification = async (req, res) => {
    try {
        let backendVerifiedAddresses = req.body.addresses;

        if (!backendVerifiedAddresses) {
            return res.status(400).json({ message: "No addresses found" });
        }

        backendVerifiedAddresses = backendVerifiedAddresses.filter((user) =>
            isAddress(user)
        );

        const Address = process.env.CONTRACT_ADDRESS;
        const chainId = process.env.CHAIN_ID;

        const provider = new providers.JsonRpcProvider(
            process.env.RPC_PROVIDER_URL
        );

        const signer = new Wallet(process.env.WALLET_PRIVATE_KEY, provider);
        const contract = new Contract(Address, erc20ABI, signer);

        if (!contract) {
            return res.status(400).json({ message: " contract not found" });
        }

        if (backendVerifiedAddresses.length === 0) {
            return res.status(400).json({ message: "No pending addresses" });
        }

        const { signature, value } = await signMessage(
            signer,
            Address,
            backendVerifiedAddresses[0],
            chainId,
            true //verified
        );

        const sendData = backendVerifiedAddresses.map((user) => {
            return { user, verified: true };
        });

        const usersInASlice = process.env.USERS_IN_A__BATCH ?? 100;
        const slicedData = sendData.slice(0, usersInASlice);

        const tx = await contract.batchVerify(value, signature, slicedData);
        await tx.wait();

        return res.status(200).json({
            message: "Verification successful",
            addresses: slicedData.map((data) => data.user),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
};

exports.getPendingVerificationCount = async (req, res) => {
    try {
        const backendVerifiedAddresses = req.body.addresses;

        if (!backendVerifiedAddresses) {
            return res.json({ pendingVerificationCount: 0 });
        }

        const Address = process.env.CONTRACT_ADDRESS;

        const provider = new providers.JsonRpcProvider(
            process.env.RPC_PROVIDER_URL
        );

        const signer = new Wallet(process.env.WALLET_PRIVATE_KEY, provider);
        const contract = new Contract(Address, erc20ABI, signer);

        if (!contract) {
            return res.status(400).json({ message: " contract not found" });
        }

        const blockchainVerifiedAddresses = await contract.getVerifiedUsers();

        const pendingAddresses = backendVerifiedAddresses.filter(
            (address) => !blockchainVerifiedAddresses.includes(address)
        );

        return res.json({ pendingVerificationCount: pendingAddresses.length });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
};
