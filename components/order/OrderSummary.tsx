import React from 'react';
interface OrderSummaryProps {
  subtotal: number;
  shippingCost: number;
  totalDiscount: number;
  totalAmount: number;
}
const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shippingCost,
  totalDiscount,
  totalAmount,
}) => {
  return (
    <div className="mt-6 rounded-lg bg-gray-50 p-4">
      <h3 className="text-lg font-semibold">Order Summary</h3>
      <div className="mt-2 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>৳ {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>৳ {shippingCost.toLocaleString()}</span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount:</span>
            <span>- ৳ {totalDiscount.toLocaleString()}</span>
          </div>
        )}
        <div className="border-t border-gray-300 pt-2">
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>৳ {totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
