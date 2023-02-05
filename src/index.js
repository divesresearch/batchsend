const React = require('react'),
    {useState, useEffect} = require('react'),
    {createRoot} = require('react-dom/client'),
    createEthersAdapter = require('./ethersAdapter'),
    
    App = () => {
        const [walletAddress, setWalletAddress] = useState(null)
        const [tokenAddress, setTokenAddress] = useState(null)
        const [walletBalance, setWalletBalance] = useState(null)


   
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
            console.log(tokenAddress);
        },[tokenAddress])

        const testFn = async () => {
            const 
                ethersAdapter = await createEthersAdapter(window.ethereum)
                console.log(chainID)
            await ethersAdapter.getAllowanceAmountForBatchSender(tokenAddress,
            ).then((x) => console.log(x.toString()))
            console.log(chainID)
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
                                &#10;ignatyus, 10"/>
                    </div>
                    <button 
                        className='continue'
                        onClick={testFn} >Continue</button>
                </div>
            </>
        )
    }

createRoot(document.getElementById('app')).render(<App />)
