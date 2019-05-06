import React, { PureComponent } from 'react';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import { StyleSheet, Dimensions } from 'react-native';
import { Button, Card, Container, Content, Header, H1, H2, Icon, Spinner, List, Text, Thumbnail } from 'native-base';
import ProductItem from '../components/ProductItem';
import CategoryItem from '../components/CategoryItem';
import * as utils from '../utils';

const getProducts = gql`
query {
    products:getAllProducts {
        id
        name
        image
        price
        category {
        name
        categoryId
        }
    }
}
`;

const getCategories = gql`
query {
    categories:getAllCategorys {
      name
      categoryId
    }
}
`;

const deleteProductMutation = gql`
    mutation DeleteProduct($id: Int) {
        deleteProduct(id: $id) 
    }
`;

const deleteCategoryMutation = gql`
    mutation DeleteCategory($id: Int) {
        deleteCategory(id: $id) 
    }
`;

const { width } = Dimensions.get('window');

export default class Admin extends PureComponent {

    static navigationOptions = ({navigation}) => {
        // tabLabel: 'Admin'
        return {
            headerLeft: null,
            headerTitle: (
                        <Header style={{width: width, justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                            <Thumbnail source={{uri: 'https://cdn4.iconfinder.com/data/icons/user-avatar-flat-icons/512/User_Avatar-31-512.png'}} style={{height: '90%'}} />
                            <H1 style={{color: 'white', alignSelf: 'center'}}>Admin</H1>
                        </Header>
            )
        }
    }

    constructor() {
        super();
        this.state = {
            products: null,
            categories: null
        }
        this.getItems = this.getItems.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
    }

    async getItems(client) {
        const categoryResult = await client.query({query: getCategories});
        const productResult = await client.query({query: getProducts});
        // console.log('categories---------', categoryResult);
        // console.log('products---------', productResult);
        this.setState(
            {
                categories: categoryResult.data.categories,
                products: productResult.data.products
            }
        );
    }

    async deleteProduct(client, id) {
        const mutationOptions = utils.returnMutateOptions('delete', deleteProductMutation, 'product', { id }, getProducts);
        console.log('mutationOptions-----', mutationOptions);
        // await client.mutate({
        //         mutation: deleteProductMutation, 
        //         variables: {id},
        //         optimisticResponse: {
        //             __typename: 'Mutation',
        //             deleteProduct: {
        //                 id
        //             }
        //         }, 
        //         update: (proxy, { data }) => {
        //             const mutationResult = data['deleteProduct'];
        //              console.log('mutationResult--------', mutationResult);
        //         }
        //     })
        await client.mutate(mutationOptions);
    }

    async deleteCategory(client, id) {
        const mutationOptions = utils.returnMutateOptions('delete', deleteProductMutation, 'category', { id }, getCategories);    
        console.log('mutationOptions-----', mutationOptions);
        await client.mutate(mutationOptions);    
    }

    render() {
        const { navigation } = this.props;
        const { products, categories } = this.state;
        return (
            <Container>

                <Content>
                    <ApolloConsumer>
                        {(client) => {

                            if(client) {
                                try {
                                    this.getItems(client);
                                    if(Array.isArray(products) && Array.isArray(categories))

                                        return (
                                            <Card>
                                                <H2>Products</H2>
                                                {products.map(prod => <ProductItem 
                                                                            key={prod.id}
                                                                            {...prod}
                                                                            navigation={navigation}
                                                                            isAdmin={true}
                                                                            adminClient={client}
                                                                            onDelete={this.deleteProduct}
                                                                        />)}

                                                <H2>Categories</H2>
                                                {categories.map(cate => <CategoryItem  key={cate.categoryId} {...cate} navigation={navigation} isAdmin={true}/>)}
                                            </Card>
                                        );
                                
                                } catch(err) {
                                    console.log('Client Error------', err);
                                }
                            }
                            return <Spinner color="blue" />
                        }}
                    </ApolloConsumer>
                    {
                        (products && products.length && categories && categories.length) ? 
                        <Card style={styles.buttonDivider}>
                            <Button onPress={() => navigation.push('CreateCategory')} bordered primary iconLeft>
                                <Icon name="filing" color="purple"/>
                                <Text>Create Category</Text>
                            </Button>

                            <Button onPress={() => navigation.push('CreateProduct')} iconLeft>
                                <Icon name="cube" bordered success color="green"/>
                                <Text>Create Product</Text>
                            </Button>
                        </Card>
                        : null
                    }

                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    buttonDivider: {
        marginLeft: 'auto',
        marginRight: 'auto',
        flexDirection: 'row',
    }
})