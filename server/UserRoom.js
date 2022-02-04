const users = [];
 
const addUser = ({id, name, email, room}) => {
    const user = {id,name, email, room};
 
    users.push(user);
    return {user};
 
}
 
const removeUser = (id) => {
    var user

    users.forEach(function (item, index) {
        if(item.id === id){
            user = item;
            users.splice(index,1);
        }
    });
    return user;
}
 
const getUser = (id) => users
        .find((user) => user.id === id);
 
const getUsersInRoom = (room) => users
        .filter((user) => user.room === room);
 
module.exports = {addUser, removeUser,
        getUser, getUsersInRoom};