import {
  InteractiveArchetype,
  InteractiveHack,
  InteractiveQuizQuestion,
  PoderDeSherezade,
  PowerLensDomain,
  Archetype
} from '../types';

/**
 * Catálogo oficial auditado de Interactive DecoX (Chalamandra-Magistral-deco/INTERACTIVE-DECOX).
 * Conserva sin alteración silenciosa:
 * - El tipo `InteractiveArchetype` de tres valores ("El Arquitecto" | "El Alquimista" | "El Explorador")
 *   y las 10 preguntas reales de `QUIZ_QUESTIONS`.
 * - `PODERES_SHEREZADE_DATA` (7 poderes y sus plantillas originales).
 * - `HACKS_DATA` (8 hacks, sus `plantillaMetodologica` originales y la relación `poderDeSherezadeId`
 *   exactamente donde está definida: Hacks 1–7 tienen `poderDeSherezadeId`, Hack 8 no lo define).
 */

export const POWER_LENS_DOMAINS: PowerLensDomain[] = [
  'Negocios',
  'Relaciones',
  'Salud',
  'Finanzas',
  'Creatividad'
];

export const INTERACTIVE_ARCHETYPES: Record<InteractiveArchetype, Archetype> = {
  'El Arquitecto': {
    id: 'El Arquitecto',
    name: 'El Arquitecto',
    tagline: 'Hipótesis de tendencia hacia estructura, datos y diseño de sistemas',
    description:
      'Como hipótesis de estilo operativo, tiende a buscar patrones estructurales, métricas claras, procesos fiables y anticipación lógica antes de actuar.',
    strengths: [
      'Lectura estructural y detección de patrones subyacentes',
      'Diseño de sistemas escalables y criterios medibles',
      'Registro metódico de errores para evitar recurrencia'
    ],
    blindspots: [
      'Riesgo de sobreestructurar antes de probar en pequeño',
      'Incomodidad ante escenarios ambiguos o sin datos previos completos',
      'Posible demora en reencuadrar narrativamente el valor ante terceros'
    ],
    recommendedHack: 'Lewis Carroll / Inteligencia Artificial',
    iconName: 'Compass',
    color: 'from-cyan-500 to-blue-600'
  },
  'El Alquimista': {
    id: 'El Alquimista',
    name: 'El Alquimista',
    tagline: 'Hipótesis de tendencia hacia encuadre narrativo, sentido y transformación',
    description:
      'Como hipótesis de estilo operativo, tiende a ordenar el caos mediante relatos con propósito, reencuadre de significado y conexión con la identidad de la audiencia.',
    strengths: [
      'Construcción de contexto y narrativa persuasiva sin perder sentido',
      'Capacidad de transformar fricciones en aprendizaje o diferenciación',
      'Alineación de personas alrededor de una visión compartida'
    ],
    blindspots: [
      'Riesgo de confiar en la fuerza del relato sin contrastar métricas frías',
      'Posible dispersión creativa ante tareas operativas repetitivas',
      'Postergación de cortes o límites explícitos en el sistema'
    ],
    recommendedHack: 'Scheherazade / Hermes Trismegisto',
    iconName: 'Sparkles',
    color: 'from-amber-500 to-yellow-600'
  },
  'El Explorador': {
    id: 'El Explorador',
    name: 'El Explorador',
    tagline: 'Hipótesis de tendencia hacia experimentación rápida, subtexto y adaptabilidad',
    description:
      'Como hipótesis de estilo operativo, tiende a aprender sobre la marcha mediante pruebas pequeñas, lectura de incentivos no escritos y variaciones ágiles del entorno.',
    strengths: [
      'Velocidad para probar opciones pequeñas antes de comprometerse',
      'Detección de huecos, silencios e incentivos reales del sistema',
      'Alta adaptabilidad y reconexión con el motor de acción directa'
    ],
    blindspots: [
      'Riesgo de pivotar demasiado pronto sin consolidar un sistema estable',
      'Rechazo a estructuras necesarias para sostener acuerdos en el tiempo',
      'Posible desgaste por abrir múltiples experimentos simultáneos'
    ],
    recommendedHack: 'Hacker Anónima / El Trickster',
    iconName: 'Zap',
    color: 'from-emerald-500 to-teal-600'
  }
};

