import { useQuery } from '@apollo/client';

import VERSIONS_QUERY from '../queries/versions';

export default function useVersions() {
  const { data, loading, error } = useQuery(VERSIONS_QUERY, {
    errorPolicy: 'all',
  });

  if (loading) return [];
  if (error) return [];

  return data.versions;
}
