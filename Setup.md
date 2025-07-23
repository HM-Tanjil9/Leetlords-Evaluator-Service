## How to setup a new Express project with Typescript

1.

```
npm init -y
```

2.

```
npm install -D typescript
npm install concurrently
```

3.

```
tsc --init
```

4.

```
Add the following scripts in package.json

{
    "build": "npx tsc",
    "prestart": "npm run build",
    "watch": "npx tsc -w",
    "start": "npx nodemon dist/index.js",
    "dev": "npx concurrently --kill-others \"npm run watch\" \"npm start\""

}
```

5.

```
npm run dev
```
