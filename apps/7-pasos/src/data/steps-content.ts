// =============================================================================
// 7 Pasos para Cambiar tu Vida - Structured Content
// =============================================================================

export interface StepSection {
  type: 'heading' | 'paragraph' | 'quote' | 'list' | 'exercise' | 'table';
  content: string;
  items?: string[];
  rows?: { col1: string; col2: string; col3: string }[];
}

export interface StepExercise {
  title: string;
  description: string;
  weeks: string[];
}

export interface StepContent {
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  summary: string;
  sections: StepSection[];
  exercise: StepExercise;
  closingQuote: string;
  connectionText: string;
}

// =============================================================================
// STEP 1 - Todo Cuenta
// =============================================================================

const step1: StepContent = {
  number: 1,
  title: 'Todo Cuenta',
  subtitle: 'Cada micro-decisión define tu vida',
  icon: '\u26A1',
  color: 'emerald',
  summary:
    'Cada día tenés 1.440 minutos. Lo que hagas con cada uno de ellos construye o destruye tu futuro. No hay decisiones neutrales.',
  sections: [
    {
      type: 'quote',
      content:
        'Cuanto más cambian las cosas, más siguen siendo las mismas. — Jean-Baptiste Alphonse Karr, 1849',
    },
    {
      type: 'paragraph',
      content:
        'Podés cambiar de trabajo, de ciudad, de pareja, de look. Y sin embargo, si no cambiás las micro-decisiones que tomás todos los días, dentro de cinco años vas a estar exactamente en el mismo lugar. Con otra cara enfrente, en otra oficina, en otra dirección. Pero el mismo resultado.',
    },
    {
      type: 'paragraph',
      content:
        'El cambio real no empieza en lo grande. Empieza en lo que hacés a las siete de la mañana cuando suena el despertador y nadie te está mirando.',
    },
    {
      type: 'paragraph',
      content:
        'Tu vida no la define lo que hacés cuando estás motivado. La define lo que hacés cuando no tenés ganas.',
    },
    {
      type: 'heading',
      content: 'Los 1.440 minutos',
    },
    {
      type: 'paragraph',
      content:
        'Hoy tenés 1.440 minutos disponibles. Ayer también. Mañana también. Cada minuto es una decisión. Levantarte o dar vuelta la almohada. Abrir el teléfono o abrir un libro. Comer lo que tenés en el cajón o preparar algo que te haga bien. Tomar el ascensor o subir las escaleras.',
    },
    {
      type: 'paragraph',
      content:
        'La mayoría de esas decisiones las tomás en piloto automático. Sin pensar. Sin elegir conscientemente. Y eso está bien, el cerebro necesita automatizar la mayor parte de lo que hacés para no colapsar. El problema es cuando las decisiones automáticas te llevan sistemáticamente en la dirección equivocada.',
    },
    {
      type: 'paragraph',
      content:
        'No es que seas vago. No es que no tengas voluntad. Es que nadie te explicó que esas pequeñas decisiones tienen peso real. Eso cambia hoy. Todo cuenta.',
    },
    {
      type: 'heading',
      content: 'Por qué tu cerebro no registra el impacto de las decisiones pequeñas',
    },
    {
      type: 'paragraph',
      content:
        'El cerebro humano tiene un problema de diseño cuando se trata de tiempo. Somos muy buenos para reaccionar a amenazas inmediatas, un perro que ladra, un auto que se cruza, una pelea con alguien. Somos malísimos para visualizar el impacto acumulativo de decisiones pequeñas a lo largo del tiempo.',
    },
    {
      type: 'paragraph',
      content:
        '¿Por qué? Porque evolucionamos en un mundo donde el futuro lejano no importaba tanto. El que sobrevivía era el que reaccionaba al peligro de ahora, no el que planificaba qué comer en tres meses. Eso cambió. Tu contexto cambió. Pero tu cerebro sigue funcionando igual.',
    },
    {
      type: 'paragraph',
      content:
        'Tomás una gaseosa y tu cerebro no registra peligro. No hay alarma. No hay consecuencia inmediata. La conexión entre "gaseosa de hoy" y "salud dentro de diez años" es demasiado abstracta para que el sistema de amenazas del cerebro la procese. Lo mismo con no leer. Con no moverte. Con no dormir bien. Ninguna de esas cosas te mata hoy. El cerebro las da por inocentes. Pero lo que hace una gota de agua todos los días durante un año, lo sabés.',
    },
    {
      type: 'heading',
      content: 'La matemática que nadie te hizo',
    },
    {
      type: 'list',
      content: 'Hagamos los números juntos:',
      items: [
        '20 minutos de pantalla → 20 minutos de caminata: en 180 días son 60 horas de ejercicio. Desde cero.',
        'Dejar las gaseosas: una lata tiene 35-40g de azúcar. Una por día = casi 15 kilos de azúcar al año en tu cuerpo.',
        '30 minutos de lectura en vez de teléfono antes de dormir: en 180 días terminás entre 8 y 12 libros.',
        '40 minutos de aprendizaje diario: 180 días = 120 horas. La mayoría de cursos universitarios tienen 120 horas de contenido.',
      ],
    },
    {
      type: 'paragraph',
      content:
        'Nada de esto requiere fuerza de voluntad sobrehumana. Requiere entender que el tiempo compuesto funciona. El principio del interés compuesto dice que cualquier sistema donde algo pequeño se acumula consistentemente genera resultados exponenciales. Tus decisiones son ese sistema.',
    },
    {
      type: 'heading',
      content: 'Lo que la neurociencia dice sobre los hábitos',
    },
    {
      type: 'paragraph',
      content:
        'Cuando repetís una decisión muchas veces, el cerebro literalmente cambia su estructura física. Esto no es metáfora. Es biología.',
    },
    {
      type: 'paragraph',
      content:
        'Cada vez que hacés algo, las neuronas involucradas se conectan entre sí. La primera vez, la conexión es débil, como un sendero en el barro. La décima vez, el camino empieza a marcarse. La centésima, ya es una ruta. La milésima, es una autopista.',
    },
    {
      type: 'paragraph',
      content:
        'A ese proceso se lo llama mielinización. La mielina es una sustancia que recubre los axones de las neuronas y los hace más eficientes, más rápidos, más automáticos. Cuanto más repetís algo, más mielina se deposita en esas conexiones, y más fácil se vuelve hacerlo la próxima vez.',
    },
    {
      type: 'paragraph',
      content:
        'Esto tiene dos caras. La buena: cuando instalás una decisión positiva como hábito, con el tiempo requiere cada vez menos esfuerzo. La mala: lo mismo pasa con las decisiones negativas. El teléfono antes de dormir, la gaseosa del almuerzo, quejarte cuando algo sale mal. También son autopistas. También están mielinizadas. Y por eso cuesta tanto cambiarlas: no es debilidad moral, es neurología.',
    },
    {
      type: 'paragraph',
      content:
        'No estás luchando contra tus malos hábitos. Estás compitiendo contra una autopista que tardaste años en construir. La buena noticia es que el cerebro es plástico, puede remodelarse. La mala es que lleva tiempo. Y el único camino es la repetición. Por eso este programa dura 180 días, no 30.',
    },
    {
      type: 'heading',
      content: 'No existen las decisiones neutras',
    },
    {
      type: 'paragraph',
      content:
        'Siempre estás o sumando o restando. No hay pausa, no hay standby. Cuando te quedás una hora más mirando series en vez de dormir, no es que "no hiciste nada". Tomaste una decisión que le va a restar calidad a tu mañana, que va a afectar tu energía, tu claridad, tu paciencia. Realmente restaste.',
    },
    {
      type: 'paragraph',
      content:
        'Esto puede sonar duro. No es para culparte. Es para que entiendas que cada momento tiene dirección. Y vos podés elegir cuál.',
    },
    {
      type: 'heading',
      content: 'Los últimos minutos del día',
    },
    {
      type: 'paragraph',
      content:
        'Hay un momento específico que tiene un peso desproporcionado: los últimos 20 o 30 minutos antes de dormir. ¿Por qué? Porque lo último que procesás antes de cerrar los ojos es lo que tu cerebro procesa mientras dormís.',
    },
    {
      type: 'paragraph',
      content:
        'Matthew Walker, neurocientífico de la Universidad de California Berkeley, explica que durante el sueño profundo y la fase REM el cerebro consolida memorias, procesa emociones y refuerza conexiones neuronales. Y tiende a seguir trabajando con el material que tuvo más actividad al final del día.',
    },
    {
      type: 'paragraph',
      content:
        'Si lo último que hiciste fue scrollear noticias malas, tu cerebro procesa angustia. Si te fuiste a dormir con una discusión sin resolver, tu cerebro rumia el conflicto. En cambio, si antes de dormir leíste algo que te hizo pensar, revisaste tus objetivos, o simplemente tuviste diez minutos de silencio, le das al cerebro material distinto para procesar.',
    },
    {
      type: 'heading',
      content: 'La gente que cambia no es diferente a vos',
    },
    {
      type: 'paragraph',
      content:
        'Lo que tienen es otra relación con las decisiones pequeñas. El deportista de élite no entrena porque siempre tiene ganas. Entrena porque construyó una identidad alrededor de entrenar. El escritor no escribe todos los días porque está inspirado. Escribe porque en algún momento decidió que escribir es lo que hace, llueva o truene.',
    },
    {
      type: 'paragraph',
      content:
        'La diferencia entre ellos y alguien que arranca y para y arranca y para no es talento. Es que ellos dejaron de negociar con la decisión. Vos negociás todos los días. "Hoy no. Mañana arranco. Esta semana me organizo." Eso no es debilidad de carácter, es que nunca conectaste la decisión pequeña de hoy con la persona que querés ser.',
    },
    {
      type: 'heading',
      content: 'Por qué empezamos por acá',
    },
    {
      type: 'paragraph',
      content:
        'Podría haberte dado técnicas de organización, un sistema de objetivos, un tracker de hábitos. Todo eso viene. Pero si no entendés que cada decisión tiene peso real, esas herramientas son decoración. El Paso 1 no es una técnica. Es un cambio de lente.',
    },
    {
      type: 'quote',
      content:
        'No es lo que hacés una vez lo que define tu vida. Es lo que hacés todos los días, en lo pequeño, cuando nadie te ve.',
    },
  ],
  exercise: {
    title: 'Registro de micro-decisiones',
    description:
      'Días 1 a 14: solo observá. Anotá tres micro-decisiones por noche. No cambies nada todavía, solo registrá.',
    weeks: [
      'Días 1 a 14: Solo observá. Anotá tres micro-decisiones por noche. No cambies nada todavía, solo registrá.',
      'Días 15 a 30: Buscá patrones. ¿Qué se repite? ¿Cuáles te suman y cuáles te restan? Sin juzgarte.',
      'Días 31 a 60: Reemplazá UNA micro-decisión negativa por una positiva. Una sola. Sostenela.',
      'Días 61 a 90: Agregá una segunda. Para este momento, la primera ya debería estar casi en piloto automático.',
    ],
  },
  closingQuote:
    'No es lo que hacés una vez lo que define tu vida. Es lo que hacés todos los días, en lo pequeño, cuando nadie te ve.',
  connectionText:
    'Con el Paso 1 claro, surge la pregunta obvia: ¿hacia dónde quiero que sumen todas estas decisiones? Eso es exactamente lo que resolvemos en el Paso 2.',
};

