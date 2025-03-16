import { Session } from 'next-auth';
import React from 'react';

interface AddressType {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
interface CustomerInfoType {
  name: string;
  email: string;
  phone: string;
  address: AddressType;
}
interface CustomerInfoFormProps {
  customerInfo: CustomerInfoType;
  onChange: any;
  onAddressChange: any;
  session: Session | null;
}
const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  customerInfo,
  onChange,
  session,
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">Customer Information</h3>
      <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          type="text"
          value={customerInfo.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Full Name *"
          className="w-full rounded-md border p-2"
          required
          disabled={!!session?.user?.name}
        />
        <input
          type="email"
          value={customerInfo.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="Email Address *"
          className="w-full rounded-md border p-2"
          required
          disabled={!!session?.user?.email}
        />
        <input
          type="tel"
          value={customerInfo.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="Phone Number *"
          className="w-full rounded-md border p-2"
          required
        />

        {/* Address fields
        <input
          type="text"
          value={customerInfo.address.street}
          onChange={(e) => onAddressChange('street', e.target.value)}
          placeholder="Street Address *"
          className="w-full rounded-md border p-2"
          required
        />
        <input
          type="text"
          value={customerInfo.address.city}
          onChange={(e) => onAddressChange('city', e.target.value)}
          placeholder="City *"
          className="w-full rounded-md border p-2"
          required
        />
        <input
          type="text"
          value={customerInfo.address.state}
          onChange={(e) => onAddressChange('state', e.target.value)}
          placeholder="State/Province *"
          className="w-full rounded-md border p-2"
          required
        />
        <input
          type="text"
          value={customerInfo.address.postalCode}
          onChange={(e) => onAddressChange('postalCode', e.target.value)}
          placeholder="Postal Code *"
          className="w-full rounded-md border p-2"
          required
        />
        <input
          type="text"
          value={customerInfo.address.country}
          onChange={(e) => onAddressChange('country', e.target.value)}
          placeholder="Country *"
          className="w-full rounded-md border p-2"
          required
        /> */}
      </div>
    </div>
  );
};

export default CustomerInfoForm;
