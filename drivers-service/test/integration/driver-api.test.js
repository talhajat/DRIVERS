const FormData = require('form-data');
const axios = require('axios');

const form = new FormData();
form.append('firstName', 'John');
form.append('lastName', 'Doe');
form.append('email', 'john.doe@example.com');
form.append('phonePrimary', '555-123-4567');
form.append('dob', '1990-01-15');
form.append('ssn', '123-45-6789');
form.append('licenseNumber', 'DL123456');
form.append('licenseState', 'MI');
form.append('licenseClass', 'A');
form.append('licenseExpiry', '2025-12-31');
form.append('streetNumber', '123');
form.append('streetName', 'Main St');
form.append('city', 'Detroit');
form.append('stateProvince', 'MI');
form.append('country', 'USA');
form.append('postalCode', '48201');
form.append('medCertExpiry', '2025-12-31');
form.append('hireDate', '2024-01-01');

axios.post('http://localhost:3000/api/v1/drivers', form, {
  headers: form.getHeaders()
})
.then(response => {
  console.log('Success:', response.data);
})
.catch(error => {
  console.error('Error:', error.response ? error.response.data : error.message);
});