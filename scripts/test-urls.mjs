import assert from 'node:assert/strict';
import { normalizePath, blogPath, languagePaths } from '../src/utils/urls.js';
for (const suffix of ['', '/', '///']) {
  assert.equal(normalizePath(`/blog${suffix}`), '/blog');
  assert.equal(blogPath(suffix), '/blog');
  assert.deepEqual(languagePaths(`/blog/en${suffix}`), { zh: '/blog', en: '/blog/en' });
  assert.deepEqual(languagePaths(`/blog${suffix}`), { zh: '/blog', en: '/blog/en' });
  assert.deepEqual(languagePaths(`/blog/en/adhd-asd-boundaries${suffix}`), {
    zh: '/blog/adhd-asd-boundaries', en: '/blog/en/adhd-asd-boundaries',
  });
}
assert.equal(normalizePath('/'), '/');
assert.equal(blogPath('/nested/post/', 'en'), '/blog/en/nested/post');
assert.equal(blogPath('adhd-asd-boundaries', 'zh'), '/blog/adhd-asd-boundaries');
assert.deepEqual(languagePaths('/blog/enough/'), { zh: '/blog/enough', en: '/blog/en/enough' });
assert.deepEqual(languagePaths('/blogger/'), { zh: '/blogger', en: '/blogger' });
console.log('URL helper regression checks passed');
