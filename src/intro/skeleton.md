# Пример организации ОС

## Основная информация

В этом уроке мы продолжим с первых шагов и создадим минимальную операционную систему-шаблон, подходящую для дальнейшей модификации или в качестве вдохновения для вашей начальной версии операционной системы. Туториал "Первые шаги" даёт вам только абсолютно минимальный код, чтобы продемонстрировать, как правильно скомпилировать ядро, однако это не подходит в качестве примера операционной системы. Кроме того, в этом туториале реализованы необходимые функции ABI, необходимые для выполнения функций ABI и компилятора, чтобы предотвратить возможные неожиданные ошибки.

Этот туториал также служит в качестве начального гайда по тому, как создать свой собственный libc (Стандартная библиотека C). В документации GCC явно указано, что libgcc требует, чтобы автономная среда предоставляла функции memcmp, memcpy, memmove и memset. Мы выполним это требование, создав специальную библиотеку C-ядра (libk), которая содержит части пользовательского пространства libc, которые являются автономными (не требуют каких-либо функций ядра), в отличие от существующих функций libc, которые должны выполнять системные вызовы.

## Предисловие

Этот туториал является примером того, как вы можете структурировать свою операционную систему таким образом, чтобы вам не приходилось постоянно рефакторить её в будущем.

Мы назовём нашу ОС `myos`. Вы можете далее использовать это название или придумать своё.

## Настройка кросс-компилятора

Вы должны использовать таргет i686-elf в своем кросс-компиляторе.

Также вы должны сконфигурить cross-binutils с параметром --with-sysroot, иначе линковка завершится ошибкой this linker was not configured to use sysroots. Если вы забыли собрать cross-binutils с этим параметром, вам придется пересобрать его(пересобирать GCC необязательно).

## Зависимости ~~разработчика после создания ОС~~

Вам понадобятся эти инструменты:

* i686-набор инструментов elf.
* GRUB, для команды grub-mkrescue, вместе с соответствующими runtime-файлами.
* Xorriso, для создания .iso, используемый grub-mkrescue.
* GNU make 4.0 или более поздней версии.
* QEMU, для тестирования операционной системы.

Вам потребуется система основанная на GNU/Linux.

### Для пользователей Debian

Установите набор инструментов `i686-elf`, а затем установите пакеты `xorriso` `grub-pc-bin`.

## Sysroot

Обычно при компиляции программ для локальной операционной системы компилятор находит заголовки и библиотеки, в системных каталогах, таких как:

- /usr/include
- /usr/lib

Эти файлы конечно могут не использоваться в вашей ОС, скорее всего вы будете использовать собственные пути, например:

- /home/depowered/myos/sysroot/usr/include
- /home/depowered/myos/sysroot/usr/lib

Каталог `/home/depowered/myos/sysroot` будет работать как sysroot-каталог для вашей ОС.

:::tip Что такое sysroot?
Sysroot - это каталог, который считается корневым каталогом для поиска заголовков и библиотек. Так, например, если ваша сборка toolchain хочет найти /usr/include/foo.h но вы выполняете кросс-компиляцию, а соответствующий foo.h находится в /my/other/place/usr/include/foo.h, вы будете использовать /my/other/place как ваш sysroot.
:::

## Заголовки

`./headers.sh` просто устанавливает заголовки для вашего libc и ядра (системные заголовки) в `sysroot/usr/include`, но на самом деле не скомпилирует вашу операционную систему. Это полезно, так как позволяет предоставить компилятору копию ваших заголовков до того, как вы фактически скомпилируете свою систему.

## Makefile

Makefile — это файл, содержащий набор инструкций, используемых утилитой make в инструментарии автоматизации сборки. Чаще всего makefile содержит указания для утилиты make о том, как компилировать и компоновать программу.

Пример Makefile:

```makefile
# Дефолтные CFLAGS:
CFLAGS?=-O2 -g

# Дополнительные параметры CFLAGS:
CFLAGS:=$(CFLAGS) -Wall -Wextra
```

