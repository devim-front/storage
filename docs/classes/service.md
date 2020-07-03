[@devim-front/storage](../README.md) › [Service](service.md)

# Class: Service ‹**E**›

Предоставляет механизм управления значениями, хранящимися в localStorage.
Если в проекте используется этот сервис, важно, чтобы все изменения в
localStorage были сделаны через него, так как в противном случае будет
происходить рассинхронизация между состоянием сервиса и хранилищем.

## Type parameters

▪ **E**: *Events*

## Hierarchy

* StrictService

  ↳ **Service**

## Index

### Constructors

* [constructor](service.md#markdown-header-constructor)

### Properties

* [instance](service.md#markdown-header-static-protected-instance)

### Accessors

* [isExists](service.md#markdown-header-static-protected-isexists)

### Methods

* [clear](service.md#markdown-header-clear)
* [dispose](service.md#markdown-header-dispose)
* [emit](service.md#markdown-header-protected-emit)
* [field](service.md#markdown-header-field)
* [flush](service.md#markdown-header-flush)
* [get](service.md#markdown-header-get)
* [has](service.md#markdown-header-has)
* [merge](service.md#markdown-header-merge)
* [off](service.md#markdown-header-off)
* [on](service.md#markdown-header-on)
* [reset](service.md#markdown-header-reset)
* [set](service.md#markdown-header-set)
* [create](service.md#markdown-header-static-protected-create)
* [delete](service.md#markdown-header-static-delete)
* [get](service.md#markdown-header-static-get)
* [init](service.md#markdown-header-static-init)

## Constructors

### <a id="markdown-header-constructor" name="markdown-header-constructor"></a>  constructor

\+ **new Service**(`id`: string): *[Service](service.md)*

*Overrides void*

Создает экземпляр сервиса с указанным уникальным идентификатором.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | Уникальный идентификатор проекта, используюшего этот сервис. Так как несколько сайтов могут находиться на одном домене, то могут возникать ситации, когда значения localStorage одного сайта перезаписывают значения другого. Чтобы избежать этой ситуации, используется идентификатор.  |

**Returns:** *[Service](service.md)*

## Properties

### <a id="markdown-header-static-protected-instance" name="markdown-header-static-protected-instance"></a> `Static` `Protected` instance

▪ **instance**: *any*

*Inherited from [Service](service.md).[instance](service.md#markdown-header-static-protected-instance)*

Экземпляр сервиса.

## Accessors

### <a id="markdown-header-static-protected-isexists" name="markdown-header-static-protected-isexists"></a> `Static` `Protected` isExists

• **get isExists**(): *boolean*

*Inherited from [Service](service.md).[isExists](service.md#markdown-header-static-protected-isexists)*

Указывает, что экземпляр данного класса уже был создан.

**Returns:** *boolean*

## Methods

### <a id="markdown-header-clear" name="markdown-header-clear"></a>  clear

▸ **clear**(): *void*

Удаляет из сервиса все значения. Следует помнить, что для оптимизации
реальная запись в localStorage происходит не в текущем, а следующем
цикле выполнения приложения. Если после обновления значений программа
будет принудительно завершена, то изменения не сохранятся. Чтобы избежать
этого, используйте метод flush.

**Returns:** *void*

___

### <a id="markdown-header-dispose" name="markdown-header-dispose"></a>  dispose

▸ **dispose**(): *void*

*Inherited from [Service](service.md).[dispose](service.md#markdown-header-dispose)*

*Overrides void*

Освобождает все занятые экземпляром сервиса ресурсы, подготавливая его к
удалению. Для строго или ленивого сервиса прямой вызов этого метода
запрещён и приведет к ошибке, поскольку это может создать неоднозначность
в коде. Используйте вместо него статический метод delete.

**Returns:** *void*

___

### <a id="markdown-header-protected-emit" name="markdown-header-protected-emit"></a> `Protected` emit

▸ **emit**‹**T**›(`event`: T, ...`args`: Parameters‹E[T]›): *void*

*Inherited from [Service](service.md).[emit](service.md#markdown-header-protected-emit)*

Вызывает указанное событие, передавая аргументы в его обработчики.

**Type parameters:**

▪ **T**: *keyof E*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | T | Событие. |
`...args` | Parameters‹E[T]› | Аргументы, передаваемые в обработчики.  |

**Returns:** *void*

___

### <a id="markdown-header-field" name="markdown-header-field"></a>  field

▸ **field**‹**T**›(`key`: string): *object*

Возвращает коллекцию функций для управления значением с указанным ключом
(get, has и set). Все функции коллекции имеют закрепелённый контекст
выполнения.

**Type parameters:**

▪ **T**

Тип значения с указанным ключом.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | Ключ значения.  |

**Returns:** *object*

* **get**(): *function*

  * (): *T | undefined*

* **has**(): *function*

  * (): *boolean*

* **set**(): *function*

  * (`value`: T | undefined): *void*

___

### <a id="markdown-header-flush" name="markdown-header-flush"></a>  flush

▸ **flush**(): *void*

Немедленно записывает значения из сервиса в localStorage. Служит для того,
чтобы избежать рассинхронизации localStorage и сервиса при принудительном
завершении программы.

**Returns:** *void*

___

### <a id="markdown-header-get" name="markdown-header-get"></a>  get

▸ **get**(`key`: string): *any*

Возвращает значение, соответствующее указанному ключу. Если данный ключ
не существует, будет возвращено undefined.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | Ключ.  |

**Returns:** *any*

___

### <a id="markdown-header-has" name="markdown-header-has"></a>  has

▸ **has**(`key`: string): *boolean*

Возвращает true, если значение по указанному ключу существует (не равно
undefined).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | Кюч.  |

**Returns:** *boolean*

___

### <a id="markdown-header-merge" name="markdown-header-merge"></a>  merge

▸ **merge**(): *void*

Производит принудительное добавление значений из localStorage в сервис.
Если в сервисе пристутствуют несохранённые изменения, то они не будут
удалены. Данный метод следует использовать лишь тогда, когда по какой-то
вы собираетесь повторно считать все значения из localStorage, но не хотите
терять текущие изменения в коллекции значений. При стандартном
использовании сервиса нужды в данном методе не возникает.

**Returns:** *void*

___

### <a id="markdown-header-off" name="markdown-header-off"></a>  off

▸ **off**‹**T**›(`event`: T, `handler`: E[T]): *void*

*Inherited from [Service](service.md).[off](service.md#markdown-header-off)*

Удаляет указанный обработчик события.

**Type parameters:**

▪ **T**: *keyof E*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | T | Событие. |
`handler` | E[T] | Обработчик.  |

**Returns:** *void*

___

### <a id="markdown-header-on" name="markdown-header-on"></a>  on

▸ **on**‹**T**›(`event`: T, `handler`: E[T]): *void*

*Inherited from [Service](service.md).[on](service.md#markdown-header-on)*

Добавляет обработчик указанному событию.

**Type parameters:**

▪ **T**: *keyof E*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | T | Событие. |
`handler` | E[T] | Обработчик.  |

**Returns:** *void*

___

### <a id="markdown-header-reset" name="markdown-header-reset"></a>  reset

▸ **reset**(): *void*

Производит принудительную замену всех значений сервиса содержимым
localStorage. Все несохранённые изменения будет потеряны. При нормальном
использовании сервиса нужды в данном методе не возникает.

**Returns:** *void*

___

### <a id="markdown-header-set" name="markdown-header-set"></a>  set

▸ **set**(`key`: string, `value`: any): *void*

Присваивает новое значение указанному ключу. Следует помнить, что для
оптимизации реальная запись в localStorage происходит не в текущем, а
следующем цикле выполнения приложения. Если после обновления значений
программа будет принудительно завершена, то изменения не сохранятся. Чтобы
избежать этого, используйте метод flush.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | Ключ. |
`value` | any | Новое значение.  |

**Returns:** *void*

___

### <a id="markdown-header-static-protected-create" name="markdown-header-static-protected-create"></a> `Static` `Protected` create

▸ **create**‹**T**›(...`args`: ConstructorParameters‹T›): *void*

*Inherited from [Service](service.md).[create](service.md#markdown-header-static-protected-create)*

Создает экземпляр сервиса и сохраняет его. Для создания экземпляра класса
следует использовать именно его; вызов оператора new приводит к ошибке.

**Type parameters:**

▪ **T**: *typeof SingleService*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...args` | ConstructorParameters‹T› | Аргументы конструктора.  |

**Returns:** *void*

___

### <a id="markdown-header-static-delete" name="markdown-header-static-delete"></a> `Static` delete

▸ **delete**(): *void*

*Inherited from [Service](service.md).[delete](service.md#markdown-header-static-delete)*

Удаляет существующий экземпляр сервиса, освобождая все занятые им ресурсы.

**Returns:** *void*

___

### <a id="markdown-header-static-get" name="markdown-header-static-get"></a> `Static` get

▸ **get**‹**T**›(`this`: T): *InstanceType‹T›*

*Inherited from [Service](service.md).[get](service.md#markdown-header-static-get)*

*Overrides void*

Возвращает экземпляр сервиса. Если сервис ещё не был инициализирован
методом init, вызов get приведёт к ошибке.

**Type parameters:**

▪ **T**: *typeof SingleService*

**Parameters:**

Name | Type |
------ | ------ |
`this` | T |

**Returns:** *InstanceType‹T›*

___

### <a id="markdown-header-static-init" name="markdown-header-static-init"></a> `Static` init

▸ **init**(...`args`: any[]): *void*

*Inherited from [Service](service.md).[init](service.md#markdown-header-static-init)*

*Overrides void*

Инициализирует экземпляр сервиса. Аргументы, указанные при вызове, будут
переданы в конструктор класса. Если вызвать метод инициализации повторно с
теми же аргументами, то новый экземпляр создан не будет. Если же при
повторном вызове метода аргументы изменятся, то предыдущий экземпляр
сервиса будет уничтожен через метод delete и создан новый. Чтобы
пересоздать сервис с теми же аргументами, используйте метод delete, а
уж затем init.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...args` | any[] | Аргументы, которые будут переданы в конструктор.  |

**Returns:** *void*
