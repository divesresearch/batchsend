const
    {ethers} = require('ethers'),

    {ERC20TokenABI} = require('./contracts'),

    createEthersAdapter = (sourceProvider) => {
        const
            provider = new ethers.providers.Web3Provider(sourceProvider),
            signer = provider.getSigner()

        return ({
            getAddress: () => signer.getAddress(),

            getBalanceForToken: async function(tokenAddress){
                new ethers.Contract(
                    tokenAddress,
                    ERC20TokenABI,
                    signer,
                )
                    .balanceOf(await this.getAddress())
            },

            approveAccount: ({
                tokenAddress,
                spenderAddress,
            }) => {
                const
                    tokenContract =
                        new ethers.Contract(tokenAddress, ERC20TokenABI, signer),

                    approveAmount =
                        '115792089237316195423570985008687907853269984665640564039457584007913129639935' //(2^256 - 1 )

                return tokenContract.approve(spenderAddress, approveAmount)
            },

            getAllowanceAmount: ({
                tokenAddress,
                ownerAddress,
                spenderAddress,
            }) => {
                const
                    tokenContract =
                        new ethers.Contract(tokenAddress, ERC20TokenABI, signer)

                return tokenContract.allowance(ownerAddress, spenderAddress)
            },

            batchSend: () => {}, // TODO: Implement this
            batchSendToken: () => {} // TODO: Implement this
        })
    }

module.exports = createEthersAdapter
