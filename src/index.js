const React = require('react'),
    {useState} = require('react'),
    {createRoot} = require('react-dom/client'),
    
    App = () => {
        const [wallet, setWallet] = useState('Connect Wallet')
        const [tokenAdress, setTokenAdress] = useState(false)
        const [checked, setChecked] = useState(false)
        const [balance, setBalance] = useState(0)

        const handleChange = () => {
            setChecked(!checked)
        }

        const connectWallet = async () => {
            if (window.ethereum) {
                window.ethereum
                    .request({method: 'eth_requestAccounts'})
                    .then((res) => {
                        setWallet(res)
                    })
            }
        }
        return (
            <>
                <nav>
                    <button onClick={connectWallet} className="mm-button">
                        {wallet}
                    </button>
                </nav>
                <div className="app-main flex">
                    <div className='flex address-container'>
                        <form className='address-bar'>
                            <div className='flex flex-span'>
                                <span>Token Address</span>

                                {/* TODO:Token'ın balance'ı çekilecek ethers ile */}
                                { tokenAdress&&
                                <span>{`Balance: ${balance}`} </span>}

                            </div>
                            <input 
                                type="text" 
                                className="token-address"
                                autoComplete="off"
                                placeholder='0x..' 
                                onChange={(e)=> 
                                {setTokenAdress(e.target.value)}} />
                        </form>
                        <div className='flex checkbox-box' >   
                            <label htmlFor='checkDef' >Deflationary</label>
                            <input
                                id='checkDef'
                                type="checkbox"
                                checked={checked}
                                onChange={handleChange}
                            /> 
                        </div>
                    </div>
                    <div className='flex csv-box'>
                        <label > List of Addresses in CSV</label>
                        <textarea
                            id='csv'
                            placeholder=
                                "0x83d0700d29854AAB1fB42165F97df4960dd82CA5, 0.3
                                &#10;ignatyus, 10"/>
                    </div>
                    <button className='continue' >Continue</button>
                </div>
            </>
        )
    }

createRoot(document.getElementById('app')).render(<App />)
