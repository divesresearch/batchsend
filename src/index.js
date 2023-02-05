const React = require('react'),
    {useState,useEffect} = require('react'),
    {createRoot} = require('react-dom/client'),
    createEthersAdapter = require('./ethersAdapter'),
    {csvTextToBatchSendArgument} = require('./utils'),

    App = () => {
        const [walletAddress, setWalletAddress] = useState(null)
        const [tokenAddress, setTokenAddress] = useState(null)
        const [walletBalance, setWalletBalance] = useState(null)
        const [allowance, setAllowance] = useState(null)
        const [csvText, setCSVText] = useState(null)

        const connectWallet = async () => {
            if (window.ethereum) {
                window.ethereum
                    .request({method: 'eth_requestAccounts'})
                    .then((res) => {
                        setWalletAddress(res)
                    })
            }
        }

        useEffect(()=>{
            if (tokenAddress, walletAddress){
                checkAllowance()
                checkBalanceForToken()
            }
        },[tokenAddress, walletAddress, allowance])


        const checkBalanceForToken = async () => {
            const
                ethersAdapter =
                    await createEthersAdapter(window.ethereum),

                decimals =
                    await ethersAdapter.getTokenDecimals(tokenAddress),


                balance = await ethersAdapter
                    .getBalanceForToken(tokenAddress)

            setWalletBalance(
                (parseInt(balance) / Math.pow(10, decimals))
                    .toString(),
            )
        }

        const checkAllowance = async () => {
            const
                ethersAdapter = await createEthersAdapter(window.ethereum)

            await ethersAdapter
                .getAllowanceAmountForBatchSender(tokenAddress)
                .then((x) => setAllowance(x.toString()))
        }

        const approveAllowance = async () => {
            const
                ethersAdapter = await createEthersAdapter(window.ethereum),

                tx = await ethersAdapter.approveBatchSender(tokenAddress)

            await tx.wait()

            checkAllowance()
        }

        const batchSendToken = async () => {
            const
                ethersAdapter = await createEthersAdapter(window.ethereum),

                decimals = await ethersAdapter.getTokenDecimals(tokenAddress),

                batchSendTokenArgument =
                    csvTextToBatchSendArgument(decimals, csvText)

            console.log(batchSendTokenArgument)

            await ethersAdapter.batchSendToken({
                tokenAddress,
                ...batchSendTokenArgument,
            })
        }

        const executeTx = () => {
            if (allowance>0) return batchSendToken()
            else return approveAllowance()
        }

        return (
            <>
                <nav>
                    <button onClick={connectWallet} className="mm-button">
                        {walletAddress ? walletAddress : 'Connect Wallet' }
                    </button>
                </nav>
                <div className="app-main flex">
                    <div className='flex address-container'>
                        <form className='address-bar'>
                            <div className='flex flex-span'>
                                <span>Token Address</span>

                                { tokenAddress&&
                                <span>{`Balance: ${walletBalance}`} </span>}

                            </div>
                            <input 
                                type="text" 
                                className="token-address"
                                autoComplete="off"
                                placeholder='0x..' 
                                onChange={(e)=> 
                                {setTokenAddress(e.target.value)}} />
                        </form>
                    </div>
                    <div className='flex csv-box'>
                        <label > List of Addresses in CSV</label>
                        <textarea
                            id='csv'
                            placeholder=
                                "0x83d0700d29854AAB1fB42165F97df4960dd82CA5, 0.3
                                &#10;ignatyus, 10"
                            onChange={(e) => setCSVText(e.target.value)}
                        />
                    </div>
                    <button
                        className='continue'
                        onClick={executeTx}>
                        {
                            (allowance)
                                ? (allowance > 0
                                    ? 'Continue'
                                    : 'Approve')
                                : 'Continue'
                        }
                    </button>
                </div>
            </>
        )
    }

createRoot(document.getElementById('app')).render(<App />)
