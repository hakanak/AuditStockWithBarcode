# Sera Food Bakliyat Audit App

A Progressive Web Application (PWA) for product auditing in retail stores. Built with React, Vite, and html5-qrcode.

## Features

- 📍 **Location Selection**: Cascading dropdowns for Country → City → District → Market
- 📷 **Barcode Scanner**: Camera-based barcode scanning using html5-qrcode
- ✍️ **Manual Entry**: Option to manually enter barcodes
- ✅ **Review & Submit**: Review scanned products before submission
- 📱 **PWA Support**: Installable on mobile devices, works offline for UI
- 🇹🇷 **Turkish Language**: Full Turkish language support

## Tech Stack

- **Frontend**: React 19 + Vite
- **Routing**: React Router DOM
- **Barcode Scanner**: html5-qrcode
- **HTTP Client**: Axios
- **PWA**: vite-plugin-pwa

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API running (see API Configuration below)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

## API Configuration

The app expects the following API endpoints to be available:

### Location Endpoints
- `GET /api/locations/countries` - Get all countries
- `GET /api/locations/cities/{countryId}` - Get cities by country
- `GET /api/locations/districts/{cityId}` - Get districts by city
- `GET /api/locations/markets/{districtId}` - Get markets by district

### Audit Endpoints
- `POST /api/audits/submit` - Submit audit data
  ```json
  {
    "marketId": 1,
    "barcodes": ["8690572000124", "8690572000131"],
    "auditDate": "2024-12-22",
    "employeeId": "1",
    "username": "jane.joe"
  }
  ```
- `GET /api/products/info/{barcode}` - Get product info (optional)

## Application Flow

1. **Step 1 - Location Selection** (`/`)
   - User selects Country → City → District → Market
   - Cascading dropdowns load options based on previous selection
   - "İleri" button enabled when market is selected

2. **Step 2 - Barcode Scanning** (`/scan`)
   - Camera opens automatically for barcode scanning
   - Scanned barcodes are added to a list
   - Manual entry option available
   - Can delete individual barcodes
   - "Kontrole Geç" button to proceed to review

3. **Step 3 - Review & Submit** (`/review`)
   - Review all scanned barcodes
   - View audit information (market, date, count)
   - Delete individual items if needed
   - Submit audit to backend API
   - Success message and redirect to Step 1

## Project Structure

```
src/
├── components/
│   ├── Step1LocationSelect.jsx    # Location selection component
│   ├── Step2BarcodeScanner.jsx    # Barcode scanner component
│   ├── Step3ReviewSubmit.jsx      # Review and submit component
│   └── common/
│       ├── Dropdown.jsx            # Reusable dropdown component
│       └── BarcodeList.jsx         # Barcode list display component
├── services/
│   └── api.js                      # API service layer with axios
├── context/
│   └── AuditContext.jsx            # Global state management
├── App.jsx                         # Main app with routing
├── App.css                         # Global styles
└── main.jsx                        # App entry point
```

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder. Deploy this folder to your web server.

## PWA Features

- **Installable**: Users can install the app on their mobile devices
- **Offline UI**: The app UI works offline (service worker caches assets)
- **Online Required**: API calls require internet connection
- **Auto-update**: Service worker automatically updates when new version is deployed

## Camera Permissions

The barcode scanner requires camera access. Users will be prompted to allow camera permissions when they reach Step 2.

## Browser Support

- Chrome/Edge (recommended)
- Safari (iOS 11+)
- Firefox

## Notes for Developers

- The app uses React Context for state management (simple and effective for this use case)
- All components are functional components with hooks
- Inline styles are used for simplicity (no CSS framework needed)
- Mobile-first responsive design
- Error handling for all API calls
- Loading states for better UX

## Troubleshooting

### Camera not working
- Ensure HTTPS is enabled (camera API requires secure context)
- Check browser camera permissions
- Try a different browser

### API errors
- Verify the backend API is running
- Check the `VITE_API_BASE_URL` in `.env` file
- Check browser console for detailed error messages

## License

Private - Sera Food Bakliyat

## Support

For issues or questions, contact your development team.