// =============================================================================
// STEP 2 - Objetivos
// =============================================================================

const step2: StepContent = {
  number: 2,
  title: 'Objetivos',
  subtitle: 'Definí 10 objetivos concretos para 180 días',
  icon: '\uD83C\uDFAF',
  color: 'blue',
  summary:
    'Definí 10 objetivos concretos para los próximos 180 días. Escritos en presente, específicos y medibles. Leelos cada mañana en voz alta.',
  sections: [
    {
      type: 'paragraph',
      content:
        'Ya entendiste que todo cuenta. Ahora necesitás saber para qué cuenta. Porque si no tenés claro hacia dónde vas, no podés saber si tus micro-decisiones te están acercando o alejando. Acá es donde definimos el norte.',
    },
    {
      type: 'heading',
      content: 'El estudio que todo el mundo cita mal',
    },
    {
      type: 'paragraph',
      content:
        'Durante años circuló una historia. Decía que en 1979 Harvard le preguntó a sus graduados si tenían objetivos escritos. Solo el 3% los tenía. Veinte años después, ese 3% ganaba diez veces más que todos los demás juntos. Buena historia, ¿no? El problema es que nunca pasó. El Dr. Steven Kraus, la revista Fast Company y la propia biblioteca de Harvard confirmaron que no hay registros de tal investigación.',
    },
    {
      type: 'paragraph',
      content:
        'Pero cuando la Dra. Gail Matthews, psicóloga de la Universidad Dominican de California, decidió hacer el estudio de verdad, los resultados fueron igual de contundentes. Tomó 267 participantes y los dividió en grupos. Las personas que escribieron sus objetivos los cumplieron un 42% más que las que solo los pensaron. Y las que sumaron compromisos concretos y rendición de cuentas llegaron todavía más lejos.',
    },
    {
      type: 'quote',
      content:
        '42% más de chances de cumplir un objetivo. Por el solo hecho de bajarlo al papel. No hace falta inventar mitos. La realidad ya es suficientemente poderosa.',
    },
    {
      type: 'heading',
      content: 'Por qué el cerebro necesita ver el objetivo escrito',
    },
    {
      type: 'paragraph',
      content:
        'Cuando un objetivo vive solo en tu cabeza, vive en el mismo lugar que los sueños, las preocupaciones y lo que tenés que comprar en el supermercado. Es ruido entre ruido. Cuando lo escribís, pasa algo distinto a nivel neurológico.',
    },
    {
      type: 'paragraph',
      content:
        'Los investigadores Hirshman y Bjork describieron lo que se llama el "efecto de generación": el cerebro procesa con mucha más profundidad la información que produce que la que solo consume. Cuando escribís un objetivo con tus propias palabras, tu cerebro lo codifica como información prioritaria. Lo marca. Lo sube a la cima de la pila.',
    },
    {
      type: 'paragraph',
      content:
        'Un deseo es una imagen vaga. Un objetivo escrito es una orden.',
    },
    {
      type: 'heading',
      content: 'La diferencia entre un deseo y un objetivo',
    },
    {
      type: 'paragraph',
      content:
        'Un deseo es "quiero bajar de peso". "Ojalá pudiera ahorrar más". "Estaría bueno ir al gimnasio". ¿Sabés qué pasa con los deseos? No se cumplen. Son cómodos porque no te comprometen a nada. Un objetivo es otra cosa. "Bajo 5 kilos en los próximos 180 días." Eso tiene forma. Tiene número. Tiene plazo.',
    },
    {
      type: 'list',
      content: 'La escalera completa:',
      items: [
        'Deseo → "Me gustaría ir al gimnasio" → No se cumple nunca.',
        'Objetivo → "Mi objetivo es ir al gimnasio 2 veces por semana" → Tiene forma.',
        'Objetivo escrito → Lo bajás al papel → Tu cerebro lo hace real.',
        'Objetivo en presente → "Voy al gimnasio 2 veces por semana" → Tu mente lo procesa como realidad actual.',
        'Objetivo + disciplina → Lo sostenés en el tiempo → Se transforma en un resultado.',
      ],
    },
    {
      type: 'heading',
      content: '¿Por qué en presente, no en futuro?',
    },
    {
      type: 'paragraph',
      content:
        'No es lo mismo escribir "quiero ir al gimnasio" que "voy al gimnasio dos veces por semana". Leélo de nuevo. ¿Sentís la diferencia? "Quiero ir" es un deseo. "Voy al gimnasio" es una realidad. Ya está pasando, al menos en el papel.',
    },
    {
      type: 'paragraph',
      content:
        'Cuando escribís en futuro, tu subconsciente registra distancia. Cuando escribís en presente, registra identidad. Algo que ya sos, que ya hacés. Si te repetís "voy al gimnasio" todos los días, tu cerebro empieza a construir esa identidad. No es magia. Es que el cerebro no distingue bien entre lo que imagina vívidamente y lo que vive.',
    },
    {
      type: 'list',
      content: 'Ejemplos:',
      items: [
        '❌ "Quiero empezar a ir al gimnasio" → ✅ "Voy al gimnasio dos veces por semana"',
        '❌ "Quiero bajar cinco kilos" → ✅ "Bajo cinco kilos en los próximos 180 días"',
        '❌ "Me gustaría leer más" → ✅ "Leo un libro por mes"',
        '❌ "Quiero pasar más tiempo con mis hijos" → ✅ "Juego con mi hijo 40 minutos cada día cuando llego del trabajo"',
      ],
    },
    {
      type: 'heading',
      content: 'Ser inteligente no es suficiente. A veces, incluso frena.',
    },
    {
      type: 'paragraph',
      content:
        'Angela Duckworth era profesora de matemática cuando notó que sus mejores alumnos no eran los más inteligentes. Eran los más persistentes. Estudió a miles de personas en entornos de alta exigencia: cadetes de West Point, finalistas de torneos nacionales, maestros en escuelas difíciles. El mejor predictor de éxito no era la inteligencia. Era lo que Duckworth llamó grit: perseverancia con propósito.',
    },
    {
      type: 'paragraph',
      content:
        'Las personas con IQ más alto tenían en algunos estudios menos grit. Los que no tienen todo tan fácil aprenden a compensar trabajando más duro y con más determinación. El que piensa demasiado no arranca. El que arranca, aunque no tenga todo pensado, llega.',
    },
    {
      type: 'quote',
      content:
        'Escribilos. Leélos. Actuá. Así de simple. Así de difícil.',
    },
    {
      type: 'heading',
      content: 'Las 4 categorías',
    },
    {
      type: 'paragraph',
      content:
        'Vas a escribir diez objetivos distribuidos entre cuatro áreas de tu vida. La vida funciona como sistema. Podés estar muy bien en el trabajo y destruido en las relaciones. Cuando te obligás a poner objetivos en las cuatro áreas, obtenés una imagen completa.',
    },
    {
      type: 'list',
      content: 'Categorías:',
      items: [
        'Personal: salud, hábitos, crecimiento, lectura, deporte, alimentación.',
        'Profesional: carrera, proyectos, habilidades, ingresos, capacitación.',
        'Relaciones: pareja, hijos, familia, amigos, vínculos que querés construir o cuidar.',
        'Financiero: ahorro, deudas, inversiones, gastos conscientes, independencia.',
      ],
    },
    {
      type: 'heading',
      content: 'La regla de oro: que sean posibles',
    },
    {
      type: 'paragraph',
      content:
        'Tus objetivos tienen que ser alcanzables. No fáciles, alcanzables. Si hoy no vas al gimnasio, no pongas "voy todos los días". La brecha es demasiado grande, y lo único que vas a lograr es frustrarte y abandonar. Arrancá con dos veces por semana. Si hoy tomás tres gaseosas, arrancá dejando una.',
    },
    {
      type: 'paragraph',
      content:
        'El cerebro necesita victorias para seguir. Las victorias imposibles no existen, y las ridículamente fáciles no generan tracción. El punto dulce es el objetivo que te estira un poco pero que sabés que podés cumplir si te lo proponés en serio.',
    },
    {
      type: 'heading',
      content: 'Leelos cada mañana en voz alta',
    },
    {
      type: 'paragraph',
      content:
        'Escribir los objetivos una sola vez no alcanza. El cerebro necesita repetición para reforzar las conexiones neuronales. Cada mañana, antes de abrir el teléfono, leés tus diez objetivos en voz alta. No en silencio. En voz alta. Escucharte decirlos en presente activa circuitos distintos que solo leerlos con los ojos.',
    },
    {
      type: 'paragraph',
      content:
        '¿Cuánto tarda? Dos minutos. Menos que revisar las notificaciones. ¿Qué hace? Le recuerda a tu cerebro, todos los días, cuál es la dirección. La gaseosa ya no es "una gaseosa", es "algo que me aleja de mi objetivo de bajar cinco kilos". El cambio es sutil. El efecto no.',
    },
  ],
  exercise: {
    title: 'Escribí tus 10 objetivos',
    description:
      'Días 1 a 7: Escribilos. No importa si no son perfectos, primero bajalos al papel.',
    weeks: [
      'Días 1 a 7: Escribilos. No importa si no son perfectos, primero bajalos al papel.',
      'Días 8 a 14: Revisalos con las cinco reglas. ¿Específicos? ¿Medibles? ¿En presente? Ajustalos.',
      'Días 15 a 30: Leelos en voz alta cada mañana. Sí, en voz alta. Tu cerebro escucha tu propia voz distinto.',
      'Días 31 a 180: Seguí leyéndolos cada mañana. Marcá progreso cada 30 días. Celebrá lo avanzado, ajustá lo que quedó atrás.',
    ],
  },
  closingQuote:
    'Escribí tus diez objetivos. Leélos cada mañana. Y cada vez que vayas a tomar una decisión, preguntate: ¿esto me acerca o me aleja? Esa pregunta, repetida todos los días, es más poderosa que cualquier técnica de productividad que hayas probado.',
  connectionText:
    'Con los objetivos claros, surge el siguiente problema: ¿de qué sirve tener dirección si las personas que te rodean te frenan cada vez que intentás avanzar? Eso es lo que resolvemos en el Paso 3.',
};

