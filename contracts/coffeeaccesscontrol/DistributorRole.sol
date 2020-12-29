pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'DistributorRole' to manage this role - add, remove, check
contract DistributorRole {
    using Roles for Roles.Role;
    // Define 2 events, one for Adding, and other for Removing. OK TAK
    event DistributorAdded(address indexed account);
    event DistributorRemoved(address indexed account);

    // Define a struct 'distributors' by inheriting from 'Roles' library, struct Role. Ok TAK
    Roles.Role private disributor;

    // In the constructor make the address that deploys this contract the 1st distributor. Ok TAK
    constructor() public {
        _addDistributor(msg.sender);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role. Ok TAK
    modifier onlyDistributor() {
        require(isDistributor(msg.sender));
        _;
    }

    // Define a function 'isDistributor' to check this role. Ok TAK
    function isDistributor(address account) public view returns (bool) {
        return disributor.has(account);
    }

    // Define a function 'addDistributor' that adds this role. Ok TAK
    function addDistributor(address account) public onlyDistributor {
        _addDistributor(account);
    }

    // Define a function 'renounceDistributor' to renounce this role. Ok TAK
    function renounceDistributor() public {
        _removeDistributor(msg.sender);
    }

    // Define an internal function '_addDistributor' to add this role, called by 'addDistributor'. Ok TAK
    function _addDistributor(address account) internal {
        disributor.add(account);
        emit DistributorAdded(account);
    }

    // Define an internal function '_removeDistributor' to remove this role, called by 'removeDistributor'. Ok TAK. //Do you mean called by "renounceDistributor"?
    function _removeDistributor(address account) internal {
        disributor.remove(account);
        emit DistributorRemoved(account);
    }
}
