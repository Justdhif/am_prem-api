import assert from 'assert';
import { container } from '../src/infrastructure/container.js';
import { createApp } from '../src/app.js';
import { Server } from 'http';
import axios from 'axios';

async function runTests() {
  console.log('🧪 Starting Clean Architecture Alight Motion Prem API Tests...\n');

  // Test 1: FirebaseAuthGateway oobCode parsing logic
  console.log('Test 1: FirebaseAuthGateway oobCode parsing logic');
  const code1 = container.firebaseAuthGateway.extractOobCode(
    'https://alightcreative.com/?oobCode=myCode12345&mode=signIn'
  );
  assert.strictEqual(code1, 'myCode12345');

  const code2 = container.firebaseAuthGateway.extractOobCode(
    'https://alightcreative.com/?link=' +
      encodeURIComponent('https://alightcreative.com/?oobCode=nestedCode999&mode=signIn')
  );
  assert.strictEqual(code2, 'nestedCode999');

  const code3 = container.firebaseAuthGateway.extractOobCode(
    '<https://alightcreative.com/?oobCode=wrappedCode777>'
  );
  assert.strictEqual(code3, 'wrappedCode777');

  const code4 = container.firebaseAuthGateway.extractOobCode('rawOobCodeTokenLongerThan10Chars');
  assert.strictEqual(code4, 'rawOobCodeTokenLongerThan10Chars');

  const codeNull = container.firebaseAuthGateway.extractOobCode('invalid');
  assert.strictEqual(codeNull, null);
  console.log('✅ extractOobCode passed');

  // Test 2: extractEmail logic
  console.log('\nTest 2: extractEmail logic');
  assert.strictEqual(
    container.firebaseAuthGateway.extractEmail(
      'https://alightcreative.com/?email=test%40gmail.com&oobCode=123'
    ),
    'test@gmail.com'
  );
  assert.strictEqual(
    container.firebaseAuthGateway.extractEmail('Hubungi saya di user.name@domain.co.id ya'),
    'user.name@domain.co.id'
  );
  console.log('✅ extractEmail passed');

  // Test 3: friendlyFirebaseError
  console.log('\nTest 3: friendlyFirebaseError mapping');
  assert(container.firebaseAuthGateway.friendlyFirebaseError('INVALID_OOB_CODE').includes('tidak valid'));
  assert(container.firebaseAuthGateway.friendlyFirebaseError('EXPIRED_OOB_CODE').includes('kadaluarsa'));
  assert(container.firebaseAuthGateway.friendlyFirebaseError('INVALID_EMAIL').includes('tidak valid'));
  console.log('✅ friendlyFirebaseError passed');

  // Test 4: InMemorySessionRepository
  console.log('\nTest 4: InMemorySessionRepository pending sessions');
  container.sessionRepository.setSession('user_jid_123', 'test@gmail.com');
  assert.strictEqual(container.sessionRepository.getSession('user_jid_123'), 'test@gmail.com');
  container.sessionRepository.deleteSession('user_jid_123');
  assert.strictEqual(container.sessionRepository.getSession('user_jid_123'), null);
  console.log('✅ InMemorySessionRepository passed');

  // Test 5: FileStatsRepository & GetStatsUseCase
  console.log('\nTest 5: FileStatsRepository & GetStatsUseCase');
  const statsDto = await container.getStatsUseCase.execute();
  assert(typeof statsDto.totalPremium === 'number');
  assert(typeof statsDto.todayPremium === 'number');
  assert(statsDto.formattedText.includes('STATISTIK ALIGHT MOTION PRO'));
  console.log('✅ Stats passed');

  // Test 6: Express App Integration & Web Generator
  console.log('\nTest 6: Express API endpoints & Web Generator');
  const app = createApp();
  const testPort = 3999;
  const server: Server = await new Promise((resolve) => {
    const s = app.listen(testPort, () => resolve(s));
  });

  try {
    const baseUrl = `http://127.0.0.1:${testPort}`;

    // GET /health
    const healthRes = await axios.get(`${baseUrl}/health`);
    assert.strictEqual(healthRes.status, 200);
    assert.strictEqual(healthRes.data.status, 'ok');

    // GET / (Welcome JSON)
    const rootRes = await axios.get(`${baseUrl}/`);
    assert.strictEqual(rootRes.status, 200);
    assert.strictEqual(rootRes.data.author, 'Justdhif');
    assert(rootRes.data.endpoints);
    assert.strictEqual(
      rootRes.data.architecture,
      'Clean Architecture (Domain, Application, Infrastructure, Presentation)'
    );

    // Web UI Test: GET /dashboard (Documentation Only)
    const dashboardRes = await axios.get(`${baseUrl}/dashboard`);
    assert.strictEqual(dashboardRes.status, 200);
    assert(dashboardRes.data.includes('Alight Motion Pro'));
    assert(dashboardRes.data.includes('Dokumentasi'));
    assert(dashboardRes.data.includes('by Justdhif'));

    // Static Asset Test: GET /logo.jpg
    const logoRes = await axios.get(`${baseUrl}/logo.jpg`);
    assert.strictEqual(logoRes.status, 200);

    // GET /api/am/help
    const helpRes = await axios.get(`${baseUrl}/api/am/help`);
    assert.strictEqual(helpRes.status, 200);
    assert(helpRes.data.formattedText.includes('PANDUAN ALIGHT MOTION PRO'));

    // GET /api/am/stats
    const statsRes = await axios.get(`${baseUrl}/api/am/stats`);
    assert.strictEqual(statsRes.status, 200);
    assert(statsRes.data.formattedText.includes('STATISTIK ALIGHT MOTION PRO'));

    // POST /api/am/command (!amhelp) -> 200
    const cmdHelpRes = await axios.post(`${baseUrl}/api/am/command`, {
      text: '!amhelp',
    });
    assert.strictEqual(cmdHelpRes.status, 200);
    assert.strictEqual(cmdHelpRes.data.command, 'amhelp');
    assert(cmdHelpRes.data.replyText.includes('PANDUAN'));

    // POST /api/am/command (!amstats) -> 200
    const cmdStatsRes = await axios.post(`${baseUrl}/api/am/command`, {
      text: '!amstats',
    });
    assert.strictEqual(cmdStatsRes.status, 200);
    assert.strictEqual(cmdStatsRes.data.command, 'amstats');
    assert(cmdStatsRes.data.replyText.includes('STATISTIK'));

    // POST /api/am/command (!amprem without email) -> 400 with helpful format
    try {
      await axios.post(`${baseUrl}/api/am/command`, { text: '!amprem' });
      assert.fail('Should have thrown 400');
    } catch (err: any) {
      assert.strictEqual(err.response?.status, 400);
      assert(err.response?.data?.replyText.includes('Format Belum Lengkap'));
    }

    // POST /api/am/verify without email and no session -> 400 with format guide
    try {
      await axios.post(`${baseUrl}/api/am/verify`, {
        link: 'https://alightcreative.com/?oobCode=123',
      });
      assert.fail('Should have thrown 400');
    } catch (err: any) {
      assert.strictEqual(err.response?.status, 400);
      assert(err.response?.data?.message.includes('belum lengkap'));
    }

    // Security Test: Check server signature masking
    assert.strictEqual(healthRes.headers['x-powered-by'], undefined);

    // Security Test: Input validation rejects oversized email
    try {
      await axios.post(`${baseUrl}/api/am/send-link`, {
        email: 'a'.repeat(150) + '@gmail.com',
      });
      assert.fail('Should have thrown 400 for oversized email');
    } catch (err: any) {
      assert.strictEqual(err.response?.status, 400);
      assert(err.response?.data?.message.includes('terlalu panjang'));
    }

    // Test 7: TikTok Preset Finder Logic & Endpoint
    console.log('\nTest 7: TikTok Preset Finder Regex & Extraction Logic');
    const sampleCaption = 'Preset jedag jedug viral xml drive: https://drive.google.com/file/d/123456/view?usp=sharing';
    const sampleComment1 = 'Preset 5mb: https://alight.link/aBcDeFgH123 yuk comot';
    const sampleComment2 = 'xml nya disini ya guys alight.link/xYz987 dan mediafire https://www.mediafire.com/file/sample/preset.xml';

    const pCaption = container.findAlightPresetUseCase.extractPresetsFromText(
      sampleCaption,
      'caption',
      'creator_user',
      true
    );
    assert.strictEqual(pCaption.length, 1);
    assert.strictEqual(pCaption[0].type, 'google_drive');

    const pComment1 = container.findAlightPresetUseCase.extractPresetsFromText(
      sampleComment1,
      'comment',
      'creator_user',
      true
    );
    assert.strictEqual(pComment1.length, 1);
    assert.strictEqual(pComment1[0].url, 'https://alight.link/aBcDeFgH123');
    assert.strictEqual(pComment1[0].type, 'alight_link');

    const pComment2 = container.findAlightPresetUseCase.extractPresetsFromText(
      sampleComment2,
      'comment',
      'other_user',
      false
    );
    assert.strictEqual(pComment2.length, 2);
    assert.strictEqual(pComment2[0].url, 'https://alight.link/xYz987');
    assert.strictEqual(pComment2[1].type, 'mediafire');

    // TikTok URL Extraction
    assert.strictEqual(
      container.tikTokGateway.extractTikTokUrl('Tonton video ini https://vt.tiktok.com/ZSjR1234/ mantap'),
      'https://vt.tiktok.com/ZSjR1234/'
    );
    assert.strictEqual(
      container.tikTokGateway.extractTikTokUrl('https://www.tiktok.com/@user/video/7106594312292453675?is_from_webapp=1'),
      'https://www.tiktok.com/@user/video/7106594312292453675'
    );

    // POST /api/am/preset/find validation (invalid URL throws 400)
    try {
      await axios.post(`${baseUrl}/api/am/preset/find`, { url: 'https://youtube.com/watch?v=123' });
      assert.fail('Should have failed for non-TikTok URL');
    } catch (err: any) {
      assert.strictEqual(err.response?.status, 400);
      assert(err.response?.data?.message.includes('TikTok'));
    }

    // POST /api/am/command (!ampreset without url) -> 400
    try {
      await axios.post(`${baseUrl}/api/am/command`, { text: '!ampreset' });
      assert.fail('Should have failed for empty !ampreset');
    } catch (err: any) {
      assert.strictEqual(err.response?.status, 400);
      assert(err.response?.data?.replyText.includes('Belum Lengkap'));
    }
    console.log('✅ TikTok Preset Finder passed');

    // Test 8: Comment Section & Threaded Replies
    console.log('\nTest 8: Comment Section & Threaded Replies');
    // POST /api/comments (Parent comment)
    const parentCommentRes = await axios.post(`${baseUrl}/api/comments`, {
      name: 'Dhif Testing',
      content: 'Halo ini komentar pertama!',
      isAnonymous: false,
    });
    assert.strictEqual(parentCommentRes.status, 201);
    assert.strictEqual(parentCommentRes.data.success, true);
    assert.strictEqual(parentCommentRes.data.data.name, 'Dhif Testing');
    const parentId = parentCommentRes.data.data.id;

    // POST /api/comments (Reply as Anonymous)
    const replyRes = await axios.post(`${baseUrl}/api/comments`, {
      parentId: parentId,
      name: 'Budi',
      content: 'Halo juga dari anonim!',
      isAnonymous: true,
    });
    assert.strictEqual(replyRes.status, 201);
    assert.strictEqual(replyRes.data.data.name, 'Anonim');
    assert.strictEqual(replyRes.data.data.isAnonymous, true);
    assert.strictEqual(replyRes.data.data.parentId, parentId);
    const replyId = replyRes.data.data.id;

    // POST /api/comments (Nested reply to the reply)
    const nestedReplyRes = await axios.post(`${baseUrl}/api/comments`, {
      parentId: replyId,
      name: 'Creator',
      content: 'Terima kasih sudah membalas!',
      isAnonymous: false,
    });
    assert.strictEqual(nestedReplyRes.status, 201);
    assert.strictEqual(nestedReplyRes.data.data.parentId, replyId);

    // GET /api/comments -> tree structure verification
    const getCommentsRes = await axios.get(`${baseUrl}/api/comments`);
    assert.strictEqual(getCommentsRes.status, 200);
    assert(getCommentsRes.data.totalComments >= 3);
    const foundParent = getCommentsRes.data.comments.find((c: any) => c.id === parentId);
    assert(foundParent, 'Parent comment should be in tree');
    assert.strictEqual(foundParent.replies.length >= 1, true);
    assert.strictEqual(foundParent.replies[0].id, replyId);
    const foundNested = foundParent.replies.find((r: any) => r.id === nestedReplyRes.data.data.id);
    assert(foundNested, 'Nested reply should be aligned in root replies');
    assert.strictEqual(foundNested.replyToName, 'Anonim');

    // POST /api/comments validation: empty content should fail
    try {
      await axios.post(`${baseUrl}/api/comments`, { content: '   ' });
      assert.fail('Should have failed for empty content');
    } catch (err: any) {
      assert.strictEqual(err.response?.status, 400);
    }
    console.log('✅ Comment Section & Threaded Replies passed');

    console.log('✅ Express API endpoints & Web Generator passed');
  } finally {
    server.close();
  }

  console.log('\n🎉 ALL CLEAN ARCHITECTURE TESTS PASSED SUCCESSFULLY! 🎉\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
