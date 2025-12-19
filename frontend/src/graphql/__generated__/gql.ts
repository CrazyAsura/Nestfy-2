/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment UserFields on User {\n    id\n    name\n    email\n    image\n    role\n    isActive\n  }\n": typeof types.UserFieldsFragmentDoc,
    "\n  fragment CategoryFields on Category {\n    id\n    name\n    slug\n    imageUrl\n  }\n": typeof types.CategoryFieldsFragmentDoc,
    "\n  fragment BrandFields on Brand {\n    id\n    name\n    logoUrl\n  }\n": typeof types.BrandFieldsFragmentDoc,
    "\n  fragment ProductImageFields on ProductImage {\n    id\n    url\n    isMain\n  }\n": typeof types.ProductImageFieldsFragmentDoc,
    "\n  \n  \n  \n  fragment ProductFields on Product {\n    id\n    name\n    slug\n    description\n    price\n    discountPrice\n    stock\n    sku\n    weight\n    height\n    width\n    length\n    color\n    isActive\n    images {\n      ...ProductImageFields\n    }\n    category {\n      ...CategoryFields\n    }\n    brand {\n      ...BrandFields\n    }\n  }\n": typeof types.ProductFieldsFragmentDoc,
    "\n  mutation Login($createAuthInput: CreateAuthInput!) {\n    createAuth(createAuthInput: $createAuthInput) {\n      accessToken\n      user {\n        id\n        name\n        email\n        role\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  \n  query GetCart($id: Int!) {\n    cart(id: $id) {\n      id\n      userId\n      items {\n        id\n        quantity\n        product {\n          ...ProductFields\n        }\n      }\n    }\n  }\n": typeof types.GetCartDocument,
    "\n  mutation AddToCart($createCartItemInput: CreateCartItemInput!) {\n    createCartItem(createCartItemInput: $createCartItemInput) {\n      id\n      quantity\n      productId\n    }\n  }\n": typeof types.AddToCartDocument,
    "\n  mutation UpdateCartItem($updateCartItemInput: UpdateCartItemInput!) {\n    updateCartItem(updateCartItemInput: $updateCartItemInput) {\n      id\n      quantity\n    }\n  }\n": typeof types.UpdateCartItemDocument,
    "\n  mutation RemoveFromCart($id: Int!) {\n    removeCartItem(id: $id) {\n      id\n    }\n  }\n": typeof types.RemoveFromCartDocument,
    "\n  query GetOrders {\n    orders {\n      id\n      orderNumber\n      totalAmount\n      status\n      paymentStatus\n      createdAt\n    }\n  }\n": typeof types.GetOrdersDocument,
    "\n  \n  query GetOrder($id: Int!) {\n    order(id: $id) {\n      id\n      orderNumber\n      totalAmount\n      status\n      paymentStatus\n      paymentMethod\n      shippingAddress\n      createdAt\n      items {\n        id\n        quantity\n        price\n        product {\n          ...ProductFields\n        }\n      }\n    }\n  }\n": typeof types.GetOrderDocument,
    "\n  mutation CreateOrder($createOrderInput: CreateOrderInput!) {\n    createOrder(createOrderInput: $createOrderInput) {\n      id\n      orderNumber\n    }\n  }\n": typeof types.CreateOrderDocument,
    "\n  \n  query GetBrands {\n    brands {\n      ...BrandFields\n    }\n  }\n": typeof types.GetBrandsDocument,
    "\n  \n  query GetBrand($id: Int!) {\n    brand(id: $id) {\n      ...BrandFields\n    }\n  }\n": typeof types.GetBrandDocument,
    "\n  \n  query GetCategories {\n    categories {\n      ...CategoryFields\n      parentId\n      children {\n        ...CategoryFields\n      }\n    }\n  }\n": typeof types.GetCategoriesDocument,
    "\n  \n  query GetCategory($id: Int!) {\n    category(id: $id) {\n      ...CategoryFields\n      parent {\n        ...CategoryFields\n      }\n      children {\n        ...CategoryFields\n      }\n    }\n  }\n": typeof types.GetCategoryDocument,
    "\n  \n  query GetProducts {\n    products {\n      ...ProductFields\n    }\n  }\n": typeof types.GetProductsDocument,
    "\n  \n  query GetProduct($id: Int!) {\n    product(id: $id) {\n      ...ProductFields\n      reviews {\n        id\n        rating\n        comment\n        user {\n          name\n        }\n      }\n    }\n  }\n": typeof types.GetProductDocument,
};
const documents: Documents = {
    "\n  fragment UserFields on User {\n    id\n    name\n    email\n    image\n    role\n    isActive\n  }\n": types.UserFieldsFragmentDoc,
    "\n  fragment CategoryFields on Category {\n    id\n    name\n    slug\n    imageUrl\n  }\n": types.CategoryFieldsFragmentDoc,
    "\n  fragment BrandFields on Brand {\n    id\n    name\n    logoUrl\n  }\n": types.BrandFieldsFragmentDoc,
    "\n  fragment ProductImageFields on ProductImage {\n    id\n    url\n    isMain\n  }\n": types.ProductImageFieldsFragmentDoc,
    "\n  \n  \n  \n  fragment ProductFields on Product {\n    id\n    name\n    slug\n    description\n    price\n    discountPrice\n    stock\n    sku\n    weight\n    height\n    width\n    length\n    color\n    isActive\n    images {\n      ...ProductImageFields\n    }\n    category {\n      ...CategoryFields\n    }\n    brand {\n      ...BrandFields\n    }\n  }\n": types.ProductFieldsFragmentDoc,
    "\n  mutation Login($createAuthInput: CreateAuthInput!) {\n    createAuth(createAuthInput: $createAuthInput) {\n      accessToken\n      user {\n        id\n        name\n        email\n        role\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  \n  query GetCart($id: Int!) {\n    cart(id: $id) {\n      id\n      userId\n      items {\n        id\n        quantity\n        product {\n          ...ProductFields\n        }\n      }\n    }\n  }\n": types.GetCartDocument,
    "\n  mutation AddToCart($createCartItemInput: CreateCartItemInput!) {\n    createCartItem(createCartItemInput: $createCartItemInput) {\n      id\n      quantity\n      productId\n    }\n  }\n": types.AddToCartDocument,
    "\n  mutation UpdateCartItem($updateCartItemInput: UpdateCartItemInput!) {\n    updateCartItem(updateCartItemInput: $updateCartItemInput) {\n      id\n      quantity\n    }\n  }\n": types.UpdateCartItemDocument,
    "\n  mutation RemoveFromCart($id: Int!) {\n    removeCartItem(id: $id) {\n      id\n    }\n  }\n": types.RemoveFromCartDocument,
    "\n  query GetOrders {\n    orders {\n      id\n      orderNumber\n      totalAmount\n      status\n      paymentStatus\n      createdAt\n    }\n  }\n": types.GetOrdersDocument,
    "\n  \n  query GetOrder($id: Int!) {\n    order(id: $id) {\n      id\n      orderNumber\n      totalAmount\n      status\n      paymentStatus\n      paymentMethod\n      shippingAddress\n      createdAt\n      items {\n        id\n        quantity\n        price\n        product {\n          ...ProductFields\n        }\n      }\n    }\n  }\n": types.GetOrderDocument,
    "\n  mutation CreateOrder($createOrderInput: CreateOrderInput!) {\n    createOrder(createOrderInput: $createOrderInput) {\n      id\n      orderNumber\n    }\n  }\n": types.CreateOrderDocument,
    "\n  \n  query GetBrands {\n    brands {\n      ...BrandFields\n    }\n  }\n": types.GetBrandsDocument,
    "\n  \n  query GetBrand($id: Int!) {\n    brand(id: $id) {\n      ...BrandFields\n    }\n  }\n": types.GetBrandDocument,
    "\n  \n  query GetCategories {\n    categories {\n      ...CategoryFields\n      parentId\n      children {\n        ...CategoryFields\n      }\n    }\n  }\n": types.GetCategoriesDocument,
    "\n  \n  query GetCategory($id: Int!) {\n    category(id: $id) {\n      ...CategoryFields\n      parent {\n        ...CategoryFields\n      }\n      children {\n        ...CategoryFields\n      }\n    }\n  }\n": types.GetCategoryDocument,
    "\n  \n  query GetProducts {\n    products {\n      ...ProductFields\n    }\n  }\n": types.GetProductsDocument,
    "\n  \n  query GetProduct($id: Int!) {\n    product(id: $id) {\n      ...ProductFields\n      reviews {\n        id\n        rating\n        comment\n        user {\n          name\n        }\n      }\n    }\n  }\n": types.GetProductDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment UserFields on User {\n    id\n    name\n    email\n    image\n    role\n    isActive\n  }\n"): (typeof documents)["\n  fragment UserFields on User {\n    id\n    name\n    email\n    image\n    role\n    isActive\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment CategoryFields on Category {\n    id\n    name\n    slug\n    imageUrl\n  }\n"): (typeof documents)["\n  fragment CategoryFields on Category {\n    id\n    name\n    slug\n    imageUrl\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment BrandFields on Brand {\n    id\n    name\n    logoUrl\n  }\n"): (typeof documents)["\n  fragment BrandFields on Brand {\n    id\n    name\n    logoUrl\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment ProductImageFields on ProductImage {\n    id\n    url\n    isMain\n  }\n"): (typeof documents)["\n  fragment ProductImageFields on ProductImage {\n    id\n    url\n    isMain\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  \n  \n  \n  fragment ProductFields on Product {\n    id\n    name\n    slug\n    description\n    price\n    discountPrice\n    stock\n    sku\n    weight\n    height\n    width\n    length\n    color\n    isActive\n    images {\n      ...ProductImageFields\n    }\n    category {\n      ...CategoryFields\n    }\n    brand {\n      ...BrandFields\n    }\n  }\n"): (typeof documents)["\n  \n  \n  \n  fragment ProductFields on Product {\n    id\n    name\n    slug\n    description\n    price\n    discountPrice\n    stock\n    sku\n    weight\n    height\n    width\n    length\n    color\n    isActive\n    images {\n      ...ProductImageFields\n    }\n    category {\n      ...CategoryFields\n    }\n    brand {\n      ...BrandFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Login($createAuthInput: CreateAuthInput!) {\n    createAuth(createAuthInput: $createAuthInput) {\n      accessToken\n      user {\n        id\n        name\n        email\n        role\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($createAuthInput: CreateAuthInput!) {\n    createAuth(createAuthInput: $createAuthInput) {\n      accessToken\n      user {\n        id\n        name\n        email\n        role\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  \n  query GetCart($id: Int!) {\n    cart(id: $id) {\n      id\n      userId\n      items {\n        id\n        quantity\n        product {\n          ...ProductFields\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  \n  query GetCart($id: Int!) {\n    cart(id: $id) {\n      id\n      userId\n      items {\n        id\n        quantity\n        product {\n          ...ProductFields\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddToCart($createCartItemInput: CreateCartItemInput!) {\n    createCartItem(createCartItemInput: $createCartItemInput) {\n      id\n      quantity\n      productId\n    }\n  }\n"): (typeof documents)["\n  mutation AddToCart($createCartItemInput: CreateCartItemInput!) {\n    createCartItem(createCartItemInput: $createCartItemInput) {\n      id\n      quantity\n      productId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateCartItem($updateCartItemInput: UpdateCartItemInput!) {\n    updateCartItem(updateCartItemInput: $updateCartItemInput) {\n      id\n      quantity\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCartItem($updateCartItemInput: UpdateCartItemInput!) {\n    updateCartItem(updateCartItemInput: $updateCartItemInput) {\n      id\n      quantity\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveFromCart($id: Int!) {\n    removeCartItem(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveFromCart($id: Int!) {\n    removeCartItem(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetOrders {\n    orders {\n      id\n      orderNumber\n      totalAmount\n      status\n      paymentStatus\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query GetOrders {\n    orders {\n      id\n      orderNumber\n      totalAmount\n      status\n      paymentStatus\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  \n  query GetOrder($id: Int!) {\n    order(id: $id) {\n      id\n      orderNumber\n      totalAmount\n      status\n      paymentStatus\n      paymentMethod\n      shippingAddress\n      createdAt\n      items {\n        id\n        quantity\n        price\n        product {\n          ...ProductFields\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  \n  query GetOrder($id: Int!) {\n    order(id: $id) {\n      id\n      orderNumber\n      totalAmount\n      status\n      paymentStatus\n      paymentMethod\n      shippingAddress\n      createdAt\n      items {\n        id\n        quantity\n        price\n        product {\n          ...ProductFields\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateOrder($createOrderInput: CreateOrderInput!) {\n    createOrder(createOrderInput: $createOrderInput) {\n      id\n      orderNumber\n    }\n  }\n"): (typeof documents)["\n  mutation CreateOrder($createOrderInput: CreateOrderInput!) {\n    createOrder(createOrderInput: $createOrderInput) {\n      id\n      orderNumber\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  \n  query GetBrands {\n    brands {\n      ...BrandFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetBrands {\n    brands {\n      ...BrandFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  \n  query GetBrand($id: Int!) {\n    brand(id: $id) {\n      ...BrandFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetBrand($id: Int!) {\n    brand(id: $id) {\n      ...BrandFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  \n  query GetCategories {\n    categories {\n      ...CategoryFields\n      parentId\n      children {\n        ...CategoryFields\n      }\n    }\n  }\n"): (typeof documents)["\n  \n  query GetCategories {\n    categories {\n      ...CategoryFields\n      parentId\n      children {\n        ...CategoryFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  \n  query GetCategory($id: Int!) {\n    category(id: $id) {\n      ...CategoryFields\n      parent {\n        ...CategoryFields\n      }\n      children {\n        ...CategoryFields\n      }\n    }\n  }\n"): (typeof documents)["\n  \n  query GetCategory($id: Int!) {\n    category(id: $id) {\n      ...CategoryFields\n      parent {\n        ...CategoryFields\n      }\n      children {\n        ...CategoryFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  \n  query GetProducts {\n    products {\n      ...ProductFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetProducts {\n    products {\n      ...ProductFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  \n  query GetProduct($id: Int!) {\n    product(id: $id) {\n      ...ProductFields\n      reviews {\n        id\n        rating\n        comment\n        user {\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  \n  query GetProduct($id: Int!) {\n    product(id: $id) {\n      ...ProductFields\n      reviews {\n        id\n        rating\n        comment\n        user {\n          name\n        }\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;