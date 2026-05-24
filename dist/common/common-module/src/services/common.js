function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype), d = Object.defineProperty;
    return d(g, "next", {
        value: verb(0)
    }), d(g, "throw", {
        value: verb(1)
    }), d(g, "return", {
        value: verb(2)
    }), typeof Symbol === "function" && d(g, Symbol.iterator, {
        value: function() {
            return this;
        }
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
import config from '@/config/default';
import axios from 'axios';
import ejs from 'ejs';
import path from 'path';
import { logger } from '../utils/logger';
import { transporter } from '../utils/nodemailer';
export var sendEmail = function sendEmail(emailData) {
    return transporter.sendMail(emailData, function(err, info) {
        if (err) {
            logger.error("sendEmail: ".concat(err.stack));
        }
        logger.info("Email Sent, Envelope: ".concat(info.envelope, ", MessageId: ").concat(info.messageId));
    });
};
export function getFileStream(bucket, pathKey) {
    throw new Error('Function not implemented.');
}
export var sendEmailViaBravo = function sendEmailViaBravo(to, subject, htmlContent) {
    return _async_to_generator(function() {
        var sender, payload, response, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        2,
                        ,
                        3
                    ]);
                    sender = {
                        name: config.bravoSenderName,
                        email: config.bravoFrom
                    };
                    payload = {
                        sender: sender,
                        to: to,
                        subject: subject,
                        htmlContent: htmlContent
                    };
                    return [
                        4,
                        axios.post('https://api.brevo.com/v3/smtp/email', payload, {
                            headers: {
                                accept: 'application/json',
                                'api-key': config.bravoApiKey,
                                'content-type': 'application/json'
                            }
                        })
                    ];
                case 1:
                    response = _state.sent();
                    console.log('Email Sent');
                    return [
                        2,
                        true
                    ];
                case 2:
                    error = _state.sent();
                    console.error('Error sending email:', error);
                    return [
                        2,
                        false
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    })();
};
export var sendSendinblueMail = function sendSendinblueMail(mailData) {
    return _async_to_generator(function() {
        var sendData, response, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    sendData = {
                        sender: {
                            name: 'Ramfincorp',
                            email: mailData.from
                        },
                        to: [
                            {
                                email: mailData.to
                            }
                        ],
                        subject: mailData.subject,
                        htmlContent: mailData.body
                    };
                    if (mailData.content && mailData.attachmentName) {
                        sendData.attachment = [
                            {
                                content: mailData.content,
                                name: mailData.attachmentName
                            }
                        ];
                    }
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        3,
                        ,
                        4
                    ]);
                    return [
                        4,
                        axios.post('https://api.brevo.com/v3/smtp/email', sendData, {
                            headers: {
                                'api-key': config.bravoApiKey,
                                'content-type': 'application/json',
                                accept: 'application/json'
                            }
                        })
                    ];
                case 2:
                    response = _state.sent();
                    console.log('Email sent successfully:', response.data);
                    return [
                        2,
                        response.data
                    ];
                case 3:
                    error = _state.sent();
                    console.error('Error sending email:', error);
                    throw new Error('Failed to send email');
                case 4:
                    return [
                        2
                    ];
            }
        });
    })();
};
export var verifyOfficeEmail = function verifyOfficeEmail(emailId, otp, name) {
    return _async_to_generator(function() {
        var to, subject, from, templatePath, mailData, message, emailSendFromData, response;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    to = emailId;
                    subject = 'Ram Fincorp : Email Verification OTP';
                    from = 'info@ramfincorp.com';
                    templatePath = path.join(__dirname, '..', 'views', 'emails', 'email_verification.ejs');
                    mailData = {
                        name: name,
                        otp: otp
                    };
                    return [
                        4,
                        ejs.renderFile(templatePath, mailData)
                    ];
                case 1:
                    message = _state.sent();
                    emailSendFromData = {
                        to: to,
                        from: from,
                        subject: subject,
                        body: message
                    };
                    return [
                        4,
                        sendSendinblueMail(emailSendFromData)
                    ];
                case 2:
                    response = _state.sent();
                    return [
                        2,
                        {
                            errorCode: '0',
                            errorMsg: 'Mail sent successfully'
                        }
                    ];
            }
        });
    })();
};

//# sourceMappingURL=common.js.map