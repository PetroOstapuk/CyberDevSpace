---
sidebar_position: 2
---

# Базові команди Linux

## Комбінації клавіш

1. повернути курсор на початок: `ctrl + a`.

2. курсор назад до кінця: `ctrl + e`.

## Комбінації клавіш VIM

1. відмінити: `u`
2. повторити: `ctrl + r`
3. видалити поточний символ: `x` 4.
4. видалити поточний рядок: `dd`
5. перехід на наступну сторінку: `fn + up`
6. перехід на наступну сторінку: `fn + down`
7. пошук слів: `/word` введіть, потім натисніть n, щоб продовжити пошук
8. початок рядка: `^`
9. кінець рядка: `$`
10. наступне слово: `w`
11. попереднє слово: `b`
12. видалити наступні рядки, включаючи цей: `:,$d`.
13. символ багаторазового вибору: `v`
14. блочне виділення: `ctrl + v`, натисніть d або x, щоб видалити після виділення, або натисніть c, щоб замінити
15. відступ: `<<` і `>>`

## Shell

1. Перша стрічка у файлі скрипті повинна починатись з: `#!/bin/bash`
2. Для того, щоб зробити файл виконуваним потрібно надати права на виконання: `chmod +x ./index.sh`

### Змінні

```shell
name="linux"  # декларування змінної
echo $name    # використання змінної
echo ${name}  # використовувати змінну *рекомендовано
readonly name # зробити змінну доступною лише для читання
unset name    # видалити змінні, змінні лише для читання не можна видалити
```

Змінні ``оболонки`` можна розділити на локальні змінні під поточним скриптом і змінні оточення.

```shell
# Рядок (одинарні лапки)
name='Petro'
# Рядок (подвійні лапки)
name="Petro"
```

Внутрішні символи рядка в одинарних лапках виводяться як є, тобто всередині не може бути змінних або екранованих символів.

```shell
# Одинарні лапки
name='Petro'
echo 'I am ${name}' # I am ${name}

# подвійні лапки
name='Petro'
echo "I am ${name}" # I am Petro
```



```shell
arr=("a" "b" "c") # масив
echo ${arr[0]} # "a"
echo ${arr[@]} # Вивести всі елементи масиву "a" "b" "c"
```

### Передача аргументів

```shell
echo "$1 $2 $3"
. /index.sh a b c # a b c
```

### Оператори

Арифметика в ``оболонці`` зазвичай виконується з використанням зворотних лапок з `expr``.

```shell
a=10
b=20

echo `expr $a + $b`
```

**Умовне судження

```shell
if [ $name == 'Petro' ] # Зверніть увагу, що ви повинні залишити пробіл
then
    echo "рівні"
fi
```

Доповнення: Ви можете використовувати `==` при визначенні рівності, або просто використовувати `=`.

**Логічні операції:**

```shell
name="Petro"
age=22

if [[ $name == 'Petro' && $age == 20 ]]
then
    echo "рівні"
else 
    echo "не рівні"
fi
```

### Перенаправлення виводу

```shell
echo "hello" > index.js # Перевизначити
echo "hello" >> index.js # Не перезаписувати, додати в кінець файлу
```

Є можливість перенаправлення для маскування виводу при виконанні певних скриптів

```shell
. /index.sh > /dev/null
```

## Загальні команди

Дуже прості команди не записуються.

### ls

```shell
ls 
ls -a # Приховані файли 
ls -l # Показати повну інформацію, включно з правами на читання, запис, виконання тощо.
```

Повну інформацію про файл можна переглянути за допомогою ``ls -l`` наступним чином

```shell
-rwxr-xr-x 1 root root 27776 Mar 20 2023 root.txt
```

де `- rwx r-x r-x` складається з чотирьох частин: тип файлу, дозволи власника, дозволи групи користувачів, 
до якої належить власник, і дозволи інших користувачів.

Типи файлів: 
`-` для звичайних файлів, 
`d` для каталогів і 
`l` для м'яких посилань (жорсткі посилання не позначаються спеціально).

Дозволи включають `rwx`, тобто читання, запис, виконання. Дозволи можна представити за допомогою чисел, 
read: 4, write: 2, execute: 1, тобто `r-x` відповідає `5`.

### chmod

За допомогою `ls` ви можете переглянути права доступу до файлу, а за допомогою `chmod` ви можете змінити права доступу до файлу.

```shell
chmod 777 text.txt
```

або

```shell
chmod +x test.txt # Зробити його виконуваним
```

### псевдонім(alias)

Псевдоніми для команд

```shell
alias ... = 'cd ...'
```

### grep

Для пошуку рядків

```shell
grep 'content' test.txt
-e # Звичайний пошук 
```

### Конвеєр(pipe)

Конвеєри використовуються для забезпечення зв'язку між процесами, зокрема, для отримання виводу однієї програми 
як вхідних даних для іншої

```shell
cat test.txt | wc # Отримати вміст test.txt за допомогою cat і використати його як вхідні дані для команди wc
```

### sudo

Тимчасово надати права користувача `root` звичайному користувачеві

```shell
sudo ls
```

### ssh

```shell
ssh user@host
-p # Вкажіть номер порту, за замовчуванням ssh порт 22
ssh host # Увійдіть від імені користувача root
```

Альтернативно, `~/.ssh/config` використовується для зберігання конфігурації, пов'язаної з сервером, наприклад

```shell
# ssh config
#
#
host myserver
    hostName 111.111.111.111
    user root
    port 2045
