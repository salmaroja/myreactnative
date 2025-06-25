import axios from 'axios';

const API_BASE_URL = 'http://10.3.2.95:54927/api';

export const registerCustomer = async (customerData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/v1/customer/create`, customerData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginCustomer = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/v1/customer/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const createServiceRequest = async (requestData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/requests`, requestData);
    return response.data;
  } catch (error) {
    console.error('Request creation error:', error);
    throw error;
  }
};

export const getAllCustomers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/v1/customer/all`);
    return response.data;
  } catch (error) {
    console.error('Fetch customers error:', error);
    throw error;
  }
};

export const getAllRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests`);
    return response.data;
  } catch (error) {
    console.error('Fetch requests error:', error);
    throw error;
  }
};