## Архитектурные директории

Проекты в этом примере (libc и ядро) хранят все зависимые от архитектуры исходные файлы в каталоге `arch/` со своим собственным вложенным Makefile.

## Структура ядра

Мы переместили ядро в его собственный каталог с именем `kernel/`. Возможно, было бы лучше назвать его как-то иначе, если ваше ядро имеет другое имя, чем ваш полный дистрибутив операционной системы, хотя, называя его `kernel/`, другим разработчикам-любителям будет легче найти основные части вашей ОС.

Ядро устанавливает свои общедоступные Header-файлы в `sysroot/usr/include/kernel`. Это полезно, если вы решите создать ядро с модулями, где модули могут просто получать общедоступные заголовки из основного ядра.

GNU GRUB используется в качестве загрузчика, а ядро использует мультизагрузку, как в туториале "Первые шаги".

Ядро реализует правильный способ вызова глобальных конструкторов (полезно для кода C++ и кода C с использованием **&lowbar;&lowbar;attribute&lowbar;&lowbar;((constructor))**. Начальная загрузка вызывает _init, который вызывает все глобальные конструкторы. Они вызываются самими первыми при загрузке без какого-либо конкретного порядка. Вы должны использовать их только для инициализации глобальных переменных, которые не могут быть инициализированы во время выполнения.

Специальный макрос **__is_kernel** позволяет исходному коду определить, является ли он частью ядра.

Модуль ожидает подключения к ядру:
![Модуль ожидает подключения к ядру](/osdev/module.jpeg)

## Структура libc и libk

libc и libk на самом деле являются двумя версиями одной и той же библиотеки, которая хранится в каталоге `libc/`. Стандартная библиотека разделена на две версии: автономную и размещенную. Разница в том, что автономная библиотека (libk) не содержит кода, который работает только в пользовательском пространстве, например системных вызовов. libk также собирается с различными параметрами компилятор.

Каждая стандартная функция помещается в файл с тем же именем, что и функция в каталоге с именем заголовка. Например, **strlen** из **string.h** находится в `libc/string/strlen.c` и **stat** из `sys/stat.h` будет находиться в `libc/sys/stat/stat.c`.

Стандартные заголовки используют BSD-подобную схему, где `sys/cdefs.h` объявляет кучу полезных макросов препроцессора, предназначенных для внутреннего использования стандартной библиотекой. Все прототипы функций завернуты в extern `"C" { ... }` и таким образом, что код C++ может правильно связываться с libc. Обратите также внимание, как компилятор предоставляет внутреннее ключевое слово `__restrict` (даже в режиме C89), что полезно для добавления ключевого слова **restrict** в прототипы функций даже при компиляции кода в режиме C99 или C++.

Специальный макрос **__is_libc** позволяет исходному коду определить, является ли он частью libc, а **__is_libk** позволяет исходному коду определить, является ли он частью двоичного файла libk.

Этот пример поставляется с небольшим количеством стандартных функций, которые служат для примера и выполнения требований ABI. Обратите внимание, что включенная функция printf очень минимальна и намеренно не обрабатывает большинство распространенных функций.

## Исходный код

Исходный код можно посмотреть и загрузить на странице: [https://gitlab.com/sortie/meaty-skeleton.git](https://gitlab.com/sortie/meaty-skeleton.git)

### Основные файлы ядра

::: details kernel/include/kernel/tty.h

```c
#ifndef _KERNEL_TTY_H
#define _KERNEL_TTY_H

#include <stddef.h>

void terminal_initialize(void);
void terminal_putchar(char c);
void terminal_write(const char* data, size_t size);
void terminal_writestring(const char* data);

#endif
```

**kernel/Makefile**

```makefile
DEFAULT_HOST!=../default-host.sh
HOST?=DEFAULT_HOST
HOSTARCH!=../target-triplet-to-arch.sh $(HOST)

CFLAGS?=-O2 -g
CPPFLAGS?=
LDFLAGS?=
LIBS?=

DESTDIR?=
PREFIX?=/usr/local
EXEC_PREFIX?=$(PREFIX)
BOOTDIR?=$(EXEC_PREFIX)/boot
INCLUDEDIR?=$(PREFIX)/include

CFLAGS:=$(CFLAGS) -ffreestanding -Wall -Wextra
CPPFLAGS:=$(CPPFLAGS) -D__is_kernel -Iinclude
LDFLAGS:=$(LDFLAGS)
LIBS:=$(LIBS) -nostdlib -lk -lgcc

ARCHDIR=arch/$(HOSTARCH)

include $(ARCHDIR)/make.config

CFLAGS:=$(CFLAGS) $(KERNEL_ARCH_CFLAGS)
CPPFLAGS:=$(CPPFLAGS) $(KERNEL_ARCH_CPPFLAGS)
LDFLAGS:=$(LDFLAGS) $(KERNEL_ARCH_LDFLAGS)
LIBS:=$(LIBS) $(KERNEL_ARCH_LIBS)

KERNEL_OBJS=\
$(KERNEL_ARCH_OBJS) \
kernel/kernel.o \

OBJS=\
$(ARCHDIR)/crti.o \
$(ARCHDIR)/crtbegin.o \
$(KERNEL_OBJS) \
$(ARCHDIR)/crtend.o \
$(ARCHDIR)/crtn.o \

LINK_LIST=\
$(LDFLAGS) \
$(ARCHDIR)/crti.o \
$(ARCHDIR)/crtbegin.o \
$(KERNEL_OBJS) \
$(LIBS) \
$(ARCHDIR)/crtend.o \
$(ARCHDIR)/crtn.o \

.PHONY: all clean install install-headers install-kernel
.SUFFIXES: .o .c .S

all: myos.kernel

myos.kernel: $(OBJS) $(ARCHDIR)/linker.ld
    $(CC) -T $(ARCHDIR)/linker.ld -o $@ $(CFLAGS) $(LINK_LIST)
    grub-file --is-x86-multiboot myos.kernel

$(ARCHDIR)/crtbegin.o $(ARCHDIR)/crtend.o:
    OBJ=`$(CC) $(CFLAGS) $(LDFLAGS) -print-file-name=$(@F)` && cp "$$OBJ" $@

.c.o:
    $(CC) -MD -c $< -o $@ -std=gnu11 $(CFLAGS) $(CPPFLAGS)

.S.o:
    $(CC) -MD -c $< -o $@ $(CFLAGS) $(CPPFLAGS)

clean:
    rm -f myos.kernel
    rm -f $(OBJS) *.o */*.o */*/*.o
    rm -f $(OBJS:.o=.d) *.d */*.d */*/*.d

install: install-headers install-kernel

install-headers:
    mkdir -p $(DESTDIR)$(INCLUDEDIR)
    cp -R --preserve=timestamps include/. $(DESTDIR)$(INCLUDEDIR)/.

install-kernel: myos.kernel
    mkdir -p $(DESTDIR)$(BOOTDIR)
    cp myos.kernel $(DESTDIR)$(BOOTDIR)

-include $(OBJS:.o=.d)
```
:::

::: details kernel/kernel/kernel.c

```c
#include <stdio.h>

#include <kernel/tty.h>

void kernel_main(void) {
    terminal_initialize();
    printf("Hello, kernel World!\n");
}
```
:::

::: details kernel/arch/i386/tty.c

```c
#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
#include <string.h>

#include <kernel/tty.h>

#include "vga.h"

static const size_t VGA_WIDTH = 80;
static const size_t VGA_HEIGHT = 25;
static uint16_t* const VGA_MEMORY = (uint16_t*) 0xB8000;

static size_t terminal_row;
static size_t terminal_column;
static uint8_t terminal_color;
static uint16_t* terminal_buffer;

void terminal_initialize(void) {
    terminal_row = 0;
    terminal_column = 0;
    terminal_color = vga_entry_color(VGA_COLOR_LIGHT_GREY, VGA_COLOR_BLACK);
    terminal_buffer = VGA_MEMORY;
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

void terminal_putentryat(unsigned char c, uint8_t color, size_t x, size_t y) {
    const size_t index = y * VGA_WIDTH + x;
    terminal_buffer[index] = vga_entry(c, color);
}

void terminal_scroll(int line) {
    int loop;
    char c;

    for(loop = line * (VGA_WIDTH * 2) + 0xB8000; loop < VGA_WIDTH * 2; loop++) {
        c = *loop;
        *(loop - (VGA_WIDTH * 2)) = c;
    }
}

void terminal_delete_last_line() {
    int x, *ptr;

    for(x = 0; x < VGA_WIDTH * 2; x++) {
        ptr = 0xB8000 + (VGA_WIDTH * 2) * (VGA_HEIGHT - 1) + x;
        *ptr = 0;
    }
}

void terminal_putchar(char c) {
    int line;
    unsigned char uc = c;

    terminal_putentryat(uc, terminal_color, terminal_column, terminal_row);
    if (++terminal_column == VGA_WIDTH) {
        terminal_column = 0;
        if (++terminal_row == VGA_HEIGHT)
        {
            for(line = 1; line <= VGA_HEIGHT - 1; line++)
            {
                terminal_scroll(line);
            }
            terminal_delete_last_line();
            terminal_row = VGA_HEIGHT - 1;
        }
    }
}

void terminal_write(const char* data, size_t size) {
    for (size_t i = 0; i < size; i++)
        terminal_putchar(data[i]);
}

void terminal_writestring(const char* data) {
    terminal_write(data, strlen(data));
}
```
:::

::: details kernel/arch/i386/crtn.S
```nasm
.section .init
    /* gcc красиво разместит здесь содержимое раздела crtend.o .init. */
    popl %ebp
    ret

.section .fini
    /* gcc красиво разместит здесь содержимое раздела crtend.o .fini. */
    popl %ebp
    ret
```
:::

::: details kernel/arch/i386/vga.h
```c
#ifndef ARCH_I386_VGA_H
#define ARCH_I386_VGA_H

#include <stdint.h>

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

#endif
```
:::

::: details kernel/arch/i386/make.config
```makefile
KERNEL_ARCH_CFLAGS=
KERNEL_ARCH_CPPFLAGS=
KERNEL_ARCH_LDFLAGS=
KERNEL_ARCH_LIBS=

KERNEL_ARCH_OBJS=\
$(ARCHDIR)/boot.o \
$(ARCHDIR)/tty.o \
```
:::

::: details kernel/arch/i386/crti.S
```nasm
.section .init
.global _init
.type _init, @function
_init:
    push %ebp
    movl %esp, %ebp
    /* gcc красиво разместит здесь содержимое раздела crtbegin.o .init. */

.section .fini
.global _fini
.type _fini, @function
_fini:
    push %ebp
    movl %esp, %ebp
    /* gcc красиво разместит здесь содержимое раздела crtbegin.o .fini. */
```
:::

::: details kernel/arch/i386/linker.ld
```c
/* Загрузчик посмотрит на этот образ и начнет выполнение с символа, обозначенного в точке входа. */
ENTRY(_start)

/* Укажите, где различные секции объектных файлов будут помещены в окончательный образ ядра. */
SECTIONS
{
    /* Начнём размещать секции в 1 Мбайт, обычное место для загрузки ядро загрузчиком. */
    . = 1M;

    /* Сначала поместим заголовок multiboot, так как он должен быть помещен очень рано в образ, иначе загрузчик не распознает формат файла. Далее мы поместим раздел .text. */
    .text BLOCK(4K) : ALIGN(4K)
    {
        *(.multiboot)
        *(.text)
    }

    /* Данные только для чтения */
    .rodata BLOCK(4K) : ALIGN(4K)
    {
        *(.rodata)
    }

    /* Данные для чтения и записи (инициализированы) */
    .data BLOCK(4K) : ALIGN(4K)
    {
        *(.data)
    }

    /* Чтение-запись данных (неинициализированных) и стек */
    .bss BLOCK(4K) : ALIGN(4K)
    {
        *(COMMON)
        *(.bss)
    }

    /* Компилятор может создать другие разделы и помещать их в нужное место в этом файле, если вы хотите включить их в окончательное ядро. */
}
```
:::

::: details kernel/arch/i386/boot.S
```nasm
# Обявление констант для заголовка multiboot.
.set ALIGN,    1<<0             # выравнивание загруженных модулей по границам страниц
.set MEMINFO,  1<<1             # предоставление карты памяти
.set FLAGS,    ALIGN | MEMINFO  # это поле мультизагрузочного флага
.set MAGIC,    0x1BADB002       # это магическое число поможет загрузчику найти заголовок
.set CHECKSUM, -(MAGIC + FLAGS) # контрольная сумма выше, чтобы доказать, что мы можем включить multiboot

# Объявление заголовков Multiboot Standard.
.section .multiboot
.align 4
.long MAGIC
.long FLAGS
.long CHECKSUM

# Резервирование стека для первоначального потока
.section .bss
.align 16
stack_bottom:
.skip 16384 # 16 KiB
stack_top:

# Входная точка в ядро
.section .text
.global _start
.type _start, @function
_start:
    movl $stack_top, %esp

    # Вызов глобальных конструкторов
    call _init

    # Передача управления ядру
    call kernel_main

    # Зависнуть если kernel_main вернёт результат
    cli
1:	hlt
    jmp 1b
.size _start, . - _start
```
:::

::: details kernel/.gitignore
```gitignore
*.d
*.kernel
*.o
```
:::

### libc и libk

::: details libc/include/string.h
```c
ifndef _STRING_H
#define _STRING_H 1

#include <sys/cdefs.h>

#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

int memcmp(const void*, const void*, size_t);
void* memcpy(void* __restrict, const void* __restrict, size_t);
void* memmove(void*, const void*, size_t);
void* memset(void*, int, size_t);
size_t strlen(const char*);

#ifdef __cplusplus
}
#endif

#endif
```
:::

::: details libc/include/stdio.h
```c
#ifndef _STDIO_H
#define _STDIO_H 1

#include <sys/cdefs.h>

#define EOF (-1)

#ifdef __cplusplus
extern "C" {
#endif

int printf(const char* __restrict, ...);
int putchar(int);
int puts(const char*);

#ifdef __cplusplus
}
#endif

#endif
```
:::

::: details libc/include/sys/cdefs.h
```c
#ifndef _SYS_CDEFS_H
#define _SYS_CDEFS_H 1

#define __myos_libc 1

#endif
```
:::

::: details libc/include/stdlib.h
```c
#ifndef _STDLIB_H
#define _STDLIB_H 1

#include <sys/cdefs.h>

#ifdef __cplusplus
extern "C" {
#endif

__attribute__((__noreturn__))
void abort(void);

#ifdef __cplusplus
}
#endif

#endif
```
:::

::: details libc/include/stdlib.h
```c
#ifndef _STDLIB_H
#define _STDLIB_H 1

#include <sys/cdefs.h>

#ifdef __cplusplus
extern "C" {
#endif

__attribute__((__noreturn__))
void abort(void);

#ifdef __cplusplus
}
#endif

#endif
```
:::

::: details libc/Makefile
```makefile
DEFAULT_HOST!=../default-host.sh
HOST?=DEFAULT_HOST
HOSTARCH!=../target-triplet-to-arch.sh $(HOST)

CFLAGS?=-O2 -g
CPPFLAGS?=
LDFLAGS?=
LIBS?=

DESTDIR?=
PREFIX?=/usr/local
EXEC_PREFIX?=$(PREFIX)
INCLUDEDIR?=$(PREFIX)/include
LIBDIR?=$(EXEC_PREFIX)/lib

CFLAGS:=$(CFLAGS) -ffreestanding -Wall -Wextra
CPPFLAGS:=$(CPPFLAGS) -D__is_libc -Iinclude
LIBK_CFLAGS:=$(CFLAGS)
LIBK_CPPFLAGS:=$(CPPFLAGS) -D__is_libk

ARCHDIR=arch/$(HOSTARCH)

include $(ARCHDIR)/make.config

CFLAGS:=$(CFLAGS) $(ARCH_CFLAGS)
CPPFLAGS:=$(CPPFLAGS) $(ARCH_CPPFLAGS)
LIBK_CFLAGS:=$(LIBK_CFLAGS) $(KERNEL_ARCH_CFLAGS)
LIBK_CPPFLAGS:=$(LIBK_CPPFLAGS) $(KERNEL_ARCH_CPPFLAGS)

FREEOBJS=\
$(ARCH_FREEOBJS) \
stdio/printf.o \
stdio/putchar.o \
stdio/puts.o \
stdlib/abort.o \
string/memcmp.o \
string/memcpy.o \
string/memmove.o \
string/memset.o \
string/strlen.o \

HOSTEDOBJS=\
$(ARCH_HOSTEDOBJS) \

OBJS=\
$(FREEOBJS) \
$(HOSTEDOBJS) \

LIBK_OBJS=$(FREEOBJS:.o=.libk.o)

#BINARIES=libc.a libk.a
BINARIES=libk.a

.PHONY: all clean install install-headers install-libs
.SUFFIXES: .o .libk.o .c .S

all: $(BINARIES)

libc.a: $(OBJS)
    $(AR) rcs $@ $(OBJS)

libk.a: $(LIBK_OBJS)
    $(AR) rcs $@ $(LIBK_OBJS)

.c.o:
    $(CC) -MD -c $< -o $@ -std=gnu11 $(CFLAGS) $(CPPFLAGS)

.S.o:
    $(CC) -MD -c $< -o $@ $(CFLAGS) $(CPPFLAGS)

.c.libk.o:
    $(CC) -MD -c $< -o $@ -std=gnu11 $(LIBK_CFLAGS) $(LIBK_CPPFLAGS)

.S.libk.o:
    $(CC) -MD -c $< -o $@ $(LIBK_CFLAGS) $(LIBK_CPPFLAGS)

clean:
    rm -f $(BINARIES) *.a
    rm -f $(OBJS) $(LIBK_OBJS) *.o */*.o */*/*.o
    rm -f $(OBJS:.o=.d) $(LIBK_OBJS:.o=.d) *.d */*.d */*/*.d

install: install-headers install-libs

install-headers:
    mkdir -p $(DESTDIR)$(INCLUDEDIR)
    cp -R --preserve=timestamps include/. $(DESTDIR)$(INCLUDEDIR)/.

install-libs: $(BINARIES)
    mkdir -p $(DESTDIR)$(LIBDIR)
    cp $(BINARIES) $(DESTDIR)$(LIBDIR)

-include $(OBJS:.o=.d)
-include $(LIBK_OBJS:.o=.d)
```
:::

::: details libc/stdlib/abort.c
```c
#include <stdio.h>
#include <stdlib.h>

__attribute__((__noreturn__))
void abort(void) {
#if defined(__is_libk)
    // TODO: добавить нормальный кернел паник
    printf("kernel: panic: abort()\n");
#else
    // TODO: добавить нормальное завершение процесса как через SIGABRT.
    printf("abort()\n");
#endif
    while (1) { }
    __builtin_unreachable();
}
```
:::

::: details libc/string/memmove.c
```c
#include <string.h>

void* memmove(void* dstptr, const void* srcptr, size_t size) {
    unsigned char* dst = (unsigned char*) dstptr;
    const unsigned char* src = (const unsigned char*) srcptr;
    if (dst < src) {
        for (size_t i = 0; i < size; i++)
            dst[i] = src[i];
    } else {
        for (size_t i = size; i != 0; i--)
            dst[i-1] = src[i-1];
    }
    return dstptr;
}
```
:::

::: details libc/string/strlen.c
```c
#include <string.h>

size_t strlen(const char* str) {
    size_t len = 0;
    while (str[len])
        len++;
    return len;
}
```
:::

::: details libc/string/memcmp.c
```c
#include <string.h>

int memcmp(const void* aptr, const void* bptr, size_t size) {
    const unsigned char* a = (const unsigned char*) aptr;
    const unsigned char* b = (const unsigned char*) bptr;
    for (size_t i = 0; i < size; i++) {
        if (a[i] < b[i])
            return -1;
        else if (b[i] < a[i])
            return 1;
    }
    return 0;
}
```
:::

::: details libc/string/memset.c
```c
#include <string.h>

void* memset(void* bufptr, int value, size_t size) {
    unsigned char* buf = (unsigned char*) bufptr;
    for (size_t i = 0; i < size; i++)
        buf[i] = (unsigned char) value;
    return bufptr;
}
```
:::

::: details libc/string/memcpy.c
```c
#include <string.h>

void* memcpy(void* restrict dstptr, const void* restrict srcptr, size_t size) {
    unsigned char* dst = (unsigned char*) dstptr;
    const unsigned char* src = (const unsigned char*) srcptr;
    for (size_t i = 0; i < size; i++)
        dst[i] = src[i];
    return dstptr;
}
```
:::

::: details libc/stdio/puts.c
```c
#include <stdio.h>

int puts(const char* string) {
    return printf("%s\n", string);
}
```
:::

::: details libc/stdio/putchar.c
```c
#include <stdio.h>

#if defined(__is_libk)
#include <kernel/tty.h>
#endif

int putchar(int ic) {
#if defined(__is_libk)
    char c = (char) ic;
    terminal_write(&c, sizeof(c));
#else
    // TODO: реализовать stdio и системный вызов write.
#endif
    return ic;
}
```
:::

::: details libc/stdio/printf.c
```c
#include <limits.h>
#include <stdbool.h>
#include <stdarg.h>
#include <stdio.h>
#include <string.h>

static bool print(const char* data, size_t length) {
    const unsigned char* bytes = (const unsigned char*) data;
    for (size_t i = 0; i < length; i++)
        if (putchar(bytes[i]) == EOF)
            return false;
    return true;
}

int printf(const char* restrict format, ...) {
    va_list parameters;
    va_start(parameters, format);

    int written = 0;

    while (*format != '\0') {
        size_t maxrem = INT_MAX - written;

        if (format[0] != '%' || format[1] == '%') {
            if (format[0] == '%')
                format++;
            size_t amount = 1;
            while (format[amount] && format[amount] != '%')
                amount++;
            if (maxrem < amount) {
                // TODO: установить значение errno в EOVERFLOW.
                return -1;
            }
            if (!print(format, amount))
                return -1;
            format += amount;
            written += amount;
            continue;
        }

        const char* format_begun_at = format++;

        if (*format == 'c') {
            format++;
            char c = (char) va_arg(parameters, int /* char promotes to int */);
            if (!maxrem) {
                // TODO: установить значение errno в EOVERFLOW.
                return -1;
            }
            if (!print(&c, sizeof(c)))
                return -1;
            written++;
        } else if (*format == 's') {
            format++;
            const char* str = va_arg(parameters, const char*);
            size_t len = strlen(str);
            if (maxrem < len) {
                // TODO: установить значение errno в EOVERFLOW.
                return -1;
            }
            if (!print(str, len))
                return -1;
            written += len;
        } else {
            format = format_begun_at;
            size_t len = strlen(format);
            if (maxrem < len) {
                // TODO: установить значение errno в EOVERFLOW.
                return -1;
            }
            if (!print(format, len))
                return -1;
            written += len;
            format += len;
        }
    }

    va_end(parameters);
    return written;
}
```
:::

::: details libc/arch/i386/make.config
```makefile
ARCH_CFLAGS=
ARCH_CPPFLAGS=
KERNEL_ARCH_CFLAGS=
KERNEL_ARCH_CPPFLAGS=

ARCH_FREEOBJS=\

ARCH_HOSTEDOBJS=\
```
:::

::: details libc/.gitignore
```gitignore
*.a
*.d
*.o
```
:::

### Дополнительные файлы

Все эти файлы находятся в корневой директории

::: details build.sh
```bash
#!/bin/sh
set -e
. ./headers.sh

for PROJECT in $PROJECTS; do
  (cd $PROJECT && DESTDIR="$SYSROOT" $MAKE install)
done
```
:::

::: details clean.sh
```bash
#!/bin/sh
set -e
. ./config.sh

for PROJECT in $PROJECTS; do
  (cd $PROJECT && $MAKE clean)
done

rm -rf sysroot
rm -rf isodir
rm -rf myos.iso
```
:::

::: details config.sh
```bash
SYSTEM_HEADER_PROJECTS="libc kernel"
PROJECTS="libc kernel"

export MAKE=${MAKE:-make}
export HOST=${HOST:-$(./default-host.sh)}

export AR=${HOST}-ar
export AS=${HOST}-as
export CC=${HOST}-gcc

export PREFIX=/usr
export EXEC_PREFIX=$PREFIX
export BOOTDIR=/boot
export LIBDIR=$EXEC_PREFIX/lib
export INCLUDEDIR=$PREFIX/include

export CFLAGS='-O2 -g'
export CPPFLAGS=''

# Настройка кросс-компилятора для использования sysroot
export SYSROOT="$(pwd)/sysroot"
export CC="$CC --sysroot=$SYSROOT"

if echo "$HOST" | grep -Eq -- '-elf($|-)'; then
  export CC="$CC -isystem=$INCLUDEDIR"
fi
```
:::

::: details default-host.sh
```bash
#!/bin/sh
echo i686-elf
```
:::

::: details headers.sh
```bash
#!/bin/sh
set -e
. ./config.sh

mkdir -p "$SYSROOT"

for PROJECT in $SYSTEM_HEADER_PROJECTS; do
  (cd $PROJECT && DESTDIR="$SYSROOT" $MAKE install-headers)
done
```
:::

::: details iso.sh
```bash
#!/bin/sh
set -e
. ./build.sh

mkdir -p isodir
mkdir -p isodir/boot
mkdir -p isodir/boot/grub

cp sysroot/boot/myos.kernel isodir/boot/myos.kernel
cat > isodir/boot/grub/grub.cfg << EOF
menuentry "myos" {
    multiboot /boot/myos.kernel
}
EOF
grub-mkrescue -o myos.iso isodir
```
:::

::: details qemu.sh
```bash
#!/bin/sh
set -e
. ./iso.sh

qemu-system-$(./target-triplet-to-arch.sh $HOST) -cdrom myos.iso
```
:::

::: details target-triplet-to-arch.sh
```bash
#!/bin/sh
if echo "$1" | grep -Eq 'i[[:digit:]]86-'; then
  echo i386
else
  echo "$1" | grep -Eo '^[[:alnum:]_]*'
fi
```
:::

::: details .gitignore
```gitignore
*.iso
isodir
sysroot
```
:::

Не забудьте дать скриптам права для их выполнения:
```bash
chmod +x *.sh
```

## Порядок выполнения скриптов

- ./clean.sh - очищаем сборку;
- ./headers.sh - устанавливаем системные заголовки;
- ./iso.sh - собираем ISO-образ;
- ./qemu.sh - запускаем ОС через эмулятор QEMU.