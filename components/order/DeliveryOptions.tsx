import React from 'react';

interface DeliveryOptionsProps {
  deliveryType: 'door-to-door' | 'warehouse';
  shippingMethod: 'air' | 'sea';
  onChange: any;
}

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({
  deliveryType,
  shippingMethod,
  onChange,
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">Delivery Options</h3>

      {/* Delivery Type */}
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-700">Delivery Type</p>
        <div className="mt-1 flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="deliveryType"
              value="door-to-door"
              checked={deliveryType === 'door-to-door'}
              onChange={() => onChange('deliveryType', 'door-to-door')}
              className="size-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Door to Door</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="deliveryType"
              value="warehouse"
              checked={deliveryType === 'warehouse'}
              onChange={() => onChange('deliveryType', 'warehouse')}
              className="size-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Warehouse Pickup</span>
          </label>
        </div>
      </div>

      {/* Shipping Method */}
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700">Shipping Method</p>
        <div className="mt-1 flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="shippingMethod"
              value="air"
              checked={shippingMethod === 'air'}
              onChange={() => onChange('shippingMethod', 'air')}
              className="size-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Air Freight (৳1500)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="shippingMethod"
              value="sea"
              checked={shippingMethod === 'sea'}
              onChange={() => onChange('shippingMethod', 'sea')}
              className="size-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Sea Freight (৳1000)</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOptions;
