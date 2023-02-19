// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 record model
const Record = require('../../models/record')
const Category = require('../../models/category')
// 定義首頁路由
const CATEGORY = {
  家居物業: "fa-solid fa-house",
  交通出行: "fa-solid fa-van-shuttle",
  休閒娛樂: "fa-solid fa-face-grin-beam",
  餐飲食品: "fa-solid fa-utensils",
  其他: "fa-solid fa-pen"
}

router.get('/', (req, res) => {
  const userId = req.user._id   // 變數設定
  Record.find({ userId })         // 加入查詢條件
    .lean()
    .sort({ _id: 'asc' })
    .then(records => {
      for (const record of records) {
        record.icon = CATEGORY[record.category]
      }
      Category.find({})
        .lean()
        .sort({ id: 'asc' })
        .then(categories => {
          let sum = 0
          for (const record of records) {
            sum = sum + record.amount
          }
          res.render('index', { records, categories, sum, selectedCategory: '全部類別' })
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

router.get('/category', (req, res) => {
  console.log(req.query.category)
  const selectedCategory = req.query.category
  const userId = req.user._id
  Record.find({ userId })
    .lean()
    .sort({ _id: 'asc' })
    .then(records => {
      for (const record of records) {
        record.icon = CATEGORY[record.category]
      }
      Category.find({})
        .lean()
        .sort({ id: 'asc' })
        .then(categories => {
          if (selectedCategory !== "全部類別") {
            records = records.filter(record => {
              console.log(record.category)
              return record.category.includes(selectedCategory)
            })
          }
          console.log(records)
          if (records.length !== 0) {
            let sum = 0
            for (const record of records) {
              sum = sum + record.amount
            }
            console.log(sum)
            res.render('index', { records, categories, sum, selectedCategory })
          }
          else {
            res.render('index', { categories, sum: 0, selectedCategory })
          }
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})





// 匯出路由模組
module.exports = router