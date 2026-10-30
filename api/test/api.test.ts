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

    // Web UI / Dashboard Info Test: GET /dashboard
    const dashboardRes = await axios.get(`${baseUrl}/dashboard`);
    assert.strictEqual(dashboardRes.status, 200);
    assert.strictEqual(dashboardRes.data.service, 'alight-motion-premium-api');
    assert.strictEqual(dashboardRes.data.author, 'Justdhif');

    // Static Asset Test: GET /logo.jpg
    const logoRes = await axios.get(`${baseUrl}/logo.jpg`);
    assert.strictEqual(logoRes.status, 200);

    // GET /api/am/stats & GET /api/stats -> 200
    const statsApiRes = await axios.get(`${baseUrl}/api/am/stats`);
    assert.strictEqual(statsApiRes.status, 200);
    assert.strictEqual(statsApiRes.data.success, true);
    assert(typeof statsApiRes.data.data.totalPremium === 'number');

    const statsRootRes = await axios.get(`${baseUrl}/api/stats`);
    assert.strictEqual(statsRootRes.status, 200);
    assert.strictEqual(statsRootRes.data.success, true);


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

    // YouTube URL Extraction (Watch, Shorts, youtu.be)
    const ytWatch = container.youTubeGateway.extractYouTubeUrl('Cek https://www.youtube.com/watch?v=dQw4w9WgXcQ keren');
    assert(ytWatch !== null);
    assert.strictEqual(ytWatch?.videoId, 'dQw4w9WgXcQ');

    const ytShorts = container.youTubeGateway.extractYouTubeUrl('https://youtube.com/shorts/dQw4w9WgXcQ?feature=share');
    assert(ytShorts !== null);
    assert.strictEqual(ytShorts?.videoId, 'dQw4w9WgXcQ');

    const ytShortUrl = container.youTubeGateway.extractYouTubeUrl('https://youtu.be/dQw4w9WgXcQ');
    assert(ytShortUrl !== null);
    assert.strictEqual(ytShortUrl?.videoId, 'dQw4w9WgXcQ');

    // POST /api/am/preset/find validation (invalid non-supported URL throws 400)
    try {
      await axios.post(`${baseUrl}/api/am/preset/find`, { url: 'https://instagram.com/reel/123456/' });
      assert.fail('Should have failed for non-supported URL');
    } catch (err: any) {
      assert.strictEqual(err.response?.status, 400);
      assert(err.response?.data?.message.includes('TikTok') || err.response?.data?.message.includes('YouTube'));
    }

    // POST /api/am/command (!ampreset without url) -> 400
    try {
      await axios.post(`${baseUrl}/api/am/command`, { text: '!ampreset' });
      assert.fail('Should have failed for empty !ampreset');
    } catch (err: any) {
      assert.strictEqual(err.response?.status, 400);
      assert(err.response?.data?.replyText.includes('Belum Lengkap'));
    }

    // Prioritas 1: Ekstraksi link preset langsung (alightcreative / drive / mediafire dll)
    const sampleDirectText = 'XML pm wak🗿 5mb:\nhttps://alightcreative.com/am/share/u/SRTPfg8lX3qOFUZGSXKMvr2ZF2/p/wSi2LfMf-943c09596b6ff61f\nDrive: https://drive.google.com/file/d/123/view';
    const extractedDirect = container.findAlightPresetUseCase.extractPresetsFromText(
      sampleDirectText,
      'comment',
      'mailreal_',
      true
    );
    assert.strictEqual(extractedDirect.length, 2);
    assert.strictEqual(extractedDirect[0].priority, 'preset_link');
    assert.strictEqual(extractedDirect[0].type, 'alight_creative');
    assert.strictEqual(extractedDirect[1].priority, 'preset_link');
    assert.strictEqual(extractedDirect[1].type, 'google_drive');

    // Prioritas 2: Ekstraksi Ajakan Join Saluran / Join SL (WhatsApp Channel)
    const sampleSaluranText = 'Xml & dll di saluran wa:\nhttps://whatsapp.com/channel/0029Vb9Bq88KGGGFFoqPEX3Y/112';
    const extractedSaluran = container.findAlightPresetUseCase.extractPresetsFromText(
      sampleSaluranText,
      'comment',
      'creator_am',
      true
    );
    assert.strictEqual(extractedSaluran.length, 1);
    assert.strictEqual(extractedSaluran[0].priority, 'join_saluran');
    assert.strictEqual(extractedSaluran[0].type, 'whatsapp_channel');
    assert.strictEqual(extractedSaluran[0].url, 'https://whatsapp.com/channel/0029Vb9Bq88KGGGFFoqPEX3Y/112');

    // Prioritas 2: Deteksi teks "join sl" tanpa tautan langsung (arahkan ke bio)
    const sampleJoinSlText = 'Preset 5mb & xml join sl di bio ya!';
    const extractedJoinSl = container.findAlightPresetUseCase.extractPresetsFromText(
      sampleJoinSlText,
      'comment',
      'fajaruzumaki',
      true
    );
    assert.strictEqual(extractedJoinSl.length, 1);
    assert.strictEqual(extractedJoinSl[0].priority, 'join_saluran');
    assert.strictEqual(extractedJoinSl[0].label, 'Ajakan Join Saluran (Join SL)');

    console.log('✅ Multi-Platform Preset Finder (TikTok & YouTube, 2 Prioritas) passed');

    // Test 8: HTTP Status Codes Coverage (200, 400, 429, 500, 404)
    console.log('\nTest 8: HTTP Status Codes Coverage (200, 400, 429, 500, 404)');
    const { classifyError } = await import('../src/presentation/middlewares/errorHandler.js');

    // 9a. Verify classifyError utility
    const err400 = classifyError(new Error('Format email tidak valid.'));
    assert.strictEqual(err400.statusCode, 400);
    assert.strictEqual(typeof err400.error, 'string');

    const err429 = classifyError(new Error('Terlalu banyak permintaan ke API.'));
    assert.strictEqual(err429.statusCode, 429);
    assert.strictEqual(err429.error, 'Rate limit exceeded');

    const err500 = classifyError(new Error('Koneksi database PostgreSQL terputus.'), 500);
    assert.strictEqual(err500.statusCode, 500);
    assert.strictEqual(err500.error, 'Internal Server Error');

    // 9b. GET /api/am/stats with invalid query parameter -> 400 Bad Request
    try {
      await axios.get(`${baseUrl}/api/am/stats?unknownQueryParam=1`);
      assert.fail('Should have failed for invalid query params');
    } catch (err: any) {
      assert.strictEqual(err.response?.status, 400);
      assert.strictEqual(err.response?.data?.success, false);
      assert.strictEqual(err.response?.data?.error, 'Bad Request');
    }

    // 9c. 404 Not Found route handler
    try {
      await axios.get(`${baseUrl}/api/am/non-existent-endpoint`);
      assert.fail('Should have returned 404');
    } catch (err: any) {
      assert.strictEqual(err.response?.status, 404);
      assert.strictEqual(err.response?.data?.success, false);
      assert.strictEqual(err.response?.data?.error, 'Not Found');
    }
    console.log('✅ HTTP Status Codes Coverage passed');

    console.log('✅ Express API endpoints & Web Generator passed');
  } finally {
    server.close();
  }

  console.log('\n🎉 ALL CLEAN ARCHITECTURE TESTS PASSED SUCCESSFULLY! 🎉\n');
}

runTests().then(() => process.exit(0)).catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
