import OrderEditor from "./order-editor";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models";
import { formatCurrency } from "@/lib/format";

async function getOrder(id: string) {
  await connectDB();
  const order = await Order.findById(id).lean();
  return JSON.parse(JSON.stringify(order));
}

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="premium-card p-6">
        <h1 className="text-2xl font-black">Order {order.orderNumber}</h1>
        <p className="mt-2 text-black/60">{order.customer?.name} · {order.customer?.email} · {order.customer?.phone}</p>
        <div className="mt-6 grid gap-4">
          {order.items.map((item: any) => (
            <div key={item.productId} className="flex gap-4 rounded-xl border border-black/10 p-3">
              <img src={item.image} alt={item.title} className="h-20 w-16 rounded-lg object-cover" />
              <div className="flex-1">
                <b>{item.title}</b>
                <p className="text-sm text-black/50">Qty {item.quantity} · Size {item.size || "-"} · Color {item.color || "-"}</p>
              </div>
              <b>{formatCurrency((item.salePrice || item.price) * item.quantity)}</b>
            </div>
          ))}
        </div>
      </div>
      <OrderEditor order={order} />
    </div>
  );
}
