import pkg from 'pg';
const { Client } = pkg;
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function seedPatients() {
  try {
    await client.connect();
    console.log("Connected. Clearing existing patients and seeding 15 new mothers...");

    // Replace the whole patient table with the seed
    await client.query("DELETE FROM patients");
    
    let patients = [];

    // 10 Prenatal Mothers
    for (let i = 0; i < 10; i++) {
      const riskLevel = faker.helpers.arrayElement(['LOW', 'MEDIUM', 'HIGH']);
      
      // Assign the test number to the very first prenatal mother
      let phone = `+23324${Math.floor(1000000 + Math.random() * 9000000)}`;
      if (i === 0) {
        phone = '+233597110983';
      }

      patients.push({
        id: `p-prenatal-${Date.now()}-${i}`,
        name: i === 0 ? 'Nana Yaa' : faker.person.fullName({ sex: 'female' }),
        age: faker.number.int({ min: 18, max: 40 }),
        pathway: 'Pregnancy',
        risk_level: riskLevel,
        language: 'English',
        assigned_chw: 'Sarah Coffie',
        stage: `${faker.number.int({ min: 4, max: 40 })} weeks`,
        last_call_date: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
        registration_date: faker.date.past({ years: 1 }).toISOString().split('T')[0],
        risk_history: JSON.stringify([
          { date: faker.date.past({ years: 1 }).toISOString().split('T')[0], level: 'LOW' },
          { date: faker.date.recent({ days: 30 }).toISOString().split('T')[0], level: riskLevel }
        ]),
        coping_index: null,
        phone: phone
      });
    }

    // 5 Post-Loss Mothers
    for (let i = 0; i < 5; i++) {
      const riskLevel = faker.helpers.arrayElement(['LOW', 'MEDIUM', 'HIGH']);
      const phone = `+23324${Math.floor(1000000 + Math.random() * 9000000)}`;
      
      patients.push({
        id: `p-postloss-${Date.now()}-${i}`,
        name: faker.person.fullName({ sex: 'female' }),
        age: faker.number.int({ min: 18, max: 40 }),
        pathway: 'Post-Loss',
        risk_level: riskLevel,
        language: 'English',
        assigned_chw: 'Sarah Coffie',
        stage: `Post-loss: ${faker.number.int({ min: 1, max: 12 })} months`,
        last_call_date: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
        registration_date: faker.date.past({ years: 1 }).toISOString().split('T')[0],
        risk_history: JSON.stringify([
          { date: faker.date.past({ years: 1 }).toISOString().split('T')[0], level: 'HIGH' },
          { date: faker.date.recent({ days: 30 }).toISOString().split('T')[0], level: riskLevel }
        ]),
        coping_index: faker.number.int({ min: 1, max: 10 }),
        phone: phone
      });
    }

    // Insert into DB
    const insertQuery = `
      INSERT INTO patients (id, name, age, pathway, risk_level, language, assigned_chw, stage, last_call_date, registration_date, risk_history, coping_index, phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `;

    for (const p of patients) {
      await client.query(insertQuery, [
        p.id, p.name, p.age, p.pathway, p.risk_level, p.language, p.assigned_chw, p.stage, p.last_call_date, p.registration_date, p.risk_history, p.coping_index, p.phone
      ]);
    }

    console.log("Successfully seeded 15 patients!");
  } catch (err) {
    console.error("Error seeding patients:", err);
  } finally {
    await client.end();
  }
}

seedPatients();
