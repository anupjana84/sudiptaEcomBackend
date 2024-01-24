class UserDto{
    _id;
    name;
    email;
    
    createdAt;
    updatedAt;
    constructor(user){
        this._id=user._id;
        this.name=user.name;
        this.email=user.email;
      
        this.createdAt=user.createdAt;
        this.updatedAt=user.updatedAt;
    }
}
export {UserDto}