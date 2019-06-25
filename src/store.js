import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {changeKeyForArray, changeKeyForObject} from "./utils/_db";

Vue.use(Vuex)

const Datastore = require('nedb')
const db = {}

const path = require('path')
import { remote } from 'electron'

const filePaths = {
    dbPath: path.join(remote.app.getPath('userData'), '/symmetryk.db')
}

db.symmetryk = new Datastore({
    filename: filePaths.dbPath,
    autoload: true,
    onload: err => {
        if (err) {
            console.error('Error whole loading the db.', err)
        }

        db.symmetryk.find({}, (err, results) => {
            console.log(results)
            if (results) {
                store.state.user = results[0]
            } else {
                console.log(results)
            }
        })
    }
})

export const store = new Vuex.Store({
    state: {
        user: {
            _id:        null,
            name:       null,
            avatar:     null,

            briefcases: [],
            files:      []
        }
    },
    getters: {
        briefcases: state => {
          return state.user.briefcases
        },
        user: state => {
            return state.user
        },
        fullName: state => {
            return state.user.firstname + ' ' + state.user.lastname
        },
        initials(state, getters) {
            return getters.fullName.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g).join('');
        }
    },
    actions: {
        login(context, args) {
            return axios.post('/login', {
                email: args.email,
                pwd: args.pwd,
                vendorID: args.vendorID,
                bundleID: args.bundleID
            }).then(function (response) {

                db.symmetryk.findOne({email: args.email}, function (err, doc) {
                    if (doc) {
                        context.commit('setUser', doc)

                        context.dispatch('getBriefcases', {key: doc._id})
                    } else {
                        db.symmetryk.insert(changeKeyForObject(response.data, 'key', '_id'), function (err, docs) {
                            context.commit('setUser', docs)

                            context.dispatch('getBriefcases', {key: docs._id})
                        })
                    }
                })
            })
        },
        getBriefcases(context, args) {
            db.symmetryk.findOne({_id: args.key}, function (err, doc) {
                if (doc.briefcases) {
                    console.log('getting briefcases in the nedb')

                    context.commit('setBriefcases', doc.briefcases)

                    context.dispatch('setFiles')
                } else {
                    axios.get(`/projects?key=${args.key}`).then(response => {

                        let updatedResponseKeyData = changeKeyForArray(response.data, 'id', '_id');

                        db.symmetryk.update({_id: args.key}, {$set: {"briefcases": updatedResponseKeyData}}, {}, function () {
                            console.log('Setting briefcases in the nedb')
                        });

                        context.commit('setBriefcases', updatedResponseKeyData)
                    })
                }
            })
        },
        addBriefcase(context, args) {
            context.commit('addBriefcase', changeKeyForObject(args.briefcase, 'id', '_id'))

            db.symmetryk.update({}, {$push: {briefcases: changeKeyForObject(args.briefcase, 'id', '_id')}}, function () {
                context.dispatch('setFiles')
            })
        },
        removeBriefcase(context, args) {
            context.commit('removeBriefcase', args.briefcase)

            db.symmetryk.update({}, { $pull: {briefcases: {_id: args.briefcaseId }}}, () => {
                context.dispatch('setFiles')
            })
        },
        setFiles(context) {
            let result = [];
            context.state.user.briefcases.forEach(b => {
                b.tiles.forEach(t => {
                    t.tree.forEach( f => {
                        if (f.node_type != 2) {
                            result.push(f)
                        }
                    })
                })
            });

            context.commit('setFiles', result);
        },
        getUpdates(context, args) {
            return axios.get(`/updates?key=${args.key}`).then(response => {
                if (response.length > 0) {
                    console.log(response);
                } else {
                    // dispatch updates to concerned objects
                }
            })
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        setBriefcases(state, briefcases) {
            state.briefcases = briefcases
        },
        addBriefcase(state, briefcase) {
            state.briefcases.push(briefcase)
        },
        removeBriefcase(state, briefcase) {
            for (let i = state.briefcases.length - 1; i >= 0; --i) {
                if (state.briefcases[i]._id == briefcase.id) {
                    state.briefcases.splice(i, 1);
                }
            }
        },
        setFiles(state, files) {
            state.files = files
        }
    }
})
