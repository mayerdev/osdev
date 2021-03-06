# Главная

## Добро пожаловать

Добро пожаловать в разработку операционных систем!

Не все могут разрабатывать в этой области, многие даже не проходят стадию "Hello world!" в разработке ОС, но, возможно, вы пойдете дальше и создадите следующий Linux? Или Windows? Или ваши цели ниже - BolgenOS? Или даже CP/M?

Каковы бы ни были ваши цели, разработка ОС - это вершина программирования для самых отчаянных. Но вы не одиноки. На самом деле весь этот веб-сайт, включая [форумы](https://forum.osdev.org) и эту вики, посвящены разработке ОС. На форуме Вы можете найти помощь и единомышленников для исполнения своей цели.

<!-- todo: Добавить ссылку на начало работы -->

Что Вам нужно, чтобы преуспеть в разработке ОС? Вы должны прочитать статью "Начало работы". Если вы собираетесь использовать [C]/[C++] в качестве основного языка, то Вам необходимо сначала настроить кросс-компилятор [GCC]. И если вы предпочитаете использовать другие языки, то важно иметь некоторые аналогичные инструменты (например, компилятор), или если таких инструментов нет, часто только ваши усилия могут Вам помочь. Но использование языка, который Вы знаете может добавить некоторую мотивацию для вашей работы.

Удачи!

[GCC]: https://ru.wikipedia.org/wiki/GNU_Compiler_Collection
[C++]: https://ru.wikipedia.org/wiki/C++
[C]: https://ru.wikipedia.org/wiki/Си_(язык_программирования)

## Что такое операционная система?

Операционная система - это программное обеспечение, управляющее работой компьютера и его ресурсами. Среди прочего, есть один очень важный критерий, общий для всех операционных систем:

::: danger Важно
Операционная система должна обеспечить возможность загружать и выполнять пользовательские программы, обеспечивая для них стандартизированный (аппаратно-независимый) интерфейс ввода-вывода.
:::

Другие основные функции операционных систем:

Основные функции операционных систем могут включать:

- Управление памятью и другими системными ресурсами.
- Установка политики безопасности и доступа.
- Планирование и мультиплексирование процессов и потоков.
- Динамический запуск и закрытие пользовательских программ.
- Обеспечение базового пользовательского интерфейса и интерфейса прикладного программиста.

Не все операционные системы обеспечивают все эти функции. Однозадачные системы, такие как MS-DOS, не будут планировать процессы, в то время как встроенные системы, такие как eCOS, могут не иметь пользовательского интерфейса или могут работать со статическим набором пользовательских программ.

К операционным системам **НЕ ОТНОСИТСЯ**:

- Оборудование компьтера.
- Конкретное приложение, такое как текстовый процессор, веб-браузер или игра.
- Набор утилит (например, инструменты GNU, которые используются во многих системах, производных от Unix).
- Среда разработки (хотя некоторые операционные системы, такие как UCSD Pascal или Smalltalk-80, включают интерпретатор и IDE).
- Графический пользовательский интерфейс (хотя многие современные операционные системы включают графический интерфейс как часть ОС).

Не смотря на то, что большинство операционных систем распространяются с такими инструментами, сами по себе они не являются обязательной частью ОС. Некоторые операционные системы, такие как Linux, могут выпускаться во многих различных сборках, называемых дистрибутивами, которые могут иметь различные наборы приложений и утилит и могут по-разному организовывать некоторые аспекты системы. Тем не менее, все они являются версиями одной и той же базовой ОС и не должны рассматриваться как отдельные типы операционных систем.

## Что такое ядро?

Ядро операционной системы - это то, что вы никогда не увидите в пользовательском интерфейсе. Ядро позволяет выполнять любые другие программы, кроме этого оно ещё обрабатывает события, генерируемые аппаратными средствами (называемые прерываниями) и программным обеспечением (называемые системными вызовами), и управляет доступом к ресурсам.

Аппаратные обработчики событий (обработчики прерываний), например, получат числовой код только что нажатой клавиши и преобразуют его в соответствующий символ, хранящийся в буфере, чтобы какая-либо программа могла его извлечь.

Системные вызовы инициируются программами пользовательского уровня для открытия файлов, запуска других программ и т.д. Каждый обработчик системного вызова должен будет проверить, являются ли переданные аргументы допустимыми, а затем выполнить внутреннюю операцию для завершения вызова.

Большинство пользовательских программ напрямую не выполняют системные вызовы (за исключением, например, программ разработанных на asm), а вместо этого используют стандартную библиотеку, которая выполняет работу по форматированию аргументов в соответствии с требованиями ядра и генерации системного вызова. (Например, функция C `fopen()` в конечном итоге вызывает функцию ядра, которая фактически открывает файл.)

Ядро обычно определяет несколько абстракций, таких как файлы, процессы, сокеты, каталоги и т.д., соответствующих внутреннему состоянию, которое оно запоминает о последних операциях, чтобы программа могла более эффективно выполняться.

## Что такое оболочка?

Оболочка - это специальная программа, которая обычно интегрируется в дистрибутив ОС и которая предлагает людям интерфейс работы с компьютером. То, как он выглядит для пользователей, может изменяться от системы к системе (командная строка, проводник файлов и т.д.), но концепция всегда одна и та же:

- Позвольте пользователю выбрать программу для запуска и, при необходимости, предоставить ей аргументы для конкретного запуска.
- Разрешите тривиальные операции с локальным хранилищем, такие как перечисление содержимого каталогов, перемещение и копирование файлов по всей системе.

Чтобы выполнить эти действия, оболочке, возможно, придется выполнить множество системных вызовов, таких как открыть файл "x"; открыть файл "y" и создать его, если он не существует; прочитать содержимое из "x", записать в "y", закрыть оба файла, записать "готово" в вывод.

Оболочка также может использоваться программами, которые хотят запустить другие программы, но не хотят делать это сами (например, заполнение шаблонов файлов, таких как `*.mp3`, получение точного пути к программе и т.д.).

Современные оболочки также могут иметь различные дополнительные функции:

- Автозавершение: при нажатии клавиши TAB (или любой другой предпочтительной клавиши) слово, которое вводит пользователь, будет дополнено допустимой командой оболочки, файлом, каталогом или чем-то еще. Нажатие клавиши автозаполнения несколько раз показываются другие возможности завершения.
- Вставка символов: пользователь может перемещаться в том, что он ввел, с помощью клавиш со стрелками. При вводе новых символов в середине предложения символы будут "вставлены".
- История: с помощью клавиш со стрелками вверх и вниз пользователь может просмотреть историю вводов.
- Прокрутка: если строк больше, чем в консоли, сохраните выходные данные в буфере и разрешите пользователю прокручивать вверх и вниз.
- Сценарии: некоторые оболочки имеют собственные языки сценариев. Примерами языков сценариев являются [Bash] или [DOS Batch File].

[Bash]: https://ru.wikipedia.org/wiki/Bash
[DOS Batch File]: https://ru.wikipedia.org/wiki/Пакетный_файл

## Что такое графический интерфейс?

Пользовательский графический интерфейс является наиболее заметной частью любой операционной системы, в которой он есть. Его роль выходит за рамки простой библиотеки отрисовки, так как он должен уметь:

- Перехватывать события пользовательского ввода (клавиатура, мышь и т.д.) и отправлять их в соответствующий объект.
- Обновить внутреннюю информацию о том, что должно отображаться на экране, определяя, какие части экрана необходимо перерисовать.
- Обновить видимое содержимое экрана, перерисовав необходимые части.
- Сделать это так, чтобы чувствовать себя естественно, интуитивно и отзывчиво к пользователю.

### Рабочий стол, менеджер окон, библиотека виджетов

Сеанс KDE или Windows - это среда рабочего стола, то есть _графическая оболочка_, обеспечивающая функциональную среду для всех функций более низкого уровня.

Частью системы, ответственной за организацию окон различных запущенных программ, их изменение размера, закрытие, границы окон, полосы прокрутки и т.д. являются *менеджером окон*.

И наконец, у Вас есть подсистема, которая выполняет отрисовку элементов управления, отображение документов на экране и т.д.
Это обычно называется *библиотекой виджетов*. Однако существуют альтернативы, обычно в форме декларативных языков (например, XUL Mozilla, QML QT, Dart).

### Темы на форуме про графический интерфейс

- [Будете ли вы реализовывать графический интерфейс?](https://forum.osdev.org/viewtopic.php?t=8783)
- [Дизайн графического интерфейса](https://forum.osdev.org/viewtopic.php?t=9432)
- [Отлавливание событий ввода в графическом интерфейсе](https://forum.osdev.org/viewtopic.php?t=9448)

## Зачем нужно разрабатывать ОС?

~~Ещё раз повторяю - **НЕ НУЖНО!**~~

Существуют различные причины, по которым люди хотят разработать собственную операционную систему. У каждого отдельного разработчика могут быть свои собственные причины, но некоторые являются общими для некоторых (если не для большинства) разработчиков:

- Полный контроль над машиной. При разработке приложения или другой программы пользовательского пространства разработчик должен учитывать код, написанный другими: операционной системой, библиотеками, другими программами и т.д. Некоторые хотят иметь полностью собственный код, который они знают от начала до конца.
- Исследование. Довольно много проектов начинаются как дипломная или исследовательская работа, в то время как запуск операционной системы в качестве курсовой работы до третьего курса обычно считается плохой идеей (из-за коротких сроков), но как долгосрочный проект вполне подходит. Исследовательские работы обычно выполняются для улучшения существующих операционных систем. Однако распространенной ошибкой новичков является недооценка времени, необходимого для написания операционной системы с нуля.
- Замены других операционных систем. Возможно, что у них нет конкретной функции, которую хочет разработчик. Быть может они просто отстой (Linux раздут, Windows нестабильна, BSD сложен и т.д.). Это может быть даже ради получения прибыли; у всех разные причины.
- Это весело. Программирование на низком уровне - это ~~не пустыню пылесосить~~ весёлая и захватывающая задача, потому что вы должны делать абсолютно всё. Это может показаться более сложным (это так, не волнуйтесь), но по тем же причинам это более увлекательно. Вы знаете, как всё работает, как это всё пишется и как работает ваша программа.

К сожалению, многие проекты операционных систем закрываются по различным причинам, подробнее смотрите
в списке [ошибок начинающих](./mistakes).