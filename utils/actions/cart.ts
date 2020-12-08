export const CART_PRODUCTS = 'CART_PRODUCT';
export const CART_ADD_PRODUCT = 'CART_ADD_PRODUCT';
export const CART_REMOVE_PRODUCT = 'CART_REMOVE_PRODUCT';

function getAllProducts() {
    return {
        type: CART_PRODUCTS
    }
}

function addProduct(item: any) {
    return {
        type: CART_ADD_PRODUCT,
        payload: item
    }
}

function removeProduct(index: number) {
    return {
        type: CART_REMOVE_PRODUCT,
        payload: index
    }
}

export const actionCreators = {
    getAllProducts,
    addProduct,
    removeProduct
}