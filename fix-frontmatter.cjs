const fs = require('fs');
const path = require('path');

const dir = './src/content/posts';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const full = path.join(dir, file);
  let content = fs.readFileSync(full, 'utf-8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return;

  let fm = match[1];
  const body = content.slice(match[0].length);

  // 字段映射
  fm = fm.replace(/^pubDate:/m, 'published:');
  fm = fm.replace(/^heroImage:/m, 'image:');
  fm = fm.replace(/^updatedDate:/m, 'updated:');
  
  // 如果 description 是空的，补一个占位
  if (!/^description:/m.test(fm)) {
    fm += '\ndescription: ""';
  }

  const newContent = `---\n${fm}\n---${body}`;
  fs.writeFileSync(full, newContent, 'utf-8');
  console.log(`已处理: ${file}`);
});