```

Для швидкого підключення до сервера нам просто потрібно використовувати `ssh myserver`

### ssh-keygen

Використовується для створення ключа, який зберігається в `~/.ssh/`.

```shell
ssh-keygen
```

### whoami

```shell
whoami # Вивести моє ім'я
```

### who

```shell
who # Вивести інформацію про всіх зареєстрованих користувачів на поточному хості
```



### useradd

Для додавання користувача також працює команда `adduser`, але між ними є невелика різниця

```shell
useradd akara
```

### passwd

Зміна пароля користувача

```shell
passwd Petro
```

### export

Для встановлення змінних оточення використовується команда ``export`` у конфігураційному файлі 
``/etc/profile`` або ``~/.bashrc``.

```shell
# /etc/profile
export name="Petro"
```

### wc

Використовується для підрахунку кількості слів, рядків тощо у файлі

```shell
wc -l test.txt # експортувати кількість рядків
```

### man

Для запиту використання команди

```shell
man ls
```

### whereis

Використовується для пошуку файлу, часто використовується для пошуку розташування конфігураційного файлу або 
виконуваного файлу

```shell
whereis profile
# profile: /etc/profile.d /etc/profile
```

### Where

Також використовується для пошуку файлів, зазвичай для пошуку виконуваних файлів.

``` shell
where bash
```

### ln

Використовується для створення посилань, які поділяються на м'які (символічні) та жорсткі

```shell
ln /bin/bash sh # За замовчуванням створюються жорсткі посилання
ln -s /bin/bash sh # М'які посилання
```

М'які посилання можна уявити як ярлики у Windows; жорсткі посилання можна уявити як файл з іншим шляхом.

### tar

Використовується для пакування та стиснення файлів.

Ми часто бачимо файли типу: `*.tar.gz`, `*.tar.bz2`, `*.tar.xz`. Всі вони запаковані в `tar`, різниця в суфіксі 
пояснюється різними алгоритмами стиснення.

Ступінь стиснення: `gz` < `bz2` < `xz`.

Швидкість стиснення: `gz` > `bz2` > `xz`

** Стиснення файлів:**

```shell
# Кілька способів
tar -zcvf filename.tar.gz ФАЙЛИ # z означає gz
tar -jcvf ім'я файлу.tar.bz2 ФАЙЛИ # j для bz2
tar -Jcvf ім'я_файлу.tar.xz ФАЙЛИ # J для xz
```

**Розархівувати файл:**

```shell
tar -vx -f ім'я файлу
# або
tar -vxf ім'я файлу
```

### crontab

Завдання з таймером.

``` shell
crontab -l # Перегляд завдань з таймером
```

### clear

Очистити вивід

## Загальні конфігураційні файли

### Конфігурація ядра

`/etc/profile`: конфігурація на рівні системи

`~/.bashrc`: конфігурація на рівні користувача

Коли ми змінюємо конфігурацію, ми робимо її активною за допомогою `source ~/.bashrc`.

### Інформація про користувача

`/etc/passwd`: інформація про користувача (ID користувача, ID групи тощо)

`/etc/group`: інформація про групу користувача

`/etc/shadow`: пароль користувача (зашифроване)

`/etc/sudoers`: sudo-привілеї користувача



### ssh

Особисті файли, пов'язані з `ssh`, знаходяться у каталозі `~/.ssh` і включають особистий приватний ключ, 
відкритий ключ, файл конфігурації SSH `config`, `authorized_keys`, `known_hosts`.

Зазвичай ми зберігаємо відкритий ключ власного комп'ютера в `authorized_keys` на сервері, після чого нам 
не потрібно використовувати пароль для підключення до сервера.

Після успішного підключення до сервера у файлі `known_hosts` нашого комп'ютера також буде записано 
відкритий ключ сервера.

### Інше

`~/.bash_history`: записує історію командних рядків