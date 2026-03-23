import { Database } from "@/schema";



type OrderProps = {
  order: Database['public']['Tables']['orders']['Row'];
}

const Order: React.FC<Readonly<OrderProps>> = ({order}:OrderProps) => {
  return (
        <div></div>
         );
};
export default Order;
