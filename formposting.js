     // Get form elements
     const form = document.querySelector('form');
     const nameInput = form.querySelector('input[type="text"]');
     const emailInput = form.querySelector('input[type="email"]');
     const messageInput = form.querySelector('textarea');
     const submitButton = form.querySelector('button');

     // Modify the form to use FormSubmit.co service
     form.action = "https://formsubmit.co/6b2620c91e177be9ee759f1cf6d6f749";
     form.method = "POST";

     // Create a hidden input for the honeypot (anti-spam)
     const honeypotInput = document.createElement('input');
     honeypotInput.type = 'text';
     honeypotInput.name = '_honey';
     honeypotInput.style.display = 'none';
     form.appendChild(honeypotInput);

     // Create a hidden input to disable captcha
     const captchaInput = document.createElement('input');
     captchaInput.type = 'hidden';
     captchaInput.name = '_captcha';
     captchaInput.value = 'false';
     form.appendChild(captchaInput);

     // Create a hidden input for redirect
     const redirectInput = document.createElement('input');
     redirectInput.type = 'hidden';
     redirectInput.name = '_next';
     redirectInput.value = window.location.href; // Redirect back to the same page
     form.appendChild(redirectInput);

     // Add event listener to the submit button
     submitButton.addEventListener('click', function(event) {
         // Validate the form before submission
         if (!validateForm()) {
             event.preventDefault();
         } else {
             // Change button text during submission
             submitButton.innerHTML = 'Sending...';
         }
     });

 // Form validation
 function validateForm() {
     // Get values
     const name = nameInput.value.trim();
     const email = emailInput.value.trim();
     const message = messageInput.value.trim();
     
     // Check for empty fields
     if (name === '') {
         showError(nameInput, 'Please enter your name');
         return false;
     }
     
     if (email === '') {
         showError(emailInput, 'Please enter your email address');
         return false;
     }
     
     // Basic email validation
     if (!isValidEmail(email)) {
         showError(emailInput, 'Please enter a valid email address');
         return false;
     }
     
     if (message === '') {
         showError(messageInput, 'Please enter your message');
         return false;
     }
     
     // All validations passed
     return true;
 }

 // Email validation function
 function isValidEmail(email) {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(email);
 }

 // Show error message
 function showError(inputElement, message) {
     // Remove any existing error message
     const parentElement = inputElement.parentElement;
     const existingError = parentElement.querySelector('.error-message');
     
     if (existingError) {
         existingError.remove();
     }
     
     // Create and add error message
     const errorDiv = document.createElement('div');
     errorDiv.className = 'error-message text-red-500 text-sm mt-1';
     errorDiv.textContent = message;
     
     parentElement.appendChild(errorDiv);
     
     // Highlight the input
     inputElement.classList.add('border-red-500');
     
     // Remove error after 3 seconds
     setTimeout(() => {
         errorDiv.remove();
         inputElement.classList.remove('border-red-500');
     }, 3000);
 }

 // Rename input fields to match FormSubmit expectations
 nameInput.name = 'name';
 emailInput.name = 'email';
 messageInput.name = 'message';

 // Update the button type to submit
 submitButton.type = 'submit';

 // Show success message
 function showSuccess() {
     // Create success message
     const successDiv = document.createElement('div');
     successDiv.className = 'success-message bg-green-100 text-green-700 p-3 rounded-md mb-4';
     successDiv.textContent = 'Your message has been sent successfully!';
     
     // Insert at the top of the form
     form.prepend(successDiv);
     
     // Remove after 5 seconds
     setTimeout(() => {
         successDiv.remove();
     }, 5000);
 }