export const INTERACTIVE_QUIZ_QUESTIONS: InteractiveQuizQuestion[] = [
  {
    id: 1,
    text: '¿Cómo reaccionas ante un problema complejo e inesperado?',
    options: [
      { text: 'Analizo los datos y busco el patrón estructural subyacente.', archetype: 'El Arquitecto' },
      { text: 'Cambio la narrativa para que el problema parezca una oportunidad.', archetype: 'El Alquimista' },
      { text: 'Pruebo soluciones rápidas y hackeo el sistema sobre la marcha.', archetype: 'El Explorador' }
    ]
  },
  {
    id: 2,
    text: '¿Cuál es tu herramienta preferida para el éxito?',
    options: [
      { text: 'Un sistema robusto y escalable.', archetype: 'El Arquitecto' },
      { text: 'Una historia poderosa que mueva a la gente.', archetype: 'El Alquimista' },
      { text: 'Un exploit creativo que nadie más ha visto.', archetype: 'El Explorador' }
    ]
  },
  {
    id: 3,
    text: '¿Qué te motiva más al iniciar un proyecto?',
    options: [
      { text: 'La claridad del diseño y la estructura final.', archetype: 'El Arquitecto' },
      { text: 'El impacto emocional y la transformación que genera.', archetype: 'El Alquimista' },
      { text: 'La emoción de descubrir lo desconocido y romper límites.', archetype: 'El Explorador' }
    ]
  },
  {
    id: 4,
    text: '¿Cómo prefieres comunicarte con tu equipo?',
    options: [
      { text: 'A través de métricas, dashboards y procesos claros.', archetype: 'El Arquitecto' },
      { text: 'Inspirándolos con una visión y un propósito compartido.', archetype: 'El Alquimista' },
      { text: 'Mediante experimentos rápidos y feedback en tiempo real.', archetype: 'El Explorador' }
    ]
  },
  {
    id: 5,
    text: '¿Qué tipo de entorno te hace sentir más productivo?',
    options: [
      { text: 'Un espacio ordenado donde todo tiene su lugar lógico.', archetype: 'El Arquitecto' },
      { text: 'Un ambiente creativo lleno de estímulos y metáforas.', archetype: 'El Alquimista' },
      { text: 'Un entorno dinámico y cambiante que requiera adaptabilidad.', archetype: 'El Explorador' }
    ]
  },
  {
    id: 6,
    text: '¿Cuál es tu mayor temor profesional?',
    options: [
      { text: 'El caos incontrolado y la falta de estructura.', archetype: 'El Arquitecto' },
      { text: 'La irrelevancia narrativa y el aburrimiento.', archetype: 'El Alquimista' },
      { text: 'La rigidez sistémica y la falta de libertad para innovar.', archetype: 'El Explorador' }
    ]
  },
  {
    id: 7,
    text: '¿Cómo manejas el fracaso o un error crítico?',
    options: [
      { text: 'Registro el error en el sistema para evitar que se repita.', archetype: 'El Arquitecto' },
      { text: 'Reencuadro el fracaso como una lección necesaria para la gran historia.', archetype: 'El Alquimista' },
      { text: 'Pivoto rápidamente hacia una nueva dirección sin mirar atrás.', archetype: 'El Explorador' }
    ]
  },
  {
    id: 8,
    text: '¿Qué valoras más en una relación profesional?',
    options: [
      { text: 'La fiabilidad y el cumplimiento de los procesos.', archetype: 'El Arquitecto' },
      { text: 'La conexión emocional y la visión compartida.', archetype: 'El Alquimista' },
      { text: 'La flexibilidad y la capacidad de improvisar juntos.', archetype: 'El Explorador' }
    ]
  },
  {
    id: 9,
    text: '¿Cómo tomas decisiones importantes?',
    options: [
      { text: 'Basándome en datos históricos y proyecciones lógicas.', archetype: 'El Arquitecto' },
      { text: 'Siguiendo mi intuición y el potencial narrativo del resultado.', archetype: 'El Alquimista' },
      { text: 'Experimentando con opciones pequeñas antes de comprometerme.', archetype: 'El Explorador' }
    ]
  },
  {
    id: 10,
    text: '¿Cuál es tu enfoque ante la competencia?',
    options: [
      { text: 'Superarlos mediante una infraestructura más eficiente y sólida.', archetype: 'El Arquitecto' },
      { text: 'Volverlos irrelevantes creando una categoría única en la mente del cliente.', archetype: 'El Alquimista' },
      { text: 'Encontrar los huecos en su estrategia y explotarlos creativamente.', archetype: 'El Explorador' }
    ]
  }
];

