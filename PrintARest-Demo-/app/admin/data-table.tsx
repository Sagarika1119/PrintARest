"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,  
  ColumnFiltersState,  
  getFilteredRowModel,
  VisibilityState,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"




interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[];
  openDocument:(url:string)=> void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,},
    });
  interface Recipe {
    id: string;
    title: string;
    image: string;
    time?: number;
    description?: string;
    vegan?: boolean;
  }
  
  const data1: Recipe[] = [
    {
      id: '1',
      title: 'PDF',
      image: '/images/download.png',
      time: 20,
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quae veritatis non ad consequatur voluptate fugiat sit obcaecati dicta! Nostrum.',
      vegan: false
    },
    {
      id: '1',
      title: 'PDF',
      image: '/images/download.png',
      time: 20,
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quae veritatis non ad consequatur voluptate fugiat sit obcaecati dicta! Nostrum.',
      vegan: false
    },
  ]
  return (
    <div className="bg-primary_color1 rounded-xl p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
      {data1.map((recipe: Recipe, index: number) => (
  <Card key={index} className="flex flex-col justify-between border border-primary_color1 bg-white">
    <CardHeader className="flex-row gap-4 items-center">
      <Avatar>
        <AvatarImage src={`${recipe.image}`} alt={recipe.title} />
        <AvatarFallback>
          {recipe.title.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div>
        <CardTitle>{recipe.title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p>{recipe.description}</p>
    </CardContent>
    <CardFooter className="flex justify-between flex-col gap-4">
      <div className="flex gap-4">
        
      </div>
      {recipe.vegan && <p>Vegan!</p>}
    </CardFooter>
  </Card>
        ))}
      </div>
  
      <div className="mt-8">
        <div className="flex-1 text-sm text-fuchsia-50">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
  
        <div className="flex items-center mt-4">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto bg-violet-200">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
  
        <div className="rounded-md border mt-4">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`border-b my-2`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
  
        <div className="flex items-center justify-end mt-4 space-x-2 ">
          <Button className="bg-violet-100"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button className="bg-violet-200"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
  
  
  
}
