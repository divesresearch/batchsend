pragma solidity 0.8.7;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";

contract BatchSenderERC20 {
    function transferFrom(
        IERC20 token,
        address targetAddress,
        uint256 amount
    ) private returns (bool) {
        require(
            token.balanceOf(msg.sender) >= amount,
            "insufficient balance"
        );

        token.transferFrom(msg.sender, targetAddress, amount);
        return true;
    }

    function multiSendToken(
        address tokenAddress, 
        address[] memory recipients,
        uint256[] memory amounts
    ) public returns (bool) {
        require(recipients.length > 0);
        require(recipients.length == amounts.length);

        IERC20 token = IERC20(tokenAddress);

        uint256 length = recipients.length;
        for(uint i = 0; i < length; i++){
            transferFrom(token, recipients[i], amounts[i]);
        }

        return true;
    }
}
