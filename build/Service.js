"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
var service_1 = require("@devim-front/service");
/**
 * Предоставляет механизм управления значениями, хранящимися в localStorage.
 * Если в проекте используется этот сервис, важно, чтобы все изменения в
 * localStorage были сделаны через него, так как в противном случае будет
 * происходить рассинхронизация между состоянием сервиса и хранилищем.
 */
var Service = /** @class */ (function (_super) {
    __extends(Service, _super);
    /**
     * Создает экземпляр сервиса с указанным уникальным идентификатором.
     *
     * @param id Уникальный идентификатор проекта, используюшего этот сервис.
     * Так как несколько сайтов могут находиться на одном домене, то могут
     * возникать ситации, когда значения localStorage одного сайта перезаписывают
     * значения другого. Чтобы избежать этой ситуации, используется идентификатор.
     */
    function Service(id) {
        var _this = _super.call(this) || this;
        /**
         * Коллекция ключей, которые были изменены в текущем цикле выполнения
         * приложения. После сохранения значений в localStorage эта коллекция
         * должна быть очищена.
         */
        _this.changed = new Map();
        /**
         * Коллекция значений, созданных методом field.
         */
        _this.fields = {};
        _this.id = id;
        return _this;
    }
    /**
     * Возвращает коллекцию значений, считанную из localStorage.
     */
    Service.prototype.readValues = function () {
        if (typeof window === 'undefined') {
            return {};
        }
        var text = window.localStorage.getItem(this.id) || '{}';
        return JSON.parse(text);
    };
    /**
     * Сериализует и записывает указанную коллекцию значений в localStorage.
     *
     * @param values Коллекция значений.
     */
    Service.prototype.saveValues = function (values) {
        if (typeof window === 'undefined') {
            return;
        }
        var text = JSON.stringify(values);
        window.localStorage.setItem(this.id, text);
    };
    Object.defineProperty(Service.prototype, "values", {
        /**
         * Коллекция всех значений, содержащихся в сервисе, сгруппированная по их
         * ключам. Содержимое коллекции может отличаться от того, что находится
         * в localStorage, так что при записи значений в коллекцию следует
         * производить синхронизацию.
         */
        get: function () {
            if (this.valuesCache == null) {
                this.valuesCache = this.readValues();
            }
            return this.valuesCache;
        },
        /**
         * Коллекция всех значений, содержащихся в сервисе, сгруппированная по их
         * ключам. Содержимое коллекции может отличаться от того, что находится
         * в localStorage, так что при записи значений в коллекцию следует
         * производить синхронизацию.
         */
        set: function (values) {
            this.valuesCache = values;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Присваивает новое значение указанному ключу. Следует помнить, что для
     * оптимизации реальная запись в localStorage происходит не в текущем, а
     * следующем цикле выполнения приложения. Если после обновления значений
     * программа будет принудительно завершена, то изменения не сохранятся. Чтобы
     * избежать этого, используйте метод flush.
     *
     * @param key Ключ.
     * @param value Новое значение.
     */
    Service.prototype.set = function (key, value) {
        var _this = this;
        if (value === undefined) {
            delete this.values[key];
        }
        else {
            this.values[key] = value;
        }
        if (this.changed.size === 0) {
            Promise.resolve().then(function () { return _this.flush(); });
        }
        this.changed.set(key, true);
    };
    /**
     * Возвращает значение, соответствующее указанному ключу. Если данный ключ
     * не существует, будет возвращено undefined.
     *
     * @param key Ключ.
     */
    Service.prototype.get = function (key) {
        return this.values[key];
    };
    /**
     * Возвращает true, если значение по указанному ключу существует (не равно
     * undefined).
     *
     * @param key Кюч.
     */
    Service.prototype.has = function (key) {
        return this.get(key) !== undefined;
    };
    /**
     * Удаляет из сервиса все значения. Следует помнить, что для оптимизации
     * реальная запись в localStorage происходит не в текущем, а следующем
     * цикле выполнения приложения. Если после обновления значений программа
     * будет принудительно завершена, то изменения не сохранятся. Чтобы избежать
     * этого, используйте метод flush.
     */
    Service.prototype.clear = function () { };
    /**
     * Немедленно записывает значения из сервиса в localStorage. Служит для того,
     * чтобы избежать рассинхронизации localStorage и сервиса при принудительном
     * завершении программы.
     */
    Service.prototype.flush = function () {
        if (this.changed.size === 0) {
            return;
        }
        this.saveValues(this.values);
        this.changed.clear();
    };
    /**
     * Производит принудительное добавление значений из localStorage в сервис.
     * Если в сервисе пристутствуют несохранённые изменения, то они не будут
     * удалены. Данный метод следует использовать лишь тогда, когда по какой-то
     * вы собираетесь повторно считать все значения из localStorage, но не хотите
     * терять текущие изменения в коллекции значений. При стандартном
     * использовании сервиса нужды в данном методе не возникает.
     */
    Service.prototype.merge = function () {
        var currentValues = this.readValues();
        if (this.changed.size === 0) {
            this.values = currentValues;
            return;
        }
        var keys = Object.keys(currentValues);
        var length = keys.length;
        if (length === 0) {
            return;
        }
        for (var i = 0; i < length; i += 1) {
            var key = keys[i];
            if (this.changed.has(key)) {
                continue;
            }
            var currentValue = currentValues[key];
            this.values[key] = currentValue;
        }
    };
    /**
     * Производит принудительную замену всех значений сервиса содержимым
     * localStorage. Все несохранённые изменения будет потеряны. При нормальном
     * использовании сервиса нужды в данном методе не возникает.
     */
    Service.prototype.reset = function () {
        this.values = this.readValues();
    };
    /**
     * Возвращает коллекцию функций для управления значением с указанным ключом
     * (get, has и set). Все функции коллекции имеют закрепелённый контекст
     * выполнения.
     *
     * @template T Тип значения с указанным ключом.
     * @param key Ключ значения.
     */
    Service.prototype.field = function (key) {
        var _this = this;
        var field = this.fields[key];
        if (field == null) {
            field = {
                set: function (value) { return _this.set(key, value); },
                get: function () { return _this.get(key); },
                has: function () { return _this.has(key); },
            };
            this.fields[key] = field;
        }
        return field;
    };
    return Service;
}(service_1.StrictService));
exports.Service = Service;
