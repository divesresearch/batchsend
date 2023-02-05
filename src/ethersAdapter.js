const
    {ethers, BigNumber} = require('ethers'),

    {
        configsByChainID,
        BatchSenderABI,
        ERC20TokenABI,
    } = require('./contracts'),

    createEthersAdapter = async (sourceProvider) => {
        const
            provider = new ethers.providers.Web3Provider(sourceProvider),
            signer = provider.getSigner(),
            {chainId} = await provider.getNetwork(),

            batchSenderAddress = configsByChainID[chainId]?.batchSenderAddress

        if(!batchSenderAddress)
            throw {msg: 'Selected network is not supported yet.'}

        return ({
            getAddress: () => signer.getAddress(),

            getBalanceForToken: async function(tokenAddress){
                return new ethers.Contract(
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

                    totalAmount = amounts.reduce(
                        (a,b) =>
                            BigNumber.from(a).add(b)
                    )

                return batchSenderContract
                    .batchSend(
                        recipients,
                        amounts,
                        {value: totalAmount.toString()},
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
