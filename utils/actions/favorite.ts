export const FAVORITE_PRODUCTS = 'FAVORITE_PRODUCTS';
export const FAVORITE_ADD_PRODUCT = 'FAVORITE_ADD_PRODUCT';
export const FAVORITE_REMOVE_PRODUCT = 'FAVORITE_REMOVE_PRODUCT';
export const FAVORITE_CLEAN = 'FAVORITE_CLEAN';
export const FAVORITE_FORCE = 'FAVORITE_FORCE';

function getAllFavorites() {
    return {
        type: FAVORITE_PRODUCTS
    }
}

function favoriteAdd(item: any) {
    return {
        type: FAVORITE_ADD_PRODUCT,
        payload: item
    }
}

function favoriteRemove(index: number) {
    return {
        type: FAVORITE_REMOVE_PRODUCT,
        payload: index
    }
}

function favoriteForce(index: number) {
    return {
        type: FAVORITE_FORCE,
        payload: index
    }
}

function cleanFavorite() {
    return {
        type: FAVORITE_CLEAN
    }
}

export const actionCreators = {
    getAllFavorites,
    favoriteAdd,
    favoriteRemove,
    favoriteForce,
    cleanFavorite
}