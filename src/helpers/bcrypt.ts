import bcryptjs from 'bcryptjs'

const salt = bcryptjs.genSaltSync(10)

const hashPassword = (password: string) => {
    return bcryptjs.hashSync(password, salt)
}

const comparePassword = (password: string, hash: string) => {
    return bcryptjs.compareSync(password, hash)
}

export {
    hashPassword,
    comparePassword
}