const FormData = require('form-data');
const axios = require('axios');

const form = new FormData();
form.append('firstName', 'Hassan');
form.append('lastName', 'Kharal');
form.append('email', 'hassan.kharal@example.com');
form.append('phonePrimary', '519-980-6545');
form.append('dob', '1997-02-08');
form.append('ssn', '123-45-6789');
form.append('licenseNumber', 'HK876898');
form.append('licenseState', 'AK');
form.append('licenseClass', 'Class A');
form.append('licenseExpiry', '2027-08-07');
form.append('streetNumber', '456');
form.append('streetName', 'Oak Ave');
form.append('city', 'Detroit');
form.append('stateProvince', 'MI');
form.append('country', 'USA');
form.append('postalCode', '48202');
form.append('medCertExpiry', '2027-08-07');
form.append('hireDate', '2025-06-04');

console.log('Attempting to create driver: Hassan Kharal');
console.log('Check the backend terminal for debug output...\n');

axios.post('http://localhost:3000/api/v1/drivers', form, {
  headers: form.getHeaders()
})
.then(response => {
  console.log('✅ Success! Hassan Kharal created successfully:');
  console.log('Driver ID:', response.data.id);
  console.log('Full Name:', response.data.firstName, response.data.lastName);
  console.log('Email:', response.data.email);
  console.log('Status:', response.data.status);
})
.catch(error => {
  console.error('❌ Error creating driver:');
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Message:', error.response.data.message || error.response.data);
    console.error('Full error:', JSON.stringify(error.response.data, null, 2));
  } else {
    console.error('Error:', error.message);
  }
});