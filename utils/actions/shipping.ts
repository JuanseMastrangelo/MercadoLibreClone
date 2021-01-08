export const SHIPPING = 'SHIPPING';
export const SHIPPING_EDIT = 'SHIPPING_EDIT';
export const SHIPPING_SELECT = 'SHIPPING_SELECT';

function getAll() {
    return {
        type: SHIPPING
    }
}

function edit(item: any) {
    return {
        type: SHIPPING_EDIT,
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
    edit,
    select
}