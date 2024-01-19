import { User } from "../models/user.js";

const userFindService=(id)=>{
    return User.findById(id);

}

export {userFindService}