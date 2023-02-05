module.exports = {
    configsByChainID: {
        5: {
            batchSenderAddress: '0x3262630A9744f84AA2F412BD41fc37fD86a3e25C'
        }
    },

    BatchSenderABI : [
        'function batchSendToken(address tokenAddress, address[] recipients, uint256[] amounts) public returns (bool)',
        'function batchSend(address[] recipients, uint256[] amounts) public returns (bool)'
    ],

    ERC20TokenABI : [
        // Read-Only Functions
        'function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)',
        'function allowance(address owner, address spender) view returns (uint256)',
        'function symbol() view returns (string)',

        // Authenticated Functions
        'function transfer(address to, uint amount) returns (bool)',
        'function approve(address spender, uint256 amount) returns (bool)',

        // Events
        'event Transfer(address indexed from, address indexed to, uint amount)',
    ]
}
