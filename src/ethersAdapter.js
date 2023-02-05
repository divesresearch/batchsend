const
    {ethers} = require('ethers'),

    {
        configsByChainID,
        BatchSenderABI,
        ERC20TokenABI,
    } = require('./contracts'),

    createEthersAdapter = async (sourceProvider) => {
        const
            provider = new ethers.providers.Web3Provider(sourceProvider),
            signer = provider.getSigner(),
            chainID = await provider.getNetwork(),

            {batchSenderAddress} = configsByChainID[chainID]

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
                ownerAddress, // TODO: remove this
                spenderAddress,
            }) => {
                const
                    tokenContract =
                        new ethers.Contract(tokenAddress, ERC20TokenABI, signer)

                return tokenContract.allowance(ownerAddress, spenderAddress)
            },

            getAllowanceAmountForBatchSender: async function (tokenAddress){
                return this.getAllowanceAmount({
                    tokenAddress,
                    ownerAddress: (await signer.getAddress()),
                    spenderAddress: batchSenderAddress,
                })
            },

            approveBatchSender: function (tokenAddress){
                return this.approveAccount({
                    tokenAddress,
                    spenderAddress: batchSenderAddress,
                })
            },

            batchSend: ({
                recipients,
                amounts,
            }) => {
                const
                    batchSenderContract =
                        new ethers.Contract(
                            batchSenderAddress,
                            BatchSenderABI,
                            signer,
                        ),

                    // FIXME: use bignumber instead
                    totalAmount = amounts.reduce((a,b) => a+b)

                return batchSenderContract
                    .batchSend(
                        recipients,
                        amounts,
                        {value: totalAmount},
                    )
            },

            batchSendToken: ({
                tokenAddress,
                recipients,
                amounts,
            }) => {
                const
                    batchSenderContract =
                        new ethers.Contract(
                            batchSenderAddress,
                            BatchSenderABI,
                            signer,
                        )

                return batchSenderContract
                    .batchSendToken(tokenAddress, recipients, amounts)

            },
        })
    }

module.exports = createEthersAdapter
