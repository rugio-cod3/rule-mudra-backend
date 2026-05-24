/**
 * Reward Transaction Interfaces
 * Purpose: Type definitions for the withdrawal system
 */ // Error Codes Enum
export var WithdrawalErrorCodes = /*#__PURE__*/ function(WithdrawalErrorCodes) {
    WithdrawalErrorCodes["INSUFFICIENT_BALANCE"] = "INSUFFICIENT_BALANCE";
    WithdrawalErrorCodes["WAITING_PERIOD_NOT_COMPLETED"] = "WAITING_PERIOD_NOT_COMPLETED";
    WithdrawalErrorCodes["MINIMUM_AMOUNT_NOT_MET"] = "MINIMUM_AMOUNT_NOT_MET";
    WithdrawalErrorCodes["MAXIMUM_AMOUNT_EXCEEDED"] = "MAXIMUM_AMOUNT_EXCEEDED";
    WithdrawalErrorCodes["BANK_ACCOUNT_NOT_VERIFIED"] = "BANK_ACCOUNT_NOT_VERIFIED";
    WithdrawalErrorCodes["DAILY_LIMIT_EXCEEDED"] = "DAILY_LIMIT_EXCEEDED";
    WithdrawalErrorCodes["MONTHLY_LIMIT_EXCEEDED"] = "MONTHLY_LIMIT_EXCEEDED";
    WithdrawalErrorCodes["GATEWAY_ERROR"] = "GATEWAY_ERROR";
    WithdrawalErrorCodes["DUPLICATE_TRANSACTION"] = "DUPLICATE_TRANSACTION";
    WithdrawalErrorCodes["CUSTOMER_NOT_FOUND"] = "CUSTOMER_NOT_FOUND";
    WithdrawalErrorCodes["INVALID_BANK_ACCOUNT"] = "INVALID_BANK_ACCOUNT";
    WithdrawalErrorCodes["SYSTEM_MAINTENANCE"] = "SYSTEM_MAINTENANCE";
    return WithdrawalErrorCodes;
}({});

//# sourceMappingURL=rewardTransaction.interface.js.map