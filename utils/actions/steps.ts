export const HOME_STEP = 'HOME_STEP';

function homeStep(show: boolean) {
    return {
        type: HOME_STEP,
        payload: show
    }
}


export const actionCreators = {
    homeStep
}