import { getUsers } from '@/actions/mock-user.actions';
import { UsersList } from '@/components/users/users-list';
import { isSuccessResponse } from '@/lib/response';

async function UsersPage() {
  const response = await getUsers();

  return (
    <div>
      <UsersList
        initialUsers={isSuccessResponse(response) ? response.data : null}
      />
    </div>
  );
}

export default UsersPage;