// =============================================================================
// STEP 3 - Tu Entorno
// =============================================================================

const step3: StepContent = {
  number: 3,
  title: 'Tu Entorno',
  subtitle: 'Tu entorno define tus resultados',
  icon: '\uD83D\uDC65',
  color: 'violet',
  summary:
    'Sos el promedio de las cinco personas con las que más tiempo pasás. No es motivación, es ciencia: los hábitos, la felicidad y los resultados se contagian entre personas.',
  sections: [
    {
      type: 'paragraph',
      content:
        'Este es el paso más controversial. Y probablemente el más difícil de todos. No porque sea complejo de entender, sino porque es complejo de cambiar. Porque acá entran el amor, el cariño, los años de amistad, la costumbre.',
    },
    {
      type: 'paragraph',
      content:
        'Pero la verdad hay que decirla: tu entorno define tus resultados.',
    },
    {
      type: 'heading',
      content: 'La frase que cambió cómo pienso en esto',
    },
    {
      type: 'paragraph',
      content:
        'Jim Rohn, uno de los mentores de desarrollo personal más influyentes del siglo XX, dijo algo que se repite en todos lados y que sin embargo muy poca gente aplica de verdad: "Sos el promedio de las cinco personas con las que más tiempo pasás."',
    },
    {
      type: 'paragraph',
      content:
        'No es una frase motivacional. Es una descripción de cómo funciona la influencia social. Tus ingresos tienden a ser el promedio de los ingresos de tu círculo cercano. Tu nivel de actividad física tiende a parecerse al de las personas con las que pasás más tiempo. Tus hábitos de alimentación, tu forma de hablar, lo que considerás normal, lo que considerás posible, todo eso está profundamente moldeado por quienes te rodean.',
    },
    {
      type: 'heading',
      content: 'La ciencia detrás del contagio social',
    },
    {
      type: 'paragraph',
      content:
        'Hay un estudio que siguió a más de 12.000 personas durante 32 años. Es uno de los más citados en la historia de las ciencias sociales. Y lo que encontraron fue extraordinario: la obesidad, el tabaquismo, la felicidad y los hábitos de ejercicio se propagan entre personas como si fueran contagiosos. No metafóricamente. Con patrones estadísticos similares a los de una enfermedad infecciosa.',
    },
    {
      type: 'paragraph',
      content:
        'Si tu amigo más cercano se vuelve obeso, tu probabilidad de volverte obeso aumenta un 45%. Si es un amigo de tu amigo, sigue siendo un 20% más probable. El efecto llega hasta tres grados de separación. Y funciona en las dos direcciones: si alguien en tu red cercana empieza a hacer ejercicio, a comer mejor, a progresar en su trabajo, eso también se contagia.',
    },
    {
      type: 'heading',
      content: 'El entorno que te frena',
    },
    {
      type: 'paragraph',
      content:
        'Si tus amigos lo único que hacen es juntarse a tomar, y tu objetivo es dejar el alcohol, tenés dos opciones: o tenés una disciplina de hierro y vas con ellos y no tomás, o dejás de juntarte un tiempo hasta que no te cueste tanto decir que no. No hay punto medio.',
    },
    {
      type: 'paragraph',
      content:
        'Si tu objetivo es ir al gimnasio dos, tres, cuatro veces por semana, y nadie en tu entorno va al gimnasio, se vuelve cuesta arriba. Porque no tenés con quién compartir ese camino. No tenés a nadie que te diga "dale, vamos" un día que no tenés ganas.',
    },
    {
      type: 'heading',
      content: 'El entorno del "no"',
    },
    {
      type: 'paragraph',
      content:
        'Hay algo que pasa mucho y que es muy dañino: rodearte de personas que todo lo resuelven con un "no". "No, yo no puedo dejar de comer azúcar." "No, no puedo ir al gimnasio." "No, no tengo tiempo." Si tu entorno es negativo, vas a normalizar el no. Sus límites se vuelven tus límites sin que te des cuenta.',
    },
    {
      type: 'heading',
      content: 'El entorno que te empuja',
    },
    {
      type: 'paragraph',
      content:
        'Ahora imaginate lo contrario. Rodeate de personas que están en el mismo camino de progreso que vos. De repente ir al gimnasio es más fácil porque vas con alguien. Comer mejor es más fácil porque el grupo elige mejor. Leer más es más fácil porque tenés con quién hablar de lo que leíste.',
    },
    {
      type: 'paragraph',
      content:
        'La investigación mostró algo que parece obvio pero que muy poca gente aplica: cuando las personas perciben que están trabajando junto a otros hacia un objetivo común, su persistencia en tareas difíciles aumenta significativamente. El efecto apareció incluso cuando esas personas no estaban físicamente juntas, solo sabían que otros estaban haciendo lo mismo.',
    },
    {
      type: 'heading',
      content: 'Cuando tu entorno se vuelve hostil',
    },
    {
      type: 'paragraph',
      content:
        'Cuando vos empezás a cambiar y tu entorno no, se genera una fricción. Empezás a progresar, y ahí tu entorno se vuelve hostil. Empiezan a cuestionarte. A tomarte el pelo. ¿Por qué pasa esto? Porque tu cambio les recuerda lo que ellos no están haciendo. No es personal. Es un mecanismo de defensa. Cuando alguien a tu alrededor mejora, los demás tienen dos opciones: inspirarse o atacar. Muchos eligen atacar porque es más fácil que cambiar.',
    },
    {
      type: 'paragraph',
      content:
        'Cuando eso pase, y va a pasar, acordate de esto: la incomodidad de tu entorno ante tu cambio es la mejor señal de que vas en la dirección correcta.',
    },
    {
      type: 'heading',
      content: 'La verdad incómoda',
    },
    {
      type: 'paragraph',
      content:
        'Es más fácil cambiar de entorno que tener una disciplina de acero. Ese estudio de 32 años lo confirmó con datos: el entorno gana casi siempre. No porque seamos débiles. Sino porque somos profundamente sociales y nuestro cerebro está diseñado para sincronizarse con los que nos rodean.',
    },
    {
      type: 'quote',
      content:
        'Es más fácil cambiar de entorno que tener una disciplina de acero. No hace falta ser un héroe todos los días. Hace falta elegir bien con quién pasás el tiempo.',
    },
  ],
  exercise: {
    title: 'Auditoría de entorno',
    description:
      'Días 1 a 7: Hacé una lista de las diez personas con las que más tiempo pasás. Clasificá cada una: ¿empuja o frena?',
    weeks: [
      'Días 1 a 7: Hacé una lista de las diez personas con las que más tiempo pasás. Clasificá cada una: ¿empuja o frena?',
      'Días 8 a 14: Observá sin actuar. ¿Cuánto tiempo pasás con cada grupo? ¿Te das cuenta del desbalance?',
      'Días 15 a 30: Aumentá el tiempo con los que empujan. Buscá una comunidad nueva que esté alineada con lo que querés.',
      'Días 31 a 180: Reducí gradualmente el tiempo con los que frenan. Sin cortar de golpe, sin explicaciones largas. Con tu agenda.',
    ],
  },
  closingQuote:
    'Es más fácil cambiar de entorno que tener una disciplina de acero. No hace falta ser un héroe todos los días. Hace falta elegir bien con quién pasás el tiempo.',
  connectionText:
    'Con el entorno claro, surge el siguiente problema: incluso rodeado de las personas correctas, hay una voz que tiene más influencia sobre vos que cualquier otra. La tuya. Eso es lo que trabajamos en el Paso 4.',
};

