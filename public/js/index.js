
(function() {
    "use strict";

    let userAddress = null;
    let connect = document.querySelector('#wallet-connect');

    // Check if wallet is already connected (but don't prompt)
    checkConnection();

    async function checkConnection() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Use eth_accounts instead of eth_requestAccounts (doesn't prompt)
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    userAddress = accounts[0];
                    let walletString = userAddress.substring(0, 5) + "..." + userAddress.substring(38, 42);
                    connect.innerHTML = walletString;
                    console.log("Wallet already connected:", userAddress);
                } else {
                    connect.innerHTML = "Connect Wallet";
                }
            } catch (error) {
                console.error(error);
                connect.innerHTML = "Connect Wallet";
            }
        } else {
            connect.innerHTML = "Install MetaMask";
        }
    }

    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Show "Connecting..." state
                connect.innerHTML = "Connecting...";
                connect.disabled = true;
                
                // Add delay for better UX
                await new Promise(resolve => setTimeout(resolve, 800));
                
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                userAddress = accounts[0];
                let walletString = userAddress.substring(0, 5) + "..." + userAddress.substring(38, 42);
                connect.innerHTML = walletString;
                connect.disabled = false;
                console.log("Wallet connected:", userAddress);
                return userAddress;
            } catch (error) {
                // Reset button on error
                connect.innerHTML = "Connect Wallet";
                connect.disabled = false;
                
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



    // Only add contact form listener if the element exists
    const contactFormButton = document.querySelector('#contact-form-button');
    if (contactFormButton) {
        contactFormButton.addEventListener('click', submitMail);
    }

    function submitMail() {
        console.log("Mail submitted.");
    }

    connect.addEventListener('click', connectWallet);

})();