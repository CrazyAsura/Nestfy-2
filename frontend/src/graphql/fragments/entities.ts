import { gql } from '@apollo/client';

export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    name
    email
    image
    role
    isActive
  }
`;

export const CATEGORY_FIELDS = gql`
  fragment CategoryFields on Category {
    id
    name
    slug
    imageUrl
  }
`;

export const BRAND_FIELDS = gql`
  fragment BrandFields on Brand {
    id
    name
    logoUrl
  }
`;

export const PRODUCT_IMAGE_FIELDS = gql`
  fragment ProductImageFields on ProductImage {
    id
    url
    isMain
  }
`;

export const PRODUCT_FIELDS = gql`
  ${PRODUCT_IMAGE_FIELDS}
  ${CATEGORY_FIELDS}
  ${BRAND_FIELDS}
  fragment ProductFields on Product {
    id
    name
    slug
    description
    price
    discountPrice
    stock
    sku
    weight
    height
    width
    length
    color
    isActive
    images {
      ...ProductImageFields
    }
    category {
      ...CategoryFields
    }
    brand {
      ...BrandFields
    }
  }
`;
