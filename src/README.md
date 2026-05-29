# XTEC-Esfera

A Chrome and Firefox extension that shows a centered edit panel for XTEC-Esfera module grades from the current page.

## Avís sobre el panell d'edició

El botó **Panell d'edició** obre directament el panell editable. Aquesta funcionalitat permet omplir els camps del formulari original d'XTEC-Esfera de manera més compacte, per seguretat cal revisar tots els canvis abans de prémer el botó  **Desa**.

Cada camp editable del panell està lligat al camp original corresponent del formulari. Quan es canvia un valor, l'extensió actualitza el camp original.

## Instal·lació Chrome

1. Descomprimeix el fitxer `.zip` i guarda la carpeta descomprimida en un lloc no temporal.
2. Obre Chrome i ves a la pàgina d’extensions: `chrome://extensions`.
3. Activa el **Mode de desenvolupador**. (A dalt a la dreta)
4. Prem **Carrega una extensió desempaquetada**.
5. Selecciona la carpeta descomprimida, la que conté el fitxer `manifest.json`.

Chrome no instal·la extensions arrossegant directament un fitxer `.zip` en mode desenvolupador. Primer cal descomprimir-lo i carregar la carpeta desempaquetada.

## Instal·lació Firefox

1. Descomprimeix el fitxer `.zip` de Firefox i guarda la carpeta descomprimida en un lloc no temporal.
2. Obre Firefox i ves a `about:debugging#/runtime/this-firefox`.
3. Prem **Carrega un complement temporal...**.
4. Selecciona el fitxer `manifest.json` de la carpeta descomprimida.

Firefox carrega aquesta versió com a complement temporal mentre no estigui publicada o signada a Mozilla Add-ons.

## Files

- `manifest.json`: Chrome extension metadata and permissions.
- `manifest.firefox.json`: Firefox extension metadata and permissions. It is packaged as `manifest.json` in the Firefox ZIP.
- `background.js`: Runs when the extension button is clicked.
- `content.js`: Extracts module data from the page and renders the overlay.

## Packaging

Run `scripts/package.sh` from the repository root to build both browser packages. The script creates `XTEC-Esfera-chrome.zip`, `XTEC-Esfera-firefox.zip`, and keeps `XTEC-Esfera.zip` as a Chrome-compatible package.
