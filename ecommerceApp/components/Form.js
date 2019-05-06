import React, { PureComponent } from 'react';
import { Container, Header, Content,  Form, Item, Label, Text, Input, Button, Picker, Root } from 'native-base';
import Toast, {DURATION} from 'react-native-easy-toast'
import gql from 'graphql-tag';
import _ from 'lodash';
import * as utils from '../utils';

//Define a getQuery for all your product since you will be defining a optimsticResponse to update your cache's query, therefore will update the ui.
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

const getCategories = gql`
query {
    categories:getAllCategorys {
      name
      categoryId
    }
}
`;

export default class FormReusable extends PureComponent {
    constructor() {
        super();
        this.state = {
            client: null, 
            form: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }


    componentDidMount() {
        const copyForm = Object.assign({}, this.state.form);
        this.props.fields.forEach(field => copyForm[field] = '');
        this.setState({form: copyForm});
    }

    static getDerivedStateFromProps(props, state) {

        //If the form state is null return  or set the state of the form to an empty object.
        if(state.form === null)
            return { form: {} }

        //If the client state is null, and the props aren't then set the state of the client to the props.
        if(state.client === null && props.client)  
           return { client: props.client };
        
        return state;
    }

    handleChange(value, field) {
        const copyForm = utils.deepCopy(this.state.form);
        if(field === 'price') 
            copyForm['price'] = !Number.isNaN(parseInt(value)) ?  parseInt(value) : copyForm['price'];
        else 
            copyForm[field] = value;
        
        this.setState({form: copyForm});
    
        return;
    }

    async onSubmit() {
        const { form, client } = this.state;

        const { fields, gqlMutation } = this.props;

                
        for(let i = 0; i < fields; i++) {
            if(!form[fields[i]])
                return;
        }
        
        
        if(client) {
            try {
                const { navigation, type } = this.props;
                
                const cacheQuery = type === 'product' ? getProductsQuery : getCategories;

                const mutationOptions = utils.returnMutateOptions('create', gqlMutation, type, form, cacheQuery);
        
                await client.mutate(mutationOptions);

                navigation.push('Admin', { refetch: true });
                
                if(type === 'product') {
                
                    Toast.show({
                        text: `New Product Created!`,
                        type: 'success',
                        position: 'top',
                        duration: 2000
                    });

                    
                } else {
                    
                    
                } 
                navigation.push('Admin', { refetch: true });
            } catch(error) {
                console.log('Submit Product Error----------', error);
            }
        } 
        
        return;
    }


    render() {
        const { fields, type, categoriesList } = this.props;  
        const { form } = this.state;
        return (
            <Container>
                <Content>
                    <Form>
                    {fields.map((field, i) => {
                        
                        if(field === 'category' && type === 'product')
                            return (  
                                   <Picker 
                                        key={i}
                                        dropdown
                                        style={{width: undefined}}
                                        selectedValue={form['category'] ? form['category'] : ''}
                                        onValueChange={(text) => this.handleChange(text, 'category')}
                                    >
                                        {
                                            categoriesList && categoriesList.length ? 
                                            categoriesList.map(cat => <Picker.Item key={cat.categoryId} label={cat.name} value={cat.name} />)
                                            : <Picker.Item key={100} label="N/A" value="" />
                                        }

                                    </Picker>
                            );

                            return (
                                <Item key={i} floatingLabel>
                                    <Label>{field}</Label>
                                    {field == 'price' ?
                                        <Input onChangeText={text => this.handleChange(text, field)} value={`${form[field]}`} keyboardType="number-pad"/>
                                        : <Input onChangeText={text => this.handleChange(text, field)} value={`${form[field]}`}/>
                                    }
                                </Item>
                            )
                        })}

                        <Root>
                            <Button success rounded onPress={() => this.onSubmit()} style={{marginTop: 10}}>
                                <Text>Create a {_.capitalize(type)}</Text>
                            </Button>
                        </Root>

                    </Form>
                </Content>
            </Container>
        );
    }
}