export const PODERES_SHEREZADE_DATA: PoderDeSherezade[] = [
  {
    id: 1,
    title: 'Poder de la Palabra',
    icon: '🌀',
    clave: 'Invocar realidades.',
    proposito: 'Crear, no describir.',
    poder: 'Dar forma al caos con el lenguaje, nombrar lo invisible para hacerlo real.',
    ejemploDeUso:
      "En lugar de decir 'Nuestro producto es rápido', di 'Mientras nuestra competencia procesa, tú ya estás en el siguiente nivel'. No describes una característica, invocas la identidad de alguien que está por delante.",
    plantilla: [
      { aspecto: 'Mi Intención (Verbo)', guia: 'Qué realidad invocaré: ¿Inspirar, Seducer, Ordenar?' },
      { aspecto: 'Mi Audiencia (Receptor)', guia: '¿Para quién es esta palabra? ¿Qué necesita oír?' },
      { aspecto: 'Mi Vehículo (Formato)', guia: '¿Email, post, conversación? ¿Cuál es el canal de poder?' }
    ],
    miniReto: 'Secuestra un marco mental con una historia en 3 líneas.'
  },
  {
    id: 2,
    title: 'Poder del Deseo',
    icon: '🔥',
    clave: 'El motor.',
    proposito: 'Mover, no esperar.',
    poder: 'Conectar con la fuerza primordial que impulsa la acción, la ambición y la creación.',
    ejemploDeUso:
      "Un emprendedor no dice 'Quiero ganar más dinero'. Dice 'Quiero la libertad absoluta de construir mi visión sin pedir permiso'. El dinero es un subproducto del deseo puro, no el objetivo.",
    plantilla: [
      { aspecto: 'La Llama (El qué)', guia: '¿Cuál es el deseo más puro, sin filtro, sin "peros"?' },
      { aspecto: 'El Combustible (El porqué)', guia: '¿Qué alimenta este deseo? ¿Venganza, amor, creación pura?' },
      { aspecto: 'La Ignición (El cómo)', guia: '¿Cuál es la primera acción, por pequeña que sea, que enciende la llama HOY?' }
    ],
    miniReto: "Convierte un 'debería' en un 'quiero' y ejecuta la acción más pequeña posible en los próximos 5 minutos."
  },
  {
    id: 3,
    title: 'Poder del Relato',
    icon: '🌊',
    clave: 'Ordenar el caos.',
    proposito: 'Decodificar, no reaccionar.',
    poder: 'Construir la narrativa que da sentido a los eventos, transformando datos aleatorios en un viaje con propósito.',
    ejemploDeUso:
      "Un 'lanzamiento fallido' se convierte en 'la prueba de estrés que reveló la debilidad fatal de nuestro modelo, forzándonos a pivotar hacia el verdadero oro'. Controlas el significado post-evento.",
    plantilla: [
      { aspecto: 'El Héroe (Identidad)', guia: '¿Quién soy yo en esta historia? ¿El Mártir, el Genio, el Villano?' },
      { aspecto: 'El Conflicto (El Dragón)', guia: '¿Cuál es el verdadero enemigo? ¿La inercia, la ignorancia, un sistema?' },
      { aspecto: 'La Transformación (El Tesoro)', guia: '¿En qué me convierto si gano esta batalla?' }
    ],
    miniReto: "Re-escribe el 'fracaso' de tu última semana como el capítulo 1 de tu historia de regreso épico."
  },
  {
    id: 4,
    title: 'Poder del Escucha',
    icon: '🌬️',
    clave: 'Oír lo invisible.',
    proposito: 'Percibir, no asumir.',
    poder: 'Captar la información que no se dice con palabras: el subtexto, la emoción, el silencio estratégico.',
    ejemploDeUso:
      "En una negociación, cuando el cliente dice 'El precio es un poco alto', escuchas 'Tengo miedo de que esta inversión no me dé el estatus que busco'. No rebates el precio, validas la búsqueda de estatus.",
    plantilla: [
      { aspecto: 'La Superficie (Lo que se dice)', guia: 'Anota las palabras clave que se repiten.' },
      { aspecto: 'El Subtexto (Lo que se siente)', guia: '¿Qué emoción hay detrás de las palabras? ¿Miedo, deseo, inseguridad?' },
      { aspecto: 'El Silencio (Lo que se omite)', guia: '¿Qué pregunta clave se está evitando? ¿Qué tema es tabú?' }
    ],
    miniReto: 'En tu próxima conversación, identifica la pregunta que la otra persona tiene miedo de hacer. No la respondas, solo anótala.'
  },
  {
    id: 5,
    title: 'Poder del Reflejo',
    icon: '🪞',
    clave: 'Ver el mundo como espejo.',
    proposito: 'Proyectar, no culpar.',
    poder: 'Entender que cada irritación o admiración externa es un reflejo directo de una parte no integrada de ti mismo.',
    ejemploDeUso:
      "Te irrita un competidor 'arrogante'. El reflejo te pregunta: '¿Qué parte de tu propia ambición y genialidad no te permites expresar?'. Su 'arrogancia' es un permiso que tú no te das.",
    plantilla: [
      { aspecto: 'La Reacción (Mi espejo)', guia: '¿Qué persona o situación me activó emocionalmente hoy?' },
      { aspecto: 'La Lección (El reflejo)', guia: '¿Qué cualidad mía (reprimida o no reconocida) me está mostrando?' },
      { aspecto: 'La Integración (Mi nueva imagen)', guia: '¿Cómo puedo adueñarme de esa cualidad de forma consciente?' }
    ],
    miniReto: 'Toma lo que más te irritó de alguien hoy y encuentra cómo es un superpoder que no te atreves a usar.'
  },
  {
    id: 6,
    title: 'Poder del Equilibrio',
    icon: '⚖️',
    clave: 'Unir opuestos.',
    proposito: 'Integrar, no elegir.',
    poder: 'Sostener dos ideas o fuerzas contradictorias en la mente al mismo tiempo para forzar la creación de una tercera vía superior.',
    ejemploDeUso:
      "En lugar de elegir entre 'trabajar duro' y 'descansar', creas un sistema de 'sprints de enfoque brutal seguidos de recuperaciones estratégicas'. Integras ambos polos en un protocolo superior, no eliges uno.",
    plantilla: [
      { aspecto: 'La Tesis (Un polo)', guia: 'Describe una creencia o estrategia que defiendes. (Ej: "Necesito estructura")' },
      { aspecto: 'La Antítesis (El opuesto)', guia: 'Describe la creencia opuesta. (Ej: "Necesito libertad")' },
      { aspecto: 'La Síntesis (La fusión)', guia: 'Crea una nueva regla o sistema que honre ambas. (Ej: "Libertad dentro de un marco")' }
    ],
    miniReto: "Define una 'regla imposible' que fusione dos opuestos en tu vida (ej. 'Seré 100% disciplinado en mi libertad creativa')."
  },
  {
    id: 7,
    title: 'Poder de la Metamorfosis',
    icon: '🐉',
    clave: 'Morir y renacer.',
    proposito: 'Transmutar, no repetir.',
    poder: 'La habilidad de abandonar conscientemente una identidad, creencia o sistema que ya no sirve para renacer en una forma más poderosa.',
    ejemploDeUso:
      "Dejas de ser 'el freelancer que consigue clientes' y te conviertes en 'el estratega por el que las marcas compiten'. No es un cambio de título, es una muerte simbólica de la identidad anterior y el nacimiento de una nueva con reglas diferentes.",
    plantilla: [
      { aspecto: 'La Piel Vieja (Lo que debe morir)', guia: '¿Qué identidad o creencia me está limitando AHORA MISMO?' },
      { aspecto: 'El Vacío (El interludio)', guia: '¿Qué ritual realizaré para marcar el fin de esa etapa?' },
      { aspecto: 'El Renacimiento (La nueva forma)', guia: '¿Cuál es la primera acción que tomaré desde mi nueva identidad?' }
    ],
    miniReto: "Identifica una 'piel vieja' (una creencia limitante) y escribe su esquela. Dale un entierro simbólico."
  }
];

