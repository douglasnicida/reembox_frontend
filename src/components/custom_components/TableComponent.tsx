import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableBody, TableCell, TableHead } from "../ui/table";
import { Pagination } from "./Pagination";
import { Paginated } from "@/types/response.type";
import EmptyTable from "./EmptyTable";
import { Switch } from "../ui/switch";
import axios from "@/api/axios";
import { errorHandler } from "@/utils/errorHandler";
import React from "react";
import { MoreVertical } from "lucide-react";
import { handleFormatDate } from "@/utils/handleDate";
import { Checkbox } from "../ui/checkbox"; // Certifique-se de que Checkbox está importado
import { Badge } from "../ui/badge";
import { translateStatus } from "@/utils/handleStatus";

export interface TableProps<T> {
  resource?: string;
  data: Paginated<T>;
  columnHeaders: string[];
  actionFinish?: boolean;
  onPageChange: (page: number) => void;
  onSelectionChange?: (selectedIds: number[]) => void;
  customActions?: (item: T) => React.ReactNode;
  onEdit?: (id: number) => void;
}

const statusColors: { [key: string]: string } = {
  OPEN: "bg-yellow-300 text-yellow-700 hover:text-black",
  SUBMITTED: "bg-blue-500 text-white hover:text-black",
  REJECTED: "bg-red-500 text-white hover:text-black",
  APPROVED: "bg-green-500 text-white hover:text-black",
  PENDING_PROCESSING: "bg-orange-500 text-white hover:text-black",
  PROCESSING_ERROR: "bg-gray-500 text-white hover:text-black",
  PROCESSING_PAYMENT: "bg-purple-500 text-white hover:text-black",
};

export default function TableComponent<T extends Record<string, any>>(
  { resource, data, columnHeaders, onPageChange, onSelectionChange, customActions, actionFinish,onEdit }: TableProps<T>
) {
  const [items, setItems] = React.useState(data.items);
  const [selectedItems, setSelectedItems] = React.useState<number[]>([]); // Armazena os IDs dos itens selecionados

  React.useEffect(() => {
    setItems(data.items);
  }, [data.items]);

  React.useEffect(() => {
    setSelectedItems([])
  }, [actionFinish])

  React.useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedItems);
    }
  }, [selectedItems]);

  const handleToggle = async (id: number, active: boolean) => {
    try {
      await axios.delete(`${resource}/${id}`);
  
      // Atualiza localmente o estado
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, active } : item
        )
      );
    } catch (err: any) {
      errorHandler(err);
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(itemId => itemId !== id); // Desmarcar
      } else {
        return [...prevSelected, id]; // Marcar
      }
    });
  };

  // Gera as células da tabela
  const GenerateTableCell = (item: T) =>
    Object.entries(item)
      .map(([key, value]) => {
        if (key === "id") return null;

        if (key === "selected" && columnHeaders.includes(' ')) {
          return (
            <TableCell key={key}>
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onCheckedChange={() => handleCheckboxChange(item.id)}
              />
            </TableCell>
          );
        } else if (key === "selected") {
          return null;
        }

        if (key === "active") {
          return (
            <TableCell key={key}>
              <Switch
                checked={value}
                onCheckedChange={async (checked) => {
                  await handleToggle(item.id, checked);
                }}
              />
            </TableCell>
          );
        }

        if(key === "status") {
          return (
            <TableCell key={key}>
              <Badge className={`${statusColors[value]}`}> {translateStatus(value)} </Badge>
            </TableCell>
          )
        }

        value = handleFormatDate(value);
        return <TableCell key={key}>{value}</TableCell>;
      })
      .filter((cell) => cell !== null);

  return (
    <>
      {items.length > 0 ? (
        <Table className="rounded-md">
          <TableHeader className="bg-zinc-800">
            <TableRow>
              {columnHeaders.map((header, index) => (
                <TableHead key={index}>{header}</TableHead>
              ))}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index} className="hover:bg-zinc-800">
                {GenerateTableCell(item)}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {customActions && customActions(item)}
                      <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit && onEdit(item.id)}>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyTable />
      )}
      {data.totalPages > 1 && <Pagination data={data} onPageChange={onPageChange} />}
    </>
  );
}
