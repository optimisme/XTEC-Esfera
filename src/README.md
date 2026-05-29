# XTEC-Esfera

A Chrome and Firefox extension that shows a centered edit panel for XTEC-Esfera module grades from the current page.

## Avís sobre el panell d'edició

El botó **Panell d'edició** obre directament el panell editable. Aquesta funcionalitat és provisional: pot omplir camps del formulari original d'XTEC-Esfera, però cal revisar manualment tots els canvis a la pàgina abans de prémer el botó oficial **Desa**.

Cada camp editable del panell està lligat al camp original corresponent del formulari. Quan es canvia un valor, l'extensió actualitza el camp original i dispara els esdeveniments `input`, `change` i `blur` perquè XTEC-Esfera detecti el canvi.

La qualificació qualitativa principal es mostra en negre, i les qualitatives de les subseccions mantenen els colors del resum anterior: pendent en vermell, pendent de `01EM` en morat, en procés en blau i la resta en gris. Els valors i subseccions tenen un espaiat més compacte dins el panell.

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
