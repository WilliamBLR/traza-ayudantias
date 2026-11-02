export const sources = {
  gallinas: `# EJERCICIO 1: COYOTES Y GALLINAS

# ENTRADAS
recinto = input("Recinto: ")
ataques = input("Ataques: ")

# PROCESAMIENTO

# Contador de gallinas sobrevivientes
ilesas = 0

# Indice para recorrer los strings
i = 0

# Recorremos todas las posiciones del recinto
while i < len(recinto):

    # Si hay una gallina y no fue atacada
    if recinto[i] == "G" and ataques[i] == "X":

        # Aumentamos la cantidad de sobrevivientes
        ilesas = ilesas + 1

    # Avanzamos a la siguiente posicion
    i = i + 1

# SALIDA
print(ilesas, "gallinas salieron ilesas esta noche")`,
  racha: `# EJERCICIO 2: LA RACHA MAS LARGA

# PROCESAMIENTO

# Cantidad de dias consecutivos practicando.
racha_actual = 0

# Mayor cantidad de dias consecutivos registrada.
mejor_racha = 0

# ENTRADA
# Pedimos la experiencia del primer dia.
experiencia = int(input("Experiencia diaria: "))

# Repetimos mientras el usuario no ingrese -1.
while experiencia != -1:

    # Si no practico, pierde su racha actual.
    if experiencia == 0:
        racha_actual = 0

    # Si practico, aumenta su racha en un dia.
    else:
        racha_actual = racha_actual + 1

        # Comprobamos si supero su mejor racha.
        if racha_actual > mejor_racha:

            # Guardamos el nuevo record.
            mejor_racha = racha_actual

    # Solicitamos la experiencia del siguiente dia.
    experiencia = int(input("Experiencia diaria: "))

# SALIDA
# Cuando se ingresa -1, termina el ciclo.
print("Mejor racha:", mejor_racha, "dias")`,
  plantas: `# EJERCICIO 1: PLANTAS POR REGAR

# ENTRADAS
jardin = input("Jardin: ")
semana = int(input("Semana: "))

# PROCESAMIENTO

# String donde guardaremos la respuesta
resultado = ""

# Indice para recorrer el jardin
i = 0

# Recorremos todas las plantas
while i < len(jardin):

    # Si la planta es tropical, siempre se riega
    if jardin[i] == "T":
        resultado = resultado + "R"

    # Si es comun, se riega cada 2 semanas
    elif jardin[i] == "C":

        if semana % 2 == 0:
            resultado = resultado + "R"
        else:
            resultado = resultado + "X"

    # Si es desertica, se riega cada 4 semanas
    elif jardin[i] == "D":

        if semana % 4 == 0:
            resultado = resultado + "R"
        else:
            resultado = resultado + "X"

    # Avanzamos a la siguiente planta
    i = i + 1

# SALIDA
print(resultado)`,
  collatz: `# EJERCICIO 2: EL MAXIMO DE COLLATZ

# ENTRADA
numero = int(input("Numero inicial: "))

# PROCESAMIENTO

# Guardamos el numero inicial como maximo
maximo = numero

# Repetimos hasta que el numero llegue a 1
while numero != 1:

    # Si el numero es par
    if numero % 2 == 0:

        # Lo dividimos por 2
        numero = numero // 2

    # Si el numero es impar
    else:

        # Lo multiplicamos por 3 y sumamos 1
        numero = 3 * numero + 1

    # Revisamos si encontramos un nuevo maximo
    if numero > maximo:

        # Actualizamos el valor maximo
        maximo = numero

# SALIDA
print("El valor maximo alcanzado es", maximo)`
};

