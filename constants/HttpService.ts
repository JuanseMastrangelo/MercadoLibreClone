import AsyncStorage from "@react-native-community/async-storage";
import { Toast } from "native-base";
import { authKey, urlApi } from "./KeyConfig";

export class HttpService {

    header: any = null;
    constructor() {
        this.getUserData();
    }

    init (callback: any) {
        callback.bind(this)();
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

    public get(url: string) {
        return fetch(urlApi + url, {
            method: 'get',
            headers: this.header
        }).catch(error => { this.showError(); });
    }
    

    public post(url: string, body: Object, headers?: any) {
        console.log(this.header);
        return fetch(urlApi + url, {
            method: 'post',
            headers: headers ? headers : this.header,
            body: JSON.stringify(body)
        }).catch(error => { this.showError(); });
    }


    private showError() {
        Toast.show({
            text: 'Ocurrió un error. Intentelo nuevamente',
            type: 'danger',
            position: 'top',
        })
    }
}
