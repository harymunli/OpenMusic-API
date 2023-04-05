const Jwt = require('@hapi/jwt');
const BadRequestError = require('../exception/BadRequestError');

const TokenManager = {
    generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
    generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
    verifyRefreshToken: (refreshToken) => {
        try{
            const artifacts = Jwt.token.decode(refreshToken);
            Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
            const { payload } = artifacts.decoded;
            return payload;
        }catch(e){
            throw new BadRequestError;
        }
    },
    // TODO Implement sistem token sudah kadaluarsa dan diberi access token yang baru
    getPayloadFromToken: (access_token) =>{
        const artifacts = Jwt.token.decode(access_token);
        const { payload } = artifacts.decoded;
        return payload;
    }
}

module.exports = TokenManager;