import { useQuery } from '@apollo/client';

import CURRENT_USER_QUERY from '../queries/currentUser';

export default function useCurrentUser() {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY, {
    errorPolicy: 'all',
  });

  if (loading || error) return { loggedIn: false };
  return {
    loggedIn: true,
    displayName: data.currentUser.displayName,
    username: data.currentUser.username,
    minecraft: data.currentUser.minecraft,
  };
}
