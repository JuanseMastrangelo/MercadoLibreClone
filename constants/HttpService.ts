import AsyncStorage from "@react-native-community/async-storage";
import { Toast } from "native-base";
import { authKey, urlApi } from "./KeyConfig";

export class HttpService {

    header: any = null;
    constructor() {
        this.getUserData();
    }

    private async getUserData() {
        const userData = await AsyncStorage.getItem(authKey)
        const userId = JSON.parse(userData!).token;
        this.header = new Headers({
            'Authorization': 'Bearer '+ userId,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })
    }


    public get(url: string, headers?: any) {
        return fetch(urlApi + url, {
            method: 'get',
            headers: headers ? headers : this.header,
        }).catch(error => { this.showError(error); });
    }
    

    public post(url: string, body: Object, headers?: any) {
        return fetch(urlApi + url, {
            method: 'post',
            headers: headers ? headers : this.header,
            body: JSON.stringify(body)
        }).catch(error => { this.showError(error); });
    }
    

    public delete(url: string) {
        return fetch(urlApi + url, {
            method: 'delete',
            headers: this.header
        }).catch(error => { this.showError(error); });
    }


    private showError(error: any) {
        // console.log(error);
        Toast.show({
            text: 'Ocurrió un error. Intentelo nuevamente',
            type: 'danger',
            position: 'top',
        })
    }
}
