const { Contract, Wallet, ethers, providers } = require("ethers");
import { ESTATE_ABI } from "../constants/estateABI.js";

export const permit = async (req, res) => {
    try {
        const estateContractAddress = req.body.contractAddress;
        const clientAddress = req.body.userWallet;
        const deadline = req.body.deadline;
        const permitSignature = req.body.signature;
        const tokensAmount = req.body.tokensAmount;

        if (!estateContractAddress) {
            return res.status(404).json({ message: "No estate" });
        }

        const provider = new providers.JsonRpcProvider(
            process.env.RPC_PROVIDER_URL
        );

        const signer = new Wallet(process.env.WALLET_PRIVATE_KEY, provider);

        const estateContract = new Contract(
            estateContractAddress,
            ESTATE_ABI,
            signer
        );

        const marketAddress = await signer.getAddress();

        const sig = ethers.utils.splitSignature(permitSignature);

        let permitTX = await estateContract.permit(
            clientAddress,
            marketAddress,
            tokensAmount,
            deadline,
            sig.v,
            sig.r,
            sig.s,
            {
                maxFeePerGas: ethers.utils.parseUnits("1000", "gwei"),
                maxPriorityFeePerGas: ethers.utils.parseUnits("30", "gwei"),
            }
        );

        const t = await permitTX.wait();
        return res.status(200).json({ signature: t });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
};
