# Guía para incorporar videos auténticos de Lengua de Señas Ecuatoriana (LSEC)

## Principios (no negociables)

1. **La LSEC no se inventa.** No se usan gestos genéricos, ni señas de otros países
   (por ejemplo, ASL), ni avatares o videos generados automáticamente.
2. **Cada video debe ser auténtico y validado** por personas competentes en LSEC,
   incluyendo representantes de la comunidad sorda ecuatoriana.
3. **Permisos explícitos**: licencia o autorización escrita de uso y consentimiento
   informado de la persona que aparece en el video.
4. **Transparencia**: mientras un concepto no tenga video validado, la plataforma dice
   claramente que está **pendiente**. Nunca se presenta como terminado.

La plataforma impone estas reglas en el código: `js/data/lsec.js` sólo entrega un
video si su entrada cumple **todos** los requisitos (función `missingRequirements()`).
Las pruebas `tests/unit/lsec.test.mjs` lo verifican.

## Con quién trabajar (sugerencias)

- Asociaciones de personas sordas de Ecuador y la federación nacional que las agrupa.
- Intérpretes de LSEC calificados y docentes sordos.
- Instituciones educativas especializadas para estudiantes sordos.
- Referentes institucionales de LSEC en Ecuador (por ejemplo, glosarios o diccionarios
  oficiales), siempre contrastados con la comunidad.

Lo ideal es que **personas sordas señantes nativas** graben y validen las señas, y que
se reconozca su trabajo con créditos (si así lo desean) y, cuando sea posible, con
retribución.

## Requisitos de cada video

| Aspecto | Recomendación |
| --- | --- |
| Formato | MP4 (H.264) o WebM. Sin audio o con audio silenciado. |
| Duración | 2 a 6 segundos por seña, con una breve pausa inicial y final. |
| Encuadre | Plano medio (cabeza a cintura): se deben ver manos, rostro y expresión facial. |
| Fondo y ropa | Fondo liso que contraste con la piel; ropa lisa de un solo color. |
| Luz | Uniforme, sin sombras fuertes en manos ni rostro. |
| Resolución | 720p es suficiente. Comprime para que cada video pese menos de ~1 MB. |
| Nombre de archivo | `<categoria>-<concepto>.mp4`, por ejemplo `animal-perro.mp4`. |
| Subtítulos (opcional) | Archivo `.vtt` en español con la palabra. |
| Vista previa (opcional) | Imagen `.jpg` o `.webp` del primer cuadro. |

## Paso a paso

1. **Grabar** siguiendo la tabla anterior.
2. **Validar** con al menos una persona u organización competente en LSEC y de la
   comunidad sorda. Registrar quién validó y la fecha.
3. **Obtener permisos**: licencia (por ejemplo, CC BY-NC-SA 4.0) o autorización
   escrita, y consentimiento informado de la persona señante. Guarda esos documentos
   fuera del repositorio público.
4. **Copiar** el archivo a `assets/lsec/videos/`.
5. **Editar** la entrada del concepto en `js/data/lsec.js`:

   ```js
   {
     concept: 'animal:perro',
     category: 'animales',
     label: 'Perro',
     status: 'validado',                          // 'pendiente' | 'en-revision' | 'validado'
     src: 'assets/lsec/videos/animal-perro.mp4',  // ruta RELATIVA, sin "/" inicial
     poster: 'assets/lsec/videos/animal-perro.jpg',
     captions: null,
     license: 'CC BY-NC-SA 4.0',
     signer: 'Nombre de la persona señante (sólo si autoriza el crédito)',
     validation: {
       reviewers: ['Nombre de la asociación o persona validadora'],
       date: '2026-11-20',
     },
     consent: true,
   }
   ```

   Mientras falte la validación usa `status: 'en-revision'`: el video **no** se mostrará.

6. **Probar**: `npm run test:unit` y abre el sitio. En **Preferencias**, la opción
   «Mostrar videos en LSEC dentro de los juegos» se habilita automáticamente cuando
   existe al menos un video validado.
