pragma solidity ^0.8.20;

interface IKYCVerification {
  function checkKYC(address user) external view returns (bool);
}
