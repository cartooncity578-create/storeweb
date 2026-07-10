# ZubayGames Admin Panel — Setup Guide

## Yeh kya hai
- `/admin/index.html` → password-protected admin panel
- `/data.json` → tumhare products, theme colors, payment info yahan store hote hain
- `/api/save-data.js` → admin panel se "Save" dabane pe GitHub repo mein `data.json` update karta hai (jo Vercel pe auto-redeploy trigger karega)
- `/api/check-password.js` → login check karta hai
- `/shop.js` → example script jo main site pe products dikhata hai `data.json` se

## Step 1 — Files apne GitHub repo mein daalo
In sab files ko apne existing repo ke **root** mein copy karo (jahan tumhara `index.html` hai). Folder structure kuch aisa hoga:

```
your-repo/
  index.html          (tumhara existing site)
  data.json           (new)
  shop.js             (new)
  admin/
    index.html        (new)
  api/
    save-data.js       (new)
    check-password.js  (new)
```

## Step 2 — GitHub Personal Access Token banao
1. GitHub → Settings → Developer settings → **Personal access tokens** → **Fine-grained tokens** → Generate new token
2. Repository access: sirf apna ZubayGames repo select karo
3. Permissions: **Contents → Read and write**
4. Token generate karke copy kar lo (yeh sirf ek baar dikhega)

## Step 3 — Vercel mein Environment Variables add karo
Vercel dashboard → tumhara project → **Settings → Environment Variables**, yeh 5 add karo:

| Name | Value |
|---|---|
| `GITHUB_TOKEN` | wahi token jo Step 2 mein banaya |
| `GITHUB_OWNER` | tumhara GitHub username |
| `GITHUB_REPO` | repo ka naam (e.g. `zubaygames`) |
| `GITHUB_BRANCH` | `main` (ya jo bhi branch use karte ho) |
| `ADMIN_PASSWORD` | koi bhi strong password jo tum admin login ke liye use karoge |

Save karne ke baad, project ko ek baar **Redeploy** karo taaki env vars apply ho jayein.

## Step 4 — Admin panel use karo
Deploy hone ke baad visit karo:
```
https://tumhari-site.vercel.app/admin
```
Password daalo → products add/edit karo, theme colors set karo, payment methods likho → **Save Changes** dabao.

Save dabate hi yeh seedha tumhare GitHub repo mein commit ho jayega, aur Vercel khud-ba-khud naya version deploy kar dega (30-60 second lagte hain).

## Step 5 — Products site pe dikhane ke liye
Apne `index.html` (ya jahan products dikhane hain) mein add karo:
```html
<div id="zg-shop"></div>
<script src="/shop.js"></script>
```
Yeh automatically `data.json` se products fetch karke dikha dega, aur click karne pe prices/payment info expand hoga.

## Important notes
- `ADMIN_PASSWORD` kisi ko mat batao, aur `/admin` URL bhi share mat karo publicly.
- Agar "Wrong password" ya save fail ho raha hai, Vercel ke **Function Logs** check karo (Project → Deployments → latest → Functions).
- Har save = ek naya git commit + redeploy. Isliye thoda time lagta hai reflect hone mein.
