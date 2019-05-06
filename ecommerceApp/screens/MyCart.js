import React, { Component } from 'react';
import {Container, Content, Text } from 'native-base';
import ProductItem from '../components/ProductItem';

export default class MyCart extends Component {
    constructor() {
        super();
        this.state = {
            cart: []
        }
    }

    async componentDidMount() {
        const cart = await fetch('http://localhost:10000/myCart', {method: 'GET', headers: { 'Content-Type': 'application/json' } })
        this.setState({cart});
    }

    render() {
        return (
            <Container>
                <Content>
                    <Text>My Cart</Text>
                    {this.state.cart.length ? this.state.cart.map(item => <ProductItem {...item} />) : <Text>No items in Cart.</Text>}
                </Content>
            </Container>
        );
    }
}