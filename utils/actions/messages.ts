export const NOT_SEE_MESSAGES = 'NOT_SEE_MESSAGES';

function notSeeMessages(items: any) {
    return {
        type: NOT_SEE_MESSAGES,
        payload: items
    }
}


export const actionCreators = {
    notSeeMessages
}