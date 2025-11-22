import React, { useState, useEffect } from 'react';
import { PaymentMethod } from '../types';
import { X, CreditCard, Banknote, QrCode, CheckCircle, Loader2 } from 'lucide-react';

interface PaymentModalProps {
  total: number;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (method: PaymentMethod, amountTendered?: number) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ total, isOpen, onClose, onComplete }) => {
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [cashGiven, setCashGiven] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setMethod(PaymentMethod.CASH);
      setCashGiven('');
      setIsProcessing(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePayment = () => {
    setIsProcessing(true);

    if (method === PaymentMethod.QR) {
        // Simulate waiting for gateway webhook
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                onComplete(method);
            }, 1500);
        }, 3000);
        return;
    }

    // Cash or Card
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onComplete(method, method === PaymentMethod.CASH ? parseFloat(cashGiven) : undefined);
      }, 1000);
    }, 1500);
  };

  const changeDue = cashGiven ? parseFloat(cashGiven) - total : 0;
  const isSufficient = method === PaymentMethod.CASH ? (parseFloat(cashGiven || '0') >= total) : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gray-50 p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold text-gray-800">Checkout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm mb-1">Total Amount Due</p>
            <h1 className="text-4xl font-extrabold text-orange-600">LKR {total.toLocaleString()}</h1>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setMethod(PaymentMethod.CASH)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${method === PaymentMethod.CASH ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-orange-200 text-gray-600'}`}
            >
              <Banknote size={28} className="mb-2" />
              <span className="font-semibold text-sm">Cash</span>
            </button>
            <button
              onClick={() => setMethod(PaymentMethod.CARD)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${method === PaymentMethod.CARD ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-orange-200 text-gray-600'}`}
            >
              <CreditCard size={28} className="mb-2" />
              <span className="font-semibold text-sm">Card</span>
            </button>
            <button
              onClick={() => setMethod(PaymentMethod.QR)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${method === PaymentMethod.QR ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-orange-200 text-gray-600'}`}
            >
              <QrCode size={28} className="mb-2" />
              <span className="font-semibold text-sm">QR Code</span>
            </button>
          </div>

          {method === PaymentMethod.CASH && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500 font-bold">LKR</span>
                    <input
                        type="number"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-lg font-bold"
                        placeholder="0.00"
                        value={cashGiven}
                        onChange={(e) => setCashGiven(e.target.value)}
                        autoFocus
                    />
                </div>
              </div>
              <div className={`p-4 rounded-lg flex justify-between items-center ${changeDue >= 0 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <span className="font-medium">Change Due:</span>
                <span className="text-xl font-bold">LKR {Math.max(0, changeDue).toLocaleString()}</span>
              </div>
            </div>
          )}

          {method === PaymentMethod.QR && (
            <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
              {!isSuccess && !isProcessing ? (
                  <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=LKR_POS_TXN_${Date.now()}_${total}`} alt="Payment QR" className="w-48 h-48" />
                  </div>
              ) : null}
              <p className="text-sm text-gray-500 text-center">Scan with banking app to pay LKR {total}</p>
            </div>
          )}
          
          {method === PaymentMethod.CARD && (
             <div className="flex flex-col items-center justify-center py-8">
                <CreditCard size={64} className="text-gray-300 mb-4" />
                <p className="text-gray-500">Waiting for terminal...</p>
             </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={handlePayment}
            disabled={!isSufficient || isProcessing || isSuccess}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all ${
              isSuccess 
                ? 'bg-green-500 text-white'
                : isSufficient 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg transform hover:-translate-y-0.5' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle />
                <span>Payment Successful</span>
              </>
            ) : (
              <span>Confirm Payment</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;