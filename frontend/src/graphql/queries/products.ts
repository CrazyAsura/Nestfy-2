import { gql } from '@apollo/client';
import { PRODUCT_FIELDS } from '../fragments/entities';

export const GET_PRODUCTS = gql`
  ${PRODUCT_FIELDS}
  query GetProducts {
    products {
      ...ProductFields
    }
  }
`;

export const GET_PRODUCT = gql`
  ${PRODUCT_FIELDS}
  query GetProduct($id: Int!) {
    product(id: $id) {
      ...ProductFields
      reviews {
        id
        rating
        comment
        user {
          name
        }
      }
    }
  }
`;
