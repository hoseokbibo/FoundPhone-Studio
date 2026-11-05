const fs = require('fs');
const p = 'stories/template/story.json';
const w = JSON.parse(fs.readFileSync(p, 'utf8'));

const messages = [
  { id: 'k1', senderId: 'namjoon', body: '跟在后面的时候是不是又偷拍我了？', time: '2025-08-05 09:10' },
  { id: 'k2', senderId: 'owner', body: '自恋狂@.@', time: '2025-08-05 09:12' },
  { id: 'k3', senderId: 'owner', body: '', time: '2025-08-05 09:13', kind: 'image', media: '' },
  { id: 'k4', senderId: 'owner', body: '是在拍挂件', time: '2025-08-05 09:13' },
  { id: 'k5', senderId: 'owner', body: 'happy happy birthday!!', time: '2025-09-12 00:00' },
  { id: 'k6', senderId: 'owner', body: '俊', time: '2025-09-12 00:00' },
  { id: 'k7', senderId: 'owner', body: '永远的朋友~', time: '2025-09-12 00:00' },
  { id: 'k8', senderId: 'namjoon', body: '朋友？？？', time: '2025-09-12 00:01' },
  { id: 'k9', senderId: 'owner', body: '总之生日快乐', time: '2025-09-12 00:02' },
  { id: 'k10', senderId: 'owner', body: '会在ig上发南俊很帅气的照片的~', time: '2025-09-12 00:02' },
  { id: 'k11', senderId: 'owner', body: '那个pokemon made', time: '2025-10-26 08:17' },
  { id: 'k12', senderId: 'owner', body: '穿起来还可以吧？', time: '2025-10-26 08:17' },
  { id: 'k13', senderId: 'namjoon', body: '起得这么早', time: '2025-10-26 09:04' },
  { id: 'k14', senderId: 'namjoon', body: '', time: '2025-10-26 09:04', kind: 'image', media: '' },
  { id: 'k15', senderId: 'owner', body: '为什么要把帽子戴在帽子上面hh', time: '2025-10-26 09:29' },
];

w.chats = w.chats || [];
w.chats = w.chats.filter(c => c.id !== 'kakao-namjoon');
w.chats.push({
  id: 'kakao-namjoon',
  app: 'kakao',
  title: '俊',
  participants: ['owner', 'namjoon'],
  messages,
});

fs.writeFileSync(p, JSON.stringify(w, null, 2), 'utf8');
console.log('ok, messages:', messages.length);