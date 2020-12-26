const jwt = require('../index');
const respond = require('./response-hendler');
const joi = require('joi');
const Cache = require('./radis');


const schema = joi.object().keys({
    authorization: joi.string().required()
}).unknown(true)

function checkToken(data) {
    return new Promise((resolve, reject) => {
        // user
        if (data.role === "user") {
            Cache.isMember(`${data.role}_${data._id}`, data.uuid)
                .then(d => {
                    d === 1 ? resolve(true) : resolve(false);
                })
                .catch(reject);
        } else {
            // admin & nutritionist
            Cache.getValue(`${data.role}_${data._id}`)
                .then(val => {
                    val === data.uuid ? resolve(true) : resolve(false);
                })
                .catch(reject);
        }
    })
}

function objectify(req) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = schema.validate(req.headers);
            if (result.error) {
                console.log("Validation error: " + result.error.details[0].message);
                reject()
                return;
            }

            let token = result.value.authorization.split(' ')[1];
            let obj = await jwt.verify(token);
            // resolve(obj);
            let isTokenValid = await checkToken(obj);
            if (isTokenValid) {
                resolve(obj);
                return;
            }
            reject();
        } catch (error) {
            reject(error);
        }
    })
}

function isBlocked(id) {
    return Cache.isMember('ADMIN_BLOCKED_USERS', id);
}


module.exports = {
    user: async (req, res, next) => {
        try {
            console.log("lllllllllllllll   ",req)
            let obj = await objectify(req);
            if (obj && obj.role === 'user') {
                let blocked = await isBlocked(obj._id);
                if (blocked) {
                    respond.forbidden(req, res, {
                        message: 'BLOCKED',
                        data: {}
                    });
                    return;
                }
                req.user = obj;
                next();
            } else {
                respond.unauthorised(req, res, {
                    message: 'UNAUTHORISED_USER',
                    data: {}
                });
            }
        } catch (error) {
            respond.unauthorised(req, res, {
                message: 'UNAUTHORISED_USER',
                data: {}
            });
        }
    }
}