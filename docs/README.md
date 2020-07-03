[@devim-front/storage](README.md)

# @devim-front/storage

## Index

### Classes

* [Service](classes/service.md)

### Type aliases

* [Field](README.md#markdown-header-field)
* [Fields](README.md#markdown-header-fields)
* [Values](README.md#markdown-header-values)

## Type aliases

### <a id="markdown-header-field" name="markdown-header-field"></a>  Field

Ƭ **Field**: *object*

Коллекция методов управления конкретного ключа из хранилища.

#### Type declaration:

* **get**(): *function*

  * (): *T | undefined*

* **has**(): *function*

  * (): *boolean*

* **set**(): *function*

  * (`value`: T | undefined): *void*

___

### <a id="markdown-header-fields" name="markdown-header-fields"></a>  Fields

Ƭ **Fields**: *Record‹string, [Field](README.md#markdown-header-field)‹any››*

Коллекция свойств хранилища.

___

### <a id="markdown-header-values" name="markdown-header-values"></a>  Values

Ƭ **Values**: *Record‹string, any›*

Коллекция значений.
