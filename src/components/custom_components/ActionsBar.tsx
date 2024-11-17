import { Filter, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { DropdownMenuContent } from "../ui/dropdown-menu";
import CreationDialog from "./CreationDialog";
import { dtoList } from "@/lib/utils";
import { useActiveItem } from "@/context/ActiveItemContext";

const FilterButton = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                // checked={}
                // onCheckedChange={(checked) =>
                //   setFilterOptions((prev) => ({ ...prev, active: checked }))
                // }
              >
                Ativos
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                // checked={filterOptions.inactive}
                // onCheckedChange={(checked) =>
                //   setFilterOptions((prev) => ({ ...prev, inactive: checked }))
                // }
              >
                Inativos
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
    )
}



const ActionsBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    
    const { activeItem } = useActiveItem();

    return ( 
        <div className="flex items-center justify-between gap-4 border-b border-zinc-700 bg-zinc-800 p-4">  
            <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
                <Input 
                    placeholder="Buscar..." 
                    className="pl-8 bg-zinc-700 border-zinc-600" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <CreationDialog dtoList={dtoList.dtos} currentLabel={activeItem} />
            <FilterButton />
        </div>
     );
}
 
export default ActionsBar;