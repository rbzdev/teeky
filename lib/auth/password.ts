import bcrypt from 'bcryptjs'

const ROUNDS = 10

export async function hashPassword(plain: string): Promise<string> {
  if (!plain || plain.length < 6) throw new Error('Password trop court (min 6)')
  return await bcrypt.hash(plain, ROUNDS)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (!plain || !hash) return false
  return await bcrypt.compare(plain, hash)
}
