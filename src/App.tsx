import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ChickArrivals from './components/ChickArrivals';
import Mortality from './components/Mortality';
import FeedMedicine from './components/FeedMedicine';
import Sales from './components/Sales';
import Reports from './components/Reports';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DataProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/arrivals" element={<ChickArrivals />} />
                <Route path="/mortality" element={<Mortality />} />
                <Route path="/feed-medicine" element={<FeedMedicine />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </Layout>
          </Router>
        </DataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;