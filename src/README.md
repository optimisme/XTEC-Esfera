# XTEC-Esfera

A Chrome extension that shows a centered overlay with a summary of XTEC-Esfera module grades from the current page.

## Instal·lació a Chrome

1. Descomprimeix el fitxer `.zip` i guarda la carpeta descomprimida en un lloc no temporal.
2. Obre Chrome i ves a la pàgina d’extensions: `chrome://extensions`.
3. Activa el **Mode de desenvolupador**. (A dalt a la dreta)
4. Prem **Carrega una extensió desempaquetada**.
5. Selecciona la carpeta descomprimida, la que conté el fitxer `manifest.json`.

Chrome no instal·la extensions arrossegant directament un fitxer `.zip` en mode desenvolupador. Primer cal descomprimir-lo i carregar la carpeta desempaquetada.

## Files

- `manifest.json`: Chrome extension metadata and permissions.
- `background.js`: Runs when the extension button is clicked.
- `content.js`: Extracts module data from the page and renders the overlay.
