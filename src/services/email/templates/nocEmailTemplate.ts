interface CustomerRecord {
  customerID: number;
  name: string;
  email: string;
  mobile: string;
}

interface LoanRecord {
  leadID: number;
  customerID: number;
  loanNo: string;
  disbursalAmount: number;
  disbursalDate: string;
  status: string;
}

interface NocTemplateData {
  customer: CustomerRecord;
  loan: LoanRecord;
  appName?: string;
  phoneNumber?: string;
  lenderId?: number;
}

export class NocEmailTemplate {
  public generateHTML(data: NocTemplateData): string {
    const currentYear = new Date().getFullYear();
    const formattedAmount = data.loan.disbursalAmount.toLocaleString("en-IN");
    const appName =
      data.lenderId == 2
        ? `Nandanvan Investments Ltd`
        : `Yashik Finlease Private Limited`;
    const phoneNumber = data.phoneNumber || "[Customer Care Number]";

    // Format disbursement date
    const disbursalDate = new Date(data.loan.disbursalDate).toLocaleDateString(
      "en-IN",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    return `<!DOCTYPE html>
<html
  lang="en"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta
      name="format-detection"
      content="telephone=no,address=no,email=no,date=no,url=no"
    />
    <title>Yashik Finlease No Dues Certificate</title>
    <style>
      a {
        text-decoration: none;
      }
      .hover-underline:hover {
        text-decoration: underline !important;
      }
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
      }
      @media (prefers-color-scheme: dark) {
        .bg-body {
          background-color: #0b0b0c !important;
        }
        .bg-card {
          background-color: #111114 !important;
        }
        .text {
          color: #eaeaec !important;
        }
        .muted {
          color: #b5b6ba !important;
        }
      }
      @media only screen and (max-width: 600px) {
        .container {
          width: 100% !important;
        }
        .px {
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
        .py {
          padding-top: 24px !important;
          padding-bottom: 24px !important;
        }
        .logo {
          margin-bottom: 12px !important;
        }
      }
    </style>
  </head>
  <body
    class="bg-body"
    style="margin: 0; padding: 0; background-color: #f4f5f7"
  >
    <center style="width: 100%; background: #f4f5f7">
      <table
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0"
        align="center"
        width="100%"
        style="max-width: 600px"
        class="container"
      >
        <tr>
          <td align="center" valign="top" style="padding: 24px 12px">
            <table
              role="presentation"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              border="0"
              style="
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
              "
              class="bg-card"
            >
              <!-- Header / Logo -->
              <tr>
                <td align="center" style="padding: 28px 32px 0 32px">
                  <img
                    class="logo"
                    src="https://nexiloans.com/images/logo.png"
                    width="100"
                    height="auto"
                    alt="${appName}"
                    border="0"
                    style="
                      display: block;
                      height: auto;
                      border: 0;
                      outline: none;
                      text-decoration: none;
                    "
                  />
                </td>
              </tr>

              <tr>
                <td
                  align="left"
                  style="
                    padding: 28px 25px 10px 25px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      Roboto, Helvetica, Arial, sans-serif;
                    font-size: 22px;
                    line-height: 32px;
                    color: #111827;
                  "
                  class="text px"
                >
                  NO DUES CERTIFICATE
                </td>
              </tr>

              <tr>
                <td
                  align="left"
                  style="
                    padding: 20px 25px 0 25px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      Roboto, Helvetica, Arial, sans-serif;
                    font-size: 18px;
                    line-height: 26px;
                    color: #1b1f29;
                  "
                  class="muted px"
                >
                  Loan Details:
                </td>
              </tr>

              <tr>
                <td
                  align="left"
                  style="
                    padding: 12px 25px 0 25px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      Roboto, Helvetica, Arial, sans-serif;
                    font-size: 13px;
                    line-height: 26px;
                    color: #1b1f29;
                  "
                  class="muted px"
                >
                  <table
                    border="0"
                    cellpadding="5"
                    cellspacing="0"
                    width="100%"
                    style="
                      border: 1px solid #dddddd;
                      border-radius: 10px;
                      padding: 10px;
                    "
                  >
                    <tr>
                      <th style="text-align: left; font-weight: 500">
                        Customer Name:
                      </th>
                      <td>
                        <span style="font-weight: 600"
                          >${data.customer.name}</span
                        >
                      </td>
                    </tr>
                    <tr>
                      <th style="text-align: left; font-weight: 500">
                        Loan Account No:
                      </th>
                      <td>
                        <span style="font-weight: 600"
                          >${data.loan.loanNo}</span
                        >
                      </td>
                    </tr>
                    <tr>
                      <th style="text-align: left; font-weight: 500">
                        Loan Amount:
                      </th>
                      <td>
                        <span style="font-weight: 600"
                          >₹${formattedAmount}</span
                        >
                      </td>
                    </tr>
                    <tr>
                      <th style="text-align: left; font-weight: 500">
                        Loan Disbursed Date:
                      </th>
                      <td>
                        <span style="font-weight: 600">${disbursalDate}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td
                  align="left"
                  style="
                    padding: 20px 25px 0 25px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      Roboto, Helvetica, Arial, sans-serif;
                    font-size: 18px;
                    line-height: 26px;
                    color: #1b1f29;
                  "
                  class="muted px"
                >
                  To whomsoever it may concern
                </td>
              </tr>

              <tr>
                <td
                  align="left"
                  style="
                    padding: 16px 25px 0 25px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      Roboto, Helvetica, Arial, sans-serif;
                    font-size: 13px;
                    line-height: 20px;
                    color: #6e737b;
                  "
                  class="muted px"
                >
                  With reference to the above referred loan, we hereby confirm
                  that the personal loan to MR.
                  "<strong>${data.customer.name}</strong>" has been completed
                  and there are no dues left in the said account.
                </td>
              </tr>

              <tr>
                <td
                  align="left"
                  style="
                    padding: 16px 25px 0 25px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      Roboto, Helvetica, Arial, sans-serif;
                    font-size: 13px;
                    line-height: 20px;
                    color: #6e737b;
                  "
                  class="muted px"
                >
                  This is a system generated letter and hence does not require
                  any signature.
                </td>
              </tr>

              <tr>
                <td
                  align="left"
                  style="
                    padding: 16px 25px 0 25px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      Roboto, Helvetica, Arial, sans-serif;
                    font-size: 13px;
                    line-height: 20px;
                    color: #6e737b;
                  "
                  class="muted px"
                >
                  In case of any further details/ clarification with regard to
                  your above-mentioned Loan Account Number, please connect with
                  us.
                </td>
              </tr>

              <tr>
                <td
                  align="left"
                  style="
                    padding: 20px 25px 0 25px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      Roboto, Helvetica, Arial, sans-serif;
                    font-size: 13px;
                    line-height: 22px;
                    color: #6e737b;
                  "
                  class="muted px"
                >
                  <span style="display: block; margin-bottom: 5px"
                    >If you have any questions, please feel free to reach us
                    at:</span
                  >

                  <p style="margin-bottom: 5px">
                    📞
                    <span style="font-weight: 600">Customer Care:</span>
                    ${phoneNumber}
                  </p>

                  <p style="margin-bottom: 5px">
                    📧 <span style="font-weight: 600">Email:</span>
                    <a
                      href="mailto:support@nexiloans.com"
                      style="color: #26264e"
                      >support@nexiloans.com</a
                    >
                  </p>

                  <p style="margin-bottom: 5px">
                    🌐 <span style="font-weight: 600">Website:</span>
                    <a
                      href="https://nexiloans.com/"
                      target="_blank"
                      style="color: #26264e"
                      >https://nexiloans.com</a
                    >
                  </p>
                </td>
              </tr>

              <tr>
                <td
                  align="left"
                  style="
                    padding: 16px 25px 0 25px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      Roboto, Helvetica, Arial, sans-serif;
                    font-size: 13px;
                    line-height: 20px;
                    color: #6e737b;
                  "
                  class="muted px"
                >
                  Thank you for choosing
                  <span style="font-weight: 600">${appName}</span>. 👋
                </td>
              </tr>

              <tr>
                <td
                  align="center"
                  style="
                    padding: 28px 25px 25px 25px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      Roboto, Helvetica, Arial, sans-serif;
                    font-size: 12px;
                    line-height: 18px;
                    color: #9ca3af;
                  "
                  class="muted px py"
                >
                  Visit our website:
                  <a
                    href="https://nexiloans.com/"
                    class="hover-underline"
                    style="color: #2563eb"
                    >https://nexiloans.com</a
                  >
                  <br />
                  © ${currentYear} ${appName}. All rights reserved.
                </td>
              </tr>
            </table>

            <div style="height: 24px; line-height: 24px">&#160;</div>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>
`;
  }

  public generatePlainTextVersion(data: NocTemplateData): string {
    const formattedAmount = data.loan.disbursalAmount.toLocaleString("en-IN");
    const appName =
      data.lenderId == 2
        ? "Nandanvan Investments Ltd"
        : "Yashik Finlease Private Limited";
    const phoneNumber = data.phoneNumber || "[Customer Care Number]";
    const disbursalDate = new Date(data.loan.disbursalDate).toLocaleDateString(
      "en-IN",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    return `NO DUES CERTIFICATE

Loan Details:
- Customer Name: ${data.customer.name}
- Loan Account No: ${data.loan.loanNo}
- Loan Amount: ₹${formattedAmount}
- Loan Disbursed Date: ${disbursalDate}

To whomsoever it may concern

With reference to the above referred loan, we hereby confirm that the personal loan to MR. "${
      data.customer.name
    }" has been completed and there are no dues left in the said account.

This is a system generated letter and hence does not require any signature.

In case of any further details/ clarification with regard to your above-mentioned Loan Account Number, please connect with us.

If you have any questions, please feel free to reach us at:
- Customer Care: ${phoneNumber}
- Email: support@nexiloans.com
- Website: https://nexiloans.com

Thank you for choosing ${appName}.

Visit our website: https://nexiloans.com
© ${new Date().getFullYear()} ${appName}. All rights reserved.
`;
  }
}
