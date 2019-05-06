import React, { PureComponent } from 'react';
import { Dimensions } from 'react-native';
import { ApolloConsumer } from 'react-apollo';
import { Container, Content, Text, Header, H3, Icon } from 'native-base';
import Form from '../components/Form';
import gql from 'graphql-tag';


const createProductMutation = gql`
    mutation CreateProduct($newProduct: ProductForm) {
        createProduct(newProduct: $newProduct) {
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

const getCategoriesQuery = gql`
    query {
        categories: getAllCategorys {
            categoryId
            name
        }
    }
`;

const { width } = Dimensions.get('window');
export default class CreateProduct extends PureComponent {
    
    static navigationOptions = ({navigation}) => {
        return {
            //Set your back icon for your navigation
            headerLeft: (
                    <Header style={{width: 100, justifyContent: 'center', alignItems: 'center', marginRight: 0, textAlign: 'center'}}>
                            <Icon name="arrow-round-back" style={{justifyContent: 'center', color: 'white'}} onPress={() => navigation.goBack()}/>
                    </Header>
            ),
            //Set the title of your navigation header
            headerTitle: (
                    <Header style={{width: width, justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                            <H3 style={{color: 'white', alignSelf: 'center'}}>Create Product</H3>
                    </Header>
            ),
        }
    }

    constructor() {
        super();
        this.state = {
            categoriesList: []
        }
        this.getCategories = this.getCategories.bind(this);
    }
    
    async getCategories(client) {
        try {
            const categoriesResult = await client.query({query: getCategoriesQuery});
            this.setState({categoriesList: categoriesResult.data.categories});
            return;
        } catch(error) {
            console.log('GEt Categories Error------------', error);
        }
    }
    render() {
        const { navigation } = this.props;
        const { categoriesList } = this.state;
        return (
            <Container>
                <ApolloConsumer>
                {client => {
                    // console.log('client---------', client);
                    if(client) {
                        console.log('Create Product client------------', client);
                        this.getCategories(client);
                        return (
                            <Content>
                                {/*Pass props to create a new Product */}
                                <Form fields={['image', 'name', 'price', 'category']} type="product" client={client} gqlMutation={createProductMutation} categoriesList={categoriesList} navigation={navigation} />
                            </Content>
                        );
                    }
                }}
                </ApolloConsumer>
            </Container>
        );
    }
}