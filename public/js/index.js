
(function() {
    "use strict";

    let userAddress = null;
    let connect = document.querySelector('#wallet-connect');

    // Check if wallet is already connected when page loads
    checkIfWalletIsConnected();

    async function checkIfWalletIsConnected() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    userAddress = accounts[0];
                    updateWalletDisplay();
                    console.log("Wallet already connected:", userAddress);
                }
            } catch (error) {
                console.error("Error checking wallet connection:", error);
            }
        }
    }

    function updateWalletDisplay() {
        if (userAddress) {
            let walletString = userAddress.substring(0, 5) + "..." + userAddress.substring(38, 42);
            connect.innerHTML = walletString;
        } else {
            connect.innerHTML = "Connect Wallet";
        }
    }

    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                userAddress = accounts[0];
                updateWalletDisplay();
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

    document.querySelector("#contact-form-button").addEventListener("click", subitMail);

    function subitMail() {
        console.log("You Clicked the Submit Button.");
    }

    connect.addEventListener('click', connectWallet);

    // Listen for account changes
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.on('accountsChanged', function (accounts) {
            if (accounts.length > 0) {
                userAddress = accounts[0];
                updateWalletDisplay();
                console.log("Account changed to:", userAddress);
            } else {
                userAddress = null;
                updateWalletDisplay();
                console.log("Wallet disconnected");
            }
        });
    }

})();