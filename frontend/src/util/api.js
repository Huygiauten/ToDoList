import axios from './axios.customize';

const createUserApi = async (name, email, password, role) => {
    try {
        const URL_API = "/users/register";
        const data = {
            name, email, password, role
        }
        const result = await axios.post(URL_API, data);
        return result;
    } catch (err) {
        return err;
    }
}

const loginUserApi = async (email, password) => {
    try {
        const URL_API = "/users/login";
        const data = {
            email, password
        }
        const result = await axios.post(URL_API, data);
        return result;
    } catch (err) {
        return err;
    }
}

const getUserApi = (groupId) => {
    try {
        const URL_API = `/users/groups/getUsers/${groupId}`;
        const result = axios.get(URL_API);
        return result;
    } catch (err) {
        console.log(err);
        return null;
    }
}




export {
    createUserApi,
    loginUserApi,
    getUserApi
};