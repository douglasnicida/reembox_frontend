import {Filter, Search} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {
    DropdownMenu, DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import TableComponent from "@/components/custom_components/TableComponent.tsx";
import * as React from "react";
import { Report } from "@/types/models.type.ts";
import {useEffect} from "react";


export default function ReportsPage() {
    const [filterOptions, setFilterOptions] = React.useState({
        active: false,
        inactive: false,
        withAddress: false,
        withoutAddress: false,
    })
    const [searchTerm, setSearchTerm] = React.useState("")
    const [filteredCollaborators, setFilteredCollaborators] = React.useState<Report[]>([{id: 1, goal: "teste de recibo"}])

    useEffect(() => {
        setFilteredCollaborators([{id: 1, goal: "teste de recibo"}]);
    }, []);

    return (
        <>
        <div className="flex-1 overflow-auto">
            {/* Search and filter bar */}
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
                            checked={filterOptions.active}
                            onCheckedChange={(checked) =>
                                setFilterOptions((prev) => ({ ...prev, active: checked }))
                            }
                        >
                            Ativos
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={filterOptions.inactive}
                            onCheckedChange={(checked) =>
                                setFilterOptions((prev) => ({ ...prev, inactive: checked }))
                            }
                        >
                            Inativos
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                            checked={filterOptions.withAddress}
                            onCheckedChange={(checked) =>
                                setFilterOptions((prev) => ({ ...prev, withAddress: checked }))
                            }
                        >
                            Com endereço
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={filterOptions.withoutAddress}
                            onCheckedChange={(checked) =>
                                setFilterOptions((prev) => ({ ...prev, withoutAddress: checked }))
                            }
                        >
                            Sem endereço
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Table */}
            <div className="p-4">
                <TableComponent data={filteredCollaborators} columnHeaders={['Nome', 'Status', 'Objetivo']} />
            </div>

        </div>
        </>
    )
}