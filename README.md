# genius-frontend

Here are a few guidelines to help you set up the Genius Frontend project.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).


## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

### Node version 20.17

```sh
npm install
```
Add a `.env` file at the root of the project (make sure it's at the root and not in the src folder or anywhere else).

In this file add the key `VITE_API_BASE_URL=` and ask your project's owner or your Frontend team for the value associated with this key.

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

For production you will have to add the environnement variable `VITE_API_BASE_URL` with the associated value in your hosting/deployment environnement.

## Documentation for the entire App content edition
[content documentation](content.md)