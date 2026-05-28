# XTEC-Esfera

Extensió de Chrome per consultar ràpidament un resum de qualificacions dins les pàgines d’avaluació d’XTEC-Esfera.

L’extensió afegeix un botó **Resum** a la pantalla i mostra una finestra gran amb els mòduls, les qualificacions principals i els resultats d’aprenentatge.

![Captura de l'extensió XTEC-Esfera](assets/capture.png)

## Què mostra

- El nom de l’alumne/a extret de la ruta de navegació de la pàgina.
- Un resum per mòdul amb `Provisional`, `Qualificació` i `Qualitativa`.
- Els subapartats del mòdul, com `01RA`, `02RA` o `01EM`.
- Colors per identificar ràpidament estats com `Pendent`, `En Procés` o valors que falten.

## Instal·lació

1. Descarrega el fitxer [release/XTEC-Esfera-0.1.0.zip](release/XTEC-Esfera-0.1.0.zip).
2. Obre Chrome i ves a `chrome://extensions`.
3. Activa el **Mode de desenvolupador**.
4. Arrossega el fitxer `.zip` a la finestra d’extensions de Chrome.
5. Obre una pàgina compatible d’XTEC-Esfera i prem el botó **Resum**.

## Desenvolupament

El codi font de l’extensió és a la carpeta [src](src).

La versió empaquetada és a la carpeta [release](release).
