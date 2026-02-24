# MongoDB setup – so hymns, hagerigna, categories, and YouTube links persist

When **MONGODB_URI** is set, the backend stores data in MongoDB collections instead of JSON files. That way data survives restarts and redeploys on Render.

Collections used:
- `hagerignahymns`
- `sdahymns`
- `categories`
- `youtubelinks`

On first successful MongoDB connection, the server auto-seeds these collections from your existing JSON files if the collections are empty.

---

## 1. Create a MongoDB Atlas account

1. Go to **[https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)**.
2. Click **Try Free** and sign up (Google/email).
3. Log in to the Atlas dashboard.

---

## 2. Create a free cluster

1. Choose **M0 (FREE)** and a region close to you (or to Render’s region, e.g. Oregon).
2. Click **Create** and wait until the cluster is ready (1–2 minutes).

---

## 3. Create a database user

1. In the left sidebar, go to **Database Access** → **Add New Database User**.
2. Choose **Password** and set a **username** and **password**. Save the password somewhere safe.
3. Under **Database User Privileges**, leave **Read and write to any database**.
4. Click **Add User**.

---

## 4. Allow network access (so Render can connect)

1. In the left sidebar, go to **Network Access** → **Add IP Address**.
2. Click **Allow Access from Anywhere**. That adds `0.0.0.0/0` (needed for Render; you can restrict IPs later if you want).
3. Confirm with **Add IP Address**.

---

## 5. Get the connection string

1. Go back to **Database** in the sidebar.
2. Click **Connect** on your cluster.
3. Choose **Drivers** (or “Connect your application”).
4. Copy the connection string. It looks like:
   ```text
   mongodb+srv://USERNAME:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with the database user password you created.  
   If the password has special characters (e.g. `#`, `@`), URL-encode them (e.g. `#` → `%23`).
6. Optional but recommended: add a database name so all data goes to one DB, e.g. before the `?`:
   ```text
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/wudassie?retryWrites=true&w=majority
   ```
   Here the database name is `wudassie`. You can use any name.

Your final URI should look like:
```text
mongodb+srv://myuser:mypass123@cluster0.abc12.mongodb.net/wudassie?retryWrites=true&w=majority
```

---

## 6. Set the URI in your app

### Local (optional)

1. In the **server** folder (or project root), open or create `.env`.
2. Add:
   ```env
   MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/wudassie?retryWrites=true&w=majority
   ```
   Use your real URI from step 5.
3. Restart the server. You should see in the console: **MongoDB connected – YouTube links will persist.**

### Render (deployed backend)

1. Open your **Render** dashboard → your **backend service**.
2. Go to **Environment** (or **Environment Variables**).
3. Add a variable:
   - **Key:** `MONGODB_URI`
   - **Value:** the same connection string from step 5 (with real username, password, and optional DB name).
4. Save. Render will redeploy the service.
5. After deploy, the logs should show **MongoDB connected**. New YouTube links added on the deployed site will be stored in MongoDB and will persist across restarts and redeploys.

---

## 7. Check that it works

- **Locally:** Add a YouTube link in the app; then in Atlas go to **Database** → **Browse Collections** and open the `wudassie` (or your) database and the `youtubelinks` collection. You should see the new document.
- **Deployed:** Open your live site, add a YouTube link, restart the Render service (or redeploy), and reload the page. The link should still be there.

---

## Summary

| Step | What you did |
|------|----------------|
| 1 | Created MongoDB Atlas account |
| 2 | Created free M0 cluster |
| 3 | Created DB user (username + password) |
| 4 | Allowed access from anywhere (0.0.0.0/0) |
| 5 | Copied connection string and set password (and optional DB name) |
| 6 | Set `MONGODB_URI` in `.env` (local) and in Render Environment (deployed) |
| 7 | Verified links persist in Atlas and on the deployed site |

If **MONGODB_URI** is not set, the app keeps using the JSON file (fine for local dev; on Render that data is still lost on restart).
