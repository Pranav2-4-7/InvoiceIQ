import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function parseWithGemini(prompt: string, imageBase64?: string): Promise<string> {
  if (!ai) {
    return JSON.stringify({
      vendor_name: 'Stark Industries Global',
      vendor_address: 'Tower A, Cyber City, Gurugram 122002',
      vendor_gstin: 'GSTIN-06AABCS1234Q1Z5',
      invoice_number: `INV-${Date.now().toString().slice(-6)}`,
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      line_items: [
        { description: 'Cloud Infrastructure', quantity: 500, rate: 2.5, amount: 1250 },
        { description: 'Data Storage', quantity: 1, rate: 450, amount: 450 },
      ],
      subtotal: 1700, cgst: 153, sgst: 153, igst: 0, total_amount: 2006, currency: 'INR',
    });
  }

  const contents: any[] = [];
  
  if (imageBase64) {
    contents.push({
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg',
      }
    });
  }
  contents.push(prompt);

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents,
  });

  return response.text || '';
}

export async function categorizeWithGemini(vendorName: string, description: string): Promise<string> {
  if (!ai) {
    const cats = ['Software', 'Professional Services', 'Raw Materials', 'Utilities', 'Marketing'];
    return cats[Math.floor(Math.random() * cats.length)];
  }
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Categorize: Vendor "${vendorName}", "${description}". Return ONLY one of: Office Supplies, Travel, Marketing, Utilities, Software, Professional Services, Raw Materials, Other`,
  });
  
  return response.text ? response.text.trim() : 'Other';
}

export async function detectFraudWithGemini(anomalies: string[]): Promise<string> {
  if (!ai) {
    return JSON.stringify([
      { alert_type: 'Unusual Payment Terms', severity: 'high', details: 'Short payment window.' },
    ]);
  }
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Anomalies: ${JSON.stringify(anomalies)}. Rate each low/medium/high. Return ONLY JSON: [{alert_type, severity, details}]`,
  });
  
  return response.text || '[]';
}
