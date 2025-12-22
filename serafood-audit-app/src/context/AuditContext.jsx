import { createContext, useContext, useState } from 'react';

// Create context for audit data
const AuditContext = createContext();

// Custom hook to use audit context
export const useAudit = () => {
    const context = useContext(AuditContext);
    if (!context) {
        throw new Error('useAudit must be used within AuditProvider');
    }
    return context;
};

// Provider component to wrap the app
export const AuditProvider = ({ children }) => {
    // Location selection state
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedMarket, setSelectedMarket] = useState(null);

    // Barcode list state
    const [barcodes, setBarcodes] = useState([]);

    // Employee info (you can extend this later)
    const [employeeId] = useState('1'); // Default employee ID
    const [username] = useState('jane.joe'); // Default username

    // Add barcode to the list
    const addBarcode = (barcode) => {
        // Check if barcode already exists
        if (!barcodes.includes(barcode)) {
            setBarcodes([...barcodes, barcode]);
            return true;
        }
        return false; // Barcode already exists
    };

    // Remove barcode from the list
    const removeBarcode = (barcode) => {
        setBarcodes(barcodes.filter((b) => b !== barcode));
    };

    // Clear all barcodes
    const clearBarcodes = () => {
        setBarcodes([]);
    };

    // Reset all audit data (used after successful submission)
    const resetAudit = () => {
        setSelectedCountry(null);
        setSelectedCity(null);
        setSelectedDistrict(null);
        setSelectedMarket(null);
        setBarcodes([]);
    };

    // Prepare audit data for submission
    const getAuditData = () => {
        return {
            marketId: selectedMarket?.id,
            barcodes: barcodes,
            auditDate: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
            employeeId: employeeId,
            username: username,
        };
    };

    const value = {
        // Location state
        selectedCountry,
        setSelectedCountry,
        selectedCity,
        setSelectedCity,
        selectedDistrict,
        setSelectedDistrict,
        selectedMarket,
        setSelectedMarket,

        // Barcode state
        barcodes,
        addBarcode,
        removeBarcode,
        clearBarcodes,

        // Employee info
        employeeId,
        username,

        // Utility functions
        resetAudit,
        getAuditData,
    };

    return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>;
};
