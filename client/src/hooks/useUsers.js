import { useQuery } from '@apollo/client';

import USERS_QUERY from '../queries/users';

export default function useCurrentUser() {
  const { data, loading, error } = useQuery(USERS_QUERY, {
    errorPolicy: 'all',
  });

  if (loading) return [];
  if (error) return null;

  return data.users.filter(Boolean);
}
