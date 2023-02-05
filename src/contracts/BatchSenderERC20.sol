pragma solidity 0.8.7;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";

contract BatchSenderERC20 {

    function transferTokenFrom(
        IERC20 token,
        address targetAddress,
        uint256 amount
    ) private returns (bool) {
        require(
            token.balanceOf(msg.sender) >= amount,
            "insufficient token balance"
        );

        token.transferFrom(msg.sender, targetAddress, amount);
        return true;
    }

    function batchSendToken(
        address tokenAddress,
        address[] memory recipients,
        uint256[] memory amounts
    ) public returns (bool) {

        require(recipients.length > 0);
        require(recipients.length == amounts.length);

        IERC20 token = IERC20(tokenAddress);

        uint256 length = recipients.length;
        for(uint i = 0; i < length; i++){
            transferTokenFrom(token, recipients[i], amounts[i]);
        }

        return true;
    }

    function batchSend(
        address payable[] memory recipients,
        uint256[] memory amounts
    ) payable public returns (bool){

        require(recipients.length > 0);
        require(recipients.length == amounts.length);

        uint256 length = recipients.length;
        for(uint i = 0; i < length; i++){
            recipients[i].transfer(amounts[i]);
        }

        return true;
    }
}
