const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  const id = 'c' + Math.floor(1000 + Math.random() * 9000);
  const date = new Date().toISOString().split('T')[0];
  
  await client.query(
    'INSERT INTO consultations (id, patient_id, patient_name, date, language, symptoms, risk_level, ai_summary, transcript, triggered_referral, audio_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
    [
      id, 
      'p004', 
      'Ama Serwaa', 
      date, 
      'Twi', 
      ['blurred vision', 'flashing lights', 'pounding headache'], 
      'High', 
      'The mother reports experiencing blurred vision, seeing flashing lights, and a persistent pounding headache. These symptoms are indicative of potential severe pre-eclampsia.', 
      JSON.stringify([
        {"speaker": "AI", "text": "Hello, how are you doing today?"}, 
        {"speaker": "Mother", "text": "Not so well. My vision is getting really blurry and I see flashing lights."}, 
        {"speaker": "AI", "text": "I am sorry to hear that. Any other issues?"}, 
        {"speaker": "Mother", "text": "I have a pounding headache that will not go away."}
      ]), 
      true, 
      null
    ]
  );
  console.log('Dummy call inserted successfully.');
  await client.end();
}

run().catch(console.error);