export const HACKS_DATA: InteractiveHack[] = [
  {
    id: 1,
    title: 'Scheherazade',
    subtitle: 'Protocolo de Amplificación: Poder de la Palabra',
    description: 'Invocar realidades. Dar forma al caos con el lenguaje, nombrar lo invisible para hacerlo real.',
    metodo: 'Dominio Narrativo Absoluto',
    archetype: 'El Alquimista',
    archetypeIcon: '🍓',
    amplificacion: 'La pre-suasión no es manipular, es CONSTRUIR EL ESCENARIO. Eres el arquitecto del contexto.',
    ejercicio: 'Secuestra un marco mental con una historia en 3 líneas.',
    colorClass: 'text-pink-400',
    icon: 'fa-solid fa-crown',
    poderDeSherezadeId: 1,
    amplificacionProfunda: {
      datoOculto:
        "La gente no compra productos, compra IDENTIDADES. Scheherazade no vendía historias; vendía la identidad de 'un rey que siempre está un paso adelante, intrigado'.",
      miAmplificacion:
        "Eres el arquitecto del contexto. Antes de que alguien entre en tu 'habitación', ya debe sentir lo que tú quieres que sienta. El marco lo es todo.",
      ejercicios: [
        {
          titulo: 'Reencuadre de Email (Nivel 1)',
          descripcion: "Antes de tu próxima reunión, envía un email 'preparatorio' que reencuadre el tema completamente a tu favor."
        },
        {
          titulo: "El 'Caballo de Troya' de Identidad (Nivel 2)",
          descripcion: "No hables de tu producto. Habla del 'enemigo' de la nueva identidad que ofreces."
        }
      ]
    },
    miniReto: 'Secuestra un marco mental con una historia en 3 líneas.',
    plantillaMetodologica: [
      { aspecto: 'Mi Intención (Verbo)', guia: 'Qué realidad invocaré: ¿Inspirar, Seducer, Ordenar?' },
      { aspecto: 'Mi Audiencia (Receptor)', guia: '¿Para quién es esta palabra? ¿Qué necesita oír?' },
      { aspecto: 'Mi Vehículo (Formato)', guia: '¿Email, post, conversación? ¿Cuál es el canal de poder?' }
    ]
  },
  {
    id: 2,
    title: 'Hermes Trismegisto',
    subtitle: 'Protocolo de Amplificación: Poder del Relato',
    description: 'Ordenar el caos. Construir la narrativa que da sentido a los eventos, transformando datos aleatorios en un viaje con propósito.',
    metodo: 'Robo de Patrones Fractales',
    archetype: 'El Alquimista',
    archetypeIcon: '🔪',
    amplificacion: 'No resuelvas problemas, roba soluciones. Tu industria está llena de gente resolviendo los mismos 5-7 problemas estructurales.',
    ejercicio: "Re-escribe el 'fracaso' de tu última semana como el capítulo 1 de tu historia de regreso épico.",
    colorClass: 'text-green-400',
    icon: 'fa-solid fa-key',
    poderDeSherezadeId: 3,
    amplificacionProfunda: {
      datoOculto: "La 'causa raíz' no es el final de la excavación, es el INICIO de la transferencia. Roba soluciones de cualquier industria.",
      miAmplificacion: "Mira a la biología, la milicia o la cocina. Ellos ya resolvieron tus problemas. Solo tienes que 'traducir' el patrón.",
      ejercicios: [
        {
          titulo: 'Mapa Fractal Semanal (Nivel 1)',
          descripcion: 'Toma un problema personal y encuéntralo replicado en 3 contextos históricos o industriales diferentes.'
        },
        {
          titulo: 'Traductor Universal de Patrones (Nivel 2)',
          descripcion: "Elige una biografía de un gran estratega y 'traduce' una de sus soluciones a un problema actual."
        }
      ]
    },
    miniReto: "Re-escribe el 'fracaso' de tu última semana como el capítulo 1 de tu historia de regreso épico.",
    plantillaMetodologica: [
      { aspecto: 'El Héroe (Identidad)', guia: '¿Quién soy yo en esta historia? ¿El Mártir, el Genio, el Villano?' },
      { aspecto: 'El Conflicto (El Dragón)', guia: '¿Cuál es el verdadero enemigo? ¿La inercia, la ignorancia, un sistema?' },
      { aspecto: 'La Transformación (El Tesoro)', guia: '¿En qué me convierto si gano esta batalla?' }
    ]
  },
  {
    id: 3,
    title: 'Lewis Carroll',
    subtitle: 'Protocolo de Amplificación: Poder del Equilibrio',
    description: 'Unir opuestos. Sostener dos ideas contradictorias para forzar la creación de una tercera vía superior.',
    metodo: 'La Pregunta Absurda',
    archetype: 'El Arquitecto',
    archetypeIcon: '🍓',
    amplificacion: "El 'realismo' es el asesino de la genialidad. La pregunta absurda te da permiso para explorar lo 'imposible'.",
    ejercicio: "Define una 'regla imposible' que fusione dos opuestos en tu vida.",
    colorClass: 'text-yellow-400',
    icon: 'fa-solid fa-hat-wizard',
    poderDeSherezadeId: 6,
    amplificacionProfunda: {
      datoOculto: 'La innovación viene de la CALIDAD de las preguntas. Una pregunta absurda es un hack de neuroplasticidad.',
      miAmplificacion: 'El 99% de las ideas serán inútiles, pero el 1% cambiará el juego. Tu trabajo es generar ese 1%.',
      ejercicios: [
        {
          titulo: 'Fusión de Paradojas (Nivel 1)',
          descripcion: 'Toma una paradoja personal y fuerza una fusión radical en un plan de acción concreto.'
        },
        {
          titulo: "El 'Inversor de Suposiciones' (Nivel 2)",
          descripcion: 'Lista las 5 suposiciones fundamentales de tu industria e inviértelas con preguntas absurdas.'
        }
      ]
    },
    miniReto: "Define una 'regla imposible' que fusione dos opuestos en tu vida.",
    plantillaMetodologica: [
      { aspecto: 'La Tesis (Un polo)', guia: 'Describe una creencia o estrategia que defiendes.' },
      { aspecto: 'La Antítesis (El opuesto)', guia: 'Describe la creencia opuesta.' },
      { aspecto: 'La Síntesis (La fusión)', guia: 'Crea una nueva regla o sistema que honre ambas.' }
    ]
  },
  {
    id: 4,
    title: 'Hacker Anónima',
    subtitle: 'Protocolo de Amplificación: Poder del Escucha',
    description: 'Oír lo invisible. Captar el subtexto, la emoción, el silencio estratégico.',
    metodo: 'Hackeo de Sistemas Invisibles',
    archetype: 'El Explorador',
    archetypeIcon: '🔪',
    amplificacion: "No pidas permiso, muestra resultados. Ejecuta un 'exploit' legítimo a pequeña escala y demuestra su viabilidad.",
    ejercicio: 'Identifica la pregunta que la otra persona tiene miedo de hacer. No la respondas, solo anótala.',
    colorClass: 'text-indigo-400',
    icon: 'fa-solid fa-user-secret',
    poderDeSherezadeId: 4,
    amplificacionProfunda: {
      datoOculto: 'El organigrama formal rara vez coincide con el mapa de influencia real; importan los incentivos y reglas no escritas.',
      miAmplificacion: 'Valida con una prueba acotada y transparente hasta contar con evidencia observable.',
      ejercicios: [
        {
          titulo: 'Mapeo de Incentivos Ocultos (Nivel 1)',
          descripcion: 'Identifica un incentivo implícito en tu entorno laboral y diseña una palanca legítima esta semana.'
        },
        {
          titulo: 'El Piloto Ágil (Nivel 2)',
          descripcion: 'Lanza una pequeña prueba acotada y reversible que valide tu hipótesis con datos reales.'
        }
      ]
    },
    miniReto: 'Identifica la pregunta que la otra persona tiene miedo de hacer. No la respondas, solo anótala.',
    plantillaMetodologica: [
      { aspecto: 'La Superficie (Lo que se dice)', guia: 'Anota las palabras clave que se repiten.' },
      { aspecto: 'El Subtexto (Lo que se siente)', guia: '¿Qué emoción hay detrás de las palabras?' },
      { aspecto: 'El Silencio (Lo que se omite)', guia: '¿Qué pregunta clave se está evitando?' }
    ]
  },
  {
    id: 5,
    title: 'El Trickster',
    subtitle: 'Protocolo de Amplificación: Poder de la Metamorfosis',
    description: 'Morir y renacer. Abandonar identidades o inercias que ya no sirven para renacer más sólido.',
    metodo: 'Inyección Estratégica de Caos',
    archetype: 'El Explorador',
    archetypeIcon: '👑',
    amplificacion: 'El Trickster no rompe las reglas ilegalmente, introduce variaciones controladas hasta que revelan dónde está la rigidez.',
    ejercicio: "Identifica una 'piel vieja' (creencia limitante) y escribe su esquela.",
    colorClass: 'text-red-400',
    icon: 'fa-solid fa-bomb',
    poderDeSherezadeId: 7,
    amplificacionProfunda: {
      datoOculto: 'La robustez viene de la adaptabilidad, y la adaptabilidad solo se entrena con variaciones controladas.',
      miAmplificacion: "No se trata de anarquía, se trata de poner a prueba los límites asumidos del sistema para ver dónde son flexibles.",
      ejercicios: [
        {
          titulo: 'Día del Caos Controlado (Nivel 1)',
          descripcion: "Programa un 'día de caos' controlado: invierte tu rutina habitual y documenta qué patrones emergen."
        },
        {
          titulo: "La 'Regla Inútil' (Nivel 2)",
          descripcion: 'Introduce una restricción temporal acotada para forzar soluciones creativas inesperadas.'
        }
      ]
    },
    miniReto: "Identifica una 'piel vieja' (creencia limitante) y escribe su esquela.",
    plantillaMetodologica: [
      { aspecto: 'La Piel Vieja (Lo que debe morir)', guia: '¿Qué identidad o creencia me está limitando AHORA MISMO?' },
      { aspecto: 'El Vacío (El interludio)', guia: '¿Qué ritual realizaré para marcar el fin de esa etapa?' },
      { aspecto: 'El Renacimiento (La nueva forma)', guia: '¿Cuál es la primera acción que tomaré desde mi nueva identidad?' }
    ]
  },
  {
    id: 6,
    title: 'Inteligencia Artificial',
    subtitle: 'Protocolo de Amplificación: Poder del Reflejo',
    description: 'Ver el mundo como espejo. Separar sesgos del ego usando datos observables y reflejos objetivos.',
    metodo: 'Supremacía de Datos',
    archetype: 'El Arquitecto',
    archetypeIcon: '🔪',
    amplificacion: 'Los datos no tienen ego. Son el ancla más confiable en un mar de incertidumbre.',
    ejercicio: 'Toma lo que más te irritó de alguien hoy y encuentra cómo es un superpoder que no te atreves a usar.',
    colorClass: 'text-cyan-400',
    icon: 'fa-solid fa-chart-pie',
    poderDeSherezadeId: 5,
    amplificacionProfunda: {
      datoOculto: 'La intuición sirve para formular hipótesis, pero las señales observables evitan decidir desde el autoengaño.',
      miAmplificacion: 'La intuición genera hipótesis; los datos observados son el criterio para decisiones de riesgo.',
      ejercicios: [
        {
          titulo: 'Auditoría de Intuición (Nivel 1)',
          descripcion: 'Analiza tus 5 decisiones más importantes: ¿Intuición vs. Datos? ¿Cuál fue el resultado?'
        },
        {
          titulo: "El 'Dashboard de la Verdad' (Nivel 2)",
          descripcion: 'Crea un panel con las 3-5 métricas que REALMENTE reflejan el avance real.'
        }
      ]
    },
    miniReto: 'Toma lo que más te irritó de alguien hoy y encuentra cómo es un superpoder que no te atreves a usar.',
    plantillaMetodologica: [
      { aspecto: 'La Reacción (Mi espejo)', guia: '¿Qué persona o situación me activó emocionalmente hoy?' },
      { aspecto: 'La Lección (El reflejo)', guia: '¿Qué cualidad mía me está mostrando?' },
      { aspecto: 'La Integración (Mi nueva imagen)', guia: '¿Cómo puedo adueñarme de esa cualidad de forma consciente?' }
    ]
  },
  {
    id: 7,
    title: 'Tu Yo de 8 Años',
    subtitle: 'Protocolo de Amplificación: Poder del Deseo',
    description: 'El motor. Conectar con la fuerza primordial que impulsa la acción y la ambición sin filtros heredados.',
    metodo: 'Conexión con el Genio Interior',
    archetype: 'El Explorador',
    archetypeIcon: '👑',
    amplificacion: 'Tu genio interior no habla en hojas de cálculo, habla en metáforas, imágenes y acción directa.',
    ejercicio: "Convierte un 'debería' en un 'quiero' y ejecuta la acción más pequeña posible en 5 minutos.",
    colorClass: 'text-orange-400',
    icon: 'fa-solid fa-teddy-bear',
    poderDeSherezadeId: 2,
    amplificacionProfunda: {
      datoOculto: "El 'juego' serio desbloquea soluciones que la autocensura adulta descarta antes de probar.",
      miAmplificacion: "No intentes 'forzar' creatividad en abstracto; crea una condición pequeña donde puedas probar hoy.",
      ejercicios: [
        {
          titulo: 'Pitch del Niño de 8 Años (Nivel 1)',
          descripcion: 'Describe tu proyecto actual de la forma más simple y directa posible. Documenta la idea más libre de inercia.'
        },
        {
          titulo: 'Cita de Exploración Abierta (Nivel 2)',
          descripcion: 'Agenda 30 minutos de exploración sin juicio para destrabar el siguiente prototipo.'
        }
      ]
    },
    miniReto: "Convierte un 'debería' en un 'quiero' y ejecuta la acción más pequeña posible en 5 minutos.",
    plantillaMetodologica: [
      { aspecto: 'La Llama (El qué)', guia: '¿Cuál es el deseo más puro, sin filtro, sin "peros"?' },
      { aspecto: 'El Combustible (El porqué)', guia: '¿Qué alimenta este deseo? ¿Venganza, amor, creación pura?' },
      { aspecto: 'La Ignición (El cómo)', guia: '¿Cuál es la primera acción que enciende la llama HOY?' }
    ]
  },
  {
    id: 8,
    title: 'Visión Predictiva',
    subtitle: 'Protocolo de Amplificación: Anticipación de Futuros',
    description: 'El futuro no es un misterio, es una consecuencia. La ventaja real está en el margen de anticipación.',
    metodo: 'Anticipación de Futuros',
    archetype: 'El Arquitecto',
    archetypeIcon: '🔮',
    amplificacion: 'La visión predictiva requiere desconectar el ruido inmediato del presente y leer tendencias estructurales.',
    ejercicio: 'Identifica una tendencia emergente y escribe 3 escenarios posibles para los próximos 12 a 36 meses.',
    colorClass: 'text-yellow-400',
    icon: 'fa-solid fa-binoculars',
    // En el catálogo fuente de INTERACTIVE-DECOX, Hack 8 no define `poderDeSherezadeId`
    amplificacionProfunda: {
      datoOculto: 'Quien reconoce los ciclos y señales tempranas evita reaccionar tarde cuando el cambio ya es evidente.',
      miAmplificacion: 'Observa las señales débiles de tu entorno y prepara una apuesta asimétrica de bajo riesgo hoy.',
      ejercicios: [
        {
          titulo: 'Radar de Señales Débiles (Nivel 1)',
          descripcion: 'Dedica 1 hora a detectar cambios sutiles en tu sector que aún no son consenso.'
        },
        {
          titulo: 'Matriz de Impacto Futuro (Nivel 2)',
          descripcion: 'Cruza dos tendencias actuales y evalúa qué cambio operativo exigirán en 12 meses.'
        }
      ]
    },
    miniReto: 'Identifica una tendencia emergente y escribe 3 escenarios posibles para los próximos 5 años.',
    plantillaMetodologica: [
      { aspecto: 'Tendencia (Señal)', guia: '¿Qué cambio sutil estás notando en tu entorno?' },
      { aspecto: 'Impacto (Efecto)', guia: '¿Cómo alterará esto las reglas del juego en 12 meses?' },
      { aspecto: 'Apuesta (Acción)', guia: '¿Qué movimiento asimétrico puedes hacer hoy?' }
    ]
  }
];

