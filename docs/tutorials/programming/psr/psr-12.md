---
sidebar_position: 2
---

# PSR-12 Розширений стандарт стилю кодування

Цей розділ стандарту містить елементи кодування, які слід вважати стандартними та необхідними для забезпечення
високого рівня технічної взаємодії між спільним PHP-кодом.

Ключові слова
«ОБОВ'ЯЗКОВО», «НЕ ПРИПУСТИМО»,
«ВИМАГАЄТЬСЯ»,
«ПОВИНЕН», «ЗАБОРОНЯЄТЬСЯ»,
«РЕКОМЕНДОВАНО», «НЕ РЕКОМЕНДОВАНО»,
«СЛІДУЄ», «МОЖЛИВО» та «ОПЦІОНАЛЬНО»
у цьому документі слід трактувати так, як описано у [RFC 2119](http://www.ietf.org/rfc/rfc2119.txt).

## 1. Огляд

Ця специфікація доповнює, розширює і замінює PSR-2, посібник зі стилів кодування, і вимагає дотримання PSR-1, 
базового стандарту кодування.

Як і PSR-2, метою цієї специфікації є зменшення зусиль при читанні коду від різних авторів. Це досягається шляхом 
перерахування загального набору правил і очікувань щодо форматування PHP-коду. Цей PSR має на меті забезпечити 
певний спосіб, який можуть реалізувати інструменти стилів кодування, проєкти можуть декларувати його дотримання, 
а розробники можуть легко взаємодіяти між різними проєктами. Коли різні автори співпрацюють над кількома проєктами, 
корисно мати один набір настанов, який можна використовувати у всіх цих проєктах. Таким чином, перевага цього посібника 
полягає не в самих правилах, а в тому, що він дає змогу обмінюватися цими правилами.

PSR-2 було прийнято у 2012 році, і з того часу до PHP було внесено низку змін, які вплинули на настанови щодо 
стилю кодування. Хоча PSR-2 дуже повно описує функціональність PHP, яка існувала на момент написання, 
нова функціональність є дуже відкритою для інтерпретації. Тому метою цього PSR є роз'яснення змісту PSR-2 у більш 
сучасному контексті з урахуванням нової функціональності, а також виправлення помилок, що містяться у PSR-2, 
з урахуванням нових можливостей.

### Попередні мовні версії

У цьому документі будь-які інструкції МОЖНА ігнорувати, якщо вони не існують у версіях PHP, що підтримуються вашим проєктом.

### Приклад

Цей приклад охоплює деякі з наведених нижче правил у вигляді короткого огляду:

```php
<?php

declare(strict_types=1);

namespace Vendor\Package;

use Vendor\Package\{ClassA as A, ClassB, ClassC as C};
use Vendor\Package\SomeNamespace\ClassD as D;

use function Vendor\Package\{functionA, functionB, functionC};

use const Vendor\Package\{ConstantA, ConstantB, ConstantC};

class Foo extends Bar implements FooInterface
{
    public function sampleFunction(int $a, int $b = null): array
    {
        if ($a === $b) {
            bar();
        } elseif ($a > $b) {
            $foo->bar($arg1);
        } else {
            BazClass::bar($arg2, $arg3);
        }
    }

    final public static function bar()
    {
        // тіло методу
    }
}
```

## 2. Загальні відомості

### 2.1 Базовий стандарт кодування

ОБОВ'ЯЗКОВО щоб код відповідав всім правилам, викладеним у PSR-1.

Термін "StudlyCaps" у PSR-1 ОБОВ'ЯЗКОВО інтерпретувати як PascalCase, де перша буква кожного слова пишеться з великої 
літери, включаючи найпершу.

### 2.2 Файли

Всі PHP-файли ОБОВ'ЯЗКОВО щоб використовували тільки закінчення рядка Unix LF (переведення рядка).

Всі PHP-файли ОБОВ'ЯЗКОВО щоб закінчуватися непустим рядком, що закінчується одним символом LF.

Тег що закриває ?> ОБОВ'ЯЗКОВО щоб був опущений у файлах, що містять лише PHP.

### 2.3 Рядки

НЕ ПРИПУСТИМО жорсткого обмеження на довжину рядка.

М'яке обмеження на довжину рядка ОБОВ'ЯЗКОВО щоб становило 120 символів.

Рядки НЕ РЕКОМЕНДОВАНО робити довшими за 80 символів; довші рядки РЕКОМЕНДОВАНО розбивати на декілька наступних рядків 
не більше 80 символів кожний.

В кінці рядків НЕ ПРИПУСТИМІ пробіли.

Порожні рядки МОЖНА додавати для покращення читабельності та для позначення пов'язаних блоків коду, 
за винятком випадків, коли це явно заборонено.

У рядку НЕ ПРИПУСТИМО більше одного оператора.

### 2.4 Відступи

У коді має ОБОВ'ЯЗКОВО використовуватись відступ у 4 пробіли для кожного рівня відступу, і НЕ ПРИПУСТИМО використовувати 
табуляцію для відступів.

### 2.5 Ключові слова та типи

Всі зарезервовані PHP ключові слова і типи [1](https://www.php.net/manual/en/reserved.keywords.php)
[2](https://www.php.net/manual/en/reserved.other-reserved-words.php) ОБОВ'ЯЗКОВО писати в нижньому регістрі.

Будь-які нові типи й ключові слова, додані до майбутніх версій PHP, ОБОВ'ЯЗКОВО що були в нижньому регістрі.

ОБОВ'ЯЗКОВО використовувати короткі форми ключових слів типів, наприклад, bool замість boolean, int замість integer і т.д.

## 3. Оголошення операторів, простору імен та операторів імпорту

Заголовок PHP-файлу може складатися з декількох різних блоків. Якщо такі блоки є, кожен з них ОБОВ'ЯЗКОВО 
відокремити одним порожнім рядком і НЕ ПРИПУСТИМО, щоб містив порожнього рядка. Кожен блок ОБОВ'ЯЗКОВО розташовувати 
в порядку, наведеному нижче, хоча блоки, які не мають відношення до справи, можуть бути пропущені.

* Тег що відкриває `<?php`.
* Блок docblock на рівні файлу.
* Один або декілька інструкцій declare.
* Оголошення простору імен файлу.
* Один або декілька операторів імпорту `use` на основі класів.
* Один або декілька операторів імпорту `use` на основі функцій.
* Один або декілька операторів імпорту `use` на основі констант.
* Решта коду у файлі.

Якщо файл містить HTML і PHP, будь-який з перерахованих вище розділів все одно може бути використаний. 
У такому випадку вони ОБОВ'ЯЗКОВО повинні бути присутніми у верхній частині файлу, навіть якщо решта коду 
складається з закриваючого тегу PHP, а потім суміші HTML і PHP.

Якщо тег `<?php` знаходиться в першому рядку файлу, він ОБОВ'ЯЗКОВО повинен бути в окремому рядку, без інших 
операторів, якщо тільки це не файл, що містить розмітку, яка не є відкриваючим і закриваючим тегами PHP.

Оператори імпорту ОБОВ'ЯЗКОВО не повинен починатися зі зворотної косої риски, оскільки вони завжди повинні бути 
повністю визначені.

Наступний приклад ілюструє повний список усіх блоків:

```php
<?php

/**
 * This file contains an example of coding styles.
 */

declare(strict_types=1);

namespace Vendor\Package;

use Vendor\Package\{ClassA as A, ClassB, ClassC as C};
use Vendor\Package\SomeNamespace\ClassD as D;
use Vendor\Package\AnotherNamespace\ClassE as E;

use function Vendor\Package\{functionA, functionB, functionC};
use function Another\Vendor\functionD;

use const Vendor\Package\{CONSTANT_A, CONSTANT_B, CONSTANT_C};
use const Another\Vendor\CONSTANT_D;

/**
 * FooBar is an example class.
 */
class FooBar
{
    // ... додатковий PHP код ...
}
```

НЕ ПРИПУСТИМО використовувати складені простори імен з глибиною понад два використовувати. 
Тому нижче наведено максимальну глибину складених просторів:
```php
<?php

use Vendor\Package\SomeNamespace\{
    SubnamespaceOne\ClassA,
    SubnamespaceOne\ClassB,
    SubnamespaceTwo\ClassY,
    ClassZ,
};
```

І наступне не буде дозволено:

```php
<?php

use Vendor\Package\SomeNamespace\{
    SubnamespaceOne\AnotherNamespace\ClassA,
    SubnamespaceOne\ClassB,
    ClassZ,
};
```

Якщо ви бажаєте оголосити строгі типи у файлах, що містять розмітку поза тегами відкриття і закриття PHP, 
оголошення ОБОВ'ЯЗКОВО повинно бути в першому рядку файлу і включати тег відкриття PHP, оголошення 
строгих типів і тег закриття.

Наприклад:

```php
<?php declare(strict_types=1) ?>
<html>
<body>
    <?php
        // ... додатковий PHP код ...
    ?>
</body>
</html>
```

Оператори declare ОБОВ'ЯЗКОВО повинні не містити пробілів і ОБОВ'ЯЗКОВО бути точно оголошені (strict_types=1) 
(з необов'язковим термінатором у вигляді крапки з комою).

Блокові інструкції declare дозволені й ОБОВ'ЯЗКОВО повинні бути відформатовані як показано нижче. 
Зверніть увагу на розташування дужок та інтервалів:

```php
declare(ticks=1) {
    // деякий код
}
```

