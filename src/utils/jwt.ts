import jwt from 'jsonwebtoken'

const signToken = (payload: any, privateKey: string, options?: jwt.SignOptions) => {
  jwt.sign(payload, privateKey, options, (error, token) => {
    if (error) {
      throw rejects(error)
    }
    return token
  })
}
