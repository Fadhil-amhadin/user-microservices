import Postgres from '../connections/connection'
import { hashPassword, comparePassword} from '../helpers/bcrypt'
import errorHandler from '../middlewares/errorHandler'
import { signToken } from '../helpers/jwt'
import joi from "joi"

class UserController {
    postgres = new Postgres()
    public async register (request: any, response: any, next: any): Promise<any> {
        try {
            const schema = joi.object({
                name: joi.string().min(3).required(),
                email: joi.string().email().min(5).required(),
                phoneNo: joi.string().min(9).required(),
                nationalId: joi.string().min(16).required(),
                password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,}$')).required()
            })

            const {error} = schema.validate(request.body)
            if (error) {
                throw { message: error.details[0].message }
            }
            let { name, email, phoneNo, nationalId, password } = request.body
            password = hashPassword(password)

            await this.postgres.query(`INSERT INTO "Users" ("name", "email", "phoneNo", "nationalId", "password") VALUES ('${name}', '${email}', '${phoneNo}','${nationalId}', '${password}');`)
            response.status(200).json({
                payload: [],
                errors: [],
                success: true
            })
        } catch (error) {
            errorHandler(error, request, response, next)
        }
    }

    public async login ( req: any, res: any, next: any) {
        try {
            const { email, password } = req.body
            const foundUser = await this.postgres.query(`SELECT * FROM "Users" WHERE email = '${email}';`)
            if (!foundUser.rows[0]) {
                throw {name: 'EmailNotRegistered'}
            }
            //check password
            const foundUserData = foundUser.rows[0]
            if (!comparePassword(password, foundUserData.password)) {
                throw {name: 'CredentialInvalid'}
            }

            const userLogin = {
                id: foundUserData.id,
                email: foundUserData.email
            }
            const token = signToken(userLogin)

            res.status(200).json({
                payload: [
                    {
                        token: {
                            accessToken: token
                        },
                        userInfo: {
                            personalInfo: {
                                email: foundUserData.email,
                                phoneNo: foundUserData.phoneNo,
                                name: foundUserData.name
                            }
                        }
                    }
                ],
                errors: [],
                success: true
            })
        } catch (error) {
            errorHandler(error, req, res, next)
        }
    }

    public async patchUser (req: any, res: any, next: any) {
        try {
            let { id, name, email, phoneNo, password } = req.body

            let container: any = {}
            if (name) container.name = name
            if (email) container.email = email
            if (phoneNo) container.phoneNo = phoneNo
            if (password) container.password = hashPassword(password)

            const foundUser = await this.postgres.query(`SELECT * FROM "Users" WHERE "id" = ${id};`)

            if (!foundUser.rows[0]) {
                throw {name: 'UserNotFound'}
            }
            !container.name ? foundUser.rows[0].name : container.name
            !container.email ? foundUser.rows[0].email : container.email
            !container.phoneNo ? foundUser.rows[0].phoneNo: container.phoneNo
            !container.password ? foundUser.rows[0].password : container.password

            let data: string[] = [
                `"name" = '${container.name}' `,
                `"email" = '${container.email}' `,
                `"phoneNo" = '${container.phoneNo}' `,
                `"password" = '${container.password}' `
            ]

            await this.postgres.query(`UPDATE "Users" SET ${data}  WHERE "id" = '${id}';`)
            const patchUser = await this.postgres.query(`SELECT * FROM "Users" WHERE "id" = '${id}';`)
            res.status(200).json({
                payload: [
                    {
                        id: patchUser.rows[0].id,
                        name: patchUser.rows[0].name,
                        email: patchUser.rows[0].email,
                        phoneNo: patchUser.rows[0].phoneNo
                    }
                ],
                errors: [],
                success: true
            })

        } catch (error) {
            errorHandler(error, req, res, next)
        }
    }

    public async deleteUser (req: any, res: any, next: any) {
        try {
            let { id } = req.body

            await this.postgres.query(`DELETE FROM "Users" WHERE id = ${id};`)

            res.status(200).json({
                payload: [],
                errors: [],
                success: true
            })
        } catch (error) {
            errorHandler(error, req, res, next)
        }
    }
}

export const userController = new UserController()