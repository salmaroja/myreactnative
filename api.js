// import axios from 'axios';

// // Badilisha hii URL na ile ya backend yako
// const API_BASE_URL = "http://10.3.11.174:59263/api/v1/customer";

// // Register customer (usajili)
// export const registerCustomer = async (customerData) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/register`, customerData);
//     return response.data;
//   } catch (error) {
//     console.error('Registration error:', error.response?.data || error.message);
//     throw error;
//   }
// };

// // Login customer (ingia)
// export const loginCustomer = async ({ email, password }) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
//     return response.data;
//   } catch (error) {
//     console.error('Login error:', error.response?.data || error.message);
//     throw error;
//   }
// };
// src/api.js
import axios from 'axios';

const API_BASE_URL = "http://10.65.2.138:62654/api/v1/customer";

// Usajili wa mteja
export const registerCustomer = async (customerData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, customerData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

// Login ya mteja
export const loginCustomer = async ({ email, password }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data; // Inasemekana inarudisha id au customerId, fullName, email
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};
