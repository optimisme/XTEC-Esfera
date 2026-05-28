# XTEC-Esfera

Extensió de Chrome per consultar ràpidament un resum de qualificacions dins les pàgines d’avaluació d’XTEC-Esfera.

L’extensió afegeix un botó **Resum** a la pantalla que mostra una finestra gran amb els mòduls, les qualificacions principals i els resultats d’aprenentatge.

![Nou botó](assets/buttons.png)

L'extensió només és informativa, no permet canviar les dades ni interactuar amb el sistema d’avaluació d’XTEC-Esfera.

![Captura de l'extensió XTEC-Esfera](assets/capture.png)

## Instal·lació

1. Descarrega el fitxer [XTEC-Esfera-0.1.1.zip](https://github.com/optimisme/XTEC-Esfera/raw/refs/heads/main/XTEC-Esfera-0.1.1.zip).
2. Descomprimeix el fitxer `.zip` i guarda la carpeta descomprimida en un lloc no temporal, per exemple a `Documents` o a una carpeta d’aplicacions.
3. Obre una pestanya nova a Chrome i escriu a la barra d’adreces: `chrome://extensions`.
4. Activa el **Mode de desenvolupador**. (A dalt a la dreta)
5. Prem **Carrega una extensió desempaquetada**.
6. Selecciona la carpeta descomprimida, la que conté el fitxer `manifest.json`.
7. Obre una pàgina de "Qualificacions per grup i alumne" compatible d’XTEC-Esfera i prem el botó **Resum**.

Chrome no instal·la extensions arrossegant directament un fitxer `.zip` en mode desenvolupador. Primer cal descomprimir-lo i carregar la carpeta desempaquetada.

## Desenvolupament

El codi font de l’extensió és a la carpeta [src](src).

La versió empaquetada és el fitxer [XTEC-Esfera-0.1.1.zip](https://github.com/optimisme/XTEC-Esfera/raw/refs/heads/main/XTEC-Esfera-0.1.1.zip).
