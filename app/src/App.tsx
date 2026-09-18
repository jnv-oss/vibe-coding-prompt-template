import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SettlementDetailPage from './pages/SettlementDetailPage';
import ClaimPage from './pages/ClaimPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/settlements/:id" element={<SettlementDetailPage />} />
        <Route path="/settlements/:id/claim" element={<ClaimPage />} />
      </Routes>
    </BrowserRouter>
  );
}
