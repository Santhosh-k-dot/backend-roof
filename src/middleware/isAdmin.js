// backend/src/middleware/isAdmin.js

const isAdmin = (req, res, next) => {
    if (req.role !== 'admin') {

        return res.status(401).send({
            success: false,
            message: 'You are not allowed  to perform this  action, please try to login as admin'
        })
    }
    next()

}
module.exports = isAdmin;   