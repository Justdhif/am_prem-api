import assert from 'assert';
import { container } from '../src/infrastructure/container.js';
import { createApp } from '../src/app.js';
import { Server } from 'http';
import axios from 'axios';

async function runTests() {
  console.log('🧪 Starting Clean Architecture Alight Motion Prem API Tests...\n');

  // Test 1: FirebaseAuthGateway parsing logic
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
  const statsDto = container.getStatsUseCase.execute();
  assert(typeof statsDto.totalPremium === 'number');
  assert(typeof statsDto.todayPremium === 'number');
  assert(statsDto.formattedText.includes('STATISTIK ALIGHT MOTION PRO'));
  console.log('✅ Stats passed');

  // Test 6: Express App Integration
  console.log('\nTest 6: Express API endpoints');
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

    // GET /docs/json (Swagger OpenAPI Spec)
    const swaggerJsonRes = await axios.get(`${baseUrl}/docs/json`);
    assert.strictEqual(swaggerJsonRes.status, 200);
    assert.strictEqual(swaggerJsonRes.data.openapi, '3.0.3');
    assert(swaggerJsonRes.data.info.title.includes('Justdhif'));

    // GET /docs/ (Swagger UI HTML)
    const swaggerUiRes = await axios.get(`${baseUrl}/docs/`);
    assert.strictEqual(swaggerUiRes.status, 200);
    assert(swaggerUiRes.data.includes('swagger'));

    // GET /
    const rootRes = await axios.get(`${baseUrl}/`);
    assert.strictEqual(rootRes.status, 200);
    assert.strictEqual(rootRes.data.author, 'Justdhif');
    assert(rootRes.data.endpoints);
    assert.strictEqual(
      rootRes.data.architecture,
      'Clean Architecture (Domain, Application, Infrastructure, Presentation)'
    );

    // GET /api/am/help
    const helpRes = await axios.get(`${baseUrl}/api/am/help`);
    assert.strictEqual(helpRes.status, 200);
    assert(helpRes.data.formattedText.includes('PANDUAN ALIGHT MOTION PRO'));

    // GET /api/am/stats
    const statsRes = await axios.get(`${baseUrl}/api/am/stats`);
    assert.strictEqual(statsRes.status, 200);
    assert(statsRes.data.formattedText.includes('STATISTIK ALIGHT MOTION PRO'));

    // POST /api/am/command (!amhelp)
    const cmdHelpRes = await axios.post(`${baseUrl}/api/am/command`, {
      text: '!amhelp',
    });
    assert.strictEqual(cmdHelpRes.status, 200);
    assert.strictEqual(cmdHelpRes.data.command, 'amhelp');
    assert(cmdHelpRes.data.replyText.includes('PANDUAN'));

    // POST /api/am/command (!amstats)
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

    console.log('✅ Express API endpoints passed');
  } finally {
    server.close();
  }

  console.log('\n🎉 ALL CLEAN ARCHITECTURE TESTS PASSED SUCCESSFULLY! 🎉\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
