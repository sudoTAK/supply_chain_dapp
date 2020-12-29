pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'RetailerRole' to manage this role - add, remove, check
contract RetailerRole {
    using Roles for Roles.Role;

    // Define 2 events, one for Adding, and other for Removing. Ok TAK
    event RetailerAdded(address indexed account);
    event RetailerRemoved(address indexed account);

    // Define a struct 'retailers' by inheriting from 'Roles' library, struct Role. Ok TAK
    Roles.Role private retailer;

    // In the constructor make the address that deploys this contract the 1st retailer. Ok TAK
    constructor() public {
        _addRetailer(msg.sender);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role. Ok TAK
    modifier onlyRetailer() {
        require(isRetailer(msg.sender));
        _;
    }

    // Define a function 'isRetailer' to check this role. Ok TAK
    function isRetailer(address account) public view returns (bool) {
        return retailer.has(account);
    }

    // Define a function 'addRetailer' that adds this role. Ok TAK
    function addRetailer(address account) public onlyRetailer {
        _addRetailer(account);
    }

    // Define a function 'renounceRetailer' to renounce this role. Ok TAK
    function renounceRetailer() public {
        _removeRetailer(msg.sender);
    }

    // Define an internal function '_addRetailer' to add this role, called by 'addRetailer'. Ok TAK
    function _addRetailer(address account) internal {
        retailer.add(account);
        emit RetailerAdded(account);
    }

    // Define an internal function '_removeRetailer' to remove this role, called by 'removeRetailer'. Ok TAK
    function _removeRetailer(address account) internal {
        retailer.remove(account);
        emit RetailerRemoved(account);
    }
}
