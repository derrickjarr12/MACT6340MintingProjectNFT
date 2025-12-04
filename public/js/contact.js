(function () {
  "use strict";
let form = document.querySelector('#contact-form');
form.addEventListener('submit', (event) => {
  // event handling code
});
form
    .querySelector("#contact-form-button")
    .addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      let formValid = true;
      
      if (!form.checkValidity()) {
        formValid = false;
      }
      
      form.classList.add('was-validated');
      
      if (formValid) {
        sendTheEmail();
      }
    });

      async function sendTheEmail() {
    console.log("You clicked the submit button.");

 // Show loading state
    document.querySelector("#btnText").textContent = "Sending...";
    document.querySelector("#btnSpinner").classList.remove("d-none");
    document.querySelector("#contact-form-button").disabled = true;


    let firstName = document.querySelector("#first-name").value;
    let lastName = document.querySelector("#last-name").value;
    let phone = document.querySelector("#phone").value;
    let email = document.querySelector("#mail").value;
    let message = document.querySelector("#msg").value;


   let obj = {
      sub: "Someone submitted the contact form!",
      txt: `${firstName} ${lastName} with phone number ${phone} sent you a message that reads: ${message}. Their email address is ${email}`
    };

    console.log("Sending email with data:", obj);
    console.log("First name: " + firstName);
    console.log("Last name: " + lastName);
    console.log("Phone: " + phone);
    console.log("Email: " + email);
    console.log("Message: " + message);


  try {
      // Actually send the email
      const response = await fetch('/mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
      });

      const result = await response.json();

      if (result.result === "success") {
        alert("Message sent successfully!");
        form.reset();
        form.classList.remove('was-validated');
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      // Reset button state
      document.querySelector("#btnText").textContent = "Send Message";
      document.querySelector("#btnSpinner").classList.add("d-none");
      document.querySelector("#contact-form-button").disabled = false;
    }
  }
}());