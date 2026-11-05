const fs = require('fs');
const p = 'stories/template/story.json';
const w = JSON.parse(fs.readFileSync(p, 'utf8'));

// 1. 顶层 contacts 只保留 owner，满足编译器和参与者的校验
// （因为 chats 里用了 owner 和 namjoon 等，最好全留，但不给 body）
const neededIds = ['owner', 'namjoon', 'jin', 'yoongi', 'jimin', 'taehyung', 'jungkook', 'mom', 'dad', 'sister', 'bangpd'];
w.contacts = neededIds.map(id => ({
  id,
  name: id === 'owner' ? 'hope' : id,
  phone: '***'
}));

// 2. 彻底重写 content.contacts（10个人，不含 owner）
const blank = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const contactNames = {
  namjoon: '俊', jin: '硕珍哥', yoongi: '玧其哥', jimin: '智旻尼', 
  taehyung: '泰亨儿', jungkook: '柾国', mom: '妈妈', dad: '爸爸', 
  sister: '姐姐', bangpd: '方pd'
};

w.content = w.content || {};
w.content.contacts = Object.keys(contactNames).map(id => ({
  id: 'contact-' + id,
  title: contactNames[id],
  body: '***',
  time: '2026-03-01 10:00',
  sender: 'hope',
  folder: '所有联系人',
  avatar: blank
}));

fs.writeFileSync(p, JSON.stringify(w, null, 2), 'utf8');
console.log('ok');