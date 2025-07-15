const express =  require("express");
const cors  = require("cors");
const dotenv = require("dotenv");
const cookieParser =  require("cookie-parser");
const { approvePendingVerification, getPendingVerificationCount } = require("./services/handleMeta.js");
const { checkAPIHealth } = require("./services/checkAPIHealth.js");
const {
  verify,
  check
} = require("./services/KYCverify.js");

dotenv.config();
const app = express();

app.use(
  cors({
    credentials: true,
    sameSite: "none",
    origin: process.env.FRONTEND_URL.split(",") ?? "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", checkAPIHealth);
app.post("/kyc-verify", verify);
app.post("/kyc-check", check);
app.listen(process.env.PORT, () =>
  console.log(`Node server listening on port ${process.env.PORT}!`)
);
