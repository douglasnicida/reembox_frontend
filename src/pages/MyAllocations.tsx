import React, { useState, useEffect } from "react";
import { MyAllocations } from "@/types/models.type";
import { Toaster } from "@/components/ui/toaster";
import { errorHandler } from "@/utils/errorHandler";

import api from "@/api/axios";
import { Paginated, PaginatedResponse } from "@/types/response.type";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { Pagination } from "@/components/custom_components/Pagination";
import { convertISOToDDMMYYYY } from "@/utils/handleDate";

export default function MyAllocationsPage() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [data, setData] = useState<Paginated<MyAllocations>>({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    size: 10,
  });

  async function fetchAllocations(page: number, size: number = 10) {
    try {
      const { data } = await api.get<PaginatedResponse<MyAllocations>>(`/allocations/my?page=${page}&size=${size}`);
      
      const { currentPage, totalItems, totalPages, items } = data.payload

      setData({
        currentPage,
        totalItems,
        totalPages,
        size: data.payload.size,
        items: items.map(item => ({
          ...item,
          startDate: convertISOToDDMMYYYY(item.startDate),
          estimatedEndDate: convertISOToDDMMYYYY(item.estimatedEndDate),
          endDate: item.endDate && convertISOToDDMMYYYY(item.endDate)
        }))
      });
    } catch (err: any) {
      errorHandler(err);
    }
  }

  useEffect(() => {
    fetchAllocations(1);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchAllocations(1);
  }

  return (
    <>
    <div className="flex items-center justify-center gap-4 mt-6">
      {data.items.map(allocation => (
        <Card key={allocation.id}>
          <CardHeader>
            <CardTitle>{allocation.project.key}</CardTitle>
            <CardDescription>{allocation.project.name}</CardDescription>
            <CardDescription>
              <p>Início: {allocation.startDate}</p>
              <p>
                {!allocation.endDate ? 
                  `Término estimado ${allocation.estimatedEndDate}` :
                  `Término: ${allocation.endDate}`
                }
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className="w-[350px] space-y-2"
            >
              <div className="flex items-center justify-between space-x-4 px-4">
                <h4 className="text-sm font-semibold">
                  Expanda para ver toda a equipe
                </h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
                  {allocation.allocations[0].name}, {allocation.allocations[0].jobTitle || "Sem cargo"}
              </div>
              {allocation.allocations.map(alloc => (
                  <CollapsibleContent key={alloc.id} lassName="space-y-2">
                      <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
                        {alloc.name}, {alloc.jobTitle || "Sem cargo"}
                      </div>
                  </CollapsibleContent>
                ))}
            </Collapsible>       
          </CardContent>
        </Card>
      ))}
    </div>
    <Toaster />
    <Pagination data={data} onPageChange={fetchAllocations}/>
    </>
  );
}