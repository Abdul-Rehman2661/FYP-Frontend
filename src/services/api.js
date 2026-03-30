import axios from "axios";

const API = axios.create({
    baseURL : "http://localhost/ComputerArchitectureToolkitAPI/api"
});

export default API;