document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      
      resetErrors();
      
      let isValid = true;
      
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Name is required');
        isValid = false;
      }
      
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required');
        isValid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
      }
      
      if (!messageInput.value.trim()) {
        showError(messageInput, 'Message is required');
        isValid = false;
      }
      
      if (isValid) {
        submitForm(nameInput.value.trim(), emailInput.value.trim(), messageInput.value.trim());
      }
    });
  }
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function showError(inputElement, message) {
    inputElement.classList.add('contact-form__input--error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'contact-form__error-message';
    errorDiv.textContent = message;
    
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
  }
  
  function resetErrors() {
    const errorInputs = document.querySelectorAll('.contact-form__input--error');
    errorInputs.forEach(input => {
      input.classList.remove('contact-form__input--error');
    });
    
    const errorMessages = document.querySelectorAll('.contact-form__error-message');
    errorMessages.forEach(error => {
      error.remove();
    });
  }
  
  function submitForm(name, email, message) {
    const submitButton = document.querySelector('.contact-form__submit');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    fetch('../config.json')
    .then(response => response.json())
    .then(config => {
      const apiUrl = config.apiBaseUrl || 'http://localhost:8080';
      return makeApiCall(apiUrl, name, email, message);
    })
    .catch(error => {
      console.warn('Could not load config.json, using default API URL:', error);
      return makeApiCall('http://localhost:8080', name, email, message);
    });

    function makeApiCall(apiUrl, name, email, message) {
      return fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
      })
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          return response.text().then(text => {
            throw new Error(text);
          });
        }
      })
      .then(data => {
        contactForm.reset();
        alert('Thank you for your message! We will get back to you soon.');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('There was an error sending your message. Please try again.');
      })
      .finally(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      });
    }
  }
});