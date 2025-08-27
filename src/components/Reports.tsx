import React from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import { useData } from '../hooks/useData';
import { useLanguage } from '../hooks/useLanguage';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { formatCurrency } from '../utils/format';


const Reports: React.FC = () => {
  const { chickArrivals, mortalities, feedMedicines, sales, stats } = useData();
  const { t, language } = useLanguage();
  const [isGenerating, setIsGenerating] = React.useState(false);

  const generatePDFReport = async () => {
    setIsGenerating(true);
    try {
      console.log('Starting PDF generation...');
      console.log('jsPDF available:', typeof jsPDF !== 'undefined');
      
      if (typeof jsPDF === 'undefined') {
        throw new Error('jsPDF library is not available');
      }
      
      console.log('Data status:', {
        chickArrivals: chickArrivals.length,
        mortalities: mortalities.length,
        feedMedicines: feedMedicines.length,
        sales: sales.length,
        stats: stats
      });
      
      // Check if there's any data to generate a report from
      if (chickArrivals.length === 0 && mortalities.length === 0 && feedMedicines.length === 0 && sales.length === 0) {
        alert('No data available to generate a report. Please add some records first.');
        setIsGenerating(false);
        return;
      }
      
      const doc = new jsPDF();
      
      // Check if autoTable is available
      console.log('autoTable plugin available:', typeof autoTable !== 'undefined');
      
      if (typeof autoTable === 'undefined') {
        throw new Error('jsPDF autoTable plugin is not available. Please check the jspdf-autotable installation.');
      }

      // Set a standard font that's always available
      doc.setFont('helvetica');

      // Title
      doc.setFontSize(20);
      if (language === 'ur') {
        doc.text('پولٹری فارم منیجمینٹ رپورٹ', 20, 20);
      } else {
        doc.text('Poultry Farm Management Report', 20, 20);
      }

      // Date
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);

      let yPosition = 60;

      // Summary Statistics
      doc.setFontSize(16);
      doc.text(language === 'ur' ? 'خلاصہ' : 'Summary', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      const summaryData = [
        [language === 'ur' ? 'کل چوزے' : 'Total Chicks', stats.totalChicks.toLocaleString()],
        [language === 'ur' ? 'موجودہ اسٹاک' : 'Current Stock', stats.currentStock.toLocaleString()],
        [language === 'ur' ? 'کل اموات' : 'Total Mortality', stats.totalMortality.toLocaleString()],
        [language === 'ur' ? 'اموات کی شرح' : 'Mortality Rate', `${stats.mortalityRate.toFixed(1)}%`],
        [language === 'ur' ? 'کل فروخت' : 'Total Sales', stats.totalSales.toLocaleString()],
        [language === 'ur' ? 'کل آمدنی' : 'Total Revenue', formatCurrency(language, stats.totalRevenue)],
        [language === 'ur' ? 'باقی رقم' : 'Outstanding Amount', formatCurrency(language, stats.totalOutstanding)],
        [language === 'ur' ? 'فیڈ کی لاگت' : 'Feed Cost', formatCurrency(language, stats.totalFeedCost)],
        [language === 'ur' ? 'دوائی کی لاگت' : 'Medicine Cost', formatCurrency(language, stats.totalMedicineCost)],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [[language === 'ur' ? 'میٹرک' : 'Metric', language === 'ur' ? 'قیمت' : 'Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { font: 'helvetica' },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;

      // Chick Arrivals
      if (chickArrivals.length > 0) {
        doc.setFontSize(16);
        doc.text(language === 'ur' ? 'چوزوں کی آمد' : 'Chick Arrivals', 20, yPosition);
        yPosition += 10;
        
        const arrivalData = chickArrivals.map(arrival => [
          arrival.date,
          arrival.batchNumber,
          arrival.quantity.toLocaleString(),
          arrival.source || '-'
        ]);
        
        autoTable(doc, {
          startY: yPosition,
          head: [[language === 'ur' ? 'تاریخ' : 'Date', language === 'ur' ? 'بیچ' : 'Batch', language === 'ur' ? 'تعداد' : 'Quantity', language === 'ur' ? 'ذریعہ' : 'Source']],
          body: arrivalData,
          theme: 'grid',
          headStyles: { fillColor: [34, 197, 94] },
          styles: { font: 'helvetica' },
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
        doc.text(language === 'ur' ? 'اموات کا ریکارڈ' : 'Mortality Records', 20, yPosition);
        yPosition += 10;
        
        const mortalityData = mortalities.map(mortality => [
          mortality.date,
          mortality.quantity.toLocaleString(),
          mortality.notes || '-'
        ]);
        
        autoTable(doc, {
          startY: yPosition,
          head: [[language === 'ur' ? 'تاریخ' : 'Date', language === 'ur' ? 'تعداد' : 'Quantity', language === 'ur' ? 'نوٹس' : 'Notes']],
          body: mortalityData,
          theme: 'grid',
          headStyles: { fillColor: [239, 68, 68] },
          styles: { font: 'helvetica' },
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
        doc.text(language === 'ur' ? 'فیڈ اور دوائی کا ریکارڈ' : 'Feed & Medicine Records', 20, yPosition);
        yPosition += 10;
        
        const feedMedicineData = feedMedicines.map(item => [
          item.date,
          item.type === 'feed' ? (language === 'ur' ? 'فیڈ' : 'Feed') : (language === 'ur' ? 'دوائی' : 'Medicine'),
          item.name,
          item.cost.toString(), // Using cost instead of quantity since FeedMedicine doesn't have quantity
          formatCurrency(language, item.cost),
          item.supplier || '-'
        ]);
        
        autoTable(doc, {
          startY: yPosition,
          head: [[language === 'ur' ? 'تاریخ' : 'Date', language === 'ur' ? 'قسم' : 'Type', language === 'ur' ? 'نام' : 'Name', language === 'ur' ? 'تعداد' : 'Quantity', language === 'ur' ? 'قیمت' : 'Cost', language === 'ur' ? 'سپلائر' : 'Supplier']],
          body: feedMedicineData,
          theme: 'grid',
          headStyles: { fillColor: [245, 158, 11] },
          styles: { font: 'helvetica' },
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
        doc.text(language === 'ur' ? 'فروخت کا ریکارڈ' : 'Sales Records', 20, yPosition);
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
        
        autoTable(doc, {
          startY: yPosition,
          head: [[language === 'ur' ? 'تاریخ' : 'Date', language === 'ur' ? 'گاہک' : 'Customer', language === 'ur' ? 'تعداد' : 'Quantity', language === 'ur' ? 'فی یونٹ قیمت' : 'Price/Unit', language === 'ur' ? 'کل' : 'Total', language === 'ur' ? 'وصول' : 'Received', language === 'ur' ? 'باقی' : 'Outstanding']],
          body: salesData,
          theme: 'grid',
          headStyles: { fillColor: [147, 51, 234] },
          styles: { font: 'helvetica' },
        });
      }

      // Save the PDF
      console.log('Saving PDF...');
      doc.save(`poultry-farm-report-${new Date().toISOString().split('T')[0]}.pdf`);
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF report:', error);
      alert('Error generating PDF report. Please check the console for details.');
    } finally {
      setIsGenerating(false);
    }
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
          disabled={isGenerating}
          className={`flex items-center gap-2 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Download className="h-4 w-4" />
          <span className={language === 'ur' ? 'urdu-text' : 'english-text'}>
            {isGenerating ? (language === 'ur' ? 'تیار کیا جا رہا ہے...' : 'Generating...') : t('downloadPDF')}
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