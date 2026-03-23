"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";

const SearchProducts = () => {

  const router = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams.get('search') ?? ''

  const productSearch = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push(`/dashboard/products?search=${e.currentTarget.search.value}&page=1&per_page=10`)
  }

  return <form onSubmit={productSearch} className="flex space-x-3">
    <Input type="search" name="search" id="search" className="border border-gray-300 rounded-md p-2" defaultValue={search} />
    <Button type="submit" >
      Search <Search />
    </Button>
  </form>;
};
export default SearchProducts;
