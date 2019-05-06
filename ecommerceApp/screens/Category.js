import React, { PureComponent } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Card, CardItem, H1, Icon, Container, Content, Header, List, Text, Spinner } from 'native-base';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import ProductItem from '../components/ProductItem';
import * as utils from '../utils';

const getCategoryQuery = gql`
    query GetCategory($id: Int) {
        category: getCategory(id: $id) {
            name
            categoryId
        }
    }
`;

const getProductsForCategoryQuery = gql`
    query GetProductsForCategory($category: String) {
        products: getProductsByCategory(category: $category) {
            id
            name
            image
            price
        }
    }
`;

const { width } = Dimensions.get('window');
class Category extends PureComponent {
        
        constructor() {
                super();
                this.state = {
                        category: null,
                        productsForCategory: []
                };
                this.getCategory = this.getCategory.bind(this);
                this.getProductsForCategory = this.getProductsForCategory.bind(this);
        }

        static navigationOptions = ({navigation}) => {
                const categoryName = navigation.getParam('name');
                // header: null
                return {
                        headerLeft: (
                                <Header style={{width: 100, justifyContent: 'center', alignItems: 'center', marginRight: 0, textAlign: 'center'}}>
                                        <Icon name="arrow-round-back" style={{justifyContent: 'center', color: 'white'}} onPress={() => navigation.goBack()}/>
                                </Header>
                        ),
                        headerTitle: (
                                <Header style={{width: width, justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                                        <H1 style={{color: 'white', alignSelf: 'center'}}>{categoryName} </H1>
                                </Header>
                        )
                }
        }


        async getCategory(client) {
                const categoryId = this.props.navigation.getParam("id");
                const results = await client.query({query: getCategoryQuery, variables: {id: +categoryId}});
                this.setState({category: results.data.category});
        }

        async getProductsForCategory(client, category) {
            const results = await client.query({query: getProductsForCategoryQuery, variables: {category} });
            this.setState({productsForCategory: results.data.products});
        }

        render() {
                const { navigation } = this.props;
                const { category, productsForCategory } = this.state;
                return (
                        <Container>
                                <ApolloConsumer>
                                        {client => {
                                                if(client) {
                                                        try {
                                                            this.getCategory(client);
                                                            if(category) {
                                                                this.getProductsForCategory(client, category.name);
                                                                console.log('productForCategory-----------', productsForCategory);
                                                                return (
                                                                        <Content>
                                                                                <Card>
                                                                                        <CardItem cardBody>
                                                                                                <H1>{category.name}</H1>
                                                                                                <Icon name={utils.getIcon(name)} />
                                                                                        </CardItem>
                                                                                </Card>
                                                                                <Card>
                                                                                        <List>
                                                                                                <Text>Recent items in cart.</Text>
                                                                                                {/* Get category items in that same category. */}
                                                                                                {
                                                                                                    productsForCategory.length ? 
                                                                                                    productsForCategory.map(prod => <ProductItem key={prod.id} {...prod} navigation={navigation}/>)
                                                                                                    : null
                                                                                                }
                                                                                        </List>
                                                                                </Card>
                                                                        </Content>
                                                                );
                                                            }

                                                        } catch(error) {
                                                                console.log('Error---------', error);
                                                                return <Text>Error</Text>
                                                        }
                                                }

                                                return <Spinner color="blue" />
                                        }}
                                </ApolloConsumer>
                        </Container>
                );
        }
}


const styles = StyleSheet.create({
        imageItem: {
                height: 250,
                width: 250,
                marginLeft: 'auto',
                marginRight: 'auto'
        }
})

export default Category;