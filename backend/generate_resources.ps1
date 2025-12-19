$entities = @(
    "users",
    "addresses",
    "phones",
    "products",
    "product-images",
    "categories",
    "brands",
    "reviews",
    "carts",
    "cart-items",
    "orders",
    "order-items",
    "wishlists",
    "wishlist-items",
    "materials",
    "risks",
    "chatbot"
)

foreach ($entity in $entities) {
    Write-Host "Generating resource for $entity..."
    node "node_modules/@angular-devkit/schematics-cli/bin/schematics.js" @nestjs/schematics:resource --name=$entity --type=graphql-code-first --crud --path=modules --source-root=src --force
}
