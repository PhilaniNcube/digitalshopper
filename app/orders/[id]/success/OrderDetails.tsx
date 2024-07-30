import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import formatter from "@/lib/currency";
import { Database } from "@/schema";
import { format } from "date-fns";
import Image from "next/image";

type OrderDetailsProps = {
  order: Database["public"]["Tables"]["orders"]["Row"];
}

const OrderDetails = ({order}:OrderDetailsProps) => {
  return (
    <section className="w-full py-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-medium">
                Order ID:{" "}
                <span className="font-semibold">{order.id.split("-")[0]}</span>
              </h3>
              <h3 className="text-lg font-medium">
                Order Date:{" "}
                <span className="font-semibold">
                  {format(new Date(order.created_at), "PPP")}
                </span>
              </h3>
              <h3 className="text-lg font-medium">
                Order Status:{" "}
                <span className="font-semibold">
                 Paid
                </span>
              </h3>
              <h3 className="text-lg font-medium">
                Payment ID:{" "}
                <span className="font-semibold">
                  {order.paid ? order.payment_id : ""}
                </span>
              </h3>
            </CardContent>
          </Card>
        </div>
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-medium">
                Name: <span className="font-semibold">{order.first_name} {order.last_name}</span>
              </h3>
              <h3 className="text-lg font-medium">
                Email: <span className="font-semibold">{order.email}</span>
              </h3>
              <h3 className="text-lg font-medium">
                Phone: <span className="font-semibold">{order.phone}</span>
              </h3>
              <h3 className="text-lg font-medium">
                Address: <span className="font-semibold">{order.address}</span>
              </h3>
              <h3 className="text-lg font-medium">
                City: <span className="font-semibold">{order.city}</span>
              </h3>
            </CardContent>
          </Card>
        </div>
      </div>
      <h2 className="mt-5 text-2xl font-bold">Order Summary</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {order.order_items.map((item, index) => (
          <Card key={index} className="w-full">
            <CardContent className="w-full">
              <div className="flex items-start w-full gap-2">
                <div className="w-1/3">
                  <Image
                    src={item.product.images[0]}
                    width={200}
                    height={200}
                    alt="Product"
                    className="object-cover w-full aspect-square"
                  />
                </div>{" "}
                <div className="flex flex-col items-start justify-start flex-1">
                  <h3 className="text-lg font-medium">{item.product.title}</h3>
                  <p className="font-semibold text-md">
                    Quantity: {item.quantity}
                  </p>
                  <p className="font-semibold text-md">
                    Price: {formatter(item.product.price)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="w-full mt-4">
        <h2 className="text-3xl font-bold">Order Total</h2>
        <Separator className="my-3" />
        <div className="w-full md:w-1/2 lg:w-2/5">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-medium">Subtotal</h3>
            <p className="text-lg font-medium">{formatter(order.subtotal)}</p>
          </div>
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-medium">Shipping</h3>
            <p className="text-lg font-medium">{formatter(order.shipping)}</p>
          </div>
          <Separator className="my-3" />
          <div className="flex items-center justify-between w-full">
            <h3 className="text-xl font-bold">Total</h3>
            <p className="text-xl font-bold">{formatter(order.total_amount)}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default OrderDetails;
