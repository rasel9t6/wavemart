import React from 'react';

type PaymentMethod =
  | 'bkash'
  | 'nogod'
  | 'rocket'
  | 'card'
  | 'bank-transfer'
  | 'cash';

interface PaymentMethodSelectorProps {
  paymentMethod: PaymentMethod;
  onChange: any;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  onChange,
}) => {
  const paymentMethods = [
    { id: 'bkash', label: 'bKash' },
    { id: 'nogod', label: 'Nagad' },
    { id: 'rocket', label: 'Rocket' },
    { id: 'card', label: 'Credit/Debit Card' },
    { id: 'bank-transfer', label: 'Bank Transfer' },
    { id: 'cash', label: 'Cash on Delivery' },
  ];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">Payment Method</h3>
      <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex cursor-pointer items-center justify-center rounded-md border p-3 text-center transition-colors ${
              paymentMethod === method.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={() => onChange(method.id as PaymentMethod)}
              className="sr-only"
            />
            <span>{method.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
