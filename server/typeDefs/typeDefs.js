const gql = require('graphql-tag');

const typeDefs = gql`
    # Define a product type for all your products.
    type Product {
        id: Int
        image: String 
        name: String
        category: Category
        price: Int 
    }

    # Define a category type for all categories for all your products
    type Category  {
        categoryId: Int 
        name: String
    }

    # Define a type for all your App Users.
    type AppUser {
        id: Int
        username: String
        avatar: String
    }

    # Define your input type for creating a Product
    input ProductForm {
        image: String
        name: String
        category: String
        price: Int 
    }

    # Define a input type for logging in
    input LoginForm {
        username: String
        password: String
    }

    # Define all your query fields for retrieving all products, and categories 
    type Query {
        getAllProducts: [Product]
        getProduct(id: Int): Product
        getProductsByCategory(category: String): [Product]
        getAllCategorys: [Category]
        getCategory(id: Int): Category
        getUser: AppUser
    }

    # Define all your mutation fields for creating, updating, and deleting products, and categories     
    type Mutation {
        createProduct(newProduct: ProductForm): Product 
        updateProduct(id: Int, updatedProduct: ProductForm): Product
        deleteProduct(id: Int): String
        createCategory(newCategory: String): Category
        updateCategory(categoryId: Int, updatedCategory: String): Category
        deleteCategory(id: Int): String
        login(loginForm: LoginForm): AppUser
    }

    schema {
        query: Query
        mutation: Mutation
    }
`;

module.exports = typeDefs;