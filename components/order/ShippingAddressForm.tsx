import React from 'react';

interface AddressType {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ShippingAddressFormProps {
  shippingAddress: AddressType;
  onChange: any;
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  shippingAddress,
  onChange,
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">Shipping Address</h3>
      <div className="mt-2 grid grid-cols-1 gap-4">
        <input
          type="text"
          value={shippingAddress.street}
          onChange={(e) => onChange('street', e.target.value)}
          placeholder="Street Address *"
          className="w-full rounded-md border p-2"
          required
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            value={shippingAddress.city}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="City *"
            className="w-full rounded-md border p-2"
            required
          />
          <input
            type="text"
            value={shippingAddress.state}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="State/Province *"
            className="w-full rounded-md border p-2"
            required
          />
          <input
            type="text"
            value={shippingAddress.postalCode}
            onChange={(e) => onChange('postalCode', e.target.value)}
            placeholder="Postal Code *"
            className="w-full rounded-md border p-2"
            required
          />
          <input
            type="text"
            value={shippingAddress.country}
            onChange={(e) => onChange('country', e.target.value)}
            placeholder="Country *"
            className="w-full rounded-md border p-2"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressForm;
