# 🌫️ AirNet — Real-Time Air Quality Intelligence Platform

> **Government-grade air quality monitoring, AI-powered policy simulation, and atmospheric analytics for Delhi NCR.**

AirNet is a full-stack web application that pulls live air quality data from the WAQI (World Air Quality Index) network, enriches it with Google Gemini AI analysis, stores zone-level readings in a SQLite database, and presents them on an interactive real-time dashboard. A built-in policy simulation engine lets users model the impact of government interventions — such as traffic restrictions and industrial caps — on projected AQI outcomes.

---

## 🖼️ Overview

| System | Description |
|--------|-------------|
| **System 1 — Live Sensor Feed** | Syncs real-time AQI, PM2.5, PM10, NO₂ data from WAQI for 20 Delhi NCR zones every 30 minutes |
| **System 2 — 24h AQI Forecast** | Pulls 2-day hourly forecasts from Open-Meteo and anchors them to live WAQI baselines per zone |
| **System 3 — AI Analysis** | Uses Gemini AI to estimate zone-level stress, spike probability, vulnerability, and pollution source |
| **System 4 — Policy Simulation Engine** | Deterministic, sub-200ms simulation of government interventions using weighted impact matrices and Gaussian plume dispersion |

---

## ✨ Features

- 🗺️ **Interactive NCR Map** — Live AQI heatmap of 20 Delhi NCR zones with pollutant drill-down
- 📈 **Analytics Dashboard** — Trend charts, city comparisons, hotspot detection, and 30/60-day historical baselines
- 🤖 **AI Policy Recommendations** — Gemini AI generates ranked, source-specific intervention strategies per zone with disruption vs. impact scatter analysis
- ⚙️ **Policy Simulation** — 5-slider real-time simulation (traffic, industrial, heavy vehicles, dust, construction) with projected AQI drop and recovery time
- 🏛️ **Government Policy Generator** — AI-assisted policy drafts with Gaussian Plume atmospheric dispersion modelling for quantified impact estimates
- 📊 **Reports API** — Structured API endpoints for programmatic access to all analytics data
- 🔄 **Auto-sync** — WAQI data synced every 30 minutes; database auto-pruned to a rolling 60-day window

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express 5 |
| **Database** | SQLite3 via Sequelize ORM |
| **AI Engine** | Google Gemini API (`gemini-2.0-flash` / `gemini-1.5-flash`) |
| **Air Quality Data** | WAQI API (World Air Quality Index) |
| **Weather Forecast** | Open-Meteo AQI API |
| **Security** | Helmet.js, CORS, dotenv |

---

## 📁 Project Structure

```
airnet/
├── api/                        # REST API route handlers
│   ├── analytics.js            # Trend analysis, city comparison, hotspot detection, zone history
│   ├── policy.js               # AI policy generation, Gaussian plume simulation, recommendations
│   ├── reports.js              # Structured reporting endpoints
│   ├── sensors.js              # Live sensor data & WAQI sync trigger
│   └── simulate.js             # Fast deterministic policy simulation engine (<200ms)
│
├── config/
│   ├── apis.js                 # Centralised API base URL configuration
│   ├── database.js             # Sequelize/SQLite connection setup
│   └── impactWeights.json      # Sector emission reduction weights for simulation
│
├── db/
│   └── schema.sql              # SQLite schema (zone_readings, AtmosphericReadings, Policies, ImpactSimulations)
│
├── models/
│   ├── index.js                # Sequelize model registry & DB init
│   ├── AtmosphericReading.js   # City-level AQI readings model
│   ├── ZoneReading.js          # Zone-level historical readings model
│   ├── Policy.js               # Government policy model
│   └── ImpactSimulation.js     # Policy simulation result model
│
├── scripts/
│   └── generate_historical_policy.js  # Utility: seed historical policy data
│
├── utils/
│   └── waqiService.js          # WAQI sync, Gemini AI analysis, Open-Meteo forecast, DB write, pruning
│
├── api.js                      # Client-side API helper (frontend fetch utilities)
├── api_server.js               # Express API server entry point (port 4000)
├── server.js                   # Static file server entry point (port 3005)
├── app.js                      # Main frontend dashboard application
├── index.html                  # Main dashboard page
├── styles.css                  # Dashboard styles
├── home.html                   # Landing / home page
├── home.js                     # Home page logic
├── home.css                    # Home page styles
├── .env.example                # Environment variable template
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- A **WAQI API token** — [Get one free at aqicn.org](https://aqicn.org/data-platform/token/)
- *(Optional)* A **Google Gemini API key** — [Get one at aistudio.google.com](https://aistudio.google.com/apikey) — enables AI zone analysis and policy generation. Without it, the app falls back to a local scoring engine.

### 1. Clone the Repository

```bash
git clone https://github.com/PranavGupta1406/AirNet.git
cd AirNet
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
API_PORT=4000
FRONTEND_PORT=3005

