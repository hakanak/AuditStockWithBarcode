import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuditProvider } from './context/AuditContext';
import Step1LocationSelect from './components/Step1LocationSelect';
import Step2BarcodeScanner from './components/Step2BarcodeScanner';
import Step3ReviewSubmit from './components/Step3ReviewSubmit';
import './App.css';

/**
 * Main App Component
 * Sets up routing for the 3-step audit process
 */
function App() {
  return (
    <AuditProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Step1LocationSelect />} />
          <Route path="/scan" element={<Step2BarcodeScanner />} />
          <Route path="/review" element={<Step3ReviewSubmit />} />
        </Routes>
      </Router>
    </AuditProvider>
  );
}

export default App;
