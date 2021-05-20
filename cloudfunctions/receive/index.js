// 云函数入口文件
const cloud = require('wx-server-sdk')
const mailClient = require('node-mail-client')
var moment = require('moment')
moment.locale('zh-cn')
const coach = new RegExp(/Coach.*Receipt.*/, 'gm');
const regexpSaleInfo = /SALE[\s\S]*?(?=\n.*?VISA|CARD\sNO\.|\s+ITEM\(S\)\s+SOLD)/  // Extract the receipt items info

cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  const {
    account,
    num,
    type
  } = event
  const {
    name,
    addr: user,
    pass,
    imap,
    smtp
  } = account
  const client = new mailClient({
    name,
    user,
    pass,
    imap,
    smtp
  })
  client.check = 1
  return await client.receive(total => {
    if (num >= total) {
      return `1:*`
    }
    return `${total-num+1}:*`
  }).then(result => {
    return result.reverse().filter(v => v.header.subject[0].match(coach)).map(v => {
      const id = moment(v.attrs.date)
      const [name, from] = v.header.from[0].replace(/\>$/, '').split(' <')
      const saleInfo = v.body.match(regexpSaleInfo);
      const time = moment(v.attrs.date).calendar(null, {
        lastDay: '[昨天] LT',
        sameDay: 'LT',
        nextDay: '[明天] LT',
        lastWeek: 'dddd LT',
        nextWeek: 'dddd LT',
        sameElse: 'L'
      })
      return {
        name,
        from,
        time,
        flags: v.attrs.flags,
        body: saleInfo,
        subject: v.header.subject[0],
        to: v.header.to[0].replace(/^[\s\S]*\<|\>$/g, ''),
        seqno: v.seqno,
        time_id: id,
        title: v.header.subject[0],
      }
    })
  }).catch(e => null)
}