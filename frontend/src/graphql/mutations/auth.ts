import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($createAuthInput: CreateAuthInput!) {
    createAuth(createAuthInput: $createAuthInput) {
      accessToken
      user {
        id
        name
        email
        role
      }
    }
  }
`;
