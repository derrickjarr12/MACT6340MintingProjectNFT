
(function() {
    "use strict";

    let userAddress = null;
    let connect = document.querySelector('#wallet-connect');

    // Only connect wallet if button exists
    if (connect) {
        // Don't auto-connect on page load, wait for user click
        connect.addEventListener('click', connectWallet);
    }

    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                userAddress = accounts[0];
                let walletString = userAddress.substring(0, 5) + "..." + userAddress.substring(38, 42);
                connect.innerHTML = walletString;
                console.log("Wallet connected:", userAddress);
                return userAddress;
            } catch (error) {
                if (error.code === 4001) {
                    // EIP-1193 userRejectedRequest error
                    // If this happens, the user rejected the connection request.
                    console.log("Please connect a wallet.");
                } else {
                    console.error(error);
                }
            }
        } else {
            console.log("MetaMask is not installed!");
            alert("Please install MetaMask to connect your wallet.");
        }
    }

    // Contact form handler - only attach if button exists
    const contactButton = document.querySelector('#contact-form-button');
    if (contactButton) {
        contactButton.addEventListener('click', submitMail);
    }

    function submitMail() {
        console.log("Mail submitted.");
    }

})();