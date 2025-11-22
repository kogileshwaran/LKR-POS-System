import React, { useRef } from 'react';
import { Order, PaymentMethod } from '../types';
import { Printer, X, CheckCircle } from 'lucide-react';

interface ReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm print:p-0 print:bg-white print:static">
      <style>
        {`
          @media print {
            @page { margin: 0; size: auto; }
            body * { visibility: hidden; }
            #receipt-container, #receipt-container * { visibility: visible; }
            #receipt-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 20px;
              background: white;
            }
            .no-print { display: none !important; }
          }
        `}
      </style>
      
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh] print:shadow-none print:max-h-none print:w-full print:max-w-none">
        
        {/* Screen Header - Hidden on Print */}
        <div className="bg-green-500 p-4 flex justify-between items-center text-white no-print">
          <div className="flex items-center space-x-2">
            <CheckCircle size={24} />
            <span className="font-bold">Payment Successful</span>
          </div>
          <button onClick={onClose} className="hover:bg-green-600 p-1 rounded">
            <X size={24} />
          </button>
        </div>

        {/* Receipt Content - Visible on Print */}
        <div id="receipt-container" ref={receiptRef} className="p-6 bg-white text-gray-900 font-mono text-sm overflow-y-auto scrollbar-hide">
            <div className="text-center mb-6">
                <h1 className="text-xl font-bold uppercase tracking-wider text-black">LKR POS</h1>
                <p className="text-xs text-gray-500 mt-1">Authentic Sri Lankan Cuisine</p>
                <p className="text-xs text-gray-500">123 Galle Road, Colombo 03</p>
                <p className="text-xs text-gray-500">Tel: +94 11 234 5678</p>
            </div>

            <div className="border-b border-dashed border-gray-300 pb-3 mb-3 space-y-1">
                <div className="flex justify-between text-xs">
                    <span>Date: {new Date(order.timestamp).toLocaleDateString()}</span>
                    <span>{new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span>Order #: {order.id}</span>
                    <span>Table: {order.tableId}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span>Cashier:</span>
                    <span>{order.cashierName}</span>
                </div>
            </div>

            <div className="mb-3">
                <div className="grid grid-cols-12 font-bold border-b border-gray-800 pb-1 mb-2 text-xs uppercase">
                    <div className="col-span-6">Item</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-4 text-right">Price</div>
                </div>
                <div className="space-y-2">
                    {order.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 text-xs">
                            <div className="col-span-6 pr-1">
                                <div className="font-medium">{item.name}</div>
                            </div>
                            <div className="col-span-2 text-center">{item.quantity}</div>
                            <div className="col-span-4 text-right">{(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-dashed border-gray-300 pt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{order.subtotal.toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-gray-600">
                      <span>Discount</span>
                      <span>- {order.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-2 border-t-2 border-gray-800 pt-2">
                    <span>Total</span>
                    <span>LKR {order.total.toLocaleString()}</span>
                </div>
            </div>

            <div className="border-t border-dashed border-gray-300 mt-4 pt-3 space-y-1 text-xs">
                <div className="flex justify-between font-bold uppercase">
                    <span>Payment: {order.paymentMethod}</span>
                </div>
                {order.paymentMethod === PaymentMethod.CASH && (
                    <>
                        <div className="flex justify-between text-gray-600">
                            <span>Cash Given:</span>
                            <span>{order.amountTendered?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Change:</span>
                            <span>{order.change?.toLocaleString()}</span>
                        </div>
                    </>
                )}
            </div>

            <div className="text-center mt-8">
                <div className="flex justify-center mb-2">
                     {/* Barcode simulation */}
                     <div className="h-8 w-48 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAABCAYAAAD5PA/NAAAAFklEQVR4AWP4DwwwMv4zMv6HAMQCYwAAAuwB/y7y7bQAAAAASUVORK5CYII=')] bg-repeat-x opacity-60"></div>
                </div>
                <p className="text-xs font-bold text-gray-800">THANK YOU FOR VISITING!</p>
                <p className="text-[10px] text-gray-500 mt-1">Please come again.</p>
            </div>
        </div>

        {/* Footer Actions - Hidden on Print */}
        <div className="p-4 bg-gray-50 border-t grid grid-cols-2 gap-4 no-print">
            <button onClick={onClose} className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-colors">
                Start New Order
            </button>
            <button onClick={handlePrint} className="px-4 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-orange-200">
                <Printer size={20} />
                <span>Print Receipt</span>
            </button>
        </div>

      </div>
    </div>
  );
};

export default ReceiptModal;