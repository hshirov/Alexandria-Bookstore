module.exports = function Basket(oldBasket) {
    this.items = oldBasket.items || [];
    this.totalQuantity = oldBasket.totalQuantity || 0;
    this.totalPrice = oldBasket.totalPrice || 0;

    this.add = function(item, id){
        let storedItem = this.items.filter(item => item.id === id)[0];

        if(!storedItem){
            storedItem = {id: id, item: item, quantity: 0, price: 0};
            this.items.push(storedItem);
        }

        storedItem.quantity++;
        storedItem.price = storedItem.item.price * storedItem.quantity;

        this.totalQuantity++;
        this.totalPrice += storedItem.item.price;
    }

    this.remove = function(id){
        const removedItem = this.items.filter(item => item.id === id)[0];
        const newItems = this.items.filter(item => item.item._id !== id); 

        this.totalQuantity -= removedItem.quantity;
        this.totalPrice -= removedItem.price;

        this.items = newItems;
    }
};