UPDATE products 
    SET image = ${updatedProduct.image},
    name = ${updatedProduct.name},
    price = ${updatedProduct.price},
    categoryId = ${updatedProduct.categoryId}
WHERE id = ${updatedProduct.id};
SELECT * FROM products WHERE id = ${updatedProduct.id};