// =============================================================================
// STEP 4 - Autopercepción
// =============================================================================

const step4: StepContent = {
  number: 4,
  title: 'Autopercepción',
  subtitle: 'Cómo te hablás a vos mismo lo cambia todo',
  icon: '\uD83E\uDE9E',
  color: 'amber',
  summary:
    'La persona con la que más hablás en toda tu vida sos vos mismo. Cada "yo no puedo" programa tu subconsciente. Cada "yo soy capaz" también.',
  sections: [
    {
      type: 'paragraph',
      content:
        'Este es uno de los pasos más importantes de todo el programa. Y paradójicamente, es el más tonto. El más fácil de hacer. Y el que más efecto genera.',
    },
    {
      type: 'paragraph',
      content:
        'Es el combustible para todo lo demás. Sin esto, la disciplina del Paso 5 cuesta el doble. La dirección del Paso 2 se siente lejana. El entorno del Paso 3 te aplasta más fácil.',
    },
    {
      type: 'heading',
      content: 'La conversación más importante de tu vida',
    },
    {
      type: 'paragraph',
      content:
        'La persona con la que más hablás en toda tu vida sos vos mismo. Más que con tu pareja, más que con tus hijos, más que con cualquier amigo. Investigadores que llevan décadas estudiando el impacto del lenguaje interno sobre el rendimiento humano llegaron a una conclusión que parece obvia pero que casi nadie aplica: la forma en que te hablás afecta directamente lo que sos capaz de hacer. No es metáfora. No es autoayuda. Es neurología.',
    },
    {
      type: 'heading',
      content: 'El daño del "yo no"',
    },
    {
      type: 'paragraph',
      content:
        'Pensá cuántas veces dijiste alguna de estas frases: "Yo no puedo ir al gimnasio." "Yo no puedo bajar de peso." "Yo no sé de inteligencia artificial." "Yo no sirvo para esas cosas." "Yo soy un boludo." "Yo nunca voy a ser mi propio jefe."',
    },
    {
      type: 'paragraph',
      content:
        'Cada vez que decís "yo no puedo", eso se guarda. Se mete en el subconsciente y se queda ahí. Tu cerebro no distingue entre lo que es verdad y lo que le repetís que es verdad. Si le dijiste mil veces que no podés, te cree. Y actúa en consecuencia. No porque seas débil. Sino porque así funciona el sistema.',
    },
    {
      type: 'paragraph',
      content:
        'Es exactamente lo mismo que vimos en el Paso 2 con los objetivos escritos en presente, pero al revés. Cuando escribís "voy al gimnasio dos veces por semana", tu cerebro lo procesa como realidad y trabaja a favor. Cuando te decís "yo no puedo ir al gimnasio", tu cerebro lo procesa como realidad y trabaja en contra. Mismo mecanismo. Dirección opuesta.',
    },
    {
      type: 'heading',
      content: 'Por qué funciona hablarte bien',
    },
    {
      type: 'paragraph',
      content:
        'Hay estudios que midieron el rendimiento de personas bajo presión, deportistas, estudiantes, ejecutivos en situaciones de estrés, dependiendo de cómo se hablaban a sí mismos antes y durante la tarea. Los que usaban un lenguaje interno positivo y específico rendían significativamente mejor que los que no.',
    },
    {
      type: 'paragraph',
      content:
        'Pero no se trata solo de dejar de decir "yo no puedo". Se trata de empezar a decir lo contrario. Sin mencionar lo negativo. No digas "yo no soy un boludo". Decí directamente: "Yo amo a mi persona." Uno tiene que amar a quien es. Estar conforme con quién sos. Desde ahí se construye todo lo demás.',
    },
    {
      type: 'quote',
      content:
        '"Yo amo a mi persona." "Hoy voy a tener un gran día." "Yo soy una persona disciplinada." "Yo voy al gimnasio." "Yo estoy construyendo algo grande." "Yo soy capaz de aprender lo que sea."',
    },
    {
      type: 'heading',
      content: 'Lo que le decimos a los chicos y dejamos de decirnos de grandes',
    },
    {
      type: 'paragraph',
      content:
        '¿Te acordás cuando a los nenes chiquitos se les repite como un mantra? "Yo soy muy inteligente, yo soy fuerte, yo soy valiente, yo soy capaz, yo puedo lograr todo lo que me proponga." Se los programa desde chiquitos con una autopercepción positiva. ¿Y qué pasa? Funciona. ¿Por qué dejamos de hacerlo de grandes? Si funciona para un nene de 5 años, funciona para vos también. Tu subconsciente no siente vergüenza. Lo agarra, lo guarda, y actúa en base a eso.',
    },
    {
      type: 'heading',
      content: 'Valorar lo que ya tenés',
    },
    {
      type: 'paragraph',
      content:
        'Hay otra cara de la autopercepción que es igual de importante: cómo percibís lo que ya lograste. Antes de frustrarte con lo que te falta, reconocé lo que ya construiste. Eso no es conformismo. Es la base desde donde seguís creciendo. Lo que tenés es suficiente. Y lo conseguiste vos.',
    },
    {
      type: 'heading',
      content: 'Yo soy responsable',
    },
    {
      type: 'paragraph',
      content:
        'Brian Tracy lo desarrolla en su concepto del Plan Fénix: yo soy responsable. Cada decisión, cada resultado, cada cosa que te pasa, son producto de tus micro-decisiones del día a día. Esto no es para culparte ni para castigarte. Es para empoderarte. Porque si sos responsable de tus fracasos, también sos responsable de tus logros. Cuando decís "yo soy responsable", te devolvés el volante.',
    },
    {
      type: 'heading',
      content: 'El mantra de la mañana',
    },
    {
      type: 'paragraph',
      content:
        'Todas las mañanas, antes de arrancar, decí en voz alta: "Yo amo a mi persona. Qué feliz que soy. Me encanta lo que tengo. Yo soy responsable." Hacelo antes de abrir el teléfono. Antes de revisar mails. Esos treinta segundos le dan a tu cerebro la primera instrucción del día. Y esa instrucción importa.',
    },
  ],
  exercise: {
    title: 'Reprogramá cómo te hablás',
    description:
      'Días 1 a 14: Registrá cada frase negativa que te decís. No las juzgues, solo anotalas. Vas a sorprenderte de cuántas son.',
    weeks: [
      'Días 1 a 14: Registrá cada frase negativa que te decís. No las juzgues, solo anotalas. Vas a sorprenderte de cuántas son.',
      'Días 15 a 30: Reescribí cada una en positivo. "No puedo" se convierte en "estoy aprendiendo". "Soy un desastre" en "estoy mejorando".',
      'Días 31 a 60: Corregite en el momento. Cuando te escuches diciendo una frase negativa, frenala y repetila en positivo. En voz alta si podés.',
      'Días 61 a 180: Mantra matutino todos los días. Tres frases positivas en voz alta antes de mirar el celular. Todos los días.',
    ],
  },
  closingQuote:
    'Nadie te habla más que vos mismo. Elegí bien lo que te decís.',
  connectionText:
    'Con la autopercepción trabajada, tenés el combustible. Ahora viene el motor: la disciplina. El paso más difícil y el más importante de todos. Eso es el Paso 5.',
};