# Google Gemini AI (optional but recommended)
GEMINI_API_KEY=your_gemini_api_key_here

# WAQI Real-Time Air Quality Feed (required)
WAQI_API_KEY=your_waqi_api_key_here
WAQI_CITY_URL=delhi
```

### 4. Run the Application

**Development (both servers):**
```bash
npm run dev
```

**Production (frontend only):**
```bash
npm start
```

> This starts both the **static file server** on `http://localhost:3005` and the **REST API server** on `http://localhost:4000`.

### 5. Open in Browser

Navigate to **[http://localhost:3005](http://localhost:3005)**

---

## 🌐 API Reference

The REST API is served on `http://localhost:4000/api/v1`.

### Sensors
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/sensors/live` | Fetch latest AQI readings for all zones |
| `POST` | `/sensors/sync` | Manually trigger a WAQI data sync |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/analytics/trends?city_id=delhi&days=7` | Hourly AQI trend data |
| `GET` | `/analytics/compare` | Latest AQI for all tracked Indian cities |
| `GET` | `/analytics/hotspots?threshold=200` | Cities exceeding a given AQI threshold |
| `GET` | `/analytics/zone-trend?zone=Rohini&hours=24` | Zone-level trend metrics |
| `GET` | `/analytics/zone-history?zone=Rohini` | 60-day historical baseline for simulation |

### Policy
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/policy` | List all policies |
| `POST` | `/policy/suggest` | Generate an AI policy from live hotspot data |
| `POST` | `/policy/simulate` | Run Gaussian plume impact simulation for a policy |
| `POST` | `/policy/recommend` | Get AI-ranked zone-specific interventions |
| `GET` | `/policy/ai-status` | Check whether Gemini AI or the local engine is active |
| `PATCH` | `/policy/:id/status` | Update a policy status (Draft / Active / Archived) |

### Simulation Engine
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/simulate/simulate-policy` | Real-time deterministic simulation with 5 intervention sliders |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | API server health check |

---

## 🧠 AI & Simulation Models

### Gemini AI Integration
When a valid `GEMINI_API_KEY` is set, Gemini AI is used to:
- Estimate zone-level AQI, stress index, spike probability, and primary pollution source
- Generate specific, legally-grounded government policy directives
- Rank intervention strategies by efficiency (AQI drop per unit disruption)

The app gracefully falls back to a deterministic **local scoring engine** if the Gemini key is missing or quota is exhausted.

### Gaussian Plume Dispersion Model
The policy impact simulation implements the standard Gaussian Plume atmospheric dispersion formula for city-scale AQI forecasting, using empirical sector coefficients calibrated to India CPCB and WHO policy effectiveness studies:

| Sector | Emission Reduction Coefficient |
|--------|-------------------------------|
| Industrial | 0.42 |
| Transport | 0.38 |
| Energy | 0.32 |
| Multi-sector | 0.30 |
| Waste / Biomass | 0.18 |

### Policy Simulation Engine (System 4)
A fast, deterministic model using a weight matrix across five intervention types:

| Intervention | Weight |
|-------------|--------|
| Traffic Flow Reduction | 32% |
| Industrial Emission Cap | 28% |
| Heavy Vehicle Restriction | 18% |
| Dust Mitigation | 12% |
| Construction Halt | 10% |

Simulations include wind speed attenuation, 60-day historical AQI blending, trend direction modifiers, and peak volatility buffers, producing results in under 200ms.

---

## 🗄️ Database

AirNet uses **SQLite** (auto-created on first run via Sequelize). The database is **not** committed to version control.

| Table | Purpose |
|-------|---------|
| `zone_readings` | 30-minute zone-level AQI readings for 20 NCR zones (auto-pruned to 60 days) |
| `AtmosphericReadings` | City-level readings with full AI analysis JSON blob |
| `Policies` | AI-generated or manually created policy drafts |
| `ImpactSimulations` | Gaussian plume simulation results linked to policies |

---

## 🔒 Security Notes

- **Never commit your `.env` file.** It is listed in `.gitignore`.
- Use `.env.example` as a safe template for collaborators.
- API keys are only read server-side and are never exposed to the frontend.
- Helmet.js and strict CORS rules protect the API server.

---

## 📜 License

ISC License © 2026 Pranav Gupta
