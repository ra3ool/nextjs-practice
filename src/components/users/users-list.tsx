'use client';

import { getUsers } from '@/actions/mock-user.actions';
import loading from '@/app/dashboard/loading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { isSuccessResponse } from '@/lib/response';
import { MockUser } from '@/types/user.type';
import { EditIcon, TrashIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PaginationControls } from '../shared/pagination-controls';

function UsersList({ initialUsers }: { initialUsers?: MockUser[] | null }) {
  const [users, setUsers] = useState<MockUser[]>(initialUsers || []);
  const [loading, setLoading] = useState(!initialUsers);
  const [error, setError] = useState<string | null>(null);
  const [displayUsers, setDisplayUsers] = useState<MockUser[]>([]);
  const currentPage = useRef(1);
  const itemsPerPage = 9;

  useEffect(() => {
    if (initialUsers && initialUsers.length > 0) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getUsers();

        if (isSuccessResponse(response)) {
          setUsers(response.data as MockUser[]);
        } else {
          setError(response.message);
        }
      } catch {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [initialUsers]);

  const handlePageChange = (
    paginatedData: MockUser[],
    paginationCurrentPage: number,
  ) => {
    currentPage.current = paginationCurrentPage;
    setDisplayUsers(paginatedData);
  };

  if (loading) {
    return <div className="p-4">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-blue-800">No users found</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>

      <Table className="border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Row</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Date Of Birth</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Zip Code</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayUsers.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>
                {(currentPage.current - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell>
                {new Date(user.dateOfBirth).toLocaleDateString()}
              </TableCell>
              <TableCell>{user.country}</TableCell>
              <TableCell>{user.company}</TableCell>
              <TableCell>{user.zipcode}</TableCell>
              <TableCell className="flex gap-4">
                <EditIcon className="cursor-pointer" />
                <TrashIcon className="text-red-400 cursor-pointer" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationControls
        data={users}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export { UsersList };
