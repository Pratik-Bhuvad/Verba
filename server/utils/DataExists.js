const dataExists = async (data, model) => {
    try {
        if (model === 'User') {
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
        }
        else {
            const existingBlog = await model.findOne({ title: data.title })
            if (existingBlog?.author.toString() === data.id.toString()) return existingBlog
            return false
        }
    } catch (error) {
        console.log("Database query error:", error.message);
        throw error
    }
}

module.exports = dataExists