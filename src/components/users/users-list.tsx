'use client';

import { getUsers } from '@/actions/mock-user.actions';
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
import { useEffect, useState } from 'react';
import { PaginationControls } from '../shared/pagination-controls';

function UsersList({ initialUsers }: { initialUsers?: MockUser[] | null }) {
  const [users, setUsers] = useState<MockUser[]>(initialUsers || []);
  const [loading, setLoading] = useState(!initialUsers);
  const [error, setError] = useState<string | null>(null);
  const [displayUsers, setDisplayUsers] = useState<MockUser[]>([]);

  useEffect(() => {
    if (initialUsers && initialUsers.length > 0) {
      setUsers(initialUsers);
      return;
    }

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

  const handlePageChange = (paginatedData: MockUser[]) => {
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

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.age}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationControls
        data={users}
        itemsPerPage={9}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export { UsersList };
