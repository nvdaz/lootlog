import { useQuery } from '@apollo/client';

import USERS_QUERY from '../queries/users';

export default function useCurrentUser() {
  const { data, loading, error } = useQuery(USERS_QUERY, {
    errorPolicy: 'all',
  });

  return { users: (data?.users || []).filter(Boolean), loading, error };
}
