import { gql } from '@apollo/client';
import { BRAND_FIELDS } from '../fragments/entities';

export const GET_BRANDS = gql`
  ${BRAND_FIELDS}
  query GetBrands {
    brands {
      ...BrandFields
    }
  }
`;

export const GET_BRAND = gql`
  ${BRAND_FIELDS}
  query GetBrand($id: Int!) {
    brand(id: $id) {
      ...BrandFields
    }
  }
`;
