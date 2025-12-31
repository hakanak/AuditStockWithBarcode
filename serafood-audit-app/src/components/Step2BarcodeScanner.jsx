import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { useAudit } from '../context/AuditContext';
import BarcodeList from './common/BarcodeList';

/**
 * Step 2: Barcode Scanner Component
 * Uses html5-qrcode library for camera-based barcode scanning
 */
const Step2BarcodeScanner = () => {
    const navigate = useNavigate();
    const { barcodes, addBarcode, removeBarcode } = useAudit();

    // Use ref to keep track of latest addBarcode function to avoid stale closures in scanner callback
    const addBarcodeRef = useRef(addBarcode);

    // Update ref whenever addBarcode changes
    useEffect(() => {
        addBarcodeRef.current = addBarcode;
    }, [addBarcode]);

    const [manualBarcode, setManualBarcode] = useState('');
    const [scannerStarted, setScannerStarted] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const scannerRef = useRef(null);
    const html5QrCodeRef = useRef(null);

    // Initialize scanner on component mount
    useEffect(() => {
        startScanner();

        // Cleanup: stop scanner when component unmounts
        return () => {
            stopScanner();
        };
    }, []);

    const startScanner = async () => {
        try {
            // Create scanner instance
            html5QrCodeRef.current = new Html5Qrcode('reader');

            // Start scanning
            await html5QrCodeRef.current.start(
                { facingMode: 'environment' }, // Use back camera
                {
                    fps: 10, // Frames per second
                    qrbox: { width: 250, height: 250 }, // Scanning box size
                },
                (decodedText) => onScanSuccess(decodedText), // Wrap to ensure we use latest closure if possible, but ref is safest
                onScanError
            );

            setScannerStarted(true);
            setError(null);
        } catch (err) {
            console.error('Error starting scanner:', err);
            setError('Kamera başlatılamadı. Lütfen kamera izinlerini kontrol edin.');
        }
    };

    const stopScanner = async () => {
        if (html5QrCodeRef.current && scannerStarted) {
            try {
                await html5QrCodeRef.current.stop();
                html5QrCodeRef.current.clear();
            } catch (err) {
                console.error('Error stopping scanner:', err);
            }
        }
    };

    const onScanSuccess = (decodedText) => {
        // Add barcode to list using the ref to ensure we have the latest state
        const added = addBarcodeRef.current(decodedText);

        if (added) {
            setSuccessMessage(`Barkod eklendi: ${decodedText}`);
            setTimeout(() => setSuccessMessage(null), 2000);
        } else {
            setError('Bu barkod zaten listede!');
            setTimeout(() => setError(null), 2000);
        }
    };

    const onScanError = (errorMessage) => {
        // Ignore scan errors (they happen frequently during scanning)
        // console.log('Scan error:', errorMessage);
    };

    const handleManualAdd = () => {
        if (manualBarcode.trim()) {
            const added = addBarcode(manualBarcode.trim());
            if (added) {
                setSuccessMessage(`Barkod eklendi: ${manualBarcode}`);
                setManualBarcode('');
                setTimeout(() => setSuccessMessage(null), 2000);
            } else {
                setError('Bu barkod zaten listede!');
                setTimeout(() => setError(null), 2000);
            }
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    const handleContinue = () => {
        if (barcodes.length > 0) {
            navigate('/review');
        } else {
            setError('Lütfen en az bir barkod okutun!');
            setTimeout(() => setError(null), 2000);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.backButton} onClick={handleBack}>
                    ← Geri
                </button>
                <h2 style={styles.title}>Barkod Okut</h2>
            </div>

            {error && (
                <div style={styles.errorMessage}>
                    {error}
                </div>
            )}

            {successMessage && (
                <div style={styles.successMessage}>
                    {successMessage}
                </div>
            )}

            {/* Camera Scanner */}
            <div style={styles.scannerContainer}>
                <div id="reader" style={styles.reader}></div>
            </div>

            {/* Manual Entry */}
            <div style={styles.manualEntry}>
                <h3 style={styles.manualTitle}>Manuel Giriş</h3>
                <div style={styles.inputGroup}>
                    <input
                        type="text"
                        style={styles.input}
                        placeholder="Barkod numarasını girin"
                        value={manualBarcode}
                        onChange={(e) => setManualBarcode(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleManualAdd();
                            }
                        }}
                    />
                    <button style={styles.addButton} onClick={handleManualAdd}>
                        Ekle
                    </button>
                </div>
            </div>

            {/* Barcode List */}
            <BarcodeList barcodes={barcodes} onDelete={removeBarcode} />

            {/* Continue Button */}
            <button
                style={{
                    ...styles.continueButton,
                    ...(barcodes.length === 0 ? styles.continueButtonDisabled : {}),
                }}
                onClick={handleContinue}
                disabled={barcodes.length === 0}
            >
                Kontrole Geç ({barcodes.length})
            </button>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        position: 'relative',
    },
    backButton: {
        padding: '8px 16px',
        fontSize: '16px',
        backgroundColor: '#6c757d',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: '22px',
        fontWeight: '600',
        color: '#2c3e50',
        margin: 0,
    },
    scannerContainer: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    reader: {
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
    },
    manualEntry: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    manualTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '12px',
        color: '#333',
    },
    inputGroup: {
        display: 'flex',
        gap: '10px',
    },
    input: {
        flex: 1,
        padding: '12px',
        fontSize: '16px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        outline: 'none',
    },
    addButton: {
        padding: '12px 24px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        whiteSpace: 'nowrap',
    },
    continueButton: {
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
    },
    continueButtonDisabled: {
        backgroundColor: '#95a5a6',
        cursor: 'not-allowed',
    },
    errorMessage: {
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '20px',
        color: '#c33',
        textAlign: 'center',
        fontWeight: '500',
    },
    successMessage: {
        backgroundColor: '#efe',
        border: '1px solid #cfc',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '20px',
        color: '#3c3',
        textAlign: 'center',
        fontWeight: '500',
    },
};

export default Step2BarcodeScanner;
