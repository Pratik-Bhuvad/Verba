const dataExists = async (data, model) => {
    try {

        if (model.modelName === 'User') {
            const existingUser = await model.findOne({
                $or: [
                    { username: data.username },
                    { email: data.email }
                ]
            })
            if (!existingUser) {
                return {
                    exists: false,
                    usernameExists: false,
                    emailExists: false
                }
            }

            return {
                exists: true,
                usernameExists: existingUser.username === data.username,
                emailExists: existingUser.email === data.email,
                data:existingUser
            }
        }
        else if(model.modelName === 'Blog'){
            const existingBlog = await model.findOne({ title: data.title, author: data.id})
            return {
                exists: !!existingBlog,
                data: existingBlog || null,
                title: existingBlog ? existingBlog.title : null
            }
        }
        else {
            return { exists: false}
        }
    } catch (error) {
        console.log("Database query error:", error.message);
        throw error
    }
}

module.exports = dataExists