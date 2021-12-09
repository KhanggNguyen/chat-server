const users = [];

const addUser = ({id, name, room}) => {
    name = name.trim().toLowerCase(); 
    room = room.trim().toLowerCase();
    
    console.log({id,name,room});

    const userExists = users.find((user) => user.room === room && user.name === name);

    if(!name || !room) return { error: 'Username and room are required.' };

    if(userExists) return { error: 'This username has been taken'};
    

    const user = { id, name, room };

    users.push(user);
    
    return { user };
}

const removeUser = (id) => {
    const idx = users.findIndex( (user) => user.id === id);
    
    if(idx !== -1) return users.splice(idx, 1)[0];
    
}

const getUser = (id) => users.find( (user) => user.id === id);


const getUsers = (room) => users.filter( (user) => user.room === room);


module.exports = { addUser, removeUser, getUser, getUsers };