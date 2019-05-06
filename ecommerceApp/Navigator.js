import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import Admin from './screens/Admin';
import CreateProduct from './screens/CreateProduct';
import CreateCategory from './screens/CreateCategory';
import ProductList from './screens/ProductList';
import Product from './screens/Product';
import Category from './screens/Category';
import MyCart from './screens/MyCart';



const ProductStackNavigator = createStackNavigator(
    {
        ProductList: ProductList, 
        Product: Product 
    },
    {
        initialRouteName: 'ProductList',
        headerBackTitleVisible: true
    }
);

const AdminStackNavigator = createStackNavigator(
    {
        Admin: Admin,
        CreateProduct: CreateProduct,
        CreateCategory: CreateCategory,
        Product: Product, 
        Category: Category
    },
    {
        initialRouteName: 'Admin',
        headerBackTitleVisible: true
    }
);

const MyCartNavigator = createStackNavigator(
    {
        MyCart: MyCart,
        Product: Product
    },
    {
        initialRouteName: 'MyCart',
        headerBackTitleVisible: true
    }
);

const TabNavigator = createBottomTabNavigator(
    {
        Products: {
            screen: ProductStackNavigator
        },
        Admin: {
            screen: AdminStackNavigator
        },
        MyCart: {
            screen: MyCartNavigator,
        
        }
    },
    {
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
            showIcon: true,
        },   
    }
);

export default createAppContainer(TabNavigator);