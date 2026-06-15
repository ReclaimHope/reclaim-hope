"use client";

import {
  CheckCircle2,
  MoreVertical,
  Plus,
  Columns,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog } from "./ui/dialog";
import { CreateChildDialog } from "./create-child";

type DataTableItem = {
  id: number;
  header: string;
  type: string;
  status: string;
  target: string;
  reviewer: string;
};

const defaultData: DataTableItem[] = [
  {
    id: 1,
    header: "Hero Section",
    type: "Landing Page",
    status: "Done",
    target: "100",
    reviewer: "John Doe",
  },
  {
    id: 2,
    header: "About Section",
    type: "Content",
    status: "In Progress",
    target: "80",
    reviewer: "Jane Smith",
  },
];

interface DataTableProps {
  data?: DataTableItem[];
}

export default function DataTable({ data }: DataTableProps) {
  const rows = data ?? defaultData;

  return (
    <div className="space-y-4 mx-auto px-4 max-w-7xl sm:px-6 lg:px-8">
      {/* Top Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manage Children</h2>
          <CreateChildDialog/>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border flex flex-col items-center w-[1050px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sponsor</TableHead>
              <TableHead>Reviewer</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.header}
                </TableCell>

                <TableCell>
                  <Badge variant="outline">
                    {item.type}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className="flex w-fit items-center gap-1"
                  >
                    <CheckCircle2 className="size-4 text-green-500" />
                    {item.status}
                  </Badge>
                </TableCell>

                <TableCell>{item.target}</TableCell>
                <TableCell>{item.reviewer}</TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                      >
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View</DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}