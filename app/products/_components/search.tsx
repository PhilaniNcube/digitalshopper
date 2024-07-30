import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

const Search = () => {

  const searchAction = async (formData:FormData) => {
    "use server"

    const search = formData.get("search") as string;

    redirect(`/products?search=${search}`);

  }

  return (
    <form action={searchAction} className="w-full">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-950 rounded-lg shadow-md">
        <Input
          aria-label="Search"
          name="search"
          className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 dark:bg-zinc-800 dark:text-zinc-200 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
          placeholder="Search products..."
          type="text"
        />
        <Button type="submit" className="ml-2" variant="outline">
          Search
        </Button>
      </div>
    </form>
  );
};
export default Search;