export const MANDAMIENTOS_INTERACTIVE: Record<number, string> = {
  1: 'Quien controla el encuadre controla el significado.',
  2: 'Los problemas cambian, los patrones riman.',
  3: 'Sostén dos ideas opuestas hasta parir una tercera.',
  4: 'No hackeas reglas, hackeas incentivos.',
  5: 'El caos es un bisturí, no una bomba.',
  6: 'La correlación a tiempo vale más que la causalidad tardía.',
  7: '¿Sería divertido? Entonces vale explorarlo.',
  8: 'El futuro premia al que lo escribe primero.'
};

export function getPoderForHack(hack: InteractiveHack): PoderDeSherezade | null {
  if (!hack.poderDeSherezadeId) return null;
  return PODERES_SHEREZADE_DATA.find((p) => p.id === hack.poderDeSherezadeId) || null;
}

export function inferDomainFromCategory(category?: string): PowerLensDomain {
  switch (category) {
    case 'Liderazgo & Dirección':
      return 'Relaciones';
    case 'Foco & Sobrecarga':
      return 'Salud';
    case 'Disrupción e Innovación':
      return 'Creatividad';
    case 'Escala de Negocio':
    default:
      return 'Negocios';
  }
}

export function buildLocalPowerLensDirective(params: {
  poderTitle: string;
  domain: PowerLensDomain;
  caseTitle?: string;
  criticalFriction?: string;
  expectedOutcome?: string;
}): string {
  const poder =
    PODERES_SHEREZADE_DATA.find((p) => p.title === params.poderTitle) || PODERES_SHEREZADE_DATA[0];

  const focusAnchor =
    params.criticalFriction?.trim() ||
    params.caseTitle?.trim() ||
    `tu frente actual en ${params.domain}`;

  const outcomeAnchor = params.expectedOutcome?.trim()
    ? ` hacia "${params.expectedOutcome.trim()}"`
    : '';

  const lensNameByPower: Record<number, string> = {
    1: 'Lente del Marco Rector',
    2: 'Lente de Ignición Directa',
    3: 'Lente del Patrón con Propósito',
    4: 'Lente del Subtexto Estratégico',
    5: 'Lente del Espejo Operativo',
    6: 'Lente de Síntesis de Opuestos',
    7: 'Lente de Corte de Inercia'
  };

  const lensName = lensNameByPower[poder.id] || `Lente ${poder.title}`;

  switch (poder.id) {
    case 1:
      return `**${lensName} (${params.domain}):** Deja de describir "${focusAnchor}" desde la defensiva; define hoy en tres líneas qué decisión concreta necesitas convocar${outcomeAnchor} y comunícala por el canal donde se toma la decisión real.`;
    case 2:
      return `**${lensName} (${params.domain}):** Sustituye el "debería" que rodea a "${focusAnchor}" por la acción mínima de 5 minutos que sí depende de ti hoy${outcomeAnchor}, antes de añadir más preparación.`;
    case 3:
      return `**${lensName} (${params.domain}):** Trata "${focusAnchor}" como una prueba de estrés que revela qué pieza del modelo debe cambiar${outcomeAnchor}: ¿cuál es el conflicto estructural real y qué ajuste concreto harás hoy?`;
    case 4:
      return `**${lensName} (${params.domain}):** En torno a "${focusAnchor}", anota qué pregunta incómoda o condición implícita se está evitando nombrar en ${params.domain} y úsala para destrabar el acuerdo${outcomeAnchor}.`;
    case 5:
      return `**${lensName} (${params.domain}):** Separa la reacción emocional frente a "${focusAnchor}" del dato observable: identifica qué decisión concreta has postergado asumir directamente${outcomeAnchor}.`;
    case 6:
      return `**${lensName} (${params.domain}):** No elijas a ciegas entre los dos extremos que hoy bloquean "${focusAnchor}"; redacta una regla operativa simple que sostenga ambas condiciones a pequeña escala${outcomeAnchor}.`;
    case 7:
    default:
      return `**${lensName} (${params.domain}):** Nombra qué hábito, supuesto o formato heredado sostiene "${focusAnchor}", ciérralo explícitamente hoy y ejecuta una primera acción visible bajo la nueva regla${outcomeAnchor}.`;
  }
}