export const exercises = [
  { id:'gallinas', n:'01', term:'2025-2', title:'Coyotes y gallinas', topic:'While · Strings · Contadores', filename:'coyotes_y_gallinas.py',
    statement:'Recorre un recinto y sus ataques, representados por strings del mismo largo. Cuenta las posiciones donde hay una gallina (G) y no hay ataque (X). Los índices comienzan en 0.',
    goal:'Contar las gallinas ilesas usando un índice y un ciclo while.', vars:['recinto','ataques','ilesas','i'],
    fields:[{name:'recinto',label:'Recinto',max:60},{name:'ataques',label:'Ataques',max:60}], hint:'G / X · C / X · Mismo largo', visualTitle:'Recorrido de los strings', visualContext:'Índices desde 0',
    samples:[{name:'Ejemplo del enunciado',recinto:'XGXXGXG',ataques:'CXXCCXC'},{name:'Todas ilesas',recinto:'GXG',ataques:'XCX'},{name:'Ataques y espacios',recinto:'GGGGGGGGG',ataques:'XXXXCXXCX'},{name:'Ninguna ilesa',recinto:'GXGG',ataques:'CXCC'}] },
  { id:'racha', n:'02', term:'2025-2', title:'La racha más larga', topic:'While · Centinela · Máximos', filename:'la_racha_mas_larga.py',
    statement:'Lee la experiencia diaria. Un valor positivo extiende la racha, 0 la reinicia y -1 termina la entrada. Guarda la mayor cantidad de días consecutivos de práctica. El -1 no representa un día.',
    goal:'Encontrar la mayor racha de días consecutivos practicando.', vars:['racha_actual','mejor_racha','experiencia'],
    fields:[{name:'dias',label:'Experiencia diaria, en orden',max:1000}], hint:'0 reinicia · -1 termina', visualTitle:'Días de práctica', visualContext:'Días consecutivos',
    samples:[{name:'Ejemplo del enunciado',dias:'120, 180, 0, 40, -1'},{name:'Un nuevo récord',dias:'10, 20, 0, 5, 15, 25, -1'},{name:'Cinco días seguidos',dias:'10, 10, 10, 10, 10, -1'},{name:'Solo el centinela',dias:'-1'}] },
  { id:'plantas', n:'01', term:'2026-1', title:'Plantas por regar', topic:'While · Strings · Módulo', filename:'plantas_por_regar.py',
    statement:'Recorre un jardín con plantas T, C y D. Sus períodos de riego son 1, 2 y 4 semanas. Para una semana N, construye un string con R si se riega y X si no corresponde. En la semana 0 se riegan todas.',
    goal:'Construir la respuesta carácter por carácter según el tipo de planta y el resto de la división.', vars:['jardin','semana','resultado','i'],
    fields:[{name:'jardin',label:'Jardín',max:60},{name:'semana',label:'Semana',numeric:true,max:10}], hint:'T / C / D · Semana desde 0', visualTitle:'Jardín y resultado', visualContext:'R: regar · X: no regar',
    samples:[{name:'Semana 10',jardin:'TCDTCDTCD',semana:'10'},{name:'Solo tropicales',jardin:'TCDTCDTCD',semana:'5'},{name:'Desérticas, semana 6',jardin:'DDD',semana:'6'},{name:'Semana inicial',jardin:'TCDCT',semana:'0'}] },
  { id:'collatz', n:'02', term:'2026-1', title:'El máximo de Collatz', topic:'While · Paridad · Máximos', filename:'el_maximo_de_collatz.py',
    statement:'Desde un entero positivo, divide por 2 con división entera si es par, o calcula 3 × número + 1 si es impar. Repite hasta alcanzar 1. Conserva el mayor valor, incluyendo el número inicial.',
    goal:'Seguir la secuencia y actualizar el máximo solo cuando aparece un valor mayor.', vars:['numero','maximo'],
    fields:[{name:'numero',label:'Número inicial',numeric:true,max:7}], hint:'Entero entre 1 y 1.000.000', visualTitle:'Secuencia de Collatz', visualContext:'Valores calculados',
    samples:[{name:'Comenzar en 6',numero:'6'},{name:'Comenzar en 11',numero:'11'},{name:'Comenzar en 33',numero:'33'},{name:'Ya está en 1',numero:'1'},{name:'Potencia de dos',numero:'16'}] }
];

