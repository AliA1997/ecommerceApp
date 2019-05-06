-- DROP TABLE category;
CREATE TABLE category (
    id SERIAL PRIMARY KEY
    ,name VARCHAR(120)
);
CREATE TABLE products (
    id SERIAL PRIMARY KEY
    ,image VARCHAR(120)
    ,name VARCHAR(120)
    ,price INTEGER
    ,categoryId INTEGER REFERENCES category(id)
);

CREATE TABLE app_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(250), 
    avatar VARCHAR(250)
);

--------Sample Data.

INSERT INTO products (image, name, price, categoryId) VALUES ('http://i3.cpcache.com/product/542600017/personalized_qr_code_mug.jpg?side=Back&color=White&height=460&width=460&qv=90', 'QR Code Mug', 10.00, 1);
INSERT INTO products (image, name, price, categoryId) VALUES ('http://i3.cpcache.com/product/1215298980/i_turn_coffee_into_code_mug.jpg?side=Back&color=White&height=460&width=460&qv=90', 'Code Mug', 8.00, 1);
INSERT INTO products (image, name, price, categoryId) VALUES ('https://tse2.mm.bing.net/th?id=OIP.OldqUu9IAlbhfufqwGDLXAHaHa&pid=15.1&P=0&w=300&h=300', 'QR Shirt', 20.00, 2);
INSERT INTO products (image, name, price, categoryId) VALUES ('http://rlv.zcache.com/funny_computer_code_writer_coffee_mug-r4010bb36f4b1484eb8173114ab5845a5_x7jsg_8byvr_512.jpg', 'Code Shirt', 12.00, 2);
INSERT INTO products (image, name, price, categoryId) VALUES ('https://tse4.mm.bing.net/th?id=OIP.6KximiDXw9LR5bVH0-LBSwHaEK&pid=15.1&P=0&w=305&h=173', 'Macbook Air', 500.00, 3);


INSERT INTO app_users (username, password, avatar) VALUES ('Admin97', '$2y$12$fe4gVzMEGwd35czZ9IhBQeyHrPxhxxf828qI1hCFGlLSfTwG2l9ni', 'https://cdn4.iconfinder.com/data/icons/user-avatar-flat-icons/512/User_Avatar-33-512.png');