import React, { useRef } from 'react';
import { Order, PaymentMethod } from '../types';
import { Printer, X, CheckCircle, ChefHat } from 'lucide-react';
import { SHOP_NAME, SHOP_ADDRESS, SHOP_PHONE } from '../constants';

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm print:p-0 print:bg-white print:static print:block">
      <style>
        {`
          @media print {
            @page {
                margin: 0;
                size: auto;
            }
            body * {
                visibility: hidden;
            }
            #receipt-modal-container, #receipt-modal-container * {
                visibility: visible;
            }
            #receipt-modal-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 15px;
                background: white;
                color: black;
            }
            .no-print {
                display: none !important;
            }
          }
        `}
      </style>
      
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh] print:shadow-none print:max-h-none print:w-auto print:max-w-none">
        
        {/* Screen Header - Hidden on Print */}
        <div className="bg-green-600 p-4 flex justify-between items-center text-white no-print shadow-md">
          <div className="flex items-center space-x-2">
            <CheckCircle size={24} className="text-green-200" />
            <span className="font-bold text-lg">Order Completed</span>
          </div>
          <button onClick={onClose} className="hover:bg-green-700 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Receipt Content - Visible on Print */}
        <div id="receipt-modal-container" ref={receiptRef} className="p-6 bg-white text-gray-900 font-mono text-sm overflow-y-auto scrollbar-hide">
            
            {/* Header / Logo */}
            <div className="text-center mb-6 border-b-2 border-black pb-4">
                <div className="flex justify-center mb-2">
                    <div className="border-2 border-black p-2 rounded-full">
                         <ChefHat size={32} strokeWidth={2.5} />
                    </div>
                </div>
                <h1 className="text-2xl font-black uppercase tracking-wider text-black mb-1">{SHOP_NAME}</h1>
                <p className="font-bold text-xs uppercase">சாப்பாட்டுக் கடை</p>
                <div className="text-xs mt-2 space-y-0.5">
                    <p>{SHOP_ADDRESS}</p>
                    <p>Tel: {SHOP_PHONE}</p>
                </div>
            </div>

            {/* Info */}
            <div className="border-b border-dashed border-gray-400 pb-3 mb-3 space-y-1">
                <div className="flex justify-between text-xs font-medium">
                    <span>Date: {new Date(order.timestamp).toLocaleDateString()}</span>
                    <span>{new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                    <span>Order ID:</span>
                    <span className="font-bold">#{order.id}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                    <span>Table:</span>
                    <span>{order.tableId}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                    <span>Cashier:</span>
                    <span>{order.cashierName}</span>
                </div>
            </div>

            {/* Items */}
            <div className="mb-3">
                <div className="grid grid-cols-12 font-bold border-b border-black pb-1 mb-2 text-xs uppercase">
                    <div className="col-span-6">Item</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-4 text-right">Price</div>
                </div>
                <div className="space-y-2">
                    {order.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 text-xs items-start">
                            <div className="col-span-6 pr-1 leading-tight">
                                <div className="font-bold">{item.name}</div>
                            </div>
                            <div className="col-span-2 text-center">{item.quantity}</div>
                            <div className="col-span-4 text-right">{(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Totals */}
            <div className="border-t border-dashed border-black pt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{order.subtotal.toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                      <span>Discount</span>
                      <span>- {order.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-xl mt-3 border-t-2 border-black pt-2">
                    <span>TOTAL</span>
                    <span>LKR {order.total.toLocaleString()}</span>
                </div>
            </div>

            {/* Payment Details */}
            <div className="mt-4 pt-2 border-t border-dashed border-gray-400 text-xs">
                <div className="flex justify-between font-bold uppercase mb-1">
                    <span>Paid via: {order.paymentMethod}</span>
                </div>
                {order.paymentMethod === PaymentMethod.CASH && (
                    <>
                        <div className="flex justify-between">
                            <span>Cash Tendered:</span>
                            <span>{order.amountTendered?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold mt-1">
                            <span>Change Due:</span>
                            <span>{order.change?.toLocaleString()}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="text-center mt-8 space-y-2">
                <p className="text-xs font-bold">THANK YOU FOR DINING WITH US!</p>
                <p className="text-[10px]">Follow us on Instagram @saapttukada</p>
                <div className="pt-4 flex justify-center opacity-60">
                     {/* Fake Barcode */}
                     <div className="h-10 w-40 bg-[repeating-linear-gradient(90deg,black,black_2px,transparent_2px,transparent_4px)]"></div>
                </div>
            </div>
        </div>

        {/* Footer Actions - Hidden on Print */}
        <div className="p-5 bg-gray-50 border-t grid grid-cols-2 gap-4 no-print">
            <button onClick={onClose} className="px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-100 transition-colors">
                Close
            </button>
            <button onClick={handlePrint} className="px-4 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black flex items-center justify-center space-x-2 transition-colors shadow-lg">
                <Printer size={20} />
                <span>Print Bill</span>
            </button>
        </div>

      </div>
    </div>
  );
};

export default ReceiptModal;