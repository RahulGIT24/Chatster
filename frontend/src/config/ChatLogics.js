export const getSender = (loggedUser, users, setFetchAgain)=>{
    if (users?.length) {
        // Check if the ID of the first user is equal to the ID of the logged-in user
        return users[0]._id === loggedUser.sendUser.id ? users[1].name : users[0].name;
    }
    setFetchAgain(true);
}