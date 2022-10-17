const db = require('../../data/dbConfig')

function findById(user_id) {
    return db('users')
    .select('users.id', "users.username", "users.password")
    .where("id", user_id).first()
}

async function add(user) {
    const [id] = await db('users').insert(user)
    //console.log(findById(id)) 
    //return
    return db('users')
    .where({id}).first()
}

function findBy(specified_username) {
    return db('users')
        //.select()
        .select('users.id', "users.username", "users.password")
        .where(specified_username)
    // return db('users')
    // .where({specified_username}).first()
  }

module.exports = {
    findById, 
    add,
    findBy,
}