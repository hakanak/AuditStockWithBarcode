/**
 * BarcodeList Component
 * Displays a list of scanned barcodes with delete functionality
 * @param {Array} barcodes - Array of barcode strings
 * @param {Function} onDelete - Delete handler function
 */
const BarcodeList = ({ barcodes, onDelete }) => {
    if (barcodes.length === 0) {
        return (
            <div style={styles.emptyState}>
                <p style={styles.emptyText}>Henüz barkod okutulmadı</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>Okutulan Ürünler ({barcodes.length})</h3>
            <div style={styles.list}>
                {barcodes.map((barcode, index) => (
                    <div key={index} style={styles.item}>
                        <span style={styles.barcode}>{barcode}</span>
                        <button
                            style={styles.deleteButton}
                            onClick={() => onDelete(barcode)}
                        >
                            Sil
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        marginTop: '20px',
        width: '100%',
    },
    title: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '12px',
        color: '#333',
    },
    list: {
        maxHeight: '300px',
        overflowY: 'auto',
        border: '2px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #eee',
    },
    barcode: {
        fontSize: '16px',
        fontFamily: 'monospace',
        color: '#333',
    },
    deleteButton: {
        padding: '6px 16px',
        fontSize: '14px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    emptyState: {
        padding: '40px 20px',
        textAlign: 'center',
        border: '2px dashed #ddd',
        borderRadius: '8px',
        marginTop: '20px',
    },
    emptyText: {
        color: '#999',
        fontSize: '16px',
    },
};

export default BarcodeList;
