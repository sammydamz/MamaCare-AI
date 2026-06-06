# MamaCare AI Clinical Dashboard

MamaCare AI is a specialized clinical intelligence dashboard built for maternal healthcare providers and community health workers (CHWs) in Ghana. The system assists in monitoring patient health, tracking CHW performance metrics, and analyzing consultations with translation capabilities for local Ghanaian languages.

## Key Features

1. **Patient Monitoring & Analytics**: Track maternal risk profiles and essential vitals.
2. **CHW Performance Metric Tracking**: Log and analyze key indicators of community health worker activities.
3. **Local Transcripts Integration**: Support for consultation transcripts in local Ghanaian languages (Twi, Ga, Ewe, Fante) translated to English.
4. **PostgreSQL Database Integration**: Direct integration with PostgreSQL on Railway.
5. **Modern Dashboard UI**: Rebranded, responsive interface customized for Ghanaian clinical facilities (e.g., Korle-Bu Teaching Hospital, Komfo Anokye Teaching Hospital).

## Getting Started

### Prerequisites

- Node.js >= 20.20.0
- PNPM (recommended package manager)
- PostgreSQL (local or hosted instance)

### Installation

Install all required dependencies:

```bash
pnpm install
```

### Environment Variables

Configure a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3000
```

### Database Migration and Seed

The application automatically checks the database connection, performs migrations, and seeds the initial localized data on server startup.

### Development

To start the development server (runs both Vite frontend and Express backend):

```bash
pnpm run dev
```

### Production Build

To build the client and server bundles:

```bash
pnpm run build
pnpm start
```

## Deployment

This project is configured for seamless deployment to Railway, automatically provisioning a PostgreSQL database and linking environment variables.
