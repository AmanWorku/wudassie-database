# Why Data Doesn’t Save on the Deployed Site (Render)

## What’s going on

On **Render**, the backend runs in a **short‑lived container**. The app writes data to **JSON files** in `server/database/` (e.g. `YouTubeLinks.json`, `HagerignaData.json`, `SDA_Hymnal.json`).

- Writes go to the **container’s local disk**.
- That disk is **ephemeral**: it is reset when the service:
  - **Redeploys** (e.g. after a git push),
  - **Restarts**, or
  - **Spins down** (free tier often spins down after ~15 minutes of no traffic).

So:

- **Locally:** Data is saved to real files on your machine, so it persists.
- **On the deployed site:** The API can still return 200/201 and “save” the data, but the file lives only in the current container. After a restart or redeploy, that container is recreated and **all written data is lost**. Only what’s in your Git repo (or built at deploy time) is there again.

So the issue is **not** that “it doesn’t save” in the sense of the write failing — it’s that **on Render, file-based storage does not persist** across restarts/redeploys.

## Options so the deployed site “saves” data

### 1. Use a database (recommended)

Store data in a **real database** that lives outside the container:

- **MongoDB Atlas** (free tier):  
  - Add a MongoDB cluster, get a connection string, and store YouTube links (and optionally hymns) in collections instead of JSON files.
- **Render Postgres** (or another Postgres host):  
  - Create a Postgres database and store the same data in tables.

Then:

- **Locally:** You can keep using JSON files, or point the same backend at a local/remote DB.
- **On Render:** The backend uses the database; data persists across restarts and redeploys.

### 2. Use a Render Persistent Disk (paid)

Render offers **persistent disks** only on **paid** plans. You mount a disk and write your JSON (or SQLite, etc.) there so data survives restarts. This is a valid option if you prefer to keep file-based storage and are okay paying for the service.

### 3. Accept that deployed data is temporary (free tier, no DB)

If you don’t add a database or persistent disk:

- The **deployed** site will keep working, but **any new or changed data (e.g. new YouTube links) will be lost** after a restart or redeploy.
- **Local** development will keep saving to JSON files and persisting as before.

---

## Summary

| Where you run the app | Where data is written | Does it persist? |
|-----------------------|------------------------|------------------|
| Local (your machine)  | `server/database/*.json` on your disk | Yes |
| Deployed (Render)     | Container’s local disk (ephemeral)     | No (lost on restart/redeploy) |

To have the **deployed** site actually save data permanently, you need either:

- A **database** (e.g. MongoDB Atlas or Postgres), or  
- A **Render Persistent Disk** (paid).

If you want, we can add MongoDB (or Postgres) and change the backend to use it in production so the deployed site saves and keeps data.
