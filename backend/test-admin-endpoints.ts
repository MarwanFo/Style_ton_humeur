import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

async function testEndpoints() {
  console.log('🧪 Starting Admin Endpoints Integration Checks...');

  // 1. Test Login
  console.log('\n🔑 Testing POST /auth/login with Admin Credentials...');
  let token = '';
  try {
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@aurastudio.com',
      pass: 'admin123'
    });

    console.log('✅ Login successful!');
    console.log('   Response keys:', Object.keys(loginRes.data));
    console.log('   User role: ', loginRes.data.user.role);
    console.log('   User plan: ', loginRes.data.user.plan);
    token = loginRes.data.access_token;
  } catch (error: any) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    process.exit(1);
  }

  // 2. Test Protected Stats Endpoint (Without Token)
  console.log('\n🔒 Testing GET /admin/stats WITHOUT Token (Should Fail)...');
  try {
    await axios.get(`${BASE_URL}/admin/stats`);
    console.error('❌ Error: Stats endpoint allowed request without token!');
  } catch (error: any) {
    console.log(`✅ Request rejected as expected (Status: ${error.response?.status})`);
  }

  // 3. Test Protected Stats Endpoint (With Token)
  console.log('\n📊 Testing GET /admin/stats WITH Bearer Token...');
  try {
    const statsRes = await axios.get(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Stats fetched successfully!');
    console.log('   Data:', JSON.stringify(statsRes.data, null, 2));
  } catch (error: any) {
    console.error('❌ Stats fetch failed:', error.response?.data || error.message);
  }

  // 4. Test Protected Users List Endpoint
  console.log('\n👥 Testing GET /admin/users WITH Bearer Token...');
  try {
    const usersRes = await axios.get(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Users list fetched successfully!');
    console.log(`   Found ${usersRes.data.length} users in the database.`);
    if (usersRes.data.length > 0) {
      console.log('   First user snippet:', {
        email: usersRes.data[0].email,
        role: usersRes.data[0].role,
        plan: usersRes.data[0].plan,
        streak: usersRes.data[0].streak
      });
    }
  } catch (error: any) {
    console.error('❌ Users list fetch failed:', error.response?.data || error.message);
  }
}

testEndpoints();
