export const NOT_FOUND = 'NOT_FOUND';
export const HTTP_ERROR = 'HTTP_ERROR';
export const UNAUTHENTICATED = 'UNAUTHENTICATED';

export function meta(error) {
  if (error instanceof Error) {
    // eslint-disable-next-line no-console
    console.error(error);
    if (
      error.graphQLErrors &&
      error.graphQLErrors[0].extensions.code === 'UNAUTHENTICATED'
    )
      return meta(UNAUTHENTICATED);

    return meta('UNKNOWN');
  }
  switch (error) {
    case NOT_FOUND:
      return { title: '404 Error', description: 'Not found' };
    case HTTP_ERROR:
      return {
        title: 'GQL Error',
        description: 'An error occured while loading this content',
      };
    case UNAUTHENTICATED:
      return {
        title: 'Unauthenticated',
        description: 'This page requires authentication.',
      };
    default:
      return { title: 'Unknown Error', description: 'How did you get here?' };
  }
}
