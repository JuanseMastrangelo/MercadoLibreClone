export const SHIPPING = 'SHIPPING';
export const SHIPPING_SET = 'SHIPPING_SET';
export const SHIPPING_SELECT = 'SHIPPING_SELECT';

function getAll() {
    return {
        type: SHIPPING
    }
}

function setShipping(item: any) {
    return {
        type: SHIPPING_SET,
        payload: item
    }
}

function select(index: number) {
    return {
        type: SHIPPING_SELECT,
        payload: index
    }
}


export const actionShipping = {
    getAll,
    setShipping,
    select
}