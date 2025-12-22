import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudit } from '../context/AuditContext';
import { auditApi } from '../services/api';
import BarcodeList from './common/BarcodeList';

/**
 * Step 3: Review & Submit Component
 * Review scanned barcodes and submit audit data
 */
const Step3ReviewSubmit = () => {
    const navigate = useNavigate();
    const {
        barcodes,
        removeBarcode,
        getAuditData,
        resetAudit,
        selectedMarket,
    } = useAudit();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleBack = () => {
        navigate('/scan');
    };

    const handleSubmit = async () => {
        if (barcodes.length === 0) {
            setError('Lütfen en az bir barkod ekleyin!');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const auditData = getAuditData();
            await auditApi.submitAudit(auditData);

            setSuccess(true);

            // Wait 2 seconds then redirect to start
            setTimeout(() => {
                resetAudit();
                navigate('/');
            }, 2000);
        } catch (err) {
            console.error('Error submitting audit:', err);
            setError(
                err.response?.data?.message ||
                'Denetim gönderilirken hata oluştu. Lütfen tekrar deneyin.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div style={styles.container}>
                <div style={styles.successCard}>
                    <div style={styles.successIcon}>✓</div>
                    <h2 style={styles.successTitle}>Başarılı!</h2>
                    <p style={styles.successText}>
                        Denetim başarıyla gönderildi.
                    </p>
                    <p style={styles.successSubtext}>
                        Ana sayfaya yönlendiriliyorsunuz...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.backButton} onClick={handleBack}>
                    ← Geri
                </button>
                <h2 style={styles.title}>Kontrol ve Gönder</h2>
            </div>

            {error && (
                <div style={styles.errorMessage}>
                    {error}
                </div>
            )}

            {/* Location Info */}
            <div style={styles.infoCard}>
                <h3 style={styles.infoTitle}>Denetim Bilgileri</h3>
                <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Market:</span>
                    <span style={styles.infoValue}>{selectedMarket?.name || 'Seçilmedi'}</span>
                </div>
                <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Tarih:</span>
                    <span style={styles.infoValue}>
                        {new Date().toLocaleDateString('tr-TR')}
                    </span>
                </div>
                <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Toplam Ürün:</span>
                    <span style={styles.infoValue}>{barcodes.length}</span>
                </div>
            </div>

            {/* Barcode List */}
            <div style={styles.listContainer}>
                <BarcodeList barcodes={barcodes} onDelete={removeBarcode} />
            </div>

            {/* Submit Button */}
            <button
                style={{
                    ...styles.submitButton,
                    ...(submitting ? styles.submitButtonDisabled : {}),
                }}
                onClick={handleSubmit}
                disabled={submitting || barcodes.length === 0}
            >
                {submitting ? 'Gönderiliyor...' : `Denetimi Gönder (${barcodes.length} Ürün)`}
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
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    infoTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '16px',
        color: '#333',
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px solid #eee',
    },
    infoLabel: {
        fontSize: '16px',
        color: '#666',
    },
    infoValue: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#333',
    },
    listContainer: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    submitButton: {
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
    submitButtonDisabled: {
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
    successCard: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '60px 30px',
        maxWidth: '400px',
        margin: '100px auto',
        textAlign: 'center',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
    },
    successIcon: {
        fontSize: '80px',
        color: '#27ae60',
        marginBottom: '20px',
    },
    successTitle: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#27ae60',
        marginBottom: '12px',
    },
    successText: {
        fontSize: '18px',
        color: '#333',
        marginBottom: '8px',
    },
    successSubtext: {
        fontSize: '14px',
        color: '#999',
    },
};

export default Step3ReviewSubmit;
