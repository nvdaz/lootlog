import { DocumentNode } from '@apollo/client';

declare module '*.graphql' {
  const document: DocumentNode;
  export default document;
}
