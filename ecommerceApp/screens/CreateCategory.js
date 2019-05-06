import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { ApolloConsumer } from 'react-apollo';
import { Container, Content, Body, Text, Header, H3, Icon } from 'native-base';
import Form from '../components/Form';
import gql from 'graphql-tag';

const createCategoryMutation = gql`
    mutation CreateCategory($newCategory: String) {
        createCategory(newCategory: $newCategory) {
            categoryId
            name
        }
    }
`;

const { width } = Dimensions.get('window');
export default class CreateCategory extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            // Set the back icons for your navigation header.
            headerLeft: (
                    <Header style={{width: 100, justifyContent: 'center', alignItems: 'center', marginRight: 0, textAlign: 'center'}}>
                            <Icon name="arrow-round-back" style={{justifyContent: 'center', color: 'white'}} onPress={() => navigation.goBack()}/>
                    </Header>
            ),
            // Set the title of your navigation header.
            headerTitle: (
                    <Header style={{width: width, justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                            <H3 style={{color: 'white', alignSelf: 'center'}}>Create Category</H3>
                    </Header>
            )
        }
    }

    render() {
        const { navigation } = this.props;
        return (
            <Container>
                <ApolloConsumer>
                {client => {
                    if(client) {
                        return (
                            <Content>
                                {/*Pass required props to your form in order to create a new category. */}
                                <Form fields={['name']} type="category" client={client} gqlMutation={createCategoryMutation} navigation={navigation} />
                            </Content>
                        );
                    }
                }}
                </ApolloConsumer>
            </Container>
            
        );
    }
}