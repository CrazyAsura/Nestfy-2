import { gql } from '@apollo/client';
import { CATEGORY_FIELDS } from '../fragments/entities';

export const GET_CATEGORIES = gql`
  ${CATEGORY_FIELDS}
  query GetCategories {
    categories {
      ...CategoryFields
      parentId
      children {
        ...CategoryFields
      }
    }
  }
`;

export const GET_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  query GetCategory($id: Int!) {
    category(id: $id) {
      ...CategoryFields
      parent {
        ...CategoryFields
      }
      children {
        ...CategoryFields
      }
    }
  }
`;
