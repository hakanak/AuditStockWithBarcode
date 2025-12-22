import { useState, useEffect } from 'react';

/**
 * Reusable Dropdown Component
 * @param {string} label - Label for the dropdown
 * @param {Array} options - Array of options {id, name}
 * @param {Object} value - Selected value
 * @param {Function} onChange - Change handler
 * @param {boolean} disabled - Whether dropdown is disabled
 * @param {boolean} loading - Whether dropdown is loading
 */
const Dropdown = ({ label, options, value, onChange, disabled, loading }) => {
    return (
        <div style={styles.container}>
            <label style={styles.label}>{label}</label>
            <select
                style={styles.select}
                value={value?.id || ''}
                onChange={(e) => {
                    const selected = options.find((opt) => opt.id === parseInt(e.target.value));
                    onChange(selected);
                }}
                disabled={disabled || loading}
            >
                <option value="">
                    {loading ? 'Yükleniyor...' : `${label} Seçin`}
                </option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

const styles = {
    container: {
        marginBottom: '20px',
        width: '100%',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#333',
    },
    select: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
        color: '#333',
        cursor: 'pointer',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
};

export default Dropdown;
