import { getUsers } from '@/actions/mock-user.actions';

async function UsersPage() {
  const users = await getUsers();

  if (!users || users.length === 0) return <p>no user found</p>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;
