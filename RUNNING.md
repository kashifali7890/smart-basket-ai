# Running Smart Basket AI locally (Windows + Android emulator)

Smart Basket AI is a React Native app built with [Expo](https://expo.dev). This
guide covers running it on an **Android emulator** on **Windows**. (You can also
run it on a physical phone via Expo Go, an iOS simulator on macOS, or in a web
browser — see the notes at the end.)

## 1. Install prerequisites (one-time)

- **Node.js (LTS)** — https://nodejs.org (`npm` is included)
- **Git** — https://git-scm.com/download/win
- **Android Studio** — https://developer.android.com/studio (provides the
  Android SDK + emulator)

> Make sure hardware virtualization (Intel VT-x / AMD-V) is enabled in your
> BIOS, otherwise the emulator will be very slow. Android Studio warns you if
> it is disabled.

## 2. Create and boot an Android emulator (one-time)

1. Open **Android Studio** → **More Actions → Virtual Device Manager**
   (or **Device Manager**).
2. **Create Device** → choose **Pixel 6** → **Next**.
3. Select a system image (e.g. **API 34 / Android 14**), click the **Download**
   icon next to it, then **Next → Finish**.
4. In Device Manager, press **▶ (Play)** to boot the emulator. Wait for the
   Android home screen.

## 3. Set the `ANDROID_HOME` environment variable (one-time)

Android Studio installs the SDK at
`C:\Users\<YourName>\AppData\Local\Android\Sdk`.

1. Windows Search → **"Edit the system environment variables"** →
   **Environment Variables**.
2. Under **User variables**, click **New**:
   - Name: `ANDROID_HOME`
   - Value: `C:\Users\<YourName>\AppData\Local\Android\Sdk`
3. Edit the **Path** variable and add a new entry:
   `%ANDROID_HOME%\platform-tools`
4. Click **OK**, then **restart VS Code** so it picks up the changes.

Verify it worked by opening a new terminal and running:

```bash
adb --version
```

## 4. Install dependencies and run

Open the project in VS Code, open a terminal (`Ctrl + ~`), and run:

```bash
git pull        # only if you already cloned the repo
npm install
npx expo start
```

With the emulator from step 2 already running, press **`a`** in the terminal.
Expo installs **Expo Go** on the emulator, bundles the app, and launches it.

Confirm the emulator is connected:

```bash
adb devices
# Expected output, e.g.:
#   List of devices attached
#   emulator-5554   device
```

## Useful commands

| Command            | What it does                          |
| ------------------ | ------------------------------------- |
| `npm install`      | Install dependencies                  |
| `npx expo start`   | Start the dev server (Metro)          |
| `npm run android`  | Start and open on Android             |
| `npm run web`      | Start and open in a web browser       |
| `npm run lint`     | Run the linter                        |

In the `expo start` terminal you can also press:

- **`a`** — open on the Android emulator
- **`w`** — open in a web browser
- **`r`** — reload the app
- **`m`** — toggle the developer menu

## Other ways to run

- **Physical Android/iOS phone:** install the **Expo Go** app, then scan the QR
  code shown by `npx expo start` (phone and computer must be on the same Wi-Fi).
- **iOS simulator (macOS only):** install Xcode, then press **`i`**.
- **Web browser:** press **`w`** or run `npm run web`.

## Troubleshooting

- **`adb` not recognized:** `ANDROID_HOME` / `Path` is not set correctly
  (step 3), or VS Code needs to be restarted.
- **Emulator is extremely slow:** enable virtualization (VT-x/AMD-V) in BIOS.
- **App stuck on the splash screen:** stop the server and run
  `npx expo start -c` to clear the Metro cache, then press **`a`** again.
- **No emulator found when pressing `a`:** make sure the emulator is booted to
  the Android home screen before pressing `a`.
