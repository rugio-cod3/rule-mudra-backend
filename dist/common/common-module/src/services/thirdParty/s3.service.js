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
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
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
import AWS from 'aws-sdk';
import mime from 'mime-types';
var S3Service = /*#__PURE__*/ function() {
    "use strict";
    function S3Service() {
        _class_call_check(this, S3Service);
        _define_property(this, "s3Client", void 0);
        _define_property(this, "sesClient", void 0);
        _define_property(this, "from", void 0);
        this.s3Client = new AWS.S3({
            accessKeyId: config.aws_s3_access_key_id,
            secretAccessKey: config.aws_s3_seceret_access_key,
            region: config.aws_s3_region
        });
        this.sesClient = new AWS.SES({
            apiVersion: '2010-12-01',
            region: config.aws_region_ses || 'ap-south-1',
            credentials: {
                accessKeyId: config.aws_access_key_id_ses,
                secretAccessKey: config.aws_secret_access_key_ses
            }
        });
        this.from = config.mail_for_ses || 'credit@ramfincorp.com';
    }
    _create_class(S3Service, [
        {
            key: "uploadDocument",
            value: function uploadDocument(file, folder, filename) {
                var isBase64 = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false, base64 = arguments.length > 4 ? arguments[4] : void 0;
                return _async_to_generator(function() {
                    var base64Data, params;
                    return _ts_generator(this, function(_state) {
                        if (isBase64 && base64) {
                            base64Data = base64.replace(/^data:image\/\w+;base64,/, '').replace(/\s/g, '');
                            file = Buffer.from(base64Data, 'base64');
                        }
                        if (!file) {
                            throw new Error('No file data provided for upload.');
                        }
                        params = {
                            Bucket: config.aws_s3_bucket_name,
                            Key: "".concat(folder, "/").concat(filename),
                            Body: file,
                            ACL: 'private',
                            ContentType: 'application/pdf'
                        };
                        return [
                            2,
                            this.s3Client.upload(params).promise()
                        ];
                    });
                }).call(this);
            }
        },
        {
            key: "getPresignedUrl",
            value: function getPresignedUrl(filename) {
                return _async_to_generator(function() {
                    var contentType, params;
                    return _ts_generator(this, function(_state) {
                        if (!filename) {
                            return [
                                2,
                                null
                            ];
                        }
                        contentType = this.getContentTypeFromExtension(filename);
                        params = {
                            Bucket: config.aws_s3_bucket_name,
                            Key: filename,
                            Expires: 259200,
                            ResponseContentType: contentType
                        };
                        return [
                            2,
                            this.s3Client.getSignedUrlPromise('getObject', params)
                        ];
                    });
                }).call(this);
            }
        },
        {
            key: "isExtensionAllowed",
            value: function isExtensionAllowed(extension) {
                var allowedExtensions = [
                    '.pdf',
                    '.doc',
                    '.docx',
                    '.jpeg',
                    '.png',
                    '.jpg',
                    '.avi',
                    '.gif',
                    '.webp',
                    '.mp4',
                    '.mov',
                    '.wmv',
                    '.mkv',
                    '.webm',
                    '.mp3',
                    '.mpeg4',
                    '.aac',
                    '.flac',
                    '.alac',
                    '.wav',
                    '.aiff',
                    '.dsd'
                ];
                return allowedExtensions.includes(extension.toLowerCase());
            }
        },
        {
            key: "getContentTypeFromExtension",
            value: function getContentTypeFromExtension(filename) {
                return mime.lookup(filename) || 'application/octet-stream';
            }
        },
        {
            key: "sendEmail",
            value: function sendEmail(mailData) {
                return _async_to_generator(function() {
                    var params;
                    return _ts_generator(this, function(_state) {
                        if (mailData.content && mailData.attachmentName) {
                            return [
                                2,
                                this.sendRawEmail(mailData.to, mailData.from, mailData.subject, mailData.body, mailData.content, mailData.attachmentName)
                            ];
                        } else {
                            params = {
                                Source: mailData.from,
                                Destination: {
                                    ToAddresses: [
                                        mailData.to
                                    ]
                                },
                                Message: {
                                    Subject: {
                                        Data: mailData.subject,
                                        Charset: 'UTF-8'
                                    },
                                    Body: {
                                        Html: {
                                            Data: mailData.body,
                                            Charset: 'UTF-8'
                                        }
                                    }
                                }
                            };
                            return [
                                2,
                                this.sesClient.sendEmail(params).promise()
                            ];
                        }
                        return [
                            2
                        ];
                    });
                }).call(this);
            }
        },
        {
            key: "sendRawEmail",
            value: function sendRawEmail(to, from, subject, body, attachment, attachmentName) {
                return _async_to_generator(function() {
                    var boundary, rawMessage, params;
                    return _ts_generator(this, function(_state) {
                        boundary = "----=_Part_".concat(Date.now());
                        rawMessage = [
                            "From: ".concat(from),
                            "To: ".concat(to),
                            "Subject: ".concat(subject),
                            "MIME-Version: 1.0",
                            'Content-Type: multipart/mixed; boundary="'.concat(boundary, '"'),
                            '',
                            "--".concat(boundary),
                            "Content-Type: text/html; charset=UTF-8",
                            "Content-Transfer-Encoding: 7bit",
                            '',
                            body,
                            '',
                            "--".concat(boundary),
                            'Content-Type: application/octet-stream; name="'.concat(attachmentName, '"'),
                            'Content-Disposition: attachment; filename="'.concat(attachmentName, '"; size=').concat(attachment.length, ";"),
                            "Content-Transfer-Encoding: base64",
                            '',
                            attachment.toString(),
                            '',
                            "--".concat(boundary, "--")
                        ].join('\n');
                        params = {
                            RawMessage: {
                                Data: rawMessage
                            }
                        };
                        return [
                            2,
                            this.sesClient.sendRawEmail(params).promise()
                        ];
                    });
                }).call(this);
            }
        }
    ]);
    return S3Service;
}();
export default S3Service;

//# sourceMappingURL=s3.service.js.map