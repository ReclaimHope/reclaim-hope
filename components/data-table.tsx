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
import useSWR from "swr";

export default function DataTable() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const getAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0) {
      age--;
    }
    return age;
  };
  const { data, error, isLoading: isFetching } = useSWR('/api/children', fetcher);
  return (
    <div className="space-y-4 mx-auto px-4 max-w-7xl sm:px-6 lg:px-8">
      {/* Top Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manage Children</h2>
        <CreateChildDialog />
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
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {
              isFetching ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center"> Loading...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center"> Error loading data</TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center"> No children found</TableCell>
                </TableRow>
              ) : data.map((child: any) => (
                <TableRow key={child.id}>
                  <TableCell>{child.firstName} {child.lastName}</TableCell>
                  <TableCell>{getAge(child.dateOfBirth)}</TableCell>
                  <TableCell>{child.sponsorshipStatus}</TableCell>
                  <TableCell>{child.sponsorName || "Not sponsored"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
              )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}