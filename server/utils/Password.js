const bcrypt = require('bcrypt')

const hashing = async (password) => {
    try {
        const salt = await bcrypt.genSalt(15)
        const hashedpassword = await bcrypt.hash(password, salt)
        return hashedpassword
    } catch (error) {
        console.log("Issue in hashing Password", error.message);
        throw error
    }
}

const compare = async (password, userPassword) => {
    try {
        const flag = await bcrypt.compare(password, userPassword)
        return flag
    } catch (error) {
        console.log("Issue in Comparing Password", error.message);
        throw error
    }
}

module.exports = {
    hashing,
    compare
}