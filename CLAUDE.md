# my-kb

## Stack
- OSpipe REST server running at http://localhost:3030
- Data stored at ~/.ospipe (local, private)
- TypeScript client using @ruvector/ospipe

## OSpipe API
- POST /ingest    — add content to the knowledge base
- GET  /search?q= — semantic search
- GET  /health    — server status
- GET  /stats     — pipeline statistics

## Key Behaviors
- Server must be running before any ingest/search calls
- Start it with: cd ~/code/ruvector && cargo run --bin ospipe-server --release
- All data is local — no cloud, no auth required

## Project Structure
- src/       source code
- scripts/   one-off ingestion scripts
