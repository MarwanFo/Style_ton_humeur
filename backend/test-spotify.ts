import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function testSpotify() {
  console.log('Testing Spotify Credentials...');
  console.log('Client ID:', clientId ? 'Set' : 'NOT Set');
  console.log('Client Secret:', clientSecret ? 'Set' : 'NOT Set');

  if (!clientId || !clientSecret) {
    console.error('Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in backend/.env');
    return;
  }

  const accountsUrl = 'https://accounts.spotify.com/api/token';
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    console.log('\n1. Fetching Access Token from accounts.spotify.com...');
    const response = await axios.post(
      accountsUrl,
      new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const token = response.data.access_token;
    console.log('✅ Access Token obtained successfully:', token.substring(0, 15) + '...');

    console.log('\n2. Testing Search Endpoint...');
    const apiBaseUrl = 'https://api.spotify.com/v1/search';
    const recoResponse = await axios.get(apiBaseUrl, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q: 'genre:pop',
        type: 'track',
        limit: 10,
      },
    });

    console.log('✅ Search endpoint response status:', recoResponse.status);
    const tracks = recoResponse.data.tracks.items;
    console.log('Tracks fetched via search:', tracks.length);
    
    // Test Deezer fallback lookup
    for (let i = 0; i < Math.min(3, tracks.length); i++) {
      const track = tracks[i];
      const artist = track.artists[0]?.name || '';
      const title = track.name;
      let previewUrl = track.preview_url;
      
      console.log(`\nAnalyzing [Track ${i + 1}]: "${title}" by ${artist}`);
      if (!previewUrl) {
        console.log('  -> Spotify preview is null. Fetching from Deezer...');
        try {
          const deezerRes = await axios.get(`https://api.deezer.com/search`, {
            params: { q: `${artist} ${title}` }
          });
          const deezerTrack = deezerRes.data?.data?.[0];
          if (deezerTrack?.preview) {
            previewUrl = deezerTrack.preview;
            console.log('  ✅ Found Deezer Preview URL:', previewUrl);
          } else {
            console.log('  ❌ No preview found on Deezer');
          }
        } catch (err: any) {
          console.error('  ❌ Deezer fetch failed:', err.message);
        }
      } else {
        console.log('  ✅ Spotify preview exists:', previewUrl);
      }
    }
  } catch (error: any) {
    console.error('❌ Error testing Spotify API:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    } else {
      console.error('Message:', error.message);
    }
  }
}

testSpotify();
