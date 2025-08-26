import React from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import NastaliqTTF from '../assets/fonts/Mehr_Nastaliq_Web.ttf?url';
import { formatCurrency } from '../utils/format';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const Reports: React.FC = () => {
  const { chickArrivals, mortalities, feedMedicines, sales, stats } = useData();
  const { t, language } = useLanguage();

  const generatePDFReport = async () => {
    const doc = new jsPDF();
    
    const fontBytes = await fetch(NastaliqTTF).then(res => res.arrayBuffer());
    const uint8 = new Uint8Array(fontBytes);
    let binary = '';
    for (let i = 0; i < uint8.length; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    const base64String = btoa(binary);
    doc.addFileToVFS('MehrNastaliq.ttf', base64String);
    doc.addFont('MehrNastaliq.ttf', 'MehrNastaliq', 'normal');

    // Choose font based on language (use custom for Urdu else default)
    if (language === 'ur') {
      doc.setFont('MehrNastaliq', 'normal');
      doc.setR2L(true);
    }
    
    // Title
    doc.setFontSize(20);
    doc.text('Poultry Farm Management Report', 20, 20);
    doc.setFont('MehrNastaliq');
    doc.text('پولٹری فارم منیجمینٹ رپورٹ', 20, 30);
    // Reset font to english default if needed
    doc.setFont(language === 'ur' ? 'MehrNastaliq' : 'helvetica');
    
    // Date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    
    let yPosition = 60;
    
    // Summary Statistics
    doc.setFontSize(16);
    doc.text('Summary / خلاصہ', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    const summaryData = [
      ['Total Chicks / کل چوزے', stats.totalChicks.toLocaleString()],
      ['Current Stock / موجودہ اسٹاک', stats.currentStock.toLocaleString()],
      ['Total Mortality / کل اموات', stats.totalMortality.toLocaleString()],
      ['Mortality Rate / اموات کی شرح', `${stats.mortalityRate.toFixed(1)}%`],
      ['Total Sales / کل فروخت', stats.totalSales.toLocaleString()],
      ['Total Revenue / کل آمدنی', formatCurrency(language, stats.totalRevenue)],
      ['Outstanding Amount / باقی رقم', formatCurrency(language, stats.totalOutstanding)],
      ['Feed Cost / فیڈ کی لاگت', formatCurrency(language, stats.totalFeedCost)],
      ['Medicine Cost / دوائی کی لاگت', formatCurrency(language, stats.totalMedicineCost)],
    ];
    
    doc.autoTable({
      startY: yPosition,
      head: [['Metric / میٹرک', 'Value / قیمت']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { font: 'MehrNastaliq' },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 20;
    
    // Chick Arrivals
    if (chickArrivals.length > 0) {
      doc.setFontSize(16);
      doc.text('Chick Arrivals / چوزوں کی آمد', 20, yPosition);
      yPosition += 10;
      
      const arrivalData = chickArrivals.map(arrival => [
        arrival.date,
        arrival.batchNumber,
        arrival.quantity.toLocaleString(),
        arrival.source || '-'
      ]);
      
      doc.autoTable({
        startY: yPosition,
        head: [['Date / تاریخ', 'Batch / بیچ', 'Quantity / تعداد', 'Source / ذریعہ']],
        body: arrivalData,
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94] },
        styles: { font: 'MehrNastaliq' },
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 20;
    }
    
    // Add new page if needed
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Mortality Records
    if (mortalities.length > 0) {
      doc.setFontSize(16);
      doc.text('Mortality Records / اموات کا ریکارڈ', 20, yPosition);
      yPosition += 10;
      
      const mortalityData = mortalities.map(mortality => [
        mortality.date,
        mortality.quantity.toLocaleString(),
        mortality.notes || '-'
      ]);
      
      doc.autoTable({
        startY: yPosition,
        head: [['Date / تاریخ', 'Quantity / تعداد', 'Notes / نوٹس']],
        body: mortalityData,
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68] },
        styles: { font: 'MehrNastaliq' },
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 20;
    }
    
    // Add new page if needed
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Feed & Medicine Records
    if (feedMedicines.length > 0) {
      doc.setFontSize(16);
      doc.text('Feed & Medicine Records / فیڈ اور دوائی کا ریکارڈ', 20, yPosition);
      yPosition += 10;
      
      const feedMedicineData = feedMedicines.map(item => [
        item.date,
        item.type === 'feed' ? 'Feed / فیڈ' : 'Medicine / دوائی',
        item.name,
        item.quantity.toString(),
        formatCurrency(language, item.cost),
        item.supplier || '-'
      ]);
      
      doc.autoTable({
        startY: yPosition,
        head: [['Date / تاریخ', 'Type / قسم', 'Name / نام', 'Quantity / تعداد', 'Cost / قیمت', 'Supplier / سپلائر']],
        body: feedMedicineData,
        theme: 'grid',
        headStyles: { fillColor: [245, 158, 11] },
        styles: { font: 'MehrNastaliq' },
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 20;
    }
    
    // Add new page if needed
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Sales Records
    if (sales.length > 0) {
      doc.setFontSize(16);
      doc.text('Sales Records / فروخت کا ریکارڈ', 20, yPosition);
      yPosition += 10;
      
      const salesData = sales.map(sale => [
        sale.date,
        sale.customerName,
        sale.quantity.toLocaleString(),
        formatCurrency(language, sale.pricePerUnit),
        formatCurrency(language, sale.totalAmount),
        formatCurrency(language, sale.amountReceived),
        formatCurrency(language, sale.outstandingBalance)
      ]);
      
      doc.autoTable({
        startY: yPosition,
        head: [['Date / تاریخ', 'Customer / گاہک', 'Quantity / تعداد', 'Price/Unit / فی یونٹ قیمت', 'Total / کل', 'Received / وصول', 'Outstanding / باقی']],
        body: salesData,
        theme: 'grid',
        headStyles: { fillColor: [147, 51, 234] },
        styles: { font: 'MehrNastaliq' },
      });
    }
    
    // Save the PDF
    doc.save(`poultry-farm-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold text-gray-900 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
            {t('reports')}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Generate comprehensive reports for your poultry farm
          </p>
        </div>
        <button
          onClick={generatePDFReport}
          className="btn-primary flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span className={language === 'ur' ? 'urdu-text' : 'english-text'}>
            {t('downloadPDF')}
          </span>
        </button>
      </div>

      {/* Report Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
            Farm Overview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Chicks Received</span>
              <span className="font-semibold">{stats.totalChicks.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Current Stock</span>
              <span className="font-semibold text-green-600">{stats.currentStock.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Mortality</span>
              <span className="font-semibold text-red-600">{stats.totalMortality.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Mortality Rate</span>
              <span className="font-semibold text-orange-600">{stats.mortalityRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Survival Rate</span>
              <span className="font-semibold text-green-600">{(100 - stats.mortalityRate).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${language === 'ur' ? 'urdu-text' : 'english-text'}`}>
            Financial Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Sales Quantity</span>
              <span className="font-semibold">{stats.totalSales.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold text-green-600">{formatCurrency(language, stats.totalRevenue)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Outstanding Amount</span>
              <span className="font-semibold text-yellow-600">{formatCurrency(language, stats.totalOutstanding)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Feed Cost</span>
              <span className="font-semibold text-orange-600">{formatCurrency(language, stats.totalFeedCost)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Medicine Cost</span>
              <span className="font-semibold text-red-600">{formatCurrency(language, stats.totalMedicineCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <FileText className="h-8 w-8 text-blue-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-900">Arrival Records</h4>
          <p className="text-2xl font-bold text-blue-600">{chickArrivals.length}</p>
          <p className="text-sm text-gray-600">Total batches received</p>
        </div>

        <div className="card text-center">
          <FileText className="h-8 w-8 text-red-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-900">Mortality Records</h4>
          <p className="text-2xl font-bold text-red-600">{mortalities.length}</p>
          <p className="text-sm text-gray-600">Death incidents recorded</p>
        </div>

        <div className="card text-center">
          <FileText className="h-8 w-8 text-orange-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-900">Feed & Medicine</h4>
          <p className="text-2xl font-bold text-orange-600">{feedMedicines.length}</p>
          <p className="text-sm text-gray-600">Purchase records</p>
        </div>

        <div className="card text-center">
          <FileText className="h-8 w-8 text-purple-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-900">Sales Records</h4>
          <p className="text-2xl font-bold text-purple-600">{sales.length}</p>
          <p className="text-sm text-gray-600">Sales transactions</p>
        </div>
      </div>

      {/* Report Generation Info */}
      <div className="card">
        <div className="flex items-start gap-4">
          <Calendar className="h-6 w-6 text-blue-500 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Report Contents</h3>
            <p className="text-gray-600 mb-4">
              The generated PDF report includes comprehensive data from all modules:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Complete summary statistics and key metrics
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                All chick arrival records with batch details
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Mortality records with dates and causes
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Feed and medicine purchase history
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Sales records with customer details and payments
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                Bilingual headers (English & Urdu) for better accessibility
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;