function recorder(id) {
  const state={},consoleLines=[],events=[],checked=[],view={sequence:[]};
  let focus=-1;
  function line(code,occurrence=0) {
    const matches=sources[id].split('\n').flatMap((s,i)=>s.trim()===code?[i+1]:[]);
    if(matches[occurrence]===undefined) throw Error('No se encontró la instrucción: '+code);
    return matches[occurrence];
  }
  function add(code,kind,title,detail,formula='',result=null,mutate=null) {
    const before=structuredClone(state);
    if(mutate) mutate(state);
    events.push({line:code?typeof code==='number'?code:line(code):0,kind,title,detail,formula,result,before,state:structuredClone(state),console:[...consoleLines],focus,checked:[...checked],visual:structuredClone(view),changed:Object.keys(state).filter(k=>!Object.hasOwn(before,k)||state[k]!==before[k])});
  }
  add('','start','Listo para comenzar.','Avanza para ejecutar una instrucción. La memoria muestra los valores después de la línea resaltada.');
  return {state,events,consoleLines,checked,view,line,add,setFocus:i=>{focus=i;}};
}

export function parseInputs(id,input) {
  if(id==='gallinas') {
    const recinto=String(input.recinto??'').trim().toUpperCase(),ataques=String(input.ataques??'').trim().toUpperCase();
    if(!recinto.length) throw Error('Escribe al menos una posición en el recinto.');
    if(!/^[GX]+$/.test(recinto)) throw Error('El recinto solo puede contener G y X.');
    if(!/^[CX]+$/.test(ataques)) throw Error('Los ataques solo pueden contener C y X.');
    if(recinto.length!==ataques.length) throw Error('El recinto y los ataques deben tener el mismo largo.');
    if(recinto.length>60) throw Error('Usa hasta 60 posiciones.');
    return {recinto,ataques};
  }
  if(id==='plantas') {
    const jardin=String(input.jardin??'').trim().toUpperCase(),text=String(input.semana??'').trim(),semana=Number(text);
    if(!/^[TCD]+$/.test(jardin)) throw Error('El jardín debe contener plantas T, C o D.');
    if(jardin.length>60) throw Error('Usa hasta 60 plantas.');
    if(!/^\d+$/.test(text)||!Number.isSafeInteger(semana)||semana>1000000000) throw Error('La semana debe ser un entero entre 0 y 1.000.000.000.');
    return {jardin,semana};
  }
  if(id==='collatz') {
    const text=String(input.numero??'').trim(),numero=Number(text);
    if(!/^\d+$/.test(text)||!Number.isInteger(numero)||numero<1||numero>1000000) throw Error('El número inicial debe ser un entero entre 1 y 1.000.000.');
    return {numero};
  }
  if(id!=='racha') throw Error('Ejercicio no disponible.');
  const tokens=String(input.dias??'').trim().split(/[\s,;]+/);
  if(!tokens.length||tokens.some(v=>!/^\-?\d+$/.test(v))) throw Error('Ingresa enteros separados por comas o espacios, terminando en -1.');
  const dias=tokens.map(Number);
  if(dias.some(v=>!Number.isSafeInteger(v)||v< -1)) throw Error('Usa enteros desde 0 para la experiencia y -1 para terminar.');
  if(dias.at(-1)!==-1||dias.slice(0,-1).includes(-1)) throw Error('El -1 debe aparecer una sola vez, al final: es el centinela de término.');
  if(dias.length>61) throw Error('Usa hasta 60 días y el -1 final.');
  return {dias};
}