// =============================================================================
// STEP 5 - Disciplina
// =============================================================================

const step5: StepContent = {
  number: 5,
  title: 'Disciplina',
  subtitle: 'El paso más difícil y el más importante',
  icon: '\uD83D\uDCAA',
  color: 'rose',
  summary:
    'La disciplina no es un talento innato. Es un músculo que se entrena con repetición. 10 micro-decisiones disciplinadas por día son 1.800 victorias en 180 días.',
  sections: [
    {
      type: 'paragraph',
      content:
        'Este es el paso más difícil de todos. No hay vueltas. No hay atajos. No hay trucos.',
    },
    {
      type: 'paragraph',
      content:
        'Pero hay algo que muy poca gente entiende sobre la disciplina, y que cuando lo entendés cambia completamente la forma en que la encarás: la disciplina no es un rasgo de personalidad. No es algo que tenés o no tenés. Es un músculo. Y como todo músculo, se entrena.',
    },
    {
      type: 'heading',
      content: 'La disciplina no es talento. Es repetición.',
    },
    {
      type: 'paragraph',
      content:
        'Los investigadores que estudiaron durante años qué separa a las personas que logran sus objetivos de las que no llegaron a una conclusión clara: la disciplina no es innata. Se desarrolla. Se construye con repetición, con pequeñas victorias acumuladas, con el hábito de no negociar con la decisión difícil. No es un rasgo de carácter. Es una habilidad. Y como toda habilidad, mejora con la práctica.',
    },
    {
      type: 'paragraph',
      content:
        'El músculo de la disciplina funciona exactamente igual que el músculo del bíceps. La primera vez que levantás peso te duele. La décima vez duele menos. La centésima, ya no pensás en el esfuerzo. Simplemente lo hacés.',
    },
    {
      type: 'heading',
      content: 'Los 21 días y la gallina',
    },
    {
      type: 'paragraph',
      content:
        'Una gallina tarda exactamente 21 días en empollar un huevo. 21 días sentada, sin moverse, manteniendo la misma conducta todos los días, sin excepción. Con frío, con calor, con ganas o sin ganas. Una gallina. Con un cerebro del tamaño de una nuez. Si una gallina puede sostener una conducta 21 días para hacer nacer algo nuevo, vos también podés.',
    },
    {
      type: 'paragraph',
      content:
        'La neurociencia lo confirma desde hace décadas: el cerebro necesita alrededor de 21 días de repetición consistente para empezar a automatizar una conducta. Después de 21 días sin azúcar, la gaseosa te empieza a parecer demasiado dulce. Lo que parecía imposible de dejar ahora te parece imposible de volver. Eso mismo aplica para todo.',
    },
    {
      type: 'heading',
      content: 'La disciplina se trabaja en las micro-decisiones',
    },
    {
      type: 'paragraph',
      content:
        '¿Tu objetivo es bajar de peso? No empieces por todo. Empieza por una cosa. Cambiá la gaseosa de todos los días. Solo eso. Cuando eso esté instalado, sacale el azúcar al café. Y si vas a comer azúcar, que sea de algo que de verdad valga la pena. No desperdicies tu tolerancia al azúcar en basura.',
    },
    {
      type: 'paragraph',
      content:
        'El error que comete casi todo el mundo es querer cambiar todo al mismo tiempo. Arrancan un lunes con dieta nueva, gimnasio todos los días, dejan el alcohol, dejan el azúcar, se acuestan temprano y se levantan a las seis. Para el jueves están quemados y abandonaron todo. No es falta de voluntad. Es que intentaron levantar demasiado peso para el músculo que tenían en ese momento.',
    },
    {
      type: 'heading',
      content: 'La magia de la oxitocina',
    },
    {
      type: 'paragraph',
      content:
        'Cada micro-logro que alcanzás genera oxitocina en tu cerebro. La misma hormona que se libera cuando abrazás a alguien que querés, cuando terminás algo que empezaste, cuando ganás. Cada vez que tomás una decisión disciplinada, tu cerebro la registra como una victoria. Y esa oxitocina genera una sensación de bienestar que el cerebro quiere repetir.',
    },
    {
      type: 'paragraph',
      content:
        'Ese día que estabas cansado y no tenías ganas de ir al gimnasio, pero fuiste igual. Tu cerebro lo registró como victoria. Y la próxima vez que no tengas ganas, ese registro está ahí. No te estoy pidiendo que seas un héroe. Te estoy pidiendo que acumules victorias pequeñas hasta que el cerebro empiece a pedirte más por su cuenta.',
    },
    {
      type: 'heading',
      content: 'Hacé las cuentas',
    },
    {
      type: 'paragraph',
      content:
        'Si tomás 10 micro-decisiones disciplinadas por día, solo diez, son 70 por semana, 300 por mes, 3.650 micro-decisiones en un año. En 180 días, que es lo que dura este programa, son 1.800 micro-decisiones disciplinadas. Mil ochocientas veces que elegiste bien. Eso es la disciplina. No es heroica. No es sobrehumana. Es elegir bien, muchas veces, de a poco.',
    },
    {
      type: 'heading',
      content: 'Siempre comparate con vos de ayer',
    },
    {
      type: 'paragraph',
      content:
        'La única comparación que vale es con vos mismo de ayer. ¿Hoy hiciste más que ayer? ¿Esta semana fuiste más al gimnasio que la semana pasada? ¿Este mes leíste más que el mes anterior? Si la respuesta es sí, vas bien. Sin importar dónde está el de al lado.',
    },
    {
      type: 'quote',
      content:
        'La disciplina no es castigarte. Es elegirte.',
    },
  ],
  exercise: {
    title: 'Elegí UNA batalla diaria',
    description:
      'Días 1 a 21: Elegí UNA sola micro-decisión. Una. Y ganala todos los días. Sin excepciones. Sin drama. Una.',
    weeks: [
      'Días 1 a 21: Elegí UNA sola micro-decisión. Una. Y ganala todos los días. Sin excepciones. Sin drama. Una.',
      'Días 22 a 45: Si la ganaste 21 días seguidos, ya es hábito. Agregá una segunda. Pero la primera la seguís sosteniendo.',
      'Días 46 a 90: Dos batallas activas. Vas a ver que la primera ya ni la pensás. La segunda todavía cuesta. Es normal.',
      'Días 91 a 180: Agregá la tercera. Al final de los 180 días, vas a tener tres hábitos nuevos sólidos. No diez. Tres. Y con tres bien puestos, tu vida es otra.',
    ],
  },
  closingQuote:
    'La disciplina no es castigarte. Es elegirte.',
  connectionText:
    'Con la disciplina entrenada, tenés las herramientas para cambiar casi cualquier cosa. Pero hay algo que muchos ignoran y que puede tirar todo por la borda: el estado de la máquina que ejecuta todo esto. Tu cuerpo. Eso es lo que trabajamos en el Paso 6.',
};

