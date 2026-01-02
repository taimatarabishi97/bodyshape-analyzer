import jsPDF from 'jspdf';
import type { AnalysisResult } from '@/types';

export function generatePDF(
  email: string,
  result: AnalysisResult
): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    
    const lines = doc.splitTextToSize(text, maxWidth);
    
    // Check if we need a new page
    if (yPosition + (lines.length * fontSize * 0.5) > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * fontSize * 0.5 + 5;
  };

  // Header with gradient effect (simulated with colored rectangle)
  doc.setFillColor(139, 92, 246); // Purple
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Body Shape Analysis', pageWidth / 2, 25, { align: 'center' });
  
  yPosition = 50;

  // User email
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(10);
  doc.text(`Analysis for: ${email}`, margin, yPosition);
  yPosition += 10;

  doc.setTextColor(107, 114, 128);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 15;

  // Body Shape Result
  addText(`Your Body Shape: ${result.bodyShape.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`, 18, true, [139, 92, 246]);
  yPosition += 5;

  // Description
  addText(result.description, 11, false);
  yPosition += 10;

  // Styling Recommendations
  addText('Styling Recommendations', 16, true, [139, 92, 246]);
  yPosition += 5;

  result.stylingRecommendations.forEach((rec) => {
    // Category header
    addText(rec.category, 13, true, [0, 0, 0]);
    
    // Recommendations
    if (rec.recommendations.length > 0) {
      addText('✓ What Works:', 11, true, [16, 185, 129]);
      rec.recommendations.forEach((item) => {
        addText(`  • ${item}`, 10, false);
      });
      yPosition += 3;
    }
    
    // Avoid list
    if (rec.avoid.length > 0) {
      addText('✗ What to Avoid:', 11, true, [239, 68, 68]);
      rec.avoid.forEach((item) => {
        addText(`  • ${item}`, 10, false);
      });
      yPosition += 3;
    }
    
    yPosition += 5;
  });

  // Color Tips
  if (result.colorTips.length > 0) {
    addText('Color Tips', 14, true, [139, 92, 246]);
    result.colorTips.forEach((tip) => {
      addText(`• ${tip}`, 10, false);
    });
    yPosition += 8;
  }

  // Fit Tips
  if (result.fitTips.length > 0) {
    addText('Fit Tips', 14, true, [139, 92, 246]);
    result.fitTips.forEach((tip) => {
      addText(`• ${tip}`, 10, false);
    });
    yPosition += 8;
  }

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  const footerText = 'This analysis is based on fashion industry standards and styling principles. Individual preferences may vary.';
  const footerLines = doc.splitTextToSize(footerText, maxWidth);
  doc.text(footerLines, margin, pageHeight - 20);

  return doc;
}

export function generatePDFBuffer(email: string, result: AnalysisResult): Buffer {
  const doc = generatePDF(email, result);
  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}