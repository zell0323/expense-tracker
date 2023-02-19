if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Category = require('../category')
const db = require('../../config/mongoose')
const User = require('../user')
const Record = require('../record')
const bcrypt = require('bcryptjs')
const SEED_USER = {
  name: 'user1',
  email: 'user1@example.com',
  password: '1245678'
}

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      Category.find({})
        .lean()
        .then(categories => {
          return Promise.all(Array.from(
            { length: 10 },
            (_, i) => {
              randomNumber = getRandomInt(categories.length - 1)
              console.log(randomNumber, categories[randomNumber])
              return Record.create({
                name: `name-${i}`,
                date: new Date().toISOString().slice(0, 10),
                category: categories[randomNumber].name,
                categoryId: categories[randomNumber]._id,
                amount: getRandomInt(10000),
                userId
              })
            }
          ))
        })
        .then(() => {
          console.log('done.')
          process.exit()
        })
    })

})



function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1
}





