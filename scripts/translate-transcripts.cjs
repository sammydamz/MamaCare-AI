const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  
  const updates = [
    {
      id: 'c001',
      transcript: `[{"text": "Good morning Abena, how are you today? I heard you have a headache.", "speaker": "AI"}, {"text": "I am not feeling well at all. I have had this headache for three days, and my vision is getting blurry.", "speaker": "Mother"}, {"text": "Have you noticed any swelling in your feet or legs?", "speaker": "AI"}, {"text": "Yes, my feet are very swollen.", "speaker": "Mother"}, {"text": "I understand. You need to go to the hospital immediately so we can check on you and your baby.", "speaker": "AI"}]`
    },
    {
      id: 'c002',
      transcript: `[{"text": "Hello Efua, how are you feeling?", "speaker": "AI"}, {"text": "Not good. I am not sleeping well, and I don't even feel like eating.", "speaker": "Mother"}, {"text": "I see. Were you able to attend the counselling session today?", "speaker": "AI"}, {"text": "Yes, but the group support doesn't seem to be working.", "speaker": "Mother"}]`
    },
    {
      id: 'c003',
      transcript: `[{"text": "Good morning Akosua, how are you?", "speaker": "AI"}, {"text": "I am fine, but I feel a little nauseous.", "speaker": "Mother"}, {"text": "That is normal. Are you feeling the baby kick?", "speaker": "AI"}, {"text": "Yes, the baby is kicking very well.", "speaker": "Mother"}]`
    },
    {
      id: 'c004',
      transcript: `[{"text": "Ama, how are you feeling? Are you in pain?", "speaker": "AI"}, {"text": "My stomach hurts so much. Also, my baby is not kicking as much as usual.", "speaker": "Mother"}, {"text": "You need to go to the hospital right now. I am calling an ambulance to come pick you up.", "speaker": "AI"}]`
    },
    {
      id: 'c005',
      transcript: `[{"text": "Hello Yaa, how are you doing?", "speaker": "AI"}, {"text": "I have a bit of back pain and sometimes a headache.", "speaker": "Mother"}, {"text": "Okay. Are you still coming for your checkup next week?", "speaker": "AI"}, {"text": "Yes, I will be there next week.", "speaker": "Mother"}]`
    },
    {
      id: 'c006',
      transcript: `[{"text": "Good morning Esi. How are you?", "speaker": "AI"}, {"text": "I am fine. I am sleeping much better and I feel much happier now.", "speaker": "Mother"}, {"text": "That is wonderful to hear! We will meet again next month.", "speaker": "AI"}]`
    }
  ];

  for (const update of updates) {
    await client.query('UPDATE consultations SET transcript = $1::jsonb WHERE id = $2', [update.transcript, update.id]);
  }
  
  console.log('Transcripts translated to English successfully!');
  await client.end();
}

run().catch(console.error);
