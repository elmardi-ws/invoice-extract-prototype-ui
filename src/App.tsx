import React, { useState } from 'react';
import './App.css';

interface InvoiceData {
  clientName: string | null;
  senderName: string | null;
  invoiceDate: string | null;
  invoiceNumber: string | null;
  dueDate: string | null;
  subtotal: string | null;
  tax: string | null;
  total: string | null;
  paymentStatus: string | null;
  transactionType: string | null;
  fileURL: string | null;
}

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setInvoiceData(null);

    const formData = new FormData();
    formData.append('invoices', file);

    try {
      const response = await fetch(
        'https://compta-pro-production.up.railway.app/upload-invoices',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to process invoice');
      }

      const data = await response.json();
      setInvoiceData(data);
    } catch (error) {
      console.error('Error uploading invoice:', error);
      setError(
        'An error occurred while processing the invoice. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold mb-5 text-center">
                Invoice Processor
              </h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-10 h-10 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">ZIP file</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".zip"
                  />
                </label>
              </div>
              {file && (
                <p className="text-sm text-gray-500">
                  Selected file: {file.name}
                </p>
              )}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-full"
                  disabled={!file || isLoading}
                >
                  {isLoading ? 'Processing...' : 'Process Invoices'}
                </button>
              </div>
            </form>
            {error && <div className="mt-4 text-red-500">{error}</div>}
            {invoiceData &&
              invoiceData.map((invoice) => (
                <div
                  key={invoice.invoiceNumber}
                  className="mt-6 p-4 bg-gray-100 rounded-lg"
                >
                  <h2 className="text-lg font-semibold mb-2">
                    Invoice Results
                  </h2>
                  <div className="space-y-2">
                    <p>
                      <strong>Client Name:</strong>{' '}
                      {invoice.clientName || 'N/A'}
                    </p>
                    <p>
                      <strong>Sender Name:</strong>{' '}
                      {invoice.senderName || 'N/A'}
                    </p>
                    <p>
                      <strong>Invoice Date:</strong>{' '}
                      {invoice.invoiceDate || 'N/A'}
                    </p>
                    <p>
                      <strong>Invoice Number:</strong>{' '}
                      {invoice.invoiceNumber || 'N/A'}
                    </p>
                    <p>
                      <strong>Due Date:</strong> {invoice.dueDate || 'N/A'}
                    </p>
                    <p>
                      <strong>Subtotal:</strong> {invoice.subtotal || 'N/A'}
                    </p>
                    <p>
                      <strong>Tax:</strong> {invoice.tax || 'N/A'}
                    </p>
                    <p>
                      <strong>Total:</strong> {invoice.total || 'N/A'}
                    </p>
                    <p>
                      <strong>Payment Status:</strong>{' '}
                      {invoice.paymentStatus || 'N/A'}
                    </p>
                    <p>
                      <strong>Transaction Type:</strong>{' '}
                      {invoice.transactionType || 'N/A'}
                    </p>
                    {invoice.fileURL && (
                      <a
                        href={invoice.fileURL}
                        target="_blank"
                        className="text-sky-500"
                      >
                        View Original file
                      </a>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
