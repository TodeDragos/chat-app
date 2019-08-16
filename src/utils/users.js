const users = []

function addUser ({ id, username, room}) {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room)
    {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find( (user) => {
        return user.room === room && user.username === username
    })

    // Validate usernam
    if (existingUser){
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room}
    users.push(user)
    return { user }
}

function removeUser (id){
     const index = users.findIndex((user) => user.id === id)

     if (index !== -1)
        return users.splice(index, 1)[0]
}

function getUser (id) {
    return users.find((user) => user.id === id)
}

function getUserInRoom (room) {
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}