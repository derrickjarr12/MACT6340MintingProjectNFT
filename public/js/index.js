
(function() {
    "use strict";

    (( +>)) {
        let userAddress =null;
        let connect = document.querySelector('#wallet-connect');

        async function connectWallet() {
            await (window.ethereum) {
                .request({ method: 'eth_requestAccounts' })
                .then(data => {
                    userAddress = data[0];
                    let walletString =
                    userAddress.substring(0, 5) + "..." + userAddress.substring(38, 42);
                    connect.innerHTML = walletString;
                    return userAddress;
                });
            }.catch ((error) => {
                if (error.code === 4001) {
                    console.log('User rejected the request.');

                    console.log("Please connect a wallet.");            
                } else {
                    console.error(error);
                }
                

    }

document.querySelector("#contact-form-button").addEventListener("click", subitMail);

function subitMail(){
    console.log("You Clicked the Submit Button.");


}



})();