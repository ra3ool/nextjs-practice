'use client';

import { getUsers } from '@/actions/mock-user.actions';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { isSuccessResponse } from '@/lib/response';
import { MockUser } from '@/types/user.type';
import { useEffect, useState } from 'react';

function UsersList({ initialUsers }: { initialUsers?: MockUser[] | null }) {
  const [users, setUsers] = useState<MockUser[]>(initialUsers || []);
  const [loading, setLoading] = useState(!initialUsers);
  const [error, setError] = useState<string | null>(null);

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium flex items-center gap-4 cursor-pointer">
                {user.name}
              </TableCell>
              <TableCell>test</TableCell>
              <TableCell>test</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export { UsersList };