// =============================================================================
// STEP 6 - Tu Cuerpo
// =============================================================================

const step6: StepContent = {
  number: 6,
  title: 'Tu Cuerpo',
  subtitle: 'Tu cuerpo es la suma de todo',
  icon: '\uD83E\uDDEC',
  color: 'cyan',
  summary:
    'Tu cuerpo no miente. Es el resultado visible de todo lo anterior. El cerebro consume el 20% de tu energía. Si le das basura, funciona con basura.',
  sections: [
    {
      type: 'paragraph',
      content:
        'Tu cuerpo es la suma y resultado de todo. De cada decisión que tomaste, de cada cosa que comiste, de cada noche que dormiste bien o mal, de cada vez que te moviste o te quedaste quieto. Tu cuerpo no miente. Es el resultado visible de los cinco pasos anteriores.',
    },
    {
      type: 'heading',
      content: 'Tu cuerpo es tu vehículo para los 180 días',
    },
    {
      type: 'paragraph',
      content:
        'Tus objetivos del Paso 2 necesitan un cuerpo que funcione. Tu disciplina del Paso 5 necesita energía. Tu autopercepción del Paso 4 se alimenta de cómo te sentís físicamente. Si estás cansado todo el día, no vas a tener energía para tomar buenas micro-decisiones. Si comés basura, tu cerebro funciona lento. El cuerpo no es un tema aparte. Es la base de todo.',
    },
    {
      type: 'heading',
      content: 'Lo que le pasa a tu cerebro cuando comés mal',
    },
    {
      type: 'paragraph',
      content:
        'Tu cerebro consume el 20% de la energía total de tu cuerpo. Es el órgano que más energía gasta, con diferencia. Y esa energía viene directamente de lo que comés. Cuando comés azúcar refinada, galletitas, gaseosas, tu glucosa en sangre pega un pico altísimo. Te sentís bien por 20 minutos. Después se desploma. Y ahí viene el bajón, el sueño, la falta de concentración, las ganas de comer más azúcar. Es un ciclo. Y es adictivo.',
    },
    {
      type: 'paragraph',
      content:
        'Los estudios sobre adicción y comportamiento cerebral muestran que el azúcar activa los mismos circuitos de recompensa en el cerebro que ciertas drogas. No es exageración, es cómo funciona la neurología del placer. La industria alimentaria lo sabe hace décadas y diseña los productos exactamente así.',
    },
    {
      type: 'heading',
      content: 'Hacé las cuentas',
    },
    {
      type: 'paragraph',
      content:
        'Si le ponés 2 cucharaditas de azúcar a cada café y tomás 2 cafés por día, son 20 gramos de azúcar por día. En 180 días son 3.600 gramos de azúcar solo del café. Eso equivale a unas 14.400 calorías vacías, aproximadamente 1,5 kilos de grasa que tu cuerpo almacena solo por ponerle azúcar al café. Sin contar la gaseosa. Sin contar las galletitas.',
    },
    {
      type: 'heading',
      content: 'El sueño no es opcional',
    },
    {
      type: 'paragraph',
      content:
        'Mientras dormís, tu cuerpo hace cosas que no puede hacer despierto. Repara tejidos. Equilibra hormonas. Consolida todo lo que aprendiste durante el día. Dormir menos de 7 horas de manera consistente tiene efectos documentados sobre el sistema inmune, el metabolismo, la capacidad de tomar decisiones y el control emocional. No es debilidad dormir 8 horas. Es mantenimiento básico de la máquina.',
    },
    {
      type: 'heading',
      content: 'Lo que tenés que dejar',
    },
    {
      type: 'list',
      content: 'Dejar de comer y hacer:',
      items: [
        'Azúcar refinada todos los días: galletitas, gaseosas, el budín del kiosco. No te aportan nada y te sacan energía y concentración.',
        'Comida ultra-procesada: si la lista de ingredientes tiene más de cinco cosas y la mitad no las podés pronunciar, no es comida.',
        'Harinas blancas en exceso: se convierten en azúcar en tu cuerpo casi instantáneamente.',
        'Quedarte sentado 8 horas sin moverte: cada 45 minutos levantate, caminá, estirate dos minutos.',
        'Dormir con el celular al lado: la luz azul interfiere con la melatonina y te roba horas de descanso.',
      ],
    },
    {
      type: 'heading',
      content: 'Lo que tenés que empezar a hacer',
    },
    {
      type: 'list',
      content: 'Sumar desde hoy:',
      items: [
        'Proteínas en cada comida: huevos, pollo, carne, pescado, legumbres. Estabilizan la glucosa y alimentan tus músculos.',
        'Vegetales y frutas todos los días. No hace falta volverse nutricionista. Un tomate, una banana, una zanahoria.',
        'Agua: mínimo 2 litros por día. 2 litros x 180 días son 360 litros de hidratación limpia.',
        'Moverte todos los días: 20 minutos caminando, 15 minutos de ejercicios en casa. 20 min x 180 días = 60 horas de movimiento.',
        'Dormir 7 u 8 horas. No es negociable.',
        'Respirar consciente: 5 minutos por día. Cuatro segundos inhalar, cuatro sostener, seis exhalar. Baja el cortisol. Es gratis.',
      ],
    },
    {
      type: 'heading',
      content: 'El efecto dominó',
    },
    {
      type: 'paragraph',
      content:
        'Cuando comés mejor, tu energía sube. Cuando tu energía sube, tomás mejores micro-decisiones. Cuando tomás mejores micro-decisiones, tu disciplina se fortalece. Cuando tu disciplina se fortalece, alcanzás más objetivos. Cuando alcanzás más objetivos, tu cerebro libera más oxitocina. Todo empieza con una sola ficha: la próxima cosa que te metas en la boca, el próximo paso que des, la próxima hora que decidas dormir en vez de scrollear.',
    },
    {
      type: 'table',
      content: 'Tu guía de cambios',
      rows: [
        {
          col1: 'Azúcar en el café (2 por día)',
          col2: '3.600g de azúcar en 180 días = 1,5kg de grasa',
          col3: 'Café sin azúcar',
        },
        {
          col1: 'Gaseosa del mediodía',
          col2: 'Pico de glucosa, bajón, más hambre',
          col3: 'Agua con limón',
        },
        {
          col1: 'Scroll del celular antes de dormir',
          col2: 'Destruye melatonina, roba horas de sueño',
          col3: 'Leer 3 páginas de un libro',
        },
      ],
    },
    {
      type: 'quote',
      content:
        'Tu cuerpo no es un obstáculo. Es tu socio. Es el vehículo que te va a llevar de donde estás a donde querés ir. Cada cosa que comés, cada minuto que te movés, cada hora que dormís, es una micro-decisión. Y vos ya sabés que todo cuenta.',
    },
  ],
  exercise: {
    title: 'Registro + un cambio',
    description:
      'Días 1 a 14: Registrá. Qué comés, cómo dormís, cuánto te movés. Solo observá, no cambies nada todavía.',
    weeks: [
      'Días 1 a 14: Registrá. Qué comés, cómo dormís, cuánto te movés. Solo observá, no cambies nada todavía.',
      'Días 15 a 30: Eliminá UNA sola cosa mala. La más fácil para vos. La que te cueste menos sacar. Una.',
      'Días 31 a 60: Agregá UNA cosa buena. Una. Caminata diaria, vaso de agua al despertarte, verdura en el almuerzo. La que sea.',
      'Días 61 a 180: Evaluá cada 30 días. Si las primeras dos ya son hábito, agregá una tercera. Si no, sosten. No aceleres de más.',
    ],
  },
  closingQuote:
    'Tu cuerpo no es un obstáculo. Es tu socio. Es el vehículo que te va a llevar de donde estás a donde querés ir. Cada cosa que comés, cada minuto que te movés, cada hora que dormís, es una micro-decisión. Y vos ya sabés que todo cuenta.',
  connectionText:
    'Con el cuerpo funcionando bien, tenés energía y claridad para el último paso. Que es el que menos hablan los libros de autoayuda y el que más pesa en la calidad de tu vida: tu relación con el mundo. Eso es el Paso 7.',
};

