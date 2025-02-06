import { getOrders } from '@/lib/actions';
import { OrderType, OrderItemType } from '@/lib/types';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';

export default async function OrdersPage() {
  const { userId } = auth();
  const orders = await getOrders(userId as string);

  return (
    <div className="px-10 py-5 max-sm:px-3">
      <p className="my-10 text-heading3-bold">Your Orders</p>
      {!orders ||
        (orders.length === 0 && (
          <p className="my-5 text-body-bold">You have no orders yet.</p>
        ))}

      <div className="flex flex-col gap-10">
        {orders?.map((order: OrderType) => (
          <div
            key={order._id}
            className="flex flex-col gap-8 p-4 hover:bg-custom-gray"
          >
            <div className="flex gap-20 max-md:flex-col max-md:gap-3">
              <p className="text-base-bold">Order ID: {order._id}</p>
              <p className="text-base-bold">
                Total Amount: ${order.totalAmount}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {order.products.map((orderItem: OrderItemType) => (
                <div key={orderItem._id} className="flex gap-4">
                  {orderItem.product && (
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
                            {orderItem.product.price.bdt}
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
                  )}
                  {!orderItem.product && (
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
