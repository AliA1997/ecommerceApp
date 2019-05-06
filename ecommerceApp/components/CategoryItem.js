import React from 'react';
import { Button, Card, CardItem, Text, Icon, SwipeRow } from 'native-base';
import * as utils from '../utils';

const CategoryItem = ({categoryId, name, navigation, isAdmin, onDelete}) => {
    if(isAdmin)
        return (
            <Card>
                <SwipeRow 
                        rightOpenValue={75}
                        body={
                            <CardItem button onPress={() => navigation.push('Category', { id: categoryId, name, isAdmin })}>
                                <Icon name={utils.getIcon(name)} />
                                <Text>{name}</Text>
                            </CardItem>
        
                        }
                        right={<Button style={{backgroundColor: 'red'}} onPress={() => onDelete(id)}><Icon color="white" name="trash"/></Button>}
                />
            </Card>
        );
    else 
        return (    
            <Card>
                <CardItem button onPress={() => navigation.push('Category', { id: categoryId, name })}>
                    <Icon name={utils.getIcon(name)} />
                    <Text>{name}</Text>
                </CardItem>
            </Card>
        );
};

export default CategoryItem;