import axios from "axios";



export const request = axios.create({
    baseURL: 'http://192.168.50.110:5004'
})