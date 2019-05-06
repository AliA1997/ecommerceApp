import _ from 'lodash';

export function deepCopy(obj) {
    const newObj = {};
    const keys = Object.keys(obj);
    for(let i = 0; i < keys.length; i++) {
        if(typeof obj[keys[i]] == 'object') 
            newObj[keys[i]] = deepCopy(obj[keys[i]]);
        else 
            newObj[keys[i]] = obj[keys[i]];
    }

    return newObj;
}

export function cutText(text) {
    if(text.length > 20) {
        return text.slice(0, 17) + '...';
    }
    return text;
}

export function formatPrice(price) {
    if(Number.isInteger(price)) {
        return `$ ${price}.00`
    }
    return `$ ${price}`;;
}

export function getIcon(name) {
    const nameLowercase = name.toLowerCase();
    let returnValue;
    switch(nameLowercase) {
        case 'houseware':
            returnValue = 'wine';
            break;
        case 'clothing':
            returnValue = 'shirt';
            break;    
        case 'office':
            returnValue = 'paper';
            break;
        case 'food':
            returnValue = 'nutrition';
            break;
        case 'sports gear':
            returnValue = 'bicycle';
            break;
        case 'electronics':
            returnValue = 'logo-apple';
            break;
            
        default:
            return returnValue;
        }
        return returnValue;

}

export function returnMutateOptions(type, mutation, tableToUpdate, body, tableQuery) {
    let returnOptions = {
        mutation 
    };

    console.log('body---------', body);
    console.log('tableToUpdate---------', tableToUpdate);

    if(type === 'create' && tableToUpdate === 'product') 
        //So the newly created product will be called createdProduct or createdCategory
        //Have it's type be set towards product or category, and since we are not updating, or deleting a product or category, we will pass an id of null.
        returnOptions['variables'] = { [`new${_.capitalize(tableToUpdate)}`]: body }
    else if(type === 'create' && tableToUpdate === 'category') 
        returnOptions['variables'] = { [`new${_.capitalize(tableToUpdate)}`]: body.name }
    else if(type === 'update' && tableToUpdate === 'product')
        returnOptions['variables'] = { id: body.id, [`updated${_.capitalize(tableToUpdate)}`]: body }
    else if(type === 'update' && tableToUpdate === 'category') 
        returnOptions['variables'] = { categoryId: body.categoryId, [`updated${_.capitalize(tableToUpdate)}`]: body }
    else if(type === 'delete')
        returnOptions['variables'] = { id: body.id }

    if(type === 'delete')
        returnOptions['optimisticResponse'] = {
            __typename: 'Mutation',
            [`${type}${_.capitalize(tableToUpdate)}`]: {
                __typename: `${_.capitalize(tableToUpdate)}`,
                ...body,
            }
        };
    else if(type !== 'delete' && tableToUpdate === 'product')
        returnOptions['optimisticResponse'] = {
            __typename: 'Mutation',
            [`${type}${_.capitalize(tableToUpdate)}`]: {
                __typename: `${_.capitalize(tableToUpdate)}`,
                id: null, 
                ...body,
            }
        };
    else 
        returnOptions['optimisticResponse'] = {
            __typename: 'Mutation',
            // [`${type}${_.capitalize(tableToUpdate)}`]: {
            //     __typename: `${_.capitalize(tableToUpdate)}`,
            //     categoryId: null, 
            //     ...body,
            // }
            createCategory: {
                __typename: 'Category',
                categoryId: null,
                name: body.name
            }
        };
    
    //In your optimisticResponse argument, pass a typename which would be mutation, then pass a property you would use to add to your cache of currentItems.
    if(tableToUpdate === 'product') 
        returnOptions['optimisticResponse'][`${type}${_.capitalize(tableToUpdate)}`]['category'] = {
            __typename: 'Category',
            categoryId: null,
            name: body.category    
        };
  

    //Have your update method which would be responsible for updating the cache to be a callback.
    //Containing a proxy which is the client, then get the createdProduct from the data object.
    returnOptions['update'] = async (proxy, { data }) => {

                                const mutationResult = data[`${type}${_.capitalize(tableToUpdate)}`];

                                console.log('mutationResult--------', mutationResult);
                                //Read from teh cache using the getProductsQuery
                                let results = await proxy.readQuery({query: tableQuery});

                                if(type === 'delete') {
                                    
                                    const mutationResultString = mutationResult ? `${mutationResult}` : '';

                                    const mutationResultId = mutationResultString ? mutationResultString.match(/[0-9]/g).join('') : '';

                                    const productDeletedId = mutationResultId ? parseInt(mutationResultId) : -1;

                                    console.log(productDeletedId);

                                    const playerToRemoveIndex = results[`${tableToUpdate}s`].findIndex(prod => prod.id === productDeletedId)

                                    //Check if the results returned from querying the cache contains the items you want to add, if it doesn't add to results to write to cache.                                    
                                    if(productDeletedId != -1)
                                        results[`${tableToUpdate}s`].splice(playerToRemoveIndex, 1);

                                        console.log(results[`${tableToUpdate}s`]);                                    
 
                                } else if(tableToUpdate === 'category') {
                                    console.log('results------------', results)
                                    //Check if the results returned from querying the cache contains the items you want to add, if it doesn't add to results to write to cache.
                                    if(results[`categories`].length && !results[`categories`].some(item => item.name === mutationResult.name)) 
                                        results[`categories`].push(mutationResult);
                                    else if(!results[`categories`].length)
                                        results[`categories`] = [ mutationResult ] 
                                
                                } 

                                //Then push the createdProduct to the currentList of products
                                //THen rewrite the query to your cache, using your new results.
                                await proxy.writeQuery({ query: tableQuery, data: results['categories'] });
                            };
    console.log('returnOptions--------', returnOptions);

    return returnOptions;
    
}