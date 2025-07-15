// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KYCVerification {
  address public admin;

  mapping(address => bool) public userList;

  event UserVerified(address user);
  event AdminChanged(address user);

  constructor() {
    admin = msg.sender;
  }

  modifier onlyAdmin() {
    require(msg.sender == admin, "Only admin can call this function");
    _;
  }

  function changeAdmin(address user) public onlyAdmin {
    admin = user;
    emit AdminChanged(user);
  }

  function verifyUser(address user, bool verified) public onlyAdmin {
    require(!userList[user], "User is already verified");
    userList[user] = verified;
    emit UserVerified(user);
  }

  function checkKYC(address user) public view returns (bool) {
    return userList[user];
  }
}
