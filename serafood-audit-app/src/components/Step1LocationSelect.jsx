import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudit } from '../context/AuditContext';
import { locationApi } from '../services/api';
import Dropdown from './common/Dropdown';

/**
 * Step 1: Location Selection Component
 * Cascading dropdowns for Country → City → District → Market
 */
const Step1LocationSelect = () => {
    const navigate = useNavigate();
    const {
        selectedCountry,
        setSelectedCountry,
        selectedCity,
        setSelectedCity,
        selectedDistrict,
        setSelectedDistrict,
        selectedMarket,
        setSelectedMarket,
    } = useAudit();

    // Options for each dropdown
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [markets, setMarkets] = useState([]);

    // Loading states
    const [loadingCountries, setLoadingCountries] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingMarkets, setLoadingMarkets] = useState(false);

    // Error state
    const [error, setError] = useState(null);

    // Load countries on component mount
    useEffect(() => {
        loadCountries();
    }, []);

    const loadCountries = async () => {
        setLoadingCountries(true);
        setError(null);
        try {
            const data = await locationApi.getCountries();
            setCountries(data);
        } catch (err) {
            setError('Ülkeler yüklenirken hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoadingCountries(false);
        }
    };

    // Load cities when country changes
    useEffect(() => {
        if (selectedCountry) {
            loadCities(selectedCountry.id);
        } else {
            setCities([]);
            setSelectedCity(null);
        }
    }, [selectedCountry]);

    const loadCities = async (countryId) => {
        setLoadingCities(true);
        setError(null);
        try {
            const data = await locationApi.getCities(countryId);
            setCities(data);
        } catch (err) {
            setError('Şehirler yüklenirken hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoadingCities(false);
        }
    };

    // Load districts when city changes
    useEffect(() => {
        if (selectedCity) {
            loadDistricts(selectedCity.id);
        } else {
            setDistricts([]);
            setSelectedDistrict(null);
        }
    }, [selectedCity]);

    const loadDistricts = async (cityId) => {
        setLoadingDistricts(true);
        setError(null);
        try {
            const data = await locationApi.getDistricts(cityId);
            setDistricts(data);
        } catch (err) {
            setError('İlçeler yüklenirken hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoadingDistricts(false);
        }
    };

    // Load markets when district changes
    useEffect(() => {
        if (selectedDistrict) {
            loadMarkets(selectedDistrict.id);
        } else {
            setMarkets([]);
            setSelectedMarket(null);
        }
    }, [selectedDistrict]);

    const loadMarkets = async (districtId) => {
        setLoadingMarkets(true);
        setError(null);
        try {
            const data = await locationApi.getMarkets(districtId);
            setMarkets(data);
        } catch (err) {
            setError('Marketler yüklenirken hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoadingMarkets(false);
        }
    };

    const handleNext = () => {
        if (selectedMarket) {
            navigate('/scan');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Sera Food Bakliyat</h1>
                <h2 style={styles.subtitle}>Ürün Denetimi</h2>

                {error && (
                    <div style={styles.error}>
                        <p>{error}</p>
                        <button style={styles.retryButton} onClick={loadCountries}>
                            Tekrar Dene
                        </button>
                    </div>
                )}

                <div style={styles.form}>
                    <Dropdown
                        label="Ülke"
                        options={countries}
                        value={selectedCountry}
                        onChange={(value) => {
                            setSelectedCountry(value);
                            setSelectedCity(null);
                            setSelectedDistrict(null);
                            setSelectedMarket(null);
                        }}
                        loading={loadingCountries}
                    />

                    <Dropdown
                        label="Şehir"
                        options={cities}
                        value={selectedCity}
                        onChange={(value) => {
                            setSelectedCity(value);
                            setSelectedDistrict(null);
                            setSelectedMarket(null);
                        }}
                        disabled={!selectedCountry}
                        loading={loadingCities}
                    />

                    <Dropdown
                        label="İlçe"
                        options={districts}
                        value={selectedDistrict}
                        onChange={(value) => {
                            setSelectedDistrict(value);
                            setSelectedMarket(null);
                        }}
                        disabled={!selectedCity}
                        loading={loadingDistricts}
                    />

                    <Dropdown
                        label="Market"
                        options={markets}
                        value={selectedMarket}
                        onChange={setSelectedMarket}
                        disabled={!selectedDistrict}
                        loading={loadingMarkets}
                    />

                    <button
                        style={{
                            ...styles.nextButton,
                            ...(selectedMarket ? {} : styles.nextButtonDisabled),
                        }}
                        onClick={handleNext}
                        disabled={!selectedMarket}
                    >
                        İleri
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: '8px',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: '18px',
        fontWeight: '400',
        color: '#7f8c8d',
        marginBottom: '30px',
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    nextButton: {
        width: '100%',
        padding: '14px',
        fontSize: '18px',
        fontWeight: '600',
        backgroundColor: '#27ae60',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '20px',
        transition: 'background-color 0.2s',
    },
    nextButtonDisabled: {
        backgroundColor: '#95a5a6',
        cursor: 'not-allowed',
    },
    error: {
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '20px',
        color: '#c33',
    },
    retryButton: {
        marginTop: '8px',
        padding: '6px 12px',
        backgroundColor: '#e74c3c',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default Step1LocationSelect;
