import { gql } from '@apollo/client';
import { PRODUCT_FIELDS } from '../fragments/entities';

export const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      orderNumber
      totalAmount
      status
      paymentStatus
      createdAt
    }
  }
`;

export const GET_ORDER = gql`
  ${PRODUCT_FIELDS}
  query GetOrder($id: Int!) {
    order(id: $id) {
      id
      orderNumber
      totalAmount
      status
      paymentStatus
      paymentMethod
      shippingAddress
      createdAt
      items {
        id
        quantity
        price
        product {
          ...ProductFields
        }
      }
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($createOrderInput: CreateOrderInput!) {
    createOrder(createOrderInput: $createOrderInput) {
      id
      orderNumber
    }
  }
`;
