function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
import { model, Schema } from 'mongoose';
var commonFields = {
    lalID: {
        type: Number
    },
    leadId: {
        type: Number
    },
    apiSupplier: {
        type: Number
    },
    apiType: {
        type: String
    },
    apiEndpointUrl: {
        type: String
    },
    apiHeaders: {
        type: String
    },
    apiMethod: {
        type: String
    },
    apiRequest: {
        type: String
    },
    apiResponse: {
        type: String
    },
    status: {
        type: Number
    },
    customerID: {
        type: Number
    },
    mobile: {
        type: Number
    },
    iuDate: {
        type: Date
    }
};
var createModel = function createModel(name, collection, extraFields) {
    var schema = new Schema(_object_spread({}, commonFields, extraFields), {
        timestamps: true
    });
    return model(name, schema, collection);
};
export var BillPaymentReceipt = createModel('BillPaymentReceipt', 'billPaymentReceipts', {
    amount: {
        type: Number
    }
});
export var Finbox = createModel('Finbox', 'finbox', {
    entityID: {
        type: String
    }
});
export var PanComprehensive = createModel('PanComprehensive', 'panComprehensive', {
    pancard: {
        type: String
    }
});
export var FaceMatch = createModel('FaceMatch', 'faceMatch', {});
export var Experian = createModel('Experian', 'experian', {
    pancard: {
        type: String
    }
});
export var AadhaarKYC = createModel('AadhaarKYC', 'aadhaarKYC', {
    aadhaarNo: {
        type: String
    },
    aadhaarClientId: {
        type: String
    }
});
export var Cibil = createModel('Cibil', 'cibil', {});
export var Ckyc = createModel('Ckyc', 'ckyc', {
    pancard: {
        type: String
    }
});
export var Digilocker = createModel('Digilocker', 'digilocker', {
    code: {
        type: String
    },
    state: {
        type: String
    }
});
export var InternalApi = createModel('InternalApi', 'internalApi', {
    pancard: {
        type: String
    },
    amount: {
        type: String
    }
});
export var GetUserScore = createModel('GetUserScore', 'getUserScore', {
    syncId: {
        type: String
    },
    syncResult: {
        type: String
    },
    syncData: {
        type: String
    }
});
export var DigiTap = createModel('DigiTap', 'digitap', {});

//# sourceMappingURL=LeadApiLogModel.js.map