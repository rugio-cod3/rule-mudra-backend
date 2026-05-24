import { getKnexInstance } from '@/utils/mysql'
import { ICustomerLeadDetails } from '../interfaces/experian.interface'

export async function getCustomerDetails(leadID: number): Promise<ICustomerLeadDetails> {
    const db = getKnexInstance()

    const result = await db('customer as c')
        .join('leads as l', 'l.customerID', 'c.customerID')
        .leftJoin('address as a', 'a.customerID', 'c.customerID')
        .select(
            'c.customerID',
            'c.firstName',
            'c.lastName',
            'c.middlename',
            'c.gender',
            'c.pancard',
            'c.mobile',
            'c.email',
            'a.address',
            'a.city',
            'a.state',
            'a.pincode',
            'c.dob'
        )
        .where('l.leadID', leadID)
        .orderBy('a.addressID', 'desc')
        .first()

    if (!result) {
        throw new Error('Customer details not found')
    }

    return result
}