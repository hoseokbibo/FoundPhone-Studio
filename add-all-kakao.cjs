const fs = require('fs');
const p = 'stories/template/story.json';
const w = JSON.parse(fs.readFileSync(p, 'utf8'));

// 10 个联系人（从 content.contacts 取，排除 owner）
const people = (w.content.contacts || []).map(c => ({
  id: c.id.replace('contact-', ''),
  name: c.title,
  phone: '***',
}));

// 顶层 contacts = owner + 10 人（去重）
const map = new Map();
map.set('owner', { id: 'owner', name: 'hope', phone: '***' });
for (const p2 of people) map.set(p2.id, p2);
w.contacts = [...map.values()];

// 已存在的会话 id
const existing = new Set((w.chats || []).map(c => c.id));

// 给每个人建一个会话（已存在的跳过，namjoon 已有聊天保留）
for (const person of people) {
  const cid = 'kakao-' + person.id;
  if (existing.has(cid)) continue;
  w.chats.push({
    id: cid,
    app: 'kakao',
    title: person.name,
    participants: ['owner', person.id],
    messages: [
      {
        id: cid + '-m1',
        senderId: person.id,
        body: '（这里还没有聊天记录）',
        time: '2026-09-04 20:00',
      },
    ],
  });
}

fs.writeFileSync(p, JSON.stringify(w, null, 2), 'utf8');
console.log('contacts:', w.contacts.length, 'chats:', w.chats.length);