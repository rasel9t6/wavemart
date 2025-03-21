import { OrderType, OrderItemType } from '@/lib/types';
import Image from 'next/image';

export default async function OrdersPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  const orders = await res.json();

  return (
    <div className="px-10 py-5 max-sm:px-3">
      <p className="my-10 text-heading3-bold">All Orders</p>

      {(!orders || orders.length === 0) && (
        <p className="my-5 text-body-bold">No orders have been placed yet.</p>
      )}

      <div className="flex flex-col gap-10">
        {orders?.map((order: OrderType) => (
          <div
            key={order._id}
            className="flex flex-col gap-8 rounded-lg border p-4 hover:bg-custom-gray"
          >
            {/* Order ID, Customer Name, and Total Amount */}
            <div className="flex flex-wrap gap-6 max-md:flex-col">
              <p className="text-base-bold">Order ID: {order._id}</p>
              <p className="text-base-bold">
                Customer: {order.customer?.name || 'Unknown Customer'}
              </p>
              <p className="text-base-bold">
                Total Amount: ৳{order.totalAmount}
              </p>
              <p className="text-base-bold text-gray-600">
                Status: {order.status}
              </p>
            </div>

            {/* Ordered Products */}
            <div className="flex flex-col gap-5">
              {order.products.map((orderItem: OrderItemType) => (
                <div key={orderItem._id} className="flex gap-4">
                  {orderItem.product ? (
                    <>
                      <Image
                        src={orderItem.product.media?.[0] || '/placeholder.jpg'}
                        alt={orderItem.product.title || 'Product image'}
                        width={100}
                        height={100}
                        className="size-32 rounded-lg object-cover"
                      />
                      <div className="flex flex-col justify-between">
                        <p className="text-small-medium">
                          Title:{' '}
                          <span className="text-small-bold">
                            {orderItem.product.title}
                          </span>
                        </p>
                        {orderItem.color && (
                          <p className="text-small-medium">
                            Color:{' '}
                            <span className="text-small-bold">
                              {orderItem.color}
                            </span>
                          </p>
                        )}
                        {orderItem.size && (
                          <p className="text-small-medium">
                            Size:{' '}
                            <span className="text-small-bold">
                              {orderItem.size}
                            </span>
                          </p>
                        )}
                        <p className="text-small-medium">
                          Unit price:{' '}
                          <span className="text-small-bold">
                            {orderItem.product?.price?.bdt || 'N/A'}
                          </span>
                        </p>
                        <p className="text-small-medium">
                          Quantity:{' '}
                          <span className="text-small-bold">
                            {orderItem.quantity}
                          </span>
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-small-medium text-red-500">
                      Product information is unavailable.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
