export enum RazorPayContactType {
  VENDOR = 'vendor',
  CUSTOMER = 'customer',
  EMPLOYEE = 'employee',
  SELF = 'self',
}

export enum RazorPayApiUrl {
  CREATE_CONTACT = '/contacts',
  CREATE_FUND_ACCOUNT = '/fund_accounts',
  VALIDATE_ACCOUNT = '/fund_accounts/validations',
  CREATE_SUBSCRIPTION_LINK = '/subscription_registration/auth_links',
  CREATE_CUSTOMER = '/customers',
  CREATE_ORDER = '/orders',
  PAYMENTS = '/payments',
  INVOICES ='/invoices'
}

export enum RazorPayLogApiType {
  CONTACTS = 'razorpay contacts',
  FUND_ACCOUNTS = 'razorpay fund_accounts',
  VALIDATE_ACCOUNT = 'razorpay validate_account',
  VERIFY_TRANSACTION = 'razorpay verify_transaction',
  EMANDATE = 'e-mandate',
  CREATE_CUSTOMER = 'razorpay create_customer',
  CREATE_ORDER = 'razorpay create_order',
  PAYMENTS = 'razorpay payments',
  INVOICES = 'razorpay invoices'
}

export enum RazorPayValidateStatus {
  CREATED = 'created',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum RazorPayMandateVerification {
  NOT_VERIFIED = 'Not Verified',
  VERIFIED = 'Verified',
  REJECTED = 'Rejected',
}

export enum RazorPayPaymentStatus{
  CAPTURED="captured", // Success
  CREATED="created", // In progress
  AUTHORIZED="authorized", // In Progress
  FAILED="failed", // FAILED status
  REFUNDED="refunded",
  PARTIALLY_REFUNDED="partially_refunded",
  PROCESSING="processing", // keep hitting API
  ATTEMPTED="attempted" // FAILED status
}