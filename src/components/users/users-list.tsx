'use client';

import { deleteUser, getUsers } from '@/actions/mock-user.actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { isSuccessResponse } from '@/lib/response';
import { cn } from '@/lib/utils';
import { MockUser } from '@/types/user.type';
import { EditIcon, TrashIcon } from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { PaginationControls } from '../shared/pagination-controls';

function UsersList({ initialUsers }: { initialUsers?: MockUser[] | null }) {
  const [users, setUsers] = useState<MockUser[]>(initialUsers || []);
  const [paginatedUsers, setPaginatedUsers] = useState<MockUser[]>([]);
  const [isPending, startTransition] = useTransition();
  const currentPage = useRef(1);
  const itemsPerPage = 9;

  useEffect(() => {
    if (initialUsers && initialUsers.length > 0) return;

    const fetchUsers = () => {
      startTransition(async () => {
        const response = await getUsers();

        if (isSuccessResponse(response)) {
          setUsers(response.data as MockUser[]);
        } else {
          toast.error(response.message);
        }
      });
    };

    fetchUsers();
  }, [initialUsers]);

  const handlePageChange = (
    paginatedData: MockUser[],
    paginationCurrentPage: number,
  ) => {
    currentPage.current = paginationCurrentPage;
    setPaginatedUsers(paginatedData);
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    if (isPending) return;

    if (!confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }

    startTransition(async () => {
      const response = await deleteUser(userId);

      if (isSuccessResponse(response)) {
        toast.success(response.message);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } else {
        toast.error(response.message);
      }
    });
  };

  const handleDeleteClick = (userId: number, userName: string) => {
    toast.error(`Delete ${userName}?`, {
      description: 'This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: () => handleDeleteUser(userId, userName),
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
      duration: 10000,
    });
  };

  if (!initialUsers && users.length === 0 && isPending) {
    return <div className="p-4">Loading users...</div>;
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

      <Table className={cn('border rounded-lg', isPending && 'opacity-50')}>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Row</TableHead>
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
          {paginatedUsers.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>
                {(currentPage.current - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell>
                {user.dateOfBirth
                  ? new Date(user.dateOfBirth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </TableCell>
              <TableCell>{user.country}</TableCell>
              <TableCell>{user.company}</TableCell>
              <TableCell>{user.zipcode}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button
                    className="p-1 rounded cursor-pointer"
                    disabled={isPending}
                  >
                    <EditIcon className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 rounded cursor-pointer"
                    onClick={() => handleDeleteClick(user.id, user.name)}
                    disabled={isPending}
                  >
                    <TrashIcon className="h-4 w-4 text-red-400" />
                  </button>
                </div>
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
