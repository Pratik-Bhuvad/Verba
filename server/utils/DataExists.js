const dataExists = async (data, model) => {
    try {
        const existingUser = await model.findOne({
            $or: [
                { username: data.username },
                { email: data.email }
            ]
        })
        if (!existingUser) {
            return { exists: false }
        }

        return {
            exists: true,
            usernameExists: existingUser.username === data.username,
            emailExists: existingUser.email === data.email
        }
    } catch (error) {
        console.log("Database query error:", error.message);
        throw error
    }
}

module.exports = dataExists