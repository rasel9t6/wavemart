'use client';

import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { UserType } from '@/lib/types';
import { Loader, Search } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  });

  // Fetch user data
  const fetchUser = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUser(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: {
          street: data.address?.street || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          postalCode: data.address?.postalCode || '',
          country: data.address?.country || '',
        },
      });
      setLoading(false);
    } catch (err) {
      console.error('[FETCH_USER_ERROR]', err);
      toast.error('Failed to load user data');
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('[FETCH_ORDERS_ERROR]', err);
      toast.error('Failed to load orders');
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchUser();
      fetchOrders();
    }
  }, [session]);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Handle image upload if there's a new image
      let imageUrl = user?.image;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'your_cloudinary_upload_preset');

        const uploadRes = await fetch(
          'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
          {
            method: 'POST',
            body: formData,
          },
        );
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.secure_url;
      }

      // Update user profile
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, image: imageUrl }),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      const updatedUser = await res.json();
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('[UPDATE_PROFILE_ERROR]', err);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

      {/* Profile Navigation */}
      <div className="mb-8 flex gap-4 border-b">
        <button
          className={`pb-2 ${
            activeTab === 'personal'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : ''
          }`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Info
        </button>
        <button
          className={`pb-2 ${
            activeTab === 'orders'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : ''
          }`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {/* Personal Info Tab */}
      {activeTab === 'personal' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <div className="relative size-24 overflow-hidden rounded-full">
              <Image
                src={previewUrl || user?.image || '/default-avatar.png'}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer rounded-lg border p-2"
            />
          </div>

          {/* Basic Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-100 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="mt-1 w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">User ID</label>
              <input
                type="text"
                value={user?.userId}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-100 p-2"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">Street</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-lg border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">City</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-lg border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">State</label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-lg border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Postal Code</label>
                <input
                  type="text"
                  value={formData.address.postalCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        postalCode: e.target.value,
                      },
                    })
                  }
                  className="mt-1 w-full rounded-lg border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Country</label>
                <input
                  type="text"
                  value={formData.address.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, country: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-lg border p-2"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          {/* Search Orders */}
          <div className="mb-6 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search orders by ID or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border p-2 pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders
              .filter(
                (order: any) =>
                  order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  order.status
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
              )
              .map((order: any) => (
                <div
                  key={order._id}
                  className="rounded-lg border bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #{order._id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      Total: ৳{order.total.toFixed(2)}
                    </p>
                    <div className="mt-2 space-y-2">
                      {order.items.map((item: any) => (
                        <div
                          key={item._id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{item.title}</span>
                          <span>x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const dynamic = 'force-dynamic';
