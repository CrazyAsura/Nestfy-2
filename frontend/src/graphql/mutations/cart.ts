import { gql } from '@apollo/client';
import { PRODUCT_FIELDS } from '../fragments/entities';

export const GET_CART = gql`
  ${PRODUCT_FIELDS}
  query GetCart($id: Int!) {
    cart(id: $id) {
      id
      userId
      items {
        id
        quantity
        product {
          ...ProductFields
        }
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($createCartItemInput: CreateCartItemInput!) {
    createCartItem(createCartItemInput: $createCartItemInput) {
      id
      quantity
      productId
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($updateCartItemInput: UpdateCartItemInput!) {
    updateCartItem(updateCartItemInput: $updateCartItemInput) {
      id
      quantity
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($id: Int!) {
    removeCartItem(id: $id) {
      id
    }
  }
`;
