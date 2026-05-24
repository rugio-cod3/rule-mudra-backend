import { NotFoundError } from '../errors'
import { ICustomerLeadDetails } from '../interfaces/customer.interface'
import { getKnexInstance } from '../utils/mysql'

export const getCustomerDetails = async (leadID: number): Promise<ICustomerLeadDetails> => {
  const db = getKnexInstance()
  const details: ICustomerLeadDetails = await db('leads as l')
    .select([
      'c.customerID',
      'c.firstName',
      'c.middlename',
      'c.lastName',
      'c.gender',
      'c.pancard',
      'c.dob',
      'c.mobile',
      'c.email',
      'l.leadID',
      'l.monthlyIncome',
      'l.salaryMode',
      'ad.address',
      'ad.city',
      'ad.state',
      'ad.pincode',
      db.raw(
        '(SELECT GROUP_CONCAT(employerName ORDER BY employerID DESC) FROM employer WHERE customerID = c.customerID) as employer_list',
      ),
    ])
    .join('customer as c', 'l.customerID', '=', 'c.customerID')
    .join('address as ad', function () {
      this.on('l.customerID', '=', 'ad.customerID').andOn(
        'ad.addressID',
        '=',
        db.raw('(SELECT MAX(addressID) FROM address WHERE customerID = l.customerID)'),
      )
    })
    // .whereIn('l.status', ['Fresh Lead', 'Document Received'])
    .where('l.leadID', leadID)
    .groupBy([
      'c.customerID',
      'c.firstName',
      'c.middlename',
      'c.lastName',
      'c.gender',
      'c.pancard',
      'c.dob',
      'c.mobile',
      'c.email',
      'l.leadID',
      'l.monthlyIncome',
      'l.salaryMode',
      'ad.address',
      'ad.city',
      'ad.state',
      'ad.pincode',
    ])
    .orderBy('l.leadID', 'desc')
    .limit(1)
    .first()

  if (!details) throw new NotFoundError('Customer Data Not Found')

  return details
}
