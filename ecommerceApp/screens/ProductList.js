import React, { PureComponent } from 'react';
import { Dimensions } from 'react-native';
import { ApolloConsumer } from 'react-apollo';
import graphql from 'graphql';
import gql from 'graphql-tag';
import { Container, Content, List, Spinner, View, H1, H3, Header } from 'native-base';
import ProductItem from '../components/ProductItem';

const getProductsQuery = gql`
query GetProducts{
    products: getAllProducts {
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

const { width } = Dimensions.get('window');

export default class ProductList extends PureComponent {

    static navigationOptions = ({navigation}) => {
        return {
            tabLabel: 'Products',
            headerLeft: null,
            headerTitle: (
                <Header style={{width: width, justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                    <H1 style={{color: 'white', alignSelf: 'center'}}>Products</H1>
                </Header>
            )
        }

    }

    constructor() {
        super();
        this.state = {
            list: []
        }
        this.getList = this.getList.bind(this);
    }

    async getList(client) {
        console.log('client method-------------------', client);

        const results = await client.query({query: getProductsQuery});
        this.setState({list: results.data.products});
            

    }

    render() {
        const { list } = this.state;
        const { navigation } = this.props;
        // if(doRefetch && this.client)
        return (
            <Container>
                <Content>
                    <ApolloConsumer>
                        {(client) => {
                            if(client) {
                               
                                try {
                                    this.getList(client);
                                    if(Array.isArray(list)) {
                                        return (
                                            <List>
                                                {list.map(item => {
                                                    return <ProductItem key={item.id} {...item} navigation={navigation} />
                                                })}
                                            </List>
                                        );
                                    } else {
                                        return <H3>No Products for Sale!</H3>
                                    }
                                    
                                } catch(error) {
                                    console.log('Error-------', error);
                                    return <H3>{JSON.stringify(error)}</H3>
                                }
                            }
                            return <Spinner color="blue" />

                        }}
                    </ApolloConsumer>
                </Content>
            </Container>
        );
    }
}