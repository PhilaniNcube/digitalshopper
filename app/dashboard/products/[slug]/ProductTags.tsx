"use client"

import { Database } from "@/schema";

type Props = {
  tags: Database['public']['Tables']['tags']['Row'][];
}

const ProductTags = ({ tags }: Props) => {
  return (
    <div className="bg-black rounded mt-6 w-full p-3">
      <h3 className="text-lg font-bold mb-3">Tags</h3>
    </div>
  );
};
export default ProductTags;
