if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Category = require('../category')
const db = require('../../config/mongoose')

const CATEGORIES = [
  { id: 1, name: '家居物業' },
  { id: 2, name: '交通出行' },
  { id: 3, name: '休閒娛樂' },
  { id: 4, name: '餐飲食品' },
  { id: 5, name: '其他' }
]

db.once('open', () => {
  Promise.all(Array.from(
    { length: CATEGORIES.length },
    (_, i) => Category.create({ id: CATEGORIES[i].id, name: CATEGORIES[i].name })
  ))
    .then(()=> {
    console.log('done.')
    process.exit()
  })
})


