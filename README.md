# DDD Game Hub

DDD Game Hub is a collection of pass-the-phone party games plus live online UNO and trivia rooms. It is built with React and Vite and can be distributed as a web app, an Android APK, or a Windows installer.

## Development

Requirements: Node.js 22 or newer and npm.

```powershell
npm install
npm run dev
```

Create a production web build with:

```powershell
npm run build
```

The compiled web app is written to `dist/`.

## Windows installer

Build the x64 NSIS installer on Windows:

```powershell
npm run desktop:installer
```

The installer is written to:

```text
release/windows/DDD-Game-Hub-Setup-<version>-x64.exe
```

Run the desktop wrapper without creating an installer with `npm run desktop:run`.

## Android APK

Local Android builds require Android Studio 2025.2.1 or newer and Android SDK 36. Android Studio installs the compatible JDK.

```powershell
npm run android:apk
```

The installable debug-signed APK is written to:

```text
release/android/DDD-Game-Hub-debug.apk
```

Use `npm run android:open` to sync the web build and open the native project in Android Studio. The debug APK is suitable for direct testing and sharing, but Google Play distribution requires an upload keystore and a production release build.

## Downloadable releases

The **Build installable apps** workflow under GitHub Actions builds both packages. A manually started workflow run provides these downloadable artifacts:

- `DDD-Game-Hub-Windows`
- `DDD-Game-Hub-Android`

Pushing a version tag builds both packages and attaches them to a new GitHub Release:

```powershell
git tag v1.0.0
git push origin v1.0.0
```

Before creating another release, update the version in both `package.json` and `desktop/package.json`, then use the matching Git tag.

The Windows installer is unsigned until a trusted code-signing certificate is configured, so Windows SmartScreen may show a warning. Signing credentials and Android keystores must be stored outside the repository, preferably as encrypted CI secrets.

See [PACKAGING.md](PACKAGING.md) for additional packaging details.
