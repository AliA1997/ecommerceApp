const id = 0;
module.exports = {
    myCart(req, res) {
        console.log('req-------', req.session.cart);
        if(req.session.cart) {
            const { cart } = req.session;
            res.end({
                cart
            })
        } else {
            req.session.cart = [];
            console.log('req.session.cart------', req.session.cart)
            res.json({
                cart: req.session.cart
            })
        }
    },
    addToMyCart(req, res) {
        if(req.body.product) 
            req.session.cart.push(req.body.product);
        
        res.json({
            cart: req.session.cart,
        })
    },
    removeFromCart(req, res) {
        const { id } = req.params;
        if(id) 
            req.session.cart = cart.filter(item => item.id == id);
    
        res.json({
            cart: req.session.cart
        })
    }
}