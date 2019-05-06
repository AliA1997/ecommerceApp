require('dotenv').config();
const { QueryFile } = require('pg-promise');
const pgPromise = require('pg-promise')
const path = require('path');

const postgresDatabase = new pgPromise({})(process.env.CONNECTION_STRING);


function load(file) {
    return new QueryFile(file, {minify: true});
}


function getPath(path, type) {

    if(!type) {
        path.replace('/connectors/', '');
        path.replace('/db/', '');
    }

    return path;
}

const getProducts = load(path.join(__dirname, '/db/product/getAllProducts.sql'));
const filterProducts = load(path.join(__dirname, '/db/product/filterProducts.sql'));
const getProduct = load(path.join(__dirname, '/db/product/getProduct.sql'));
const createProduct = load(path.join(__dirname, '/db/product/createProduct.sql'));
const updateProduct = load(path.join(__dirname, '/db/product/updateProduct.sql'));
const deleteProduct = load(path.join(__dirname, '/db/product/deleteProduct.sql'));
const getAllCategories = load(path.join(__dirname, '/db/category/getAllCategories.sql'));
const getCategory = load(path.join(__dirname, '/db/category/getCategory.sql'));
const getCategoryByName = load(path.join(__dirname, '/db/category/getCategoryByName.sql'));
const createCategory = load(path.join(__dirname, '/db/category/createCategory.sql'));
const updateCategory = load(path.join(__dirname, '/db/category/updateCategory.sql'));
const deleteCategory = load(path.join(__dirname, '/db/category/deleteCategory.sql'));
const getUser = load(path.join(__dirname, '/db/users/getUser.sql'));

module.exports = { postgresDatabase, getProduct, filterProducts, getProducts, createProduct, updateProduct, deleteProduct,
                   getAllCategories, getCategory, getCategoryByName, createCategory, updateCategory, deleteCategory, getUser };