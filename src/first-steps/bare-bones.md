# Голое железо

В этом туториале мы напишем простое 32х-битное ядро и загрузим его. Это первый шаг в создании вашей операционной системы. Здесь вы узнаете как создать минимальную систему, но не как нужно структурировать ваш проект.

<!-- TODO
This tutorial uses existing technology to get you started and straight into kernel development, rather than developing your own programming language, your own compiler, and your own bootloader. In this tutorial, you will use:

The GNU Linker from Binutils to link your object files into the final kernel.
The GNU Assembler from Binutils (or optionally NASM) to assemble instructions into object files containing machine code.
The GNU Compiler Collection to compile your high level code into assembly.
The C programming language (or optionally C++) to write the high level parts of your kernel.
The GRUB bootloader to bootload your kernel using the Multiboot boot protocol that loads us into 32-bit protected mode with paging disabled.
The ELF as the executable format that gives us control of where and how the kernel is loaded.
This article assumes you are using a Unix-like operating system such as Linux which supports operating systems development well. Windows users should be able to complete it from a WSL, MinGW, or Cygwin environment. -->

## Настройка кросс-компилятора

<!-- Main article: GCC Cross-Compiler, Why do I need a Cross Compiler? -->

Первым делом вам необходимо настроить GCC для i686-elf. Вы еще не модифицировали свой компилятор, чтобы дать ему знать о существовании вашей операционной системы, поэтому мы будем использовать стандартную сборку под i686-elf, который предоставляет инструменты для System V ABI.

Вы **не сможете** правильную сборку вашей ОС без кросс-компилятора.

Вы **не сможете** корректно завершить этот туториал с x86_64-elf, потому что GRUB способен загружать только 32х-битные [мультизагрузочные] ядра. Если это ваша первая ОС, то следует начать с 32х-битного ядра.

[мультизагрузочные]: https://ru.wikipedia.org/wiki/Мультизагрузка

## Обзор

Теперь вам понадобится три входных файлов:

* `boot.s` - точка входа ядра, которая настроит среду процессора,
* `kernel.c` - код вашего ядра,
* `linker.ld` - информация компоновки файлов выше.

## Загружаем ядро ОС

Для запуска ОС необходимо иметь ПО, которое сможет загрузить её. Такое ПО называют _загрузчиками_, мы будем использовать GRUB. Ядро получает от загрузчика минимальную среду, в которой ещё не настроен стек, виртуальная память, подключенные устройства и так далее.

Чтобы сообщить загрузчику как загрузить ОС будем использовать стандарт мультизагрузки, который описывает простой интерфейс между загрузчиком и ядром. Это работает благодаря глобальным переменным, которые ищет загрузчик.

<!-- Alternatively, you can use NASM as your assembler. -->

В этом примере используется ассемблер GNU, который является частью кросс-компилятора, настроенного ранее.

<!-- TODO: вынести части кода для читаемости, либо добавить подсветку в Prism -->

