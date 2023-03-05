---
sidebar_position: 4
---

# 4. Перетворювач даних (Data Mapper)

## Призначення

Перетворювач Даних - це патерн, який виступає в ролі посередника для двосторонньої передачі між постійним 
сховищем даних (часто, реляційної бази даних) та подання даних у пам’яті (шар домену, що вже завантажено 
і використовується для логічної обробки). Мета патерну в тому, щоб тримати подання даних у пам’яті та постійне 
сховище даних незалежними один від одного і від самого перетворювача даних. Шар складається з одного або більше 
mapper-а (або об'єктів доступу до даних), відповідальних за передачу даних. Реалізації mapper-ів різняться по 
призначення. Загальні mapper-и можуть обробляти всілякі типи сутностей доменів, а виділені mapper-и буде 
обробляти один або кілька конкретних типів.

Ключовим моментом цього патерну, на відміну від Активного Запису (Active Records) є те, що модель даних слідує 
Принципу єдиної відповідальності SOLID.

## Приклади

DB Object Relational Mapper (ORM): Doctrine2 використовує DAO під назвою «EntityRepository»

## Діаграма UML

![Data Mapper UML](./images/data_mapper.png)

## Код

Ви можете знайти цей код на [GitHub](https://github.com/PetroOstapuk/DesignPatternsPHP/tree/main/Structural/DataMapper)

```php title="User.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Structural\DataMapper;

class User
{
    public static function fromState(array $state): User
    {
        // validate state before accessing keys!

        return new self(
            $state['username'],
            $state['email']
        );
    }

    public function __construct(private string $username, private string $email)
    {
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function getEmail(): string
    {
        return $this->email;
    }
}
```

```php title="UserMapper.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Structural\DataMapper;

use InvalidArgumentException;

class UserMapper
{
    public function __construct(private StorageAdapter $adapter)
    {
    }

    /**
     * finds a user from storage based on ID and returns a User object located
     * in memory. Normally this kind of logic will be implemented using the Repository pattern.
     * However the important part is in mapRowToUser() below, that will create a business object from the
     * data fetched from storage
     */
    public function findById(int $id): User
    {
        $result = $this->adapter->find($id);

        if ($result === null) {
            throw new InvalidArgumentException("User #$id not found");
        }

        return $this->mapRowToUser($result);
    }

    private function mapRowToUser(array $row): User
    {
        return User::fromState($row);
    }
}
```

```php title="StorageAdapter.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Structural\DataMapper;

class StorageAdapter
{
    public function __construct(private array $data)
    {
    }

    /**
     * @return array|null
     */
    public function find(int $id)
    {
        if (isset($this->data[$id])) {
            return $this->data[$id];
        }

        return null;
    }
}
```

## Тест

```php title="Tests/DataMapperTest.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\Structural\DataMapper\Tests;

use InvalidArgumentException;
use DesignPatterns\Structural\DataMapper\StorageAdapter;
use DesignPatterns\Structural\DataMapper\User;
use DesignPatterns\Structural\DataMapper\UserMapper;
use PHPUnit\Framework\TestCase;

class DataMapperTest extends TestCase
{
    public function testCanMapUserFromStorage()
    {
        $storage = new StorageAdapter([1 => ['username' => 'domnikl', 'email' => 'liebler.dominik@gmail.com']]);
        $mapper = new UserMapper($storage);

        $user = $mapper->findById(1);

        $this->assertInstanceOf(User::class, $user);
    }

    public function testWillNotMapInvalidData()
    {
        $this->expectException(InvalidArgumentException::class);

        $storage = new StorageAdapter([]);
        $mapper = new UserMapper($storage);

        $mapper->findById(1);
    }
}
```