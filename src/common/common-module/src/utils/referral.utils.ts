import { ReferrarModel } from '../database/mysql/referrar'

export class ReferralUtils {
  private readonly referralModel = ReferrarModel.getInstance()
  private static instance: ReferralUtils

  private constructor() {}

  static getInstance(): ReferralUtils {
    if (!this.instance) {
      this.instance = new ReferralUtils()
    }

    return this.instance
  }

  async generateReferralCode(length = 6) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ1234567890' // Exclude ambiguous chars
    const codeLength = length
    let code: string
    let exists: boolean

    do {
      code = Array.from({ length: codeLength }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length)),
      ).join('')

      // Check uniqueness in DB
      const found = await this.referralModel.findOne({
        where: { referral_code: code },
        select: ['id'],
      })
      exists = !!found
    } while (exists)

    return code
  }
}
