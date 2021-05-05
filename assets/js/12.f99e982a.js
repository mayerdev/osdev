(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{368:function(t,a,s){"use strict";s.r(a);var n=s(45),r=Object(n.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"обработка-прерывании"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#обработка-прерывании"}},[t._v("#")]),t._v(" Обработка прерываний")]),t._v(" "),s("h2",{attrs:{id:"isr-interrupt-service-routine"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#isr-interrupt-service-routine"}},[t._v("#")]),t._v(" ISR - Interrupt Service Routine")]),t._v(" "),s("p",[t._v("Архитектура x86 - это система, управляемая прерываниями. Внешние события вызывают прерывание — прерывается нормальный поток управления и вызывается процедура обработки прерываний (ISR).")]),t._v(" "),s("p",[t._v("Такие события могут быть вызваны аппаратным или программным обеспечением. Примером аппаратного прерывания является клавиатура: каждый раз, когда вы нажимаете кнопку, клавиатура запускает IRQ1 (Запрос на прерывание 1), и вызывается соответствующий обработчик прерывания. Таймеры и завершение запроса на диск являются другими возможными источниками аппаратных прерываний.")]),t._v(" "),s("p",[t._v("Прерывания, управляемые программным обеспечением, запускаются кодом операции int; например, службы MS-DOS, вызываются программным обеспечением, запускающим INT 21h и передающим соответствующие параметры в регистрах процессора.")]),t._v(" "),s("p",[t._v("Чтобы система знала, какую процедуру обработки прерываний вызывать при возникновении определенного прерывания, смещения для ISR хранятся в Interrupt Descriptor Table, когда вы находитесь в Protected Mode, или Interrupt Vector Table, когда вы находитесь в Real Mode.")]),t._v(" "),s("p",[t._v('ISR вызывается непосредственно процессором, и протокол для вызова ISR отличается от вызова, например, функции C. Самое главное, ISR должен заканчиваться кодом операции iret (или iretq в Long Mode — да, даже при использовании синтаксиса Intel), в то время как обычные функции C заканчиваются ret или retf. Очевидное, но тем не менее неправильное решение приводит к одной из самых "популярных" тройной ошибки среди программистов ОС.')]),t._v(" "),s("h2",{attrs:{id:"когда-вызываются-обработчики"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#когда-вызываются-обработчики"}},[t._v("#")]),t._v(" Когда вызываются обработчики")]),t._v(" "),s("h3",{attrs:{id:"x86"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#x86"}},[t._v("#")]),t._v(" x86")]),t._v(" "),s("p",[t._v("Когда процессор вызывает обработчики прерываний, процессор помещает эти значения в стек в следующем порядке:")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("EFLAGS -> CS -> EIP\n")])])]),s("p",[t._v("Значение CS дополняется двумя байтами, чтобы сформировать двойное слово.")]),t._v(" "),s("p",[t._v("Если тип шлюза не является прерыванием, процессор очистит флаг прерывания. Если прерывание является исключением, процессор отправит код ошибки в стек в виде двойного слова.")]),t._v(" "),s("p",[t._v("Процессор загрузит значение селектора сегментов из связанного дескриптора IDT в CS.")]),t._v(" "),s("h3",{attrs:{id:"x86-64"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#x86-64"}},[t._v("#")]),t._v(" x86-64")]),t._v(" "),s("p",[t._v("Когда процессор вызывает обработчики прерываний, он изменяет значение в регистре RSP на значение, указанное в IST, и если его нет, стек остается прежним. В новый стек процессор помещает эти значения в следующем порядке:")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("SS:RSP (original RSP) -> RFLAGS -> CS -> RIP\n")])])]),s("p",[t._v("CS дополняется, чтобы сформировать четырехсловие.")]),t._v(" "),s("p",[t._v("Если прерывание вызывается из другого кольца, SS устанавливается в 0, что указывает на нулевой селектор. Процессор изменит регистр RFLAGS, установив биты TF, NT и RF равными 0. Если тип прерывание, процессор очистит флаг прерывания.")]),t._v(" "),s("p",[t._v("Если прерывание является исключением, процессор отправит код ошибки в стек, дополненный байтами, чтобы сформировать четырехсловие.")]),t._v(" "),s("p",[t._v("Процессор загрузит значение селектора сегментов из связанного дескриптора IDT в CS и проверит, является ли CS допустимым селектором сегментов кода.")]),t._v(" "),s("h2",{attrs:{id:"проблема"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#проблема"}},[t._v("#")]),t._v(" Проблема")]),t._v(" "),s("p",[t._v("Многие люди избегают ассемблера и хотят сделать как можно больше на своем любимом языке высокого уровня. GCC (а также другие компиляторы) позволяют добавлять встроенный ассемблер, поэтому многие программисты испытывают соблазн написать ISR, подобный этому:")]),t._v(" "),s("div",{staticClass:"language-c extra-class"},[s("pre",{pre:!0,attrs:{class:"language-c"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* Как НЕ НУЖНО писать обработчик прерываний */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("interrupt_handler")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("asm")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"pushad"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* Сохранение регистров */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* Делаем что-нибудь */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("asm")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"popad"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* Восстанавливаем регистры */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("asm")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"iret"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("   "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* Ура! Ура! Тройная ошибка */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* Думаем о своём поведении и переписываем код правильно */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("Это не будет работать. Компилятор не понимает, что происходит. Он не понимает, что регистры и стек должны сохраняться между операторами asm; оптимизатор, скорее всего, повредит функцию. Кроме того, компилятор добавляет код обработки стека до и после вашей функции, что вместе с iret приводит к коду ассемблера, похожему на этот:")]),t._v(" "),s("div",{staticClass:"language-nasm extra-class"},[s("pre",{pre:!0,attrs:{class:"language-nasm"}},[s("code",[t._v("push   "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),s("span",{pre:!0,attrs:{class:"token register variable"}},[t._v("ebp")]),t._v("\nmov    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),s("span",{pre:!0,attrs:{class:"token register variable"}},[t._v("esp")]),t._v(","),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),s("span",{pre:!0,attrs:{class:"token register variable"}},[t._v("ebp")]),t._v("\nsub    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("$")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("размер локальных переменных"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(","),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),s("span",{pre:!0,attrs:{class:"token register variable"}},[t._v("esp")]),t._v("\npushad\n# C код пишем здесь\npopad\niret\n# "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'leave'")]),t._v(" если вы используете локальные переменные, "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'pop %ebp'")]),t._v(" для остальных случаев.\nleave\nret\n")])])]),s("p",[t._v("Должно быть очевидно, как это портит стек (ebp выталкивается, но никогда не выскакивает). Не делай этого.")]),t._v(" "),s("h2",{attrs:{id:"решения"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#решения"}},[t._v("#")]),t._v(" Решения")]),t._v(" "),s("h3",{attrs:{id:"чистыи-ассемблер"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#чистыи-ассемблер"}},[t._v("#")]),t._v(" Чистый Ассемблер")]),t._v(" "),s("p",[t._v("Узнайте достаточно об ассемблере, чтобы написать в нём обработчики прерываний 😃")]),t._v(" "),s("h3",{attrs:{id:"двухэтапныи-враппер-ассемблера"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#двухэтапныи-враппер-ассемблера"}},[t._v("#")]),t._v(" Двухэтапный враппер ассемблера")]),t._v(" "),s("p",[t._v("Напишите оболочку ассемблера, вызывающую функцию C для выполнения обработки, и только затем выполните iret.")]),t._v(" "),s("div",{staticClass:"language-nasm extra-class"},[s("pre",{pre:!0,attrs:{class:"language-nasm"}},[s("code",[s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),t._v(" Файл: isr_wrapper.s "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("\n.globl   isr_wrapper\n.align   "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("4")]),t._v("\n \n"),s("span",{pre:!0,attrs:{class:"token label function"}},[t._v("isr_wrapper:")]),t._v("\n    pushad\n    cld "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),t._v(" Код C, следующий за sysV ABI, требует, чтобы DF был очищен при выполнении функции "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("\n    call interrupt_handler\n    popad\n    iret\n")])])]),s("div",{staticClass:"language-c extra-class"},[s("pre",{pre:!0,attrs:{class:"language-c"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* Файл: interrupt_handler.c */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("interrupt_handler")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* Делаем что-нибудь */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"директивы-прерывании-специфичные-для-компилятора"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#директивы-прерывании-специфичные-для-компилятора"}},[t._v("#")]),t._v(" Директивы прерываний специфичные для компилятора")]),t._v(" "),s("p",[t._v("Некоторые компиляторы для некоторых процессоров имеют директивы, позволяющие объявлять обычное прерывание, предлагая #pragma interrupt или выделенный макрос. Clang 3.9, Borland C, Watcom C/C++, Microsoft C 6.0 и GCC предлагают это. Visual C++ предлагает альтернативу, показанную в разделе "),s("strong",[t._v("Naked-функции")]),t._v(":")]),t._v(" "),s("h4",{attrs:{id:"clang"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#clang"}},[t._v("#")]),t._v(" Clang")]),t._v(" "),s("p",[t._v("Начиная с версии 3.9, он поддерживает атрибут прерывания для x86/x86-64.")]),t._v(" "),s("div",{staticClass:"language-c extra-class"},[s("pre",{pre:!0,attrs:{class:"language-c"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("struct")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("interrupt_frame")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("uword_t")]),t._v(" ip"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("uword_t")]),t._v(" cs"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("uword_t")]),t._v(" flags"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("uword_t")]),t._v(" sp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("uword_t")]),t._v(" ss"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n \n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("__attribute__")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("interrupt"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("interrupt_handler")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("struct")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("interrupt_frame")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),t._v(" frame"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* Делаем что-нибудь */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h4",{attrs:{id:"borland-c"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#borland-c"}},[t._v("#")]),t._v(" Borland C")]),t._v(" "),s("div",{staticClass:"language-c extra-class"},[s("pre",{pre:!0,attrs:{class:"language-c"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" interrupt "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("interrupt_handler")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* Делаем что-нибудь */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h4",{attrs:{id:"watcom-c-c"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#watcom-c-c"}},[t._v("#")]),t._v(" Watcom C/C++")]),t._v(" "),s("div",{staticClass:"language-c extra-class"},[s("pre",{pre:!0,attrs:{class:"language-c"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" _interrupt "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("interrupt_handler")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* Делаем что-нибудь */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h4",{attrs:{id:"naked-функции"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#naked-функции"}},[t._v("#")]),t._v(" Naked-функции")]),t._v(" "),s("p",[t._v("Некоторые компиляторы могут использоваться для создания процедур прерывания, но требуют, чтобы вы вручную обрабатывали операции стека и возврата. Для этого требуется, чтобы функция создавалась без эпилога или пролога. Это называется сделать функцию "),s("strong",[t._v("naked")]),t._v(" — это делается в Visual C++ путем добавления атрибута "),s("em",[t._v("_declspec(naked)")]),t._v(" к функции. Вам необходимо убедиться, что вы включаете операцию возврата (например, iretd), поскольку это часть эпилога, который компилятору теперь было поручено не включать.")]),t._v(" "),s("p",[t._v("Если вы собираетесь использовать локальные переменные, вы должны настроить фрейм стека так, как ожидает компилятор; однако, поскольку ISR не являются реентерабельными, вы можете просто использовать статические переменные.")]),t._v(" "),s("h4",{attrs:{id:"microsoft-visual-c"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#microsoft-visual-c"}},[t._v("#")]),t._v(" Microsoft Visual C++")]),t._v(" "),s("p",[t._v("Visual C++ предоставляет макрос ассемблера __LOCAL_SIZE, который уведомляет вас, сколько места требуется объектам в стеке для функции.")]),t._v(" "),s("div",{staticClass:"language-cpp extra-class"},[s("pre",{pre:!0,attrs:{class:"language-cpp"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("_declspec")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("naked"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("interrupt_handler")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    _asm pushad"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n \n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* Делаем что-нибудь */")]),t._v("\n \n    _asm "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        popad\n        iretd\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h4",{attrs:{id:"gcc-g"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#gcc-g"}},[t._v("#")]),t._v(" GCC / G++")]),t._v(" "),s("p",[t._v("В "),s("a",{attrs:{href:"https://gcc.gnu.org/onlinedocs/gcc/x86-Function-Attributes.html#x86-Function-Attributes",target:"_blank",rel:"noopener noreferrer"}},[t._v("документации GCC"),s("OutboundLink")],1),t._v(" говорится, что, используя атрибуты функций GCC, они добавили возможность писать обработчики прерываний в интерфейсе C с помощью _"),s("em",[t._v("attribute")]),t._v("_((interrupt)). Так что вместо:")]),t._v(" "),s("div",{staticClass:"language-c extra-class"},[s("pre",{pre:!0,attrs:{class:"language-c"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* ЧЁРНАЯ МАГИЯ - категорически не рекомендуется! */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("interrupt_handler")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("__asm__")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"pushad"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* Делаем что-нибудь */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("__asm__")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"popad; leave; iret"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* ЧЁРНАЯ МАГИЯ! */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("Вы можете использовать:")]),t._v(" "),s("div",{staticClass:"language-c extra-class"},[s("pre",{pre:!0,attrs:{class:"language-c"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("struct")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("interrupt_frame")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n \n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("__attribute__")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("interrupt"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("interrupt_handler")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("struct")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("interrupt_frame")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),t._v(" frame"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* Делаем что-нибудь */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v('В документации для GCC говорится, что если используется атрибут прерывания, инструкция iret будет использоваться вместо ret на архитектурах x86 и x86-64. В нем также говорится: "Поскольку GCC не сохраняет состояния SSE, MMX и x87, параметр GCC-mgeneral-regs-only должен использоваться для компиляции обработчиков прерываний и исключений."')]),t._v(" "),s("h5",{attrs:{id:"черная-магия"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#черная-магия"}},[t._v("#")]),t._v(" Чёрная магия")]),t._v(" "),s("p",[t._v("Посмотрите на неисправный код выше, где правильный exit-код функции C был пропущен, что испортило стек. Теперь рассмотрим этот фрагмент кода, где код выхода добавляется вручную:")]),t._v(" "),s("div",{staticClass:"language-c extra-class"},[s("pre",{pre:!0,attrs:{class:"language-c"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* ЧЁРНАЯ МАГИЯ - категорически не рекомендуется! */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("interrupt_handler")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("__asm__")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"pushad"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* Делаем что-нибудь */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("__asm__")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"popad; leave; iret"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* ЧЁРНАЯ МАГИЯ! */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("Ассемблерный код будет выглядеть примерно так:")]),t._v(" "),s("div",{staticClass:"language-nasm extra-class"},[s("pre",{pre:!0,attrs:{class:"language-nasm"}},[s("code",[t._v("push   "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),s("span",{pre:!0,attrs:{class:"token register variable"}},[t._v("ebp")]),t._v("\nmov    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),s("span",{pre:!0,attrs:{class:"token register variable"}},[t._v("esp")]),t._v(","),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),s("span",{pre:!0,attrs:{class:"token register variable"}},[t._v("ebp")]),t._v("\nsub    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("$")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("размер локальных переменных"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(","),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),s("span",{pre:!0,attrs:{class:"token register variable"}},[t._v("esp")]),t._v("\npushad\n# C"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("код где"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("то здесь\npopad\nleave\niret\nleave # мёртвый код\nret   # мёртвый код\n")])])]),s("p",[t._v('Это предполагает, что leave является правильной обработкой конца функции - вы выполняете код возврата функции "вручную", а обработку, сгенерированную компилятором, оставляете как "мертвый код". Излишне говорить, что такие предположения о внутренних компонентах компилятора опасны. Этот код может сломаться на другом компиляторе или даже на другой версии того же компилятора. Поэтому он настоятельно не рекомендуется и указан только для полноты картины.')]),t._v(" "),s("h5",{attrs:{id:"assembly-goto"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#assembly-goto"}},[t._v("#")]),t._v(" Assembly Goto")]),t._v(" "),s("p",[t._v('Начиная с версии 4.5, GCC поддерживает оператор "asm goto". Он может быть использован для создания ISR в качестве функций, которые возвращают правильный адрес точки входа ISR.')])])}),[],!1,null,null,null);a.default=r.exports}}]);