// =============================================================================
// STEP 7 - Tu Relación con el Mundo
// =============================================================================

const step7: StepContent = {
  number: 7,
  title: 'Tu Relación con el Mundo',
  subtitle: 'Todo es personal, hasta el perdón',
  icon: '\uD83D\uDD4A\uFE0F',
  color: 'indigo',
  summary:
    'El rencor vive en vos, no en el otro. Perdonar no es decir que estuvo bien. Es soltar el peso. Sé Suiza: neutral en todo, en guerra con nadie.',
  sections: [
    {
      type: 'paragraph',
      content:
        'Este es el último paso. Y es el que cierra todo. En el Paso 3 hablamos de con quién te rodeás. Acá vamos más profundo: hablamos de cómo te relacionás con esas personas y con el mundo en general. Porque podés comer bien, dormir bien, tener objetivos claros, disciplina, una autopercepción sólida, pero si tu relación con el mundo te genera bronca, resentimiento y angustia constante, todo lo demás se cae.',
    },
    {
      type: 'heading',
      content: 'Todo es personal',
    },
    {
      type: 'paragraph',
      content:
        'Esto lo tenés que entender bien: todo lo que te duele, te molesta, te enoja, te frustra, es personal. Siempre. La bronca que sentís por algo que te dijo alguien no la siente el otro. La sentís vos. El rencor que guardás por algo que te hicieron no le pesa al otro. Te pesa a vos. La angustia por una pelea, por una traición, por una injusticia, no le quita el sueño al otro. Te lo quita a vos.',
    },
    {
      type: 'paragraph',
      content:
        'Entonces la pregunta es simple: ¿a quién le hace peor? A vos. Siempre a vos.',
    },
    {
      type: 'heading',
      content: 'Lo que el rencor le hace a tu cuerpo',
    },
    {
      type: 'paragraph',
      content:
        'Hay décadas de investigación sobre lo que las emociones negativas sostenidas le hacen al cuerpo. El rencor, la bronca crónica y el resentimiento no son solo estados emocionales. Son estados físicos. Cuando guardás bronca durante semanas o meses, tu cuerpo mantiene elevados los niveles de cortisol, la hormona del estrés. Y el cortisol elevado de manera crónica debilita el sistema inmune, interrumpe el sueño, sube la presión arterial, afecta la memoria y la capacidad de concentración.',
    },
    {
      type: 'paragraph',
      content:
        'Cada vez que revivís algo que te hicieron, cada vez que te dormís pensando en alguien que te lastimó, tu cuerpo paga el precio. No el de ellos. El tuyo. Volvé al Paso 6: el rencor también es algo que le das a tu cuerpo. Y es de las cosas más tóxicas que existen.',
    },
    {
      type: 'heading',
      content: 'Perdoná',
    },
    {
      type: 'paragraph',
      content:
        'Perdoná. Aunque cueste. Aunque sientas que no podés. Aunque la otra persona no lo merezca. No perdonás por el otro. Perdonás por vos. Porque cada gramo de rencor que guardás adentro ocupa espacio. Ocupa energía. Te saca fuerza, te saca foco, te saca paz.',
    },
    {
      type: 'paragraph',
      content:
        'Los estudios sobre el perdón como proceso psicológico son consistentes en algo: las personas que perdonan no lo hacen por el otro. Lo hacen por ellas mismas. Y los efectos son medibles: bajan los niveles de cortisol, mejora la calidad del sueño, baja la presión arterial, mejora el humor. Perdonar no es decir "estuvo bien lo que me hiciste". Perdonar es decir "ya no voy a dejar que esto me siga haciendo daño".',
    },
    {
      type: 'heading',
      content: 'Sé Suiza',
    },
    {
      type: 'paragraph',
      content:
        '¿Qué hace Suiza? Está bien con todos. Es neutral. No entra en guerras. No se mete en conflictos ajenos. No toma bandos. Y le va increíblemente bien. Vos tenés que ser Suiza. Siempre bien con todos. Neutral en todo. No entrar en peleas, discusiones, debates que no te suman nada. Porque nunca te van a sumar. Siempre te van a restar.',
    },
    {
      type: 'paragraph',
      content:
        'Alguien opina algo que no te gusta. Mirá qué interesante. Alguien te critica. Contestá tranquilo y seguí. Alguien te dice "qué aburrido que no tomás alcohol". A bueno, puede ser. Y listo. Suiza. Cada vez que entrás en una discusión innecesaria, perdés energía. Esa energía, ese foco, ese tiempo, lo podrías estar usando en tus objetivos. Suiza no pierde guerras. Porque no entra en ninguna.',
    },
    {
      type: 'heading',
      content: 'Tus relaciones son como tu alimentación',
    },
    {
      type: 'paragraph',
      content:
        'Hay relaciones que te nutren y relaciones que te intoxican. Hay personas que cuando estás con ellas te sentís bien, con energía, con ganas. Y hay personas que cuando te vas sentís vacío, cansado, drenado. No hace falta cortar con nadie. Pero sí tenés que ser consciente de qué te genera cada persona. Y elegir dónde poner tu energía.',
    },
    {
      type: 'paragraph',
      content:
        'Tu familia primero. Siempre. Tu pareja, tus hijos, tu vieja, tu viejo, tus hermanos. Después las personas que te suman. Y después el resto. En ese orden. No al revés.',
    },
    {
      type: 'heading',
      content: 'La fórmula completa',
    },
    {
      type: 'paragraph',
      content:
        'Todo cuenta (Paso 1). Cada micro-decisión en tus relaciones, cada vez que elegís soltar en vez de agarrar, cada vez que elegís ser Suiza en vez de entrar en guerra, te acerca a tu mejor versión. Tus objetivos (Paso 2) necesitan un entorno emocional limpio para prosperar. Tu entorno (Paso 3) incluye las emociones que permitís que entren en tu vida. Tu autopercepción (Paso 4) se fortalece cuando dejás de depender de la opinión ajena. Tu disciplina (Paso 5) aplica también a las emociones: soltar es un acto de disciplina. Tu cuerpo (Paso 6) siente todo: el estrés de las peleas, la angustia del rencor. Todo se somatiza.',
    },
    {
      type: 'table',
      content: 'Tu guía de relaciones',
      rows: [
        {
          col1: 'Discusiones en redes sociales',
          col2: 'Perdés tiempo y energía por gente que ni conocés',
          col3: 'Una conversación real con tu pareja o tus hijos',
        },
        {
          col1: 'Bronca con alguien del pasado',
          col2: 'El rencor solo vive en vos, sube el cortisol y te quita el sueño',
          col3: 'Perdoná y usá esa energía en tus objetivos',
        },
        {
          col1: 'Intentar convencer a quien no quiere cambiar',
          col2: 'Nunca funciona y te deja frustrado',
          col3: 'Tu ejemplo habla más que tus palabras',
        },
      ],
    },
    {
      type: 'quote',
      content:
        'Todo sucede en vos. Todo se siente en vos. Todo cuenta. Elegí ser Suiza. Elegí soltar. Elegí perdonar. No por el otro, por vos. Porque cada gramo de paz que ganás es un gramo de energía que podés usar para construir la vida que querés.',
    },
  ],
  exercise: {
    title: 'Limpiá tu relación con el mundo',
    description:
      'Días 1 a 14: Hacé una lista de resentimientos pendientes, conflictos viejos, gente que te ocupa espacio mental. Verlo claro es el primer paso.',
    weeks: [
      'Días 1 a 14: Hacé una lista de resentimientos pendientes, conflictos viejos, gente que te ocupa espacio mental. Verlo claro es el primer paso.',
      'Días 15 a 30: Elegí uno. Uno solo. Y perdonalo adentro tuyo. Sin avisar, sin llamar. Soltalo. Es un acto interno.',
      'Días 31 a 60: Practicá ser Suiza. Cuando te inviten a un drama (propio o ajeno), no entres. Respondé con silencio o cambio de tema.',
      'Días 61 a 180: Invertí la energía que ahorraste en tu familia y en las relaciones que te nutren. Tiempo de calidad, presencia real, conversaciones verdaderas.',
    ],
  },
  closingQuote:
    'Todo sucede en vos. Todo se siente en vos. Todo cuenta. Elegí ser Suiza. Elegí soltar. Elegí perdonar. No por el otro, por vos.',
  connectionText:
    'Este es el último paso. El que cierra el círculo. Los 7 pasos empiezan con una idea simple: todo cuenta. Y terminan con otra igual de simple: todo sucede en vos. Cada micro-decisión, cada emoción, cada relación, cada bocado, cada pensamiento. Todo vive adentro tuyo. Y vos tenés el poder de elegir qué se queda y qué se va. Eso es cambiar tu vida en 180 días.',
};