export function makeTrace(id,raw) {
  const input=parseInputs(id,raw),r=recorder(id);
  const {add,state,consoleLines,checked,line,view}=r;
  if(id==='gallinas') {
    const {recinto,ataques}=input;
    consoleLines.push('Recinto: '+recinto);
    add('recinto = input("Recinto: ")','input','Leemos el recinto.',`input entrega un string de ${recinto.length} caracteres. Lo guardamos en recinto.`,`recinto ← "${recinto}"`,null,s=>s.recinto=recinto);
    consoleLines.push('Ataques: '+ataques);
    add('ataques = input("Ataques: ")','input','Leemos los ataques.','Cada carácter corresponde a la misma posición del recinto.',`ataques ← "${ataques}"`,null,s=>s.ataques=ataques);
    add('ilesas = 0','assign','Iniciamos el contador.','Todavía no se ha contado ninguna gallina.','ilesas ← 0',null,s=>s.ilesas=0);
    r.setFocus(0);
    add('i = 0','assign','Comenzamos en la primera posición.','El primer índice es 0. El índice se incrementará explícitamente dentro del while.','i ← 0',null,s=>s.i=0);
    while(true) {
      const i=state.i,more=i<recinto.length;
      add('while i < len(recinto):','loop',more?`¿Existe la posición ${i}?`:'Terminamos el recorrido.',more?'La condición es verdadera. Entramos al ciclo para revisar esta posición.':`i vale ${i}, igual al largo del recinto. Salimos sin acceder a recinto[${i}].`,`${i} < ${recinto.length} → ${more?'True':'False'}`,more);
      if(!more) break;
      const bird=recinto[i]==='G',safe=ataques[i]==='X',ok=bird&&safe;
      checked.push(i);
      add('if recinto[i] == "G" and ataques[i] == "X":','condition',ok?'Esta gallina está ilesa.':bird?'Esta gallina fue atacada.':'No hay una gallina aquí.',ok?'Ambas comparaciones son verdaderas. En el siguiente paso aumentará el contador.':bird?'La segunda comparación es falsa. Omitimos el incremento del contador.':'La primera comparación es falsa. Por cortocircuito, Python no evalúa ataques[i].',`"${recinto[i]}" == "G" → ${bird?'True':'False'}${bird?`  and  "${ataques[i]}" == "X" → ${safe?'True':'False'}`:' · segunda comparación omitida'}`,ok);
      if(ok) add('ilesas = ilesas + 1','assign','Contamos una gallina ilesa.','Sumamos 1 al valor anterior y lo guardamos en ilesas.',`ilesas ← ${state.ilesas} + 1 = ${state.ilesas+1}`,null,s=>s.ilesas++);
      r.setFocus(i+1);
      add('i = i + 1','assign','Avanzamos el índice.','Este incremento permite que el while llegue a la siguiente posición y finalmente termine.',`i ← ${i} + 1 = ${i+1}`,null,s=>s.i++);
    }
    const output=`${state.ilesas} gallinas salieron ilesas esta noche`;
    consoleLines.push(output);
    add('print(ilesas, "gallinas salieron ilesas esta noche")','output','Mostramos las sobrevivientes.','print separa el número y el mensaje con un espacio. Conservamos el plural de tu código.',output);
  } else if(id==='racha') {
    const {dias}=input;
    add(line('racha_actual = 0',0),'assign','Iniciamos la racha actual.','Todavía no hemos procesado ningún día.','racha_actual ← 0',null,s=>s.racha_actual=0);
    add('mejor_racha = 0','assign','Iniciamos el récord.','Esta variable guardará el máximo observado.','mejor_racha ← 0',null,s=>s.mejor_racha=0);
    let index=0;
    function read(first) {
      r.setFocus(index);
      const n=dias[index];
      consoleLines.push('Experiencia diaria: '+n);
      add(line('experiencia = int(input("Experiencia diaria: "))',first?0:1),'input',n===-1?'Leemos el centinela.':`Leemos el día ${index+1}.`,n===-1?'El -1 anuncia el fin de las entradas. El while lo comprobará en el próximo paso.':`input entrega "${n}" e int lo convierte a un entero. ${n===0?'No hubo práctica.':'Hubo práctica.'}`,`experiencia ← int("${n}") = ${n}`,null,s=>s.experiencia=n);
    }
    read(true);
    while(true) {
      const n=state.experiencia;
      add('while experiencia != -1:','loop',n===-1?'El ciclo termina.':'Procesamos otro día.',n===-1?'La condición es falsa. El centinela no incrementa ni reinicia la racha.':'La condición es verdadera: entramos al cuerpo del while.',`${n} != -1 → ${n!==-1?'True':'False'}`,n!==-1);
      if(n===-1) break;
      checked.push(index);
      add('if experiencia == 0:','condition',n===0?'Este día corta la racha.':'Este día sí hubo práctica.',n===0?'Entramos al if y reiniciaremos la racha actual. El récord se conserva.':'La condición es falsa; pasamos al else para sumar un día.',`${n} == 0 → ${n===0?'True':'False'}`,n===0);
      if(n===0) add(line('racha_actual = 0',1),'assign','Reiniciamos la racha actual.',`La racha pasa de ${state.racha_actual} a 0. mejor_racha conserva ${state.mejor_racha}.`,'racha_actual ← 0',null,s=>s.racha_actual=0);
      else {
        add('racha_actual = racha_actual + 1','assign','La racha crece un día.','Contamos días de práctica, independientemente de los puntos obtenidos.',`racha_actual ← ${state.racha_actual} + 1 = ${state.racha_actual+1}`,null,s=>s.racha_actual++);
        const record=state.racha_actual>state.mejor_racha;
        add('if racha_actual > mejor_racha:','condition',record?'Encontramos un nuevo récord.':'El récord se mantiene.',record?'La racha actual supera el máximo. En el siguiente paso actualizaremos mejor_racha.':'La racha actual no supera al máximo: omitimos la asignación.',`${state.racha_actual} > ${state.mejor_racha} → ${record?'True':'False'}`,record);
        if(record) add('mejor_racha = racha_actual','assign','Guardamos la mejor racha.','Copiamos el valor actual. Este máximo permanece aunque después aparezca un 0.',`mejor_racha ← ${state.racha_actual}`,null,s=>s.mejor_racha=s.racha_actual);
      }
      index++;
      read(false);
    }
    const output=`Mejor racha: ${state.mejor_racha} dias`;
    consoleLines.push(output);
    add('print("Mejor racha:", mejor_racha, "dias")','output','Mostramos el récord.','El print se ejecuta una sola vez, después de salir del ciclo.',output);
  } else if(id==='plantas') {
    const {jardin,semana}=input;
    consoleLines.push('Jardin: '+jardin);
    add('jardin = input("Jardin: ")','input','Leemos el jardín.','Cada carácter representa una planta: tropical, común o desértica.',`jardin ← "${jardin}"`,null,s=>s.jardin=jardin);
    consoleLines.push('Semana: '+semana);
    add('semana = int(input("Semana: "))','input','Leemos la semana.','int convierte el texto ingresado en un número entero.',`semana ← ${semana}`,null,s=>s.semana=semana);
    add('resultado = ""','assign','Comenzamos con un string vacío.','Agregaremos un carácter R o X por cada planta.','resultado ← ""',null,s=>s.resultado='');
    r.setFocus(0);
    add('i = 0','assign','Comenzamos en el índice 0.','El índice señala la planta que se va a revisar.','i ← 0',null,s=>s.i=0);
    while(true) {
      const i=state.i,more=i<jardin.length;
      add('while i < len(jardin):','loop',more?`Revisamos la planta ${i}.`:'El jardín está completo.',more?'La condición permite entrar al ciclo.':'El índice alcanzó el largo del jardín. Salimos sin acceder a una posición inexistente.',`${i} < ${jardin.length} → ${more?'True':'False'}`,more);
      if(!more) break;
      const type=jardin[i],tropical=type==='T';
      add('if jardin[i] == "T":','condition',tropical?'La planta es tropical.':'No es una planta tropical.',tropical?'Siempre se riega; omitiremos todos los elif.':'La condición es falsa: evaluamos el siguiente elif.',`"${type}" == "T" → ${tropical?'True':'False'}`,tropical);
      let char,occurrence;
      if(tropical) {char='R';occurrence=0;}
      else {
        const common=type==='C';
        add('elif jardin[i] == "C":','condition',common?'La planta es común.':'No es una planta común.',common?'Su período es de 2 semanas. Comprobaremos el resto de la división.':'Seguimos al elif de plantas desérticas.',`"${type}" == "C" → ${common?'True':'False'}`,common);
        if(!common) add('elif jardin[i] == "D":','condition','La planta es desértica.','Su período es de 4 semanas.',`"${type}" == "D" → True`,true);
        const period=common?2:4,remainder=semana%period,water=remainder===0;
        add(`if semana % ${period} == 0:`,'condition',water?'Esta semana corresponde regar.':'Esta semana no corresponde regar.',`El operador % calcula el resto. ${remainder===0?'Un resto 0 significa que la semana es múltiplo del período.':'El resto no es 0: pasamos al else.'}`,`${semana} % ${period} = ${remainder}; ${remainder} == 0 → ${water?'True':'False'}`,water);
        char=water?'R':'X';
        occurrence=char==='R'?(common?1:2):(common?0:1);
      }
      const old=state.resultado;
      add(line(`resultado = resultado + "${char}"`,occurrence),'assign',`Agregamos "${char}" al resultado.`,'La concatenación crea un nuevo string con el carácter al final y lo reasigna a resultado.',`resultado ← "${old}" + "${char}" = "${old+char}"`,null,s=>{s.resultado+=char;checked.push(i);});
      r.setFocus(i+1);
      add('i = i + 1','assign','Pasamos a la siguiente planta.','El resultado ya contiene un carácter por cada posición procesada.',`i ← ${i} + 1 = ${i+1}`,null,s=>s.i++);
    }
    consoleLines.push(state.resultado);
    add('print(resultado)','output','Mostramos el string completo.','Cada R indica riego y cada X indica que no corresponde regar. La salida conserva el orden del jardín.',state.resultado);
  } else {
    consoleLines.push('Numero inicial: '+input.numero);
    add('numero = int(input("Numero inicial: "))','input','Leemos el número inicial.','Este primer valor también debe considerarse al buscar el máximo.',`numero ← ${input.numero}`,null,s=>{s.numero=input.numero;view.sequence.push(s.numero);});
    add('maximo = numero','assign','Guardamos el máximo inicial.','Por ahora, el único valor conocido es el número inicial.',`maximo ← ${state.numero}`,null,s=>s.maximo=s.numero);
    let iterations=0;
    while(true) {
      const n=state.numero,more=n!==1;
      add('while numero != 1:','loop',more?'Todavía no llegamos a 1.':'Alcanzamos el valor 1.',more?'La condición es verdadera: calcularemos el siguiente valor.':'La condición es falsa. Salimos del while y conservamos el máximo alcanzado.',`${n} != 1 → ${more?'True':'False'}`,more);
      if(!more) break;
      if(++iterations>2000) throw Error('La secuencia supera el límite de 2.000 iteraciones de esta visualización. Prueba con otro número.');
      const even=n%2===0;
      add('if numero % 2 == 0:','condition',even?'El número es par.':'El número es impar.',even?'El resto al dividir por 2 es 0. Entramos al if.':'El resto es 1. Entramos al else.',`${n} % 2 = ${n%2} → ${even?'True':'False'}`,even);
      const next=even?n/2:3*n+1;
      if(!Number.isSafeInteger(next)) throw Error('La secuencia excede la precisión entera de esta visualización. Prueba con otro número.');
      add(even?'numero = numero // 2':'numero = 3 * numero + 1','assign',even?'Dividimos por 2.':'Aplicamos el triple más uno.',even?'// es división entera. Como el número es par, el resultado es exacto.':'Primero multiplicamos por 3 y luego sumamos 1.',even?`numero ← ${n} // 2 = ${next}`:`numero ← 3 × ${n} + 1 = ${next}`,null,s=>{s.numero=next;view.sequence.push(next);});
      const record=state.numero>state.maximo;
      add('if numero > maximo:','condition',record?'Hay un nuevo máximo.':'El máximo se conserva.',record?'El valor recién calculado supera al máximo guardado. Lo actualizaremos en el siguiente paso.':'La condición es falsa: no cambiamos maximo.',`${state.numero} > ${state.maximo} → ${record?'True':'False'}`,record);
      if(record) add(line('maximo = numero',1),'assign','Actualizamos el máximo.','Guardamos una copia del valor actual. Los descensos posteriores no lo modifican.',`maximo ← ${state.numero}`,null,s=>s.maximo=s.numero);
    }
    const output=`El valor maximo alcanzado es ${state.maximo}`;
    consoleLines.push(output);
    add('print("El valor maximo alcanzado es", maximo)','output','Mostramos el máximo alcanzado.','El resultado incluye el número inicial y todos los valores calculados hasta llegar a 1.',output);
  }
  return {events:r.events,input};
}
