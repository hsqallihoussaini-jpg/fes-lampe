import jwt from 'jsonwebtoken'
import type { NextApiRequest } from 'next'

const COOKIE_NAME = 'admin_token'

export function signAdmin(){
  const secret = process.env.ADMIN_JWT_SECRET || 'dev_secret'
  return jwt.sign({ admin: true }, secret, { expiresIn: '7d' })
}

export function verifyAdminToken(token: string){
  try{
    const secret = process.env.ADMIN_JWT_SECRET || 'dev_secret'
    return jwt.verify(token, secret)
  }catch(e){
    return null
  }
}

export function getAdminTokenFromReq(req: NextApiRequest){
  const cookie = req.headers.cookie
  if(!cookie) return null
  const match = cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE_NAME+'='))
  if(!match) return null
  return match.split('=')[1]
}
