// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 record model
const Record = require('../../models/record')
const Category = require('../../models/category')


router.get('/', (req, res) => {
  const userId = req.user._id   // 變數設定
  Record.find({ userId })         // 加入查詢條件
    .lean()
    .sort({ _id: 'asc' })
    .then(records => res.render('index', { records }))
    .catch(error => console.error(error))
})


router.get('/new', (req, res) => {
  Category.find({})
    .lean()
    .sort({ id: 'asc' })
    .then(categories => res.render('new', { categories }))
    .catch(error => console.error(error))
})

router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Record.findOne({ _id, userId })
    .lean()
    .then(record => res.render('detail', { record }))
    .catch(error => console.log(error))
})



router.post('/', (req, res) => {
  console.log(req.user)
  const userId = req.user._id
  const attr = req.body
  attr.userId = userId
  Category.findOne({ name: attr.category })
    .lean()
    .then(category => {
      attr.categoryId = category._id
      Record.create(attr)
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    })
})


router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .lean()
    .sort({id: 'asc'})
    .then(record => {
      Category.find({})
        .lean()
        .then(categories => res.render('edit', { record, categories }))
    })
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .then(record => {
      Category.findOne({ name: req.body.category })
        .lean()
        .then(category => {
          record.categoryId = category._id
          record.name = req.body.name
          record.date = req.body.date
          record.amount = req.body.amount
          record.category = req.body.category
          return record.save()
        })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


// 匯出路由模組
module.exports = router