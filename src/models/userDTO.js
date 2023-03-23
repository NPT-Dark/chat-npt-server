const {v4 : newID} = require("uuid")
const { CreateToken, HashPassword } = require("../services/secret")
const createUserDTO = async (request) =>{
    const idUser = newID()
    const token = await CreateToken(idUser)
    const passwordHash = await HashPassword(request.password)
    const newUser = {
        id:idUser,
        avatar:request.avatar,
        firstName: request.firstname,
        lastName: request.lastname,
        gender: request.gender,
        age:request.age,
        userName: request.username,
        passWord: passwordHash,
        email: request.email,
        token : token,
        createAt: new Date().getTime(),
        updateAt: new Date().getTime()
    }
    return newUser
}
module.exports = {createUserDTO}