import React from 'react';
import { Card, CardItem, Container, Content, Text, Thumbnail, Left, Right, Body, Icon,  SwipeRow, Button } from 'native-base';
import * as utils from '../utils';

const ProductItem = ({id, name, image, price, category, isAdmin, adminClient, navigation, onDelete}) => {
        if(isAdmin) 
                return (
                        <Card>
                                <SwipeRow 
                                        rightOpenValue={75}
                                        body={
                                                <CardItem button onPress={() => navigation.push('Product', {id: id, name, isAdmin})}>
                                                        <Left>
                                                                <Thumbnail source={{uri: image}} />
                                                        </Left>
                                                        <Body>
                                                                <Text>{utils.cutText(name)}</Text>
                                                                <Text>{utils.formatPrice(price)}</Text>
                                                        </Body>
                                                        {
                                                                category && category.name ? 
                                                                        <Right>
                                                                                <Text>Category: {category.name}</Text>
                                                                        </Right>
                                                                        : null
                                                        }
                                                </CardItem>
                        
                                        }
                                        right={<Button style={{backgroundColor: 'red'}} onPress={() => onDelete(adminClient, id)}><Icon color="white" name="trash"/></Button>}
                                />
                        </Card>
                );
        else 
                return (
                        <Card>
                                <CardItem button onPress={() => navigation.push('Product', {id: id, name})}>
                                        <Left>
                                                <Thumbnail source={{uri: image}} />
                                        </Left>
                                        <Body>
                                                <Text>{utils.cutText(name)}</Text>
                                                <Text>{utils.formatPrice(price)}</Text>
                                        </Body>
                                        {
                                                category && category.name ?
                                                <Right>
                                                        <Text>Category: {category.name}</Text>
                                                </Right>
                                                : null
                                        }
                                </CardItem>
                        </Card>
                );
}
 



export default ProductItem;