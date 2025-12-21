$entities = @(
    "user",
    "refresh-token",
    "address",
    "phone",
    "product",
    "product-image",
    "category",
    "brand",
    "review",
    "cart",
    "cart-item",
    "order",
    "order-item",
    "wishlist",
    "wishlist-item",
    "material",
    "risk",
    "chatbot"
)

foreach ($entity in $entities) {
    Write-Host "Generating resource for $entity..."
    # Removendo --type para evitar erro de opção desconhecida e usando npx nest
    npx nest g resource "modules/$entity"
}
