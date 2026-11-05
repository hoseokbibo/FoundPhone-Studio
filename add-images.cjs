const fs = require('fs');
const p = 'stories/template/story.json';
const w = JSON.parse(fs.readFileSync(p, 'utf8'));

function toBase64(file) {
  try {
    const b = fs.readFileSync(file);
    return 'data:image/jpeg;base64,' + b.toString('base64');
  } catch (e) {
    console.log('读取失败，请确认图片名字和位置:', file);
    return '';
  }
}

const img1 = toBase64('img1.jpg');
const img2 = toBase64('img2.jpg');

const chat = w.chats.find(c => c.id === 'kakao-namjoon');
if (chat) {
  const m3 = chat.messages.find(m => m.id === 'k3'); // 这里改了
  if (m3 && img1) {
    m3.media = img1;
    m3.kind = 'image';
  }
  const m14 = chat.messages.find(m => m.id === 'k14'); // 这里改了
  if (m14 && img2) {
    m14.media = img2;
    m14.kind = 'image';
  }
}

fs.writeFileSync(p, JSON.stringify(w, null, 2), 'utf8');
console.log('图片已写入 story.json');