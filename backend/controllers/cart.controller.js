import Product from "../models/product.model.js"; 

export const getCart = async (req,res) =>{
    try {
        const cart = await Product.find({ _id: { $in: req.user.cartItems } }); // Assuming user.cartItems contains product IDs
        
        const cartItems = cart.map(product => {
            const item = req.user.cartItems.find(cartItem => cartItem.Id === product._id.toString());
            return {...product.toJSON(),quantity:item.quantity};
        });
        res.status(200).json({ message: "Cart retrieved successfully", cart: cartItems });
    } catch (error) {
        console.error("Error in getCart Controller.",error);
        res.status(500).json({message:"Internal server error",error:error});
    }
}

export const addToCart = async (req, res) => {
    try {
        const {productId} = req.body;
        const user = req.user; // Assuming user is set in the request by auth middleware
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        const existingItems = user.cartItems.find(item => item.Id === productId);
        if(existingItems){
            existingItems.quantity += 1; // Increment quantity if item already exists
        }else{
            user.cartItems.push(productId); 
        }
        await user.save(); // Save the updated cart to the database
        res.status(201).json({ message: "Item added to cart successfully", cart: user.cartItems });
    } catch (error) {
        console.error("Error in addToCart Controller.", error);
        res.status(500).json({ message: "Internal server error", error: error });
        
    }
}

export const deleteCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user; // Assuming user is set in the request by auth middleware
        if (!productId) {
            user.cartItems = []; // Clear the entire cart if no productId is provided
        }else{
            user.cartItems = user.cartItems.filter(item => item.Id !== productId); // Remove specific item
        }
        await user.save(); // Save the updated cart to the database
        res.status(200).json({ message: "Cart updated successfully", cart: user.cartItems });
    } catch (error) {
        console.error("Error in deleteCart Controller.", error);
        res.status(500).json({ message: "Internal server error", error: error });        
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const {id:productId} = req.params; // Get product ID from request parameters
        const {quantity} = req.body; // Get new quantity from request body
        const user = req.user; // Assuming user is set in the request by auth middleware
        const cartItem = user.cartItems.find(item => item.Id === productId); // Find the item in the cart
        if(cartItem){
            if(quantity===0){
                user.cartItems = user.cartItems.filter(item => item.Id !== productId); // Remove item if quantity is 0
                await user.save(); // Save the updated cart to the database
                return res.status(200).json({ message: "Item removed from cart", cart: user.cartItems });
            }
            cartItem.quantity = quantity; // Update the quantity of the item
            await user.save(); // Save the updated cart to the database
            return res.status(200).json({ message: "Item quantity updated successfully", cart: user.cartItems });
        }else{
            return res.status(404).json({ message: "Item not found in cart" });
        }
        
    } catch (error) {
        console.error("Error in updateQuantity Controller.", error);
        res.status(500).json({ message: "Internal server error", error: error });        
    }
}