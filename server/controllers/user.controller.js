import User from '../models/user.model'
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'

const create = (req, res, next) => { 
    console.log(req.body);
    const user = new User(req.body)
    user.save()
        .then((result) => {
            return res.status(200).json({
                message: 'Successfully signed up!'
            })
        })
        .catch((err) => {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        })
 }
const list = (req, res) => { 
    User.find()
        .then((users) => {
            return res.json(users)
        })
        .catch((err) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                })
            }
        })
 }
const userByID = (req, res, next, id) => { 
    User.findById(id).exec()
        .then((user) => {
            if ( !user)
                return res.status('400').json({
                    error: "User not found"
                })
            req.profile = user
            next()
        })
        .catch((err) => {
            return res.status('400').json({
                error: "User not found"
            })
        })
 }
const read = (req, res) => { 
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
 }
const update = (req, res, next) => { 
    let user = req.profile
    user = _.extend(user, req.body)
    user.updated = Date.now()
    user.save()
        .then(() => {
            user.hashed_password = undefined
            user.salt = undefined
            res.json(user)
        })
        .catch((err) => {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        })
 }
const remove = (req, res, next) => { 
    let user = req.profile
    User.findByIdAndDelete(user._id)
        .then((deletedUser) => {
            deletedUser.hashed_password = undefined
            deletedUser.salt = undefined
            res.json(deletedUser)
        })
        .catch((err) => {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        })
 }

export default { create, list, userByID, read, update, remove }