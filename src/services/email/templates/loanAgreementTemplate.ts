
interface LoanRecord {
  leadID: number
  customerID: number
  loanNo: string
  disbursalAmount: number
  disbursalDate: string
}

interface CustomerRecord {
  customerID: number
  name: string
  email: string
  mobile: string
}

export class LoanAgreementTemplate {
  public generateHTML(
    loan: LoanRecord,
    customer: CustomerRecord,
    hasSanctionLetter: boolean = false,
    lenderId?: number
  ): string {
    const currentYear = new Date().getFullYear()
    const formattedAmount = loan.disbursalAmount.toLocaleString('en-IN')
    const attachmentText = hasSanctionLetter
      ? 'Please find attached your loan agreement document and sanction letter for your records.'
      : 'Please find attached your loan agreement document for your records.'

    return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
  <title>Loan Agreement - Yashik Finlease</title>
  <style>
    a { text-decoration: none; }
    .hover-underline:hover { text-decoration: underline !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
    @media (prefers-color-scheme: dark) {
      .bg-body { background-color: #0b0b0c !important; }
      .bg-card { background-color: #111114 !important; }
      .text { color: #eaeaec !important; }
      .muted { color: #b5b6ba !important; }
      .btn { background-color: #2563eb !important; }
    }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .px { padding-left: 16px !important; padding-right: 16px !important; }
      .py { padding-top: 24px !important; padding-bottom: 24px !important; }
      .logo { margin-bottom: 12px !important; }
    }
  </style>
</head>
<body class="bg-body" style="margin: 0; padding: 0; background-color: #f4f5f7">
  <center style="width: 100%; background: #f4f5f7">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px" class="container">
      <tr>
        <td align="center" valign="top" style="padding: 24px 12px">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
            style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);" class="bg-card">
            <!-- Header / Logo -->
            <tr>
              <td align="center" style="padding: 28px 32px 0 32px">
                <img class="logo" src="https://nexiloans.com/images/logo.png" width="100" height="auto" alt="Yashik Finlease" border="0"
                  style="display: block; height: auto; border: 0; outline: none; text-decoration: none" />
              </td>
            </tr>
            <!-- Title -->
            <tr>
              <td align="left" style="padding: 28px 25px 10px 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                font-size: 22px; line-height: 32px; color: #111827;" class="text px">
                Your Loan Documents
              </td>
            </tr>
            <!-- Greeting -->
            <tr>
              <td align="left" style="padding: 10px 25px 0 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                font-size: 15px; line-height: 24px; color: #374151;" class="text px">
                <span style="font-weight: bold; margin-bottom: 10px; display: block; color: #1b1f29">Dear ${customer.name},</span>
                Thank you for choosing ${lenderId == 2 ? `Nandanvan Investments Ltd` : `Yashik Finlease Private Limited`}. ${attachmentText}
              </td>
            </tr>
            <!-- Loan Details -->
            <tr>
              <td align="left" style="padding: 20px 25px 0 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                font-size: 18px; line-height: 26px; color: #1b1f29;" class="muted px">
                Loan Details:
              </td>
            </tr>
            <tr>
              <td align="left" style="padding: 12px 25px 0 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                font-size: 13px; line-height: 26px; color: #1b1f29;" class="muted px">
                <table border="0" cellpadding="5" cellspacing="0" width="100%" style="border: 1px solid #dddddd; border-radius: 10px; padding: 10px">
                  <tr>
                    <th style="text-align: left; font-weight: 500">Loan Account Number:</th>
                    <td><span style="font-weight: 600">${loan.loanNo}</span></td>
                  </tr>
                  <tr>
                    <th style="text-align: left; font-weight: 500">Loan Amount:</th>
                    <td><span style="font-weight: 600">₹${formattedAmount}</span></td>
                  </tr>
                  <tr>
                    <th style="text-align: left; font-weight: 500">Disbursement Date:</th>
                    <td><span style="font-weight: 600">${loan.disbursalDate}</span></td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Attachments Info -->
            <tr>
              <td align="left" style="padding: 25px 25px 0 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                font-size: 13px; line-height: 20px; color: #6e737b;" class="muted px">
                <span style="font-size: 18px; display: block; margin-bottom: 10px; color: #1b1f29">Attached Documents:</span>
                <ul style="list-style-type: disc; margin: 10px 15px; padding-left: 0">
                  <li style="margin-bottom: 5px">📄 Loan Agreement Document</li>
                  ${hasSanctionLetter ? '<li style="margin-bottom: 5px">📋 Sanction Letter</li>' : ''}
                </ul>
              </td>
            </tr>
            <!-- Important Note -->
            <tr>
              <td align="left" style="padding: 20px 25px 0 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                font-size: 13px; line-height: 20px; color: #6e737b;" class="muted px">
                <span style="font-size: 18px; display: block; margin-bottom: 10px; color: #1b1f29">Important:</span>
                <ul style="list-style-type: disc; margin: 10px 15px; padding-left: 0">
                  <li style="margin-bottom: 5px">Please review the attached documents carefully.</li>
                  <li style="margin-bottom: 5px">Keep these documents safe for your records.</li>
                  <li style="margin-bottom: 5px">Contact us immediately if you notice any discrepancies.</li>
                </ul>
              </td>
            </tr>
            <!-- Contact Information -->
            <tr>
              <td align="left" style="padding: 20px 25px 0 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                font-size: 13px; line-height: 22px; color: #6e737b;" class="muted px">
                <span style="font-size: 18px; display: block; margin-bottom: 10px; color: #1b1f29">Need Help?</span>
                <span style="display: block; margin-bottom: 5px">If you have any questions, please contact us:</span>
                <p style="margin-bottom: 5px">📧 <span style="font-weight: 600">Email:</span>
                  <a href="mailto:support@nexiloans.com" style="color: #26264e">support@nexiloans.com</a>
                </p>
                <p style="margin-bottom: 5px">🌐 <span style="font-weight: 600">Website:</span>
                  <a href="https://nexiloans.com/" target="_blank" style="color: #26264e">https://nexiloans.com</a>
                </p>
              </td>
            </tr>
            <!-- Closing -->
            <tr>
              <td align="left" style="padding: 20px 25px 0 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                font-size: 12px; line-height: 20px; color: #6e737b;" class="muted px">
                Warm regards,<br />
                <strong>Team ${lenderId == 2 ? `Nandanvan Investments Ltd` : `Yashik Finlease Private Limited`}</strong>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td align="center" style="padding: 28px 25px 25px 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                font-size: 12px; line-height: 18px; color: #9ca3af;" class="muted px py">
                Visit our website: <a href="https://nexiloans.com/" class="hover-underline" style="color: #2563eb">https://nexiloans.com</a><br />
                © ${currentYear} ${lenderId == 2 ? `Nandanvan Investments Ltd` : `Yashik Finlease Private Limited`}. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`
  }

  public generatePlainTextVersion(
    loan: LoanRecord,
    customer: CustomerRecord,
    hasSanctionLetter: boolean = false,
    lenderId?: number
  ): string {
    const formattedAmount = loan.disbursalAmount.toLocaleString('en-IN')
    const attachmentText = hasSanctionLetter
      ? 'Please find attached your loan agreement document and sanction letter for your records.'
      : 'Please find attached your loan agreement document for your records.'

    return `
Dear ${customer.name},

Thank you for choosing ${lenderId == 2 ? `Nandanvan Investments Ltd` : `Yashik Finlease Private Limited`}. ${attachmentText}

Loan Details:
- Loan Account Number: ${loan.loanNo}
- Loan Amount: ₹${formattedAmount}
- Disbursement Date: ${loan.disbursalDate}

Attached Documents:
- Loan Agreement Document
${hasSanctionLetter ? '- Sanction Letter' : ''}

Important:
- Please review the attached documents carefully.
- Keep these documents safe for your records.
- Contact us immediately if you notice any discrepancies.

Need Help?
If you have any questions, please contact us:
Email: support@nexiloans.com
Website: https://nexiloans.com

Warm regards,
Team ${lenderId == 2 ? `Nandanvan Investments Ltd` : `Yashik Finlease Private Limited`}

Visit our website: https://nexiloans.com
© ${new Date().getFullYear()} ${lenderId == 2 ? `Nandanvan Investments Ltd` : `Yashik Finlease Private Limited`}. All rights reserved.
    `
  }
}