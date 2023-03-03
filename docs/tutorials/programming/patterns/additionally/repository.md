---
sidebar_position: 2
---

# Репозиторій (Repository)

## Призначення

Посередник між рівнями області визначення (сховища) та розподілу даних. Використовує інтерфейс, схожий на колекції,
для доступу до об'єктів області визначення. Репозиторій інкапсулює набір об'єктів, що зберігаються у сховищі даних,
і операції, що виконуються над ними, забезпечуючи більш об'єктноорієнтоване подання реальних даних. Репозиторій 
також має на меті досягнення повного поділу та односторонньої залежності між рівнями області визначення та 
розподілу даних.

## Приклади

Doctrine 2 ORM: у ній є Repository, який є сполучною ланкою між Entity та DBAL і містить методи для отримання об'єктів.

Laravel Framework

## Діаграма UML

![ UML](./images/repository.png)

## Код
Ви можете знайти цей код на [GitHub](https://github.com/PetroOstapuk/DesignPatternsPHP/tree/main/More/Repository)

```php title="Post.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\More\Repository\Domain;

class Post
{
    public static function draft(PostId $id, string $title, string $text): Post
    {
        return new self(
            $id,
            PostStatus::fromString(PostStatus::STATE_DRAFT),
            $title,
            $text
        );
    }

    public static function fromState(array $state): Post
    {
        return new self(
            PostId::fromInt($state['id']),
            PostStatus::fromInt($state['statusId']),
            $state['title'],
            $state['text']
        );
    }

    private function __construct(
        private PostId $id,
        private PostStatus $status,
        private string $title,
        private string $text
    ) {
    }

    public function getId(): PostId
    {
        return $this->id;
    }

    public function getStatus(): PostStatus
    {
        return $this->status;
    }

    public function getText(): string
    {
        return $this->text;
    }

    public function getTitle(): string
    {
        return $this->title;
    }
}
```

```php title="PostId.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\More\Repository\Domain;

use InvalidArgumentException;

/**
 * This is a perfect example of a value object that is identifiable by it's value alone and
 * is guaranteed to be valid each time an instance is created. Another important property of value objects
 * is immutability.
 *
 * Notice also the use of a named constructor (fromInt) which adds a little context when creating an instance.
 */
class PostId
{
    public static function fromInt(int $id): PostId
    {
        self::ensureIsValid($id);

        return new self($id);
    }

    private function __construct(private int $id)
    {
    }

    public function toInt(): int
    {
        return $this->id;
    }

    private static function ensureIsValid(int $id)
    {
        if ($id <= 0) {
            throw new InvalidArgumentException('Invalid PostId given');
        }
    }
}
```

```php title="PostStatus.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\More\Repository\Domain;

use InvalidArgumentException;

/**
 * Like PostId, this is a value object which holds the value of the current status of a Post. It can be constructed
 * either from a string or int and is able to validate itself. An instance can then be converted back to int or string.
 */
class PostStatus
{
    public const STATE_DRAFT_ID = 1;
    public const STATE_PUBLISHED_ID = 2;

    public const STATE_DRAFT = 'draft';
    public const STATE_PUBLISHED = 'published';

    private static array $validStates = [
        self::STATE_DRAFT_ID => self::STATE_DRAFT,
        self::STATE_PUBLISHED_ID => self::STATE_PUBLISHED,
    ];

    public static function fromInt(int $statusId)
    {
        self::ensureIsValidId($statusId);

        return new self($statusId, self::$validStates[$statusId]);
    }

    public static function fromString(string $status)
    {
        self::ensureIsValidName($status);
        $state = array_search($status, self::$validStates);

        if ($state === false) {
            throw new InvalidArgumentException('Invalid state given!');
        }

        return new self($state, $status);
    }

    private function __construct(private int $id, private string $name)
    {
    }

    public function toInt(): int
    {
        return $this->id;
    }

    /**
     * there is a reason that I avoid using __toString() as it operates outside of the stack in PHP
     * and is therefore not able to operate well with exceptions
     */
    public function toString(): string
    {
        return $this->name;
    }

    private static function ensureIsValidId(int $status)
    {
        if (!in_array($status, array_keys(self::$validStates), true)) {
            throw new InvalidArgumentException('Invalid status id given');
        }
    }


    private static function ensureIsValidName(string $status)
    {
        if (!in_array($status, self::$validStates, true)) {
            throw new InvalidArgumentException('Invalid status name given');
        }
    }
}
```

```php title="PostRepository.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\More\Repository;

use OutOfBoundsException;
use DesignPatterns\More\Repository\Domain\Post;
use DesignPatterns\More\Repository\Domain\PostId;

/**
 * This class is situated between Entity layer (class Post) and access object layer (Persistence).
 *
 * Repository encapsulates the set of objects persisted in a data store and the operations performed over them
 * providing a more object-oriented view of the persistence layer
 *
 * Repository also supports the objective of achieving a clean separation and one-way dependency
 * between the domain and data mapping layers
 */
class PostRepository
{
    public function __construct(private Persistence $persistence)
    {
    }

    public function generateId(): PostId
    {
        return PostId::fromInt($this->persistence->generateId());
    }

    public function findById(PostId $id): Post
    {
        try {
            $arrayData = $this->persistence->retrieve($id->toInt());
        } catch (OutOfBoundsException $e) {
            throw new OutOfBoundsException(sprintf('Post with id %d does not exist', $id->toInt()), 0, $e);
        }

        return Post::fromState($arrayData);
    }

    public function save(Post $post)
    {
        $this->persistence->persist([
            'id' => $post->getId()->toInt(),
            'statusId' => $post->getStatus()->toInt(),
            'text' => $post->getText(),
            'title' => $post->getTitle(),
        ]);
    }
}
```

```php title="Persistence.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\More\Repository;

interface Persistence
{
    public function generateId(): int;

    public function persist(array $data);

    public function retrieve(int $id): array;

    public function delete(int $id);
}
```

```php title="InMemoryPersistence.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\More\Repository;

use OutOfBoundsException;

class InMemoryPersistence implements Persistence
{
    private array $data = [];
    private int $lastId = 0;

    public function generateId(): int
    {
        $this->lastId++;

        return $this->lastId;
    }

    public function persist(array $data)
    {
        $this->data[$this->lastId] = $data;
    }

    public function retrieve(int $id): array
    {
        if (!isset($this->data[$id])) {
            throw new OutOfBoundsException(sprintf('No data found for ID %d', $id));
        }

        return $this->data[$id];
    }

    public function delete(int $id)
    {
        if (!isset($this->data[$id])) {
            throw new OutOfBoundsException(sprintf('No data found for ID %d', $id));
        }

        unset($this->data[$id]);
    }
}
```

## Тест

```php title="Tests/PostRepositoryTest.php"
<?php

declare(strict_types=1);

namespace DesignPatterns\More\Repository\Tests;

use OutOfBoundsException;
use DesignPatterns\More\Repository\Domain\PostId;
use DesignPatterns\More\Repository\Domain\PostStatus;
use DesignPatterns\More\Repository\InMemoryPersistence;
use DesignPatterns\More\Repository\Domain\Post;
use DesignPatterns\More\Repository\PostRepository;
use PHPUnit\Framework\TestCase;

class PostRepositoryTest extends TestCase
{
    private PostRepository $repository;

    protected function setUp(): void
    {
        $this->repository = new PostRepository(new InMemoryPersistence());
    }

    public function testCanGenerateId()
    {
        $this->assertEquals(1, $this->repository->generateId()->toInt());
    }

    public function testThrowsExceptionWhenTryingToFindPostWhichDoesNotExist()
    {
        $this->expectException(OutOfBoundsException::class);
        $this->expectExceptionMessage('Post with id 42 does not exist');

        $this->repository->findById(PostId::fromInt(42));
    }

    public function testCanPersistPostDraft()
    {
        $postId = $this->repository->generateId();
        $post = Post::draft($postId, 'Repository Pattern', 'Design Patterns PHP');
        $this->repository->save($post);

        $this->repository->findById($postId);

        $this->assertEquals($postId, $this->repository->findById($postId)->getId());
        $this->assertEquals(PostStatus::STATE_DRAFT, $post->getStatus()->toString());
    }
}
```