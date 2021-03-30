export default{
    jwt:{
        secret: process.env.APP_SERCRET || 'default',
        expiresIn: '1d',
    }
}
