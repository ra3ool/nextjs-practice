import { getUsers } from '@/actions/mock-user.actions';
import { isErrorResponse } from '@/lib/response';
import { toast } from 'sonner';

async function UsersPage() {
  const response = await getUsers();

  if (isErrorResponse(response)) {
    toast.error(response.message);
    return <p>no user found</p>;
  }

  const users = response.data;
  if (!users || users.length === 0) return <p>No users found</p>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users?.map((u) => (
          <li key={u.id}>
            {u.name} {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;