7. **Publicar** (ver [PUBLICAR.md](PUBLICAR.md)). Los videos no se guardan en el modo
   sin conexión de forma automática para no llenar la memoria de los dispositivos.

## Dónde aparecen los videos

- **Dentro de los juegos**: cada ronda declara un concepto (`lsec: 'animal:perro'`,
  `'color:rojo'`, `'numero:3'`). Si la persona activó LSEC y el concepto tiene video
  validado, aparece el reproductor junto a la instrucción, con botón «Ver otra vez»,
  controles accesibles, créditos y licencia. Si falta el video de ese concepto, se
  muestra el aviso «video LSEC pendiente de validación».
- **Mundo «Manitos que hablan»**: hoy muestra el estado del vocabulario. Cuando haya
  suficientes videos validados, se podrán crear sus juegos de asociación imagen–seña
  siguiendo [NUEVOS_JUEGOS.md](NUEVOS_JUEGOS.md), usando sólo conceptos con video
  validado (`lsecRegistry.videoFor(concepto)`).

## Práctica frente a la cámara (ya programada)

Si una persona adulta lo permite en «Docentes y familias → Sonido y vista», junto a
cada video LSEC validado aparece el botón **Practicar con mi cámara**:

- Muestra la imagen de la cámara frontal como un espejo, al lado del video de referencia.
- La imagen se procesa sólo en el navegador: **no se graba, no se guarda y no se envía**.
- Se apaga con un botón y al salir de la pantalla.
- **No califica** la seña. El juego se sigue respondiendo tocando la imagen correcta;
  la cámara sirve para imitar y practicar con acompañamiento.

Código: `js/components/cameraPractice.js`. Pruebas: `tests/e2e/lsec-camera.spec.mjs`
(usa una cámara simulada y videos de prueba que sólo existen durante la prueba).

## Reconocimiento automático de señas

Que la niña o el niño **responda con señas y el sistema las reconozca** es posible
técnicamente (por ejemplo, detectando puntos de manos, brazos y rostro en el navegador
y comparándolos con un modelo), pero **no está implementado** porque hoy faltan las
condiciones para hacerlo bien:

1. **Datos auténticos**: muchas grabaciones de cada seña, hechas por distintas personas
   sordas señantes (edades, manos dominantes, tonos de piel, iluminación), con
   consentimiento informado. En el caso de niñas y niños, con autorización de sus familias.
2. **Validación**: personas competentes en LSEC y de la comunidad sorda revisan las
   etiquetas y deciden qué variantes regionales son correctas.
3. **Modelo evaluado**: entrenarlo y medir sus errores con grabaciones que no usó al
   aprender. La LSEC usa movimiento, orientación, configuración de la mano y expresión
   facial; un modelo que sólo mira la forma de la mano confundiría señas.
4. **Privacidad**: el reconocimiento debe ejecutarse en el dispositivo, sin enviar video,
   y con modelos que puedan descargarse y usarse sin conexión.
5. **Sin penalizar**: si el modelo duda, debe decir «no estoy seguro» y nunca marcar
   como incorrecta una seña que podría estar bien.

Sin esos pasos, un reconocedor diría a un niño sordo que su seña está mal cuando está
bien (o al revés), lo que contradice los principios de este proyecto. Cuando exista un
conjunto de datos validado, la práctica con cámara es el punto donde se conectaría.

## Vocabulario previsto

Saludos (hola, adiós, buenos días, gracias, por favor), vocabulario básico (mamá, papá,
escuela, agua, comer, jugar), los 13 animales del Mundo 1, 8 colores, números del 1
al 10, emociones (alegría, tristeza, miedo, sorpresa, enojo) y el alfabeto manual
(dactilología), que usan los juegos de letras. La lista completa y su estado
están en `js/data/lsec.js` y en la pantalla del mundo «Manitos que hablan».