```gs
/* Объявляем содержимое нашего заголовка. */
.set ALIGN,    1<<0             /* выравнивать загруженные модули по границам страницы */
.set MEMINFO,  1<<1             /* предоставлять карту памяти (memory map) */
.set FLAGS,    ALIGN | MEMINFO  /* это поле "флаги" заголовка */
.set MAGIC,    0x1BADB002       /* "волшебное" число, позволяющее загрузчику найти заголовок */
.set CHECKSUM, -(MAGIC + FLAGS) /* контрольная сумма */

/*
Объявление заголовка мультизагрузки помечает программу как ядро. Все эти
значения можно найти в стандарте. Загрузчик будет искать этот заголовок
в первых 8 кБ файла ядра, с отступом до 32х-битной границы. Сигнатура может
находиться в отдельной секции, поэтому заголовок может быть принудительно
помещен в начало файла.
*/
.section .multiboot
.align 4
.long MAGIC
.long FLAGS
.long CHECKSUM

/*
Стандарт мультизагрузочности не предусматривает установку значения регистра
указателя на стек (esp), т. е. стек должен предоставляться ядром. По стандарту
происходит выделение (аллокация) памяти для малого стека путём создания символа
в его конце, после происходит выделение 16384 байт для этого и создаётся символ
в начале. На архитектуре x86 стек направлен вниз. Стек находится в отдельной секции,
поэтому его можно пометить как nobits, что означает меньший развер файла ядра,
поскольку он не содержит неинициализированного стека. Стек на x86 должен быть
выровнен до 16 байт в соответствии со стандартом System V ABI и фактическими
расширениями. Компилятор предполагает, что стек выровнен корректно, отсутствие
выравнивания может привести к неопределенному поведению.
*/
.section .bss
.align 16
stack_bottom:
.skip 16384 # 16 KiB
stack_top:

/*
Скрипт компоновщика указывает _start как точку входа ядра, и загрузчик перейдёт
к этой метке сразу после полной загрузки ядра. Не важно, возвращает ли эта функция
значение, на данном этапе загрузчика уже нет.
*/
.section .text
.global _start
.type _start, @function
_start:
    /*
    Загрузчик запускается в защищённом (protected) режиме на x86.
    Прерывания (interrupts) не доступны, как и подкачка страниц памяти (memory paging).
    В этот момоент ЦП находится в состоянии, указанном стандартом мультизагрузочности,
    и под полным контролем ядра. Ядро может только использовать аппаратные функции, либо
    собственный код. Здесь нет ни printf, ни ограничений безопасности, ни каких-либо
    гарантий, ни механизма отладки - только то, что предоставляет само ядно.
    */

    /*
    Чтобы "установить" стек сохраняем указатель на его начало в регистр `esp`.
    Это необходимо сделать на ассемблере, потому что языки как C не могут
    функционировать без стека.
    */
    mov $stack_top, %esp

    /*
    Это хорошее место для инициализации минимального состояния процессора до перехода
    в высокоуровневое ядро. Лучше всего свести к минимуму раннюю среду, в которой важные
    функции отключены. Помните, что процессор еще не полностью инициализирован: инструкции
    с плавающей запятой и расширения набора инструкций, еще не доступны. Здесь должен быть
    загружен GDT и включена подкачка страниц памяти. Функций C++, как глобальные конструкторы
    и исключения, потребуют  поддержки среды выполнения для нормальной работы.
    */

    /*
    Переход в высокоуровневое ядро. ABI требует, чтобы стек был выровнен по 16 байт во время
    вызова инструкции (которая отдаёт 4х-байтный указатель). Изначально стек был выровнен,
    и с тех пор мы поместили в стек несколько байтов, кратное 16 байтам (пока что 0 байт),
    поэтому выравнивание было сохранено, и вызов четко определен.
    */
    call kernel_main

    /*
    Если системе больше нечего делать, то мы оставляем компьютер в бесконечном цикле.
    Для этого мы:
    1) Отключаем прерывания через cli (clear interrupt enable in eflags).
       Они уже отключены загрузчиком, поэтому это необезательно.
       Возможно, что позже вы захотите включить прерывания и вернуться из kernel_main
       (что немного бессмысленно).
    2) Ожидаем следующим прерываним инструкцию hlt (англ. halt - остановки/отключения).
       Т. к. они выключены, это заблокирует компьютер.
    3) Переходим на инструкцию hlt, если это вызвано не маскируемым прерыванием или
       режимом управления системой.
    */
    cli
1:
    hlt
    jmp 1b

/*
Устанавливаем размер символа _start, используя текущую позицию ("."), путём
вычитания позиции метки этого символа. Это может быть полезно при отладке
или реализации стека вызовов (call stack).
*/
.size _start, . - _start
```

Теперь вы можете собрать `boot.s`, используя:

```bash
i686-elf-as boot.s -o boot.o
```

## Реализация ядра

После написания базового загрузчика можно использовать более высокоуровневые языки, например C/C++.

### Отдельные и размещённые среды

Если вы уже использовали C/C++ для пользовательских прогрмамм, то вы использовали так называемую резмещённую (_англ._ hosted) среду, что означает наличие стандартной библиотеки языка и различных удобств, доступных во время выполнения (_англ._ runtime). Также сущесвуют отдельные (_англ._ freestanding) среды, которые мы и будем использовать. Это означает, что у нас ничего не будет из стандартного набора, и мы должы будет реализовать их самостоятельно. Тем не менее, у нас будут некоторые заголовочные файлы, которые являются частью компилятора, а не стандарта C.

Среди них:

