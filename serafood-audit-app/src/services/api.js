import axios from 'axios';

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with default configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Location API calls
export const locationApi = {
    // Get all countries
    getCountries: async () => {
        try {
            const response = await apiClient.get('/api/Locations/countries');
            // Map API response to expected format
            return response.data.map(country => ({
                id: country.countryId,
                name: country.countryName
            }));
        } catch (error) {
            console.error('Error fetching countries:', error);
            throw error;
        }
    },

    // Get cities by country ID
    getCities: async (countryId) => {
        try {
            const response = await apiClient.get(`/api/Locations/cities/${countryId}`);
            // Map API response to expected format
            return response.data.map(city => ({
                id: city.cityId,
                name: city.cityName
            }));
        } catch (error) {
            console.error('Error fetching cities:', error);
            throw error;
        }
    },

    // Get districts by city ID
    getDistricts: async (cityId) => {
        try {
            const response = await apiClient.get(`/api/Locations/districts/${cityId}`);
            // Map API response to expected format
            return response.data.map(district => ({
                id: district.districtId,
                name: district.districtName
            }));
        } catch (error) {
            console.error('Error fetching districts:', error);
            throw error;
        }
    },

    // Get markets by district ID
    getMarkets: async (districtId) => {
        try {
            const response = await apiClient.get(`/api/Locations/markets/${districtId}`);
            // Map API response to expected format
            return response.data.map(market => ({
                id: market.marketId,
                name: market.marketName
            }));
        } catch (error) {
            console.error('Error fetching markets:', error);
            throw error;
        }
    },
};

// Audit API calls
export const auditApi = {
    // Submit audit data
    submitAudit: async (auditData) => {
        try {
            const response = await apiClient.post('/api/audits/submit', auditData);
            return response.data;
        } catch (error) {
            console.error('Error submitting audit:', error);
            throw error;
        }
    },

    // Get product info by barcode
    getProductInfo: async (barcode) => {
        try {
            const response = await apiClient.get(`/api/products/info/${barcode}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product info:', error);
            throw error;
        }
    },
};

export default apiClient;