// =============================================================================
// Export
// =============================================================================

export const stepsContent: StepContent[] = [
  step1,
  step2,
  step3,
  step4,
  step5,
  step6,
  step7,
];

/**
 * Get a specific step by its number (1-7).
 * Returns undefined if the step number is out of range.
 */
export function getStep(stepNumber: number): StepContent | undefined {
  return stepsContent.find((step) => step.number === stepNumber);
}

// =============================================================================
// Book-level pages (not numbered steps)
// =============================================================================

export interface BookPage {
  title: string;
  subtitle: string;
  icon: string;
  sections: StepSection[];
  closingQuote: string;
}

// =============================================================================
// INTRO - Antes de empezar
// =============================================================================

export const introContent: BookPage = {
  title: 'Antes de empezar',
  subtitle: 'Un programa de 180 días construido en micro-decisiones',
  icon: '🔥',
  sections: [
    {
      type: 'paragraph',
      content:
        'Si estás leyendo esto es porque en algún lugar adentro tuyo sentís que algo tiene que cambiar. No hace falta que sea un quilombo total, puede ser una molestia chiquita, una sensación de que algo no está del todo bien. Esa sensación es el principio.',
    },
    {
      type: 'paragraph',
      content:
        'Este libro no te promete magia. No hay un secreto que no sepas. Todo lo que vas a leer acá, en el fondo, ya lo sabés. Lo que quizás no tenés todavía es el orden, el sistema, la forma de aplicarlo todos los días. De eso va esto.',
    },
    {
      type: 'paragraph',
      content:
        'Son siete pasos. No son siete técnicas sueltas, son un sistema. Funciona cuando los aplicás juntos, sostenidos en el tiempo. El tiempo que propone el libro son 180 días: seis meses. Ni una semana ni cinco años. Seis meses, porque es el tiempo que tu cuerpo y tu cerebro necesitan para cambiar de verdad.',
    },
    {
      type: 'heading',
      content: 'Cómo leer este libro',
    },
    {
      type: 'paragraph',
      content:
        'Al final de cada paso vas a encontrar un ejercicio concreto, con días. Hacelo. Los que leen los libros sin hacer los ejercicios, al mes no se acuerdan de lo que leyeron. Los que aplican, cambian.',
    },
    {
      type: 'list',
      content: 'Los siete pasos:',
      items: [
        'Paso 1 — Todo Cuenta: Cada micro-decisión define tu vida.',
        'Paso 2 — Objetivos: Definí 10 objetivos concretos para 180 días.',
        'Paso 3 — Tu Entorno: Tu entorno define tus resultados.',
        'Paso 4 — Autopercepción: Cómo te hablás a vos mismo lo cambia todo.',
        'Paso 5 — Disciplina: El paso más difícil y el más importante.',
        'Paso 6 — Tu Cuerpo: Tu cuerpo es la suma de todo.',
        'Paso 7 — Tu Relación con el Mundo: Todo es personal, hasta el perdón.',
      ],
    },
    {
      type: 'paragraph',
      content:
        'Eso es todo. Nos vemos en el otro lado.',
    },
  ],
  closingQuote:
    'Todo lo que vas a leer acá, en el fondo, ya lo sabés. Lo que quizás no tenés todavía es el orden, el sistema, la forma de aplicarlo todos los días.',
};

// =============================================================================
// CIERRE - Para cerrar (Nota del autor)
// =============================================================================

export const cierreContent: BookPage = {
  title: 'Para cerrar',
  subtitle: 'Nota del autor',
  icon: '💡',
  sections: [
    {
      type: 'paragraph',
      content:
        'Antes de cerrar, quiero dejarte una pregunta. Pensala bien antes de contestarme.',
    },
    {
      type: 'paragraph',
      content:
        'Si yo te ofreciera, ahora mismo, diez millones de dólares, ¿los aceptarías?',
    },
    {
      type: 'paragraph',
      content:
        'Pará. No respondas tan rápido. Pensalo de verdad. Diez millones. En tu mano. Hoy.',
    },
    {
      type: 'paragraph',
      content:
        'Seguro que sí. Todo el mundo que escucha esta pregunta dice que sí. Es imposible decir que no.',
    },
    {
      type: 'paragraph',
      content:
        'Pero ahora viene la segunda parte. ¿Sabés qué tenés que dar a cambio?',
    },
    {
      type: 'paragraph',
      content:
        'Mañana no te despertás. Eso es todo. Te llevás los diez millones, pero hoy es tu último día. No hay nada más después.',
    },
    {
      type: 'paragraph',
      content:
        'Y ahí, todo el mundo, sin excepción, te dice que no. Nadie acepta. Diez millones, y nadie acepta.',
    },
    {
      type: 'paragraph',
      content:
        'Frenate acá. Leelo de nuevo si hace falta. Porque lo que acabás de descubrir, sin darte cuenta, es lo más importante de este libro.',
    },
    {
      type: 'quote',
      content: 'Tu día de mañana vale más de diez millones de dólares.',
    },
    {
      type: 'paragraph',
      content:
        'Y si mañana vale diez millones, hagamos la cuenta bien hecha. Cada tramo de tu día de mañana tiene un valor concreto, medible, real:',
    },
    {
      type: 'list',
      content: 'El valor de tu tiempo:',
      items: [
        'Cada cuarto de día (6 horas): USD 2.500.000',
        'Cada hora: USD 416.666',
        'Cada minuto: USD 6.944',
        'Cada segundo: USD 115',
      ],
    },
    {
      type: 'paragraph',
      content:
        'Leelo de nuevo. Cada segundo que pasa vale ciento quince dólares. Cada minuto que dejás pasar scrolleando sin sentido, casi siete mil. Cada hora tirada, casi medio millón.',
    },
    {
      type: 'paragraph',
      content:
        'Y sin embargo los regalamos. Todos los días. Sin darnos cuenta.',
    },
    {
      type: 'paragraph',
      content:
        'Pensalo cada vez que estés por tomar una decisión chiquita. Cada vez que dudes entre levantarte o quedarte. Entre leer o scrollear. Entre tomar agua o gaseosa. Entre llamar a tu vieja o dejarlo para después.',
    },
    {
      type: 'paragraph',
      content:
        'Esas decisiones, las que hacés sin pensar, son parte de los diez millones de dólares que recibís gratis, todos los días, cada vez que abrís los ojos.',
    },
    {
      type: 'quote',
      content: 'No las regales.',
    },
  ],
  closingQuote: 'Los 180 días empiezan el día que vos decidís. Que sea hoy.',
};
