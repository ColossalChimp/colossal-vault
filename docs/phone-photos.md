# Getting photos from a phone into Chimp.OS

Collection lives in the desktop Electron app. The useful camera is the phone. These are practical ways to land those photos in the vault so a later build can pick one. The Returns Counter and Bulk Drop drafts are the screens that would review them.

Whichever door you pick, hash the file and skip a photo the vault already has. A 30,000-title backfill will otherwise file the same sleeve twice.

## 1. QR pairing to a local upload page

The Electron app, or the PHP backend it already talks to, listens on the LAN and shows a QR code on the Collection screen. The phone opens a small page, uses its camera, and POSTs each picture to the desktop. A short pairing code keeps other people on the Wi-Fi off the page.

**Pros**

- Matches the real capture loop: one object, one photo, a match slip a second later.
- No cloud account and no sync client. Any phone with a browser can do it.
- Identification can start the moment the file arrives, which is the returns-counter queue.
- Fits the PHP backend as a single upload route. Electron only has to show the queue.

**Cons**

- Phone and computer must see each other on the network. Guest Wi-Fi that isolates clients will fail.
- A phone will not open the camera on a plain `http://` LAN address. The page needs HTTPS, with a local certificate the phone is told to trust once. Until that is done, the page can still accept a picture from the camera roll.
- The phone has to stay awake and on that page for a long session.
- A bad door for a year of photos already sitting in the camera roll.

## 2. Watched folder, synced by cloud or LAN sync

Pick a folder the desktop already watches. The phone drops photos in through Syncthing, Dropbox, iCloud Drive, Nextcloud, or whatever is already in the house. Electron notices new files and puts them on the review queue.

**Pros**

- Bulk and background. Photograph all afternoon; import when the desktop is awake.
- Syncthing can stay on the LAN. iCloud or Dropbox wins if that is already the habit.
- Camera-roll photos, screenshots, and saved images use the same pipe.
- Reads can run unattended.

**Cons**

- There is a delay. It is not "snap and see the slip" unless the sync tool is aggressive.
- Two things to keep healthy: the phone's sync client and the watcher in Electron.
- Cloud folders mean photos of the collection sit on someone else's server.
- The watcher has to ignore a file until the sync finishes writing it, or it will ingest a half-saved image.
- "Save to folder" is a worse camera than a page built for the shutter.

## 3. Phone share target

Give the phone's share sheet something to hit: a Shortcut, a share extension, or a PWA share target that pushes to the same upload route as the QR page.

**Pros**

- Uses the camera and photos app already on the phone. Snap normally, tap share, it is in the queue.
- Works for one photo or a multi-select from the camera roll.
- Can reuse the PHP upload endpoint from option 1.

**Cons**

- A real share target is per platform. iOS wants a share extension or a Shortcut. Android wants a PWA share target or an app. Electron on the desktop is not itself a share target.
- The reliable version is still "share to a local URL or a synced folder," so this is option 1 or 2 with a nicer door.
- Setup is the fragile part. Once it works it is the nicest daily path.

## 4. Webcam at the desk

A USB camera, or the laptop camera, inside Electron. The object sits under the lens and the shutter files it straight into the queue. `getUserMedia` in a local window is enough.

**Pros**

- No phone, no pairing, no Wi-Fi. One machine.
- Fast for things already on the desk: a sleeve, a Pop, a cartridge.
- Camera permission is straightforward because the page is local.
- Lighting stays consistent, which helps the read.

**Cons**

- A phone camera is better, and the collection does not live on the desk. Long boxes and 20,000 cards will not come to a webcam.
- Hands, glare, and slab cases fight a fixed camera.
- Useless for photos that are already on the phone.
- Electron camera permissions still differ across macOS, Windows, and Linux.

## 5. Bulk folder import

A control in Collection: pick a folder or drop files. Every image becomes a row on the Bulk Drop screen. This is the backfill tool.

**Pros**

- The right tool for an existing camera roll, a dealer lot, or a scan dump. Thousands of files, one gesture.
- Nothing to install on the phone. AirDrop, a cable, or a card reader can fill the folder first. The app just reads disk.
- Easy to map onto PHP later: the desktop can hand the server a path, or upload in batches.
- The review screen can file the high-confidence rows and hold the rest for the counter.

**Cons**

- It is not a capture loop. Something else still has to get the files onto the machine.
- Copying 10,000 photos into the app database in one shot will choke. Stream the folder, skip duplicates, and enqueue reads.
- No moment of "did this one read?" while the object is still in your hand.

## When it is time to choose

Use two doors. Bulk folder import for everything already photographed. QR pairing to a local HTTPS upload page for new snaps, feeding the same queue the Returns Counter shows. Add a watched folder only if a sync tool is already part of the house. Treat a desk webcam and a custom share-sheet target as extras, not the path that has to work on day one.
