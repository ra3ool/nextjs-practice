import { ROUTE_ACCESS } from '@/constants/acl.constants';
import { UserRole } from '@/types/user.type';

export function canAccess(route: string, role?: UserRole): boolean {
  const access = ROUTE_ACCESS[route];
  return !!(!access || (role && access.includes(role)));
}
