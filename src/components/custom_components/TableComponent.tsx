import { MoreVertical } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Collaborator, Customer } from "@/types/models.type";

export interface TableProps<T> {
  data: T[];
  columnHeaders: string[];
}

export default function TableComponent<T extends Collaborator | Customer>({data, columnHeaders}: TableProps<T>) {
  
  const GenerateTableCell = (item: T) => 
    Object.entries(item).map(([key, value]) => {
      const stringValue = value.toString();

      if (key === "status") {
        return (
          <TableCell key={key}>
            <Badge 
              variant="outline" 
              className={stringValue === "Ativo" 
                ? "bg-green-400/15 text-green-400 border-green-400"
                : "bg-zinc-500/15 text-red-400 border-red-400"
              }
            >
              {stringValue}
            </Badge>
          </TableCell>
        );
      } else if (key === "name") {
        return <TableCell key={key} className="font-bold">{stringValue}</TableCell>;
      } else {
        return <TableCell key={key}>{stringValue}</TableCell>;
      }
    });
  
  return (
        <Table>
            <TableHeader>
              <TableRow>
                {
                    columnHeaders.map((header, index) => (
                        <TableHead key={index}>{header}</TableHead>
                    ))
                }
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item : T, index: number) => (
                <TableRow key={index} className="hover:bg-zinc-800">

                  {GenerateTableCell(item)}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
    )
}