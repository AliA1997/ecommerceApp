 //import postgresql database instance to be used to retrieve data.
 //And import all the sql files you would need to retrieve, edit, create, and delete data. 
const { postgresDatabase, filterProducts, getProducts, getProduct, createProduct, updateProduct, deleteProduct,
        getCategory, getCategoryByName, getAllCategories, createCategory, updateCategory, deleteCategory, getUser } = require('../connectors');
const bcrypt = require('bcrypt');
const salt = 12;

const productResolver = {
    Query: {
        getAllProducts: async (_, args) => {
            const productResult = await postgresDatabase.manyOrNone(getProducts);
            return productResult.map(product => ({name: product.name, image: product.image, price: product.price, id: product.id,
                category: {name: product.category, categoryId: product.categoryid} }));        
        },
        getProduct: async (_, args) => {
            const { id } = args;
            const productResult = await postgresDatabase.manyOrNone(getProduct, id);
            if(productResult.length) 
                return {
                        name: productResult[0].name, image: productResult[0].image, price: productResult[0].price, id: productResult[0].id,
                        category: {name: productResult[0].category, categoryId: productResult[0].categoryid}
                };
            else
                return {name: '', image: '', price: 0, id: 0, category: {name: '', categoryId: 0}};
        },
        getProductsByCategory: async (_, args)  => {
            const { category } = args;
            const categoryToCompare = `%${category}%`;
            const productResult = await postgresDatabase.manyOrNone(filterProducts, {categoryToCompare});
            return productResult.map(product => ({name: product.name, image: product.image, price: product.price, id: product.id,
                                                  category: {name: product.category, categoryId: product.categoryid} }));
        }
    },
    Mutation: {
        createProduct: async (_, args) => {
            const { newProduct } = args;
            const categoryForCreatedProduct = await postgresDatabase.manyOrNone(getCategoryByName, newProduct.category);
            newProduct.categoryId = categoryForCreatedProduct[0].id;
            const productResult = await postgresDatabase.manyOrNone(createProduct, {newProduct});
            return {
                name: productResult[0].name, image: productResult[0].image, price: productResult[0].price, id: productResult[0].id, 
                category: { name: categoryForCreatedProduct[0].name, categoryId: categoryForCreatedProduct[0].id }    
            };
        },
        updateProduct: async (_, args) => {
            //Destruct the id and the updatedProduct from the argument of the mutation.
            const { id, updatedProduct } = args;
            //Then find the category id the updatedProduct based on it's category property which is hte name of the category.
            const categoryForCreatedProduct = await postgresDatabase.manyOrNone(getCategoryByName, updatedProduct.category);
            //Then assign the updatedProduct categoryId  to the result's id 
            updatedProduct.categoryId = categoryForCreatedProduct[0].id;
            //And assign the updatedProduct id to the id argument 
            updatedProduct.id = id;
            //Then update the specified product using the updateProduct mehtod, and the updatedProduct object param.
            const productResult = await postgresDatabase.manyOrNone(updateProduct, { updatedProduct });
            //THen return the a object following the product object type which will have a category of type category, which is a categoryId, and name.
            //So instead of returning a productResult, return a object with the product object type properties, and have the category property come from the category result from earlier.
            return {
                name: productResult[0].name, image: productResult[0].image, price: productResult[0].price, id: productResult[0].id, 
                category: { name: categoryForCreatedProduct[0].name, categoryId: categoryForCreatedProduct[0].id }
            };
        },
        deleteProduct: async (_, args) => {
            const { id } = args;
            await postgresDatabase.manyOrNone(deleteProduct, id);
            return `Product with an id of ${id} has been deleted.`;
        }
    }
}

const categoryResolver = {
    Query: {
        getAllCategorys: async (_, args) => {
            const categoryResult = await postgresDatabase.manyOrNone(getAllCategories);
            return categoryResult.map(category => ({name: category.name, categoryId: category.id}));
        },
        getCategory: async (_, args) => {
            const { id } = args;
            const categoryResult = await postgresDatabase.manyOrNone(getCategory, id);
            if(categoryResult.length)
                return {name: categoryResult[0].name, categoryId: categoryResult[0].id};
            else 
                return {name: '', categoryId: ''}
        }
    },
    Mutation: {
        createCategory: async (_, args) => {
            const { newCategory } = args;
            const categoryResult = await postgresDatabase.manyOrNone(createCategory, newCategory);
            return { name: categoryResult[0].name, categoryId: categoryResult[0].id}
        },
        updateCategory: async (_, args) => {
            const { categoryId, updatedCategory } = args;
            const categoryResult = await postgresDatabase.manyOrNone(updateCategory, { name: updatedCategory, id: categoryId });
            return { name: categoryResult[0].name, categoryId: categoryResult[0].id };
        },
        deleteCategory: async (_, args) => {
            const { id } = args;
            await postgresDatabase.manyOrNone(deleteCategory, id);
            return `Category with a id ${id} has just been deleted!.`
        }
    }
}


const userResolver = {
    Query: {
        getUser: (parent, args, context, info) => {
            console.log('req.session-----', context.req.session);
            // if(!context.req.session.user) 
            //     throw new Error('Admin not logged in!');
            // return context.req.session.user;
        }
    },
    Mutation: {
        login: async (_, args, context) => {
            const { username, password } = args.loginForm;
            // console.log('context---------', context.req.session);
            const userResult = await postgresDatabase.manyOrNone(getUser, username);
            if(!userResult.length)
                throw new Error('User not found!');
                
            const doPasswordMatch = await bcrypt.compare(password, userResult[0].password);
            console.log('doPasswordMatch----------', doPasswordMatch);
            if(doPasswordMatch) {
                delete userResult[0].password;
                context.req.session.user = userResult[0];
                console.log('login ---------', context.req.session.user);
                return context.req.session.user;
            }
        }
    }
}


module.exports = {productResolver, categoryResolver, userResolver};