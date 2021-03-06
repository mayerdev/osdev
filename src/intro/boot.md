# Порядок загрузки

## POST

Когда компьютер включен или перезагружается, он проходит серию диагностических процедур, называемых [POST - Power-On Self-Test](https://ru.wikipedia.org/wiki/POST_(аппаратное_обеспечение)). Эта процедура завершается поиском загрузочного устройства, такого как дискета, компакт-диск или жесткий диск, в том порядке, который настроен в BIOS.

## Master Boot Record

Legacy-BIOS проверяет загрузочные устройства на наличие сигнатуры. Сигнатура загрузки находится в загрузочном секторе (номер сектора 0) и содержит последовательность байтов 0x55, 0xAA при смещениях байтов 510 и 511 соответственно. Когда BIOS находит такой загрузочный сектор, он загружается в память по адресу 0x0000:0x7c00 (сегмент 0, адрес 0x7c00). (Однако некоторые BIOS загружаются в 0x7c0:0x0000 (сегмент 0x07c0, смещение 0), что приводит к одному и тому же физическому адресу. Хорошей практикой является применение CS:IP в самом начале вашего загрузочного сектора.)

Затем выполнение переносится в загрузочную запись. На гибком диске все 512 байтов загрузочной записи (за исключением последних двух байтов подписи) могут содержать исполняемый код. На жестком диске Главная загрузочная запись (MBR) содержит исполняемый код со смещением 0x0000 - 0x01bd, за которым следуют записи таблицы для четырех основных разделов, используя шестнадцать байт на запись (0x01be - 0x01fd) и двухбайтовую подпись (0x01fe - 0x01ff).

## Ранняя среда

Cреда раннего выполнения в значительной степени определяется реализацией вашего конкретного BIOS. Никогда не делайте никаких предположений относительно содержимого регистров: они могут быть инициализированы до 0, но они также могут содержать ложное значение. Это включает в себя регистр FLAGS и регистр SP, у вас также может не быть валидного стека! Единственное, в чем можно быть уверенным, так это в том, что регистр DL содержит код диска, с которого был загружен ваш загрузочный код.

Процессор в настоящее время находится в реальном режиме. (Если только вы не работаете на одном из тех редких BIOS, которые считают, что делают вам одолжение, активируя для вас защищенный режим. Это означает, что вам нужно не только написать код для активации защищенного режима, но и добавить проверку на случай, если он уже активирован.).

## Ядро

Наконец, загрузчик загружает ядро в память и передает ему управление.

## Загрузка

Теперь мы знаем, что нам нужно загрузить, давайте посмотрим, как мы это загрузим.

При загрузке с жесткого диска для загрузочной записи доступно только 446 байт. Взглянув на список дел, которые необходимо выполнить до запуска образа ядра, вы согласитесь, что это не так уж много:

- определить, с какого раздела следует загрузиться (либо путем поиска активного раздела, либо путем предоставления пользователю выбора установленных операционных систем);
- определить, где находится ваш образ ядра в загрузочном разделе (либо путем интерпретации файловой системы, либо путем загрузки образа из фиксированного положения);
- загрузить образ ядра в память (требуется базовый дисковый I/O);
- включить защищенный режим;
- подготовка среды выполнения для ядра (например, настройка пространства стека);

Вам не нужно делать вещи в таком порядке, но все это должно быть сделано до того, как вы сможете вызвать kmain().

Что еще хуже, GCC генерирует исполняемые файлы в защищенном режиме, поэтому код для этой ранней среды является одной из вещей, которые вы не можете сделать в C.

Есть несколько решений этой проблемы:

- **Geek-загрузка**: Сожмите всё из приведенного выше списка в загрузочную запись. Это практически невозможно и не оставляет места для обработки особых случаев или полезных сообщений об ошибках.
- **Одноэтапная загрузка**: написать программу-заглушку для создания коммутатора и связать её с образом ядра. Загрузочная запись загружает образ ядра (ниже отметки в 1 Мб памяти, потому что в реальном режиме это верхний предел памяти!), Переходит в заглушку, заглушка переключается в защищенный режим, готовится к выполнению и переходит в ядро.
- **Двухэтапная загрузка**: напишите отдельную программу-заглушку, которая загружается ниже отметки в 1 Мб памяти и делает все из приведенного выше списка.

### Традиционный способ

Традиционно MBR перемещается в 0x0000:0x0600, определяет активный раздел из таблицы разделов, загружает первый сектор этого раздела ("загрузочная запись раздела") в 0x0000:0x7c00 (следовательно, предыдущее перемещение) и переходит к этому адресу. Это называется "цепной загрузкой". Если вы хотите, чтобы записанная вами загрузочная запись была способна к двойной загрузке, например, Windows, она должна имитировать это поведение.

### Лёгкий выход

Если вы действительно не хотите использовать свой собственный загрузчик для образовательных целей, мы рекомендуем использовать легкодоступные загрузчики.

Наиболее заметным из них является GRUB, двухступенчатый загрузчик, который не только предоставляет меню загрузки с возможностью загрузки по цепочке, но и инициализирует начальную среду до четко определенного состояния (включая защищенный режим и чтение различной интересной информации из BIOS), может загружать общие исполняемые файлы в виде образов ядра (вместо того, чтобы требовать двоичные файлы, как большинство других загрузчиков), поддерживает дополнительные модули ядра, различные файловые системы и, если ./configure сделан правильно, то даже бездисковую загрузку.

### Другие способы

Существует множество возможных вариантов загрузки. Ниже приведен список методов, но возможно, что существует еще больше методов:

- Вы можете взять неиспользуемый раздел и загрузить двухэтапный "raw"
- Вы можете поместить этап 2 между MBR и началом первого раздела
- Вы можете написать файл ядра, а затем использовать инструмент для обнаружения секторов (или кластеров). Затем пусть этап 1 загрузит сектора из списка.
- Как это делает DOS и Windows: создайте пустую файловую систему (отформатируйте ее), а затем поместите ядро в первый файл, а оболочку во второй файл в пустой корневой каталог. Таким образом, загрузчик просто загружает первую запись в rootdir, а затем вторую.
- Старый Linux загружался с дискеты. Первый сектор ("загрузка") загружал второй этап в режиме "raw" = без файловой системы (второй этап был "настройка", в секторах непосредственно за "загрузкой") На втором этапе была настройка системы (видеорежим, карта памяти и т.д.), А Затем загружался реальный образ ядра (упакованный в tgz/bz).

## Внешние ссылки

- [Как включаются компьютеры](https://manybutfinite.com/post/how-computers-boot-up/)
- [Процесс запуска ядра](https://manybutfinite.com/post/kernel-boot-process/)
- [Загрузка линукс изнутри](https://developer.ibm.com/technologies/linux/articles/l-linuxboot/)