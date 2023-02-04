const
    React = require('react'),
    {useState} = require('react'),
    {createRoot} = require('react-dom/client'),

    App = () => {
        return ( 
            <> Hello World </>
        )}

createRoot(document.getElementById('app'))
    .render(<App />)