* `stdbool.h` - тип для булевых (логических) значений;
* `stddef.h` - `size_t` и `NULL`;
* `stdint.h` - `intx_t` и `uintx_t` для точных размеров переменных (если вы использовали `short` вместо `uint16_t`, то при изменении размера типа всё может неожиданно сломаться;
* `float.h`, `iso646.h`, `limits.h`, и `stdarg.h`.

### Пищем ядро на C

Для начала мы напишем простое ядро, которое будет использовать текстовый режим VGA (адрес `0xB8000`). Оно будет запоминать положение следущего символа в буффере и выводить простые симфолы, но буде поддержки переноса строк. Добавление поддержки этой функции может стать вашей первой самостоятельной задачей. Потратьте немного времени, чтобы понять собственный код.

::: warning Важно!
Текстовый режим (также как и BIOS) является устаревшим на новых устройствах, т. к. UEFI поддерживает только буффер пикселей. Для будущей совместимости вы можете начать с этого. Просим загрузчик настроить графический буффер соответствующим флагом мультизагрузки, либо самостоятельно используем вызовы VESA VBE. В отличии от текстового режима VGA, буффер имеет пиксели, что озачает ручную отрисовку каждого символа, поддержку пролистывания (скролла), перемещения курсока и т. д. Также значит, что вам потребуется другой `terminal_putchar` и шрифт (изображения для каждого символа). Все дистрибутивы Linux поставляют экранные шрифты (_англ._ PC Screen Fonts), которые вы можете использовать.
:::

```c
#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

/* Проверяем, что используется привильное нацеливание сборки. */
#if defined(__linux__)
#error "Вы не используете кросс-компилятор, скорее всего это приведёт к проблемам"
#endif

#if !defined(__i386__)
#error "Данный пример будет работать только с компилятором ix86-elf"
#endif

/* Констатны цветов для текстового режима. */
enum vga_color {
    VGA_COLOR_BLACK = 0,
    VGA_COLOR_BLUE = 1,
    VGA_COLOR_GREEN = 2,
    VGA_COLOR_CYAN = 3,
    VGA_COLOR_RED = 4,
    VGA_COLOR_MAGENTA = 5,
    VGA_COLOR_BROWN = 6,
    VGA_COLOR_LIGHT_GREY = 7,
    VGA_COLOR_DARK_GREY = 8,
    VGA_COLOR_LIGHT_BLUE = 9,
    VGA_COLOR_LIGHT_GREEN = 10,
    VGA_COLOR_LIGHT_CYAN = 11,
    VGA_COLOR_LIGHT_RED = 12,
    VGA_COLOR_LIGHT_MAGENTA = 13,
    VGA_COLOR_LIGHT_BROWN = 14,
    VGA_COLOR_WHITE = 15,
};

static inline uint8_t vga_entry_color(enum vga_color fg, enum vga_color bg) {
    return fg | bg << 4;
}

static inline uint16_t vga_entry(unsigned char uc, uint8_t color) {
    return (uint16_t) uc | (uint16_t) color << 8;
}

size_t strlen(const char* str) {
    size_t len = 0;
    while (str[len]) len++;
    return len;
}

static const size_t VGA_WIDTH = 80;
static const size_t VGA_HEIGHT = 25;

size_t terminal_row;
size_t terminal_column;
uint8_t terminal_color;
uint16_t* terminal_buffer;

void terminal_initialize(void) {
    terminal_row = 0;
    terminal_column = 0;
    terminal_color = vga_entry_color(VGA_COLOR_LIGHT_GREY, VGA_COLOR_BLACK);
    terminal_buffer = (uint16_t*) 0xB8000;
    for (size_t y = 0; y < VGA_HEIGHT; y++) {
        for (size_t x = 0; x < VGA_WIDTH; x++) {
            const size_t index = y * VGA_WIDTH + x;
            terminal_buffer[index] = vga_entry(' ', terminal_color);
        }
    }
}

void terminal_setcolor(uint8_t color) {
    terminal_color = color;
}

void terminal_putentryat(char c, uint8_t color, size_t x, size_t y) {
    const size_t index = y * VGA_WIDTH + x;
    terminal_buffer[index] = vga_entry(c, color);
}

void terminal_putchar(char c) {
    terminal_putentryat(c, terminal_color, terminal_column, terminal_row);
    if (++terminal_column == VGA_WIDTH) {
        terminal_column = 0;
        if (++terminal_row == VGA_HEIGHT) {
            terminal_row = 0;
        }
    }
}

void terminal_write(const char* data, size_t size) {
    for (size_t i = 0; i < size; i++) {
        terminal_putchar(data[i]);
    }
}

void terminal_write_string(const char* data) {
    terminal_write(data, strlen(data));
}

void kernel_main(void) {
    terminal_initialize();
    terminal_write_string("Hello, kernel World!\n");
}
```

Обратите внимание, что в коде мы хотели использовать обычную функцию C `strlen`, которая является частью стандартной библиотеки C, которой у вас нет. Вместо этого мы положились на отдельный заголовок `stddef.h`, и собственную реализацию. И так вам придётся делать с каждой функцией из стандартной библиотеки, которую захотите использовать (заголовки для отдельной среды предоставляют только типы данным и макросы).

Пример выше можно собрать, выполнив:

```bash
i686-elf-gcc -c kernel.c -o kernel.o -std=gnu99 -ffreestanding -O2 -Wall -Wextra
```

Заметим, что код примера использует некоторый функционал из сборщика GNU для C99.

### Пишем ядро на C++

Написать ядро на C++ легко, но стоит помнить, что не весь функционал языка доступен. К примеру, выбрасывание исключений требует особой поддержи в среде выполнения, а также выделений памяти. В нашем случае просто добавляется `extern "C"` для главной функции. Важно, чтобы функция `kernel_main` была объявлена как видимостью для C, иначе компилятор добавит информацию в название сборки (_англ._ assembly). Это делает невозможным вызов этой функции из ассеблера.

Сохраните всё в файл `kernel.cpp` (или с вашим любимым расширением файла с кодом на C++).
Вы можете скомпилировать этот файл, используя:

```bash
i686-elf-g++ -c kernel.cpp -o kernel.o -ffreestanding -O2 -Wall -Wextra -fno-exceptions -fno-rtti
```

<!-- Note that you must have also built a cross C++ compiler for this work. -->

## Компоновка ядра

Выше упомянутые `boot.s` и `kernel.c` содержат части нашего ядра, и для создания полноценного ядра остаётся только скомпоновать их собранные версии в программу ядра, которую загрузчик сможет использовать. При сборке пользовательских программ мы используем стандартные скрипты компоновки инструментов разработки. В нашем случае нужно написать собственный скрипт. Ниже пример `linker.ld`:

```ld
/* Загрузчик начнёт выполение с этой метки, назначенной точкой входа. */
ENTRY(_start)

/* Сообщаем о различных секциях, которые содержатся с объектных файлах конечного ядра. */
SECTIONS {
    /* Инструкции будут размещены в первом 1 МБ, т. е. месте, принятом для расположения
       ядер, загружаемых через загрузчик. */
    . = 1M;

    /*
    Первым должен идти заголовок мультизагрузочности, иначе загрузчик не распознает
    формат файла. Далее идёт секция ".text".
    */
    .text BLOCK(4K) : ALIGN(4K) {
        *(.multiboot)
        *(.text)
    }

    /* Секция только для чтения. */
    .rodata BLOCK(4K) : ALIGN(4K) {
        *(.rodata)
    }

    /* Инициализированная секция данных */
    .data BLOCK(4K) : ALIGN(4K) {
        *(.data)
    }

    /* Неинициализированные перезаписываемые данные и стек */
    .bss BLOCK(4K) : ALIGN(4K) {
        *(COMMON)
        *(.bss)
    }

    /*
    Компилятор может пораждать другие секции, по умолчанию они будут находиться в
    сегменте с таким же названием. Просто добавьте здесь, если требуется.
    */
}
```

Мы используем компилятор в качестве компоновщика из-за большего контроля процесса. Не забудьте, что если вы использовали C++ при написании ядра, то нужно будет использовать компилятор для C++.

Вы можете скомпоновать ядро командой ниже:

```bash
i686-elf-gcc -T linker.ld -o my_kernel.bin -ffreestanding -O2 -nostdlib boot.o kernel.o -lgcc
```

::: tip Заметка
Некоторые туториалы предлагаю использовать `i686-elf-ld` вместо компилятор
Note: Some tutorials suggest linking with i686-elf-ld rather than the compiler, но это не позволяет выполнять компилятору некоторые задачи во время компоновки.
:::

Теперь файл `my_kernel.bin` - ваше ядро (другие файлы более не нужны)!
The file myos.bin is now your kernel (all other files are no longer needed). Note that we are linking against libgcc, which implements various runtime routines that your cross-compiler depends on. Leaving it out will give you problems in the future. If you did not build and install libgcc as part of your cross-compiler, you should go back now and build a cross-compiler with libgcc. The compiler depends on this library and will use it regardless of whether you provide it or not.

## Проверяем ядро

### Проверка мультизагрузочности

Проверить присутствие заголовка мультизагрузочности v1 можно при помощи GRUB:

```sh
grub-file --is-x86-multiboot myos.bin
```

Важно, чтобы заголовок находился в первых 8 КиБ с выравнивание в 4 байта, иначе GRUB выйдет с кодом 1. Поверка v2 заголовка проводится с аргументом `--is-x86-multiboot2`. Чтобы не проверять возвращаемый код, можно использовать sh-скрипт:

```sh
if grub-file --is-x86-multiboot $1; then
    echo "Мультизагрузочный заголовок найден"
else
    echo "Образ не содержит мультизагрузочный заголовок"
fi
```

### Сборка загрузочного CD-ROM образа

Для начала нужно создать файл `boot/grub/grub.cfg` в папке `isodir`, который будет хранить загрузочную конфигурацию:

```txt
menuentry "Boot MyOS" {
    multiboot /boot/myos.bin
}
```

Далее переместим скомпилированное ядро `myos.bin` в `isodir/boot` и соберём сам образ:

```sh
grub-mkrescue -o myos.iso isodir
```

### Тестовый запуск

```sh
qemu-system-i386 -cdrom myos.iso
```

После загрузки вы, скорее всего, увидите "Hello, kernel World!".

Дополнительно, QEMU поддерживает прямую загрузку ядра без загрузочного образа:

```sh
qemu-system-i386 -kernel myos.bin
```

## Что дальше?

Только что на свет появилась ещё одна ОС, поздравляем! Но это только начало. Вот что вы можете сделать:

### Поддержка переносов строки в драйвер терминала

Текстовый режим VGA на месте `\n` хранит другой символ, поэтому следует добавить проверку в `terminal_putchar`, которая будет увелимивать `terminal_row` и сбрасывать `terminal_column`.

### Пролистывание терминала

Сейчас, если мы достигаем конца экрана, то следующим символом просто оказываемя в его начале. Вместе этого следует сдвигать строки вверх, оставляя одну строку для ввода символов.

### Цветные ASCII-арты

Текущий терминальный драйвер поддерживает только 16 цветов (из них 8 фоновых), поэтому вам понадобится нормальный VGA драйвер.

### Глобальные конструкторы

<!-- Main article: Calling Global Constructors -->

This tutorial showed a small example of how to create a minimal environment for C and C++ kernels. Unfortunately, you don't have everything set up yet. For instance, C++ with global objects will not have their constructors called because you never do it. The compiler uses a special mechanism for performing tasks at program initialization time through the `crt*.o` objects, which may be valuable even for C programmers. If you combine the `crt*.o` files correctly, you will create an `_init` function that invokes all the program initialization tasks. Your `boot.o` object file can then invoke `_init` before calling `kernel_main`.

### Организация ОС

**Главная статья**: [Пример организации ОС](../intro/skeleton.html)

Этот туториал покажет как нетерпеливому новичку получить приветствие от своей ОС. В нём не будет лучших практик организации ОС, однако вы узнаете как сделать ОС с ядром, стандартной библиотекой и подготовленным пространством для пользователя.

### Дальнейшее изучение

<!-- Main article: Going Further on x86
This guide is meant as an overview of what to do, so you have a kernel ready for more features, without actually redesigning it radically when adding them. -->

<!-- Bare Bones II
Make your operating system self-hosting and then complete Bare Bones under your own operating system while following all the instructions. This is a five star exercise and you may need a couple of years to solve it. -->

## Частые вопросы

### Почему используется мультизагрузочный заголовок? Разве GRUB не умеет работать с ELF?

GRUB может загружать множество разных форматов. Однако, этот туториал описывает создание ядра, сомвестимого со стандартам мультизагрузочности, что означает поддержку и другимим загрузчиками.

### GRUB очищает секцию BSS перед загрузкой ядра?

Да. Для ELF секция .bss автоматически определяется и очищается (хотя в стандарте мультизагрузочности нет чётких указаний). Для других форматов вы можете использовать флаг №16 мультизагрузочного заголовка и не нулевое значение для поля `bss_end_addr`.

### \[GRUB\] Error 13: Invalid or unsupported executable format

<!-- TODO -->
Chances are the Multiboot header is missing from the final executable, or it is not at the right location.
If you are using some other format than ELF (such as PE), you should specify the AOUT kludge in the Multiboot header. The grub-file program describe aboveand "objdump -h" should give you more hints about what is going on.
It may also happen if you use an ELF object file instead of an executable (e.g. you have an ELF file with unresolved symbols or unfixable relocations). Try to link your ELF file to a binary executable to get more accurate error messages.
A common problem when your kernel size increases, is that the Multiboot header does no longer appear at the start of the output binary. The common solutions is to put the Multiboot header in a separate section and make sure that section is first in the output binary, or to include the Multiboot header itself in the linker script.

### \[QEMU\] Could not read from CD-ROM (code 0009)

If your development system is booted from EFI it may be that you don't have the PC-BIOS version of the grub binaries installed anywhere. If you install them then grub-mkrescue will by default produce a hybrid ISO that will work in QEMU. On Ubuntu this can be achieved with: apt-get install grub-pc-bin.
