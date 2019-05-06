import React, { PureComponent } from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';
import { Button, Card, CardItem, Thumbnail, Icon, Container, Content, Left, List, Body, Header, H1,  Text, Spinner } from 'native-base';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import * as utils from '../utils';
import ProductItem from '../components/ProductItem';

const getProductQuery = gql`
        query GetProduct($id: Int) {
                product: getProduct(id: $id) {
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

const getRelatedProductQuery = gql`
    query GetRelatedProducts($category: String) {
        relatedProducts: getProductsByCategory(category: $category) {
            id
            name
            image
            price
        }
    }
`;

const { width } = Dimensions.get('window');
class Product extends PureComponent {
        constructor() {
                super();
                this.state = {
                        product: null,
                        relatedProducts: []
                };
                this.getProduct = this.getProduct.bind(this);
                this.getRelatedProducts = this.getRelatedProducts.bind(this);
        }

        static navigationOptions = ({navigation}) => {
                const productName = navigation.getParam('name');
                // header: null'
                return {
                        headerLeft: (
                                <Header style={{width: 100, justifyContent: 'center', alignItems: 'center', marginRight: 0, textAlign: 'center'}}>
                                        <Icon name="arrow-round-back" style={{justifyContent: 'center', color: 'white'}}  onPress={() => navigation.goBack()}/>
                                </Header>
                        ),
                        headerTitle: (
                                <Header style={{width: width - 50, justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                                        <H1 style={{color: 'white', alignSelf: 'center'}}>{productName} </H1>
                                </Header>
                        )
                };
        }


        async getProduct(client) {
                const productId = this.props.navigation.getParam("id");
                const results = await client.query({query: getProductQuery, variables: {id: +productId}});
                this.setState({product: results.data.product});
        }

        async getRelatedProducts(client, category) {
                const results = await client.query({query: getRelatedProductQuery, variables: { category } })
                this.setState({relatedProducts: results.data.relatedProducts});
        }

        render() {
                const { navigation } = this.props;
                const { product, relatedProducts } = this.state;
                return (
                        <Container>
                                <ApolloConsumer>
                                        {client => {
                                                if(client) {
                                                        try {
                                                                this.getProduct(client);
                                                                if(product) {
                                                                        this.getRelatedProducts(client, product.category.name);
                                                                        return (
                                                                                <Content>
                                                                                        <Card>
                                                                                                <CardItem>
                                                                                                        <Left>
                                                                                                                <Thumbnail source={{ uri: product.image }} />
                                                                                                                <Body>
                                                                                                                        <Text>{product.name}</Text>
                                                                                                                        <Text>{product.price}</Text>
                                                                                                                        <Text>{product.category.name}</Text>
                                                                                                                </Body>
                                                                                                        </Left>
                                                                                                </CardItem>
                                                                                                <CardItem cardBody>
                                                                                                        <Image style={styles.imageItem} source={{ uri: product.image }} />
                                                                                                </CardItem>
                                                                                                <CardItem>
                                                                                                        <Icon name="md-add-circle" style={styles.addIcon} />
                                                                                                        <Icon name="md-card" style={styles.addIcon} />
                                                                                                        <Icon name="md-close-circle" style={styles.closeIcon} />
                                                                                                </CardItem>
                                                                                        </Card>
                                                                                        <Card>
                                                                                                <Text>Related Items</Text>
                                                                                                <List>
                                                                                                        {/* Get category items in that same category. */}
                                                                                                        {
                                                                                                                relatedProducts.length ?
                                                                                                                relatedProducts.map(prod => <ProductItem key={prod.id} {...prod} navigation={navigation} />)
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

export default Product;