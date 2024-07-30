
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { search } from "@/actions/searchAction";
import { Search } from "lucide-react";

export default function SearchInput() {



  return (
    <form action={search} className="w-full max-w-sm flex">
      <Input
        aria-label="Search"
        className="rounded-l-full flex-grow max-w-[200px] text-slate-600"
        placeholder="Search..."
        name="search"
        type="search"
      />
      <Button type="submit" className="rounded-r-full" variant="outline">
        <Search size={24} className="text-slate-600" />
      </Button>
    </form>
  );
}
