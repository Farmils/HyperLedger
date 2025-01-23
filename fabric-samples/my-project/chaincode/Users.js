/**
 * @author Farmils
 */
'use strict';
const { Contract } = require('fabric-contract-api');
class Users extends Contract {
    /**
     * Конструктор служит, для объявления названия контракта,
     * если не использовать его, то название контракта === название класса
     * пишется как конструктор в solidity
     * @constructor
     */
    constructor() {
        super('User');
    }
    /**
     * Метод, для добавления в реестр информации при старте системы,
     * можно представить, как конструктор, который закидывает информацию в массив,
     * при старте системы
     * В данном случае мы инициализируем
     * Базу водительских удостоверений, чтобы далее можно было сравнивать данные которые, вносит
     * пользователь и, которые хранятся в системе
     * @param {ctx} ctx - Параметр, для получения данных о пользователе, должен быть первым, а так же должен быть у всех методов
     */
    async InitLedger(ctx) {
        const DriverLicenses = [
            {
                ID: '000',
                ServiceLife: '11.01.2021',
                Category: 'A',
                UserId: '',
            },
            {
                ID: '111',
                ServiceLife: '12.05.2025',
                Category: 'B',
                UserId: '',
            },
            {
                ID: '222',
                ServiceLife: '09.09.2020',
                Category: 'C',
                UserId: '',
            },
            {
                ID: '333',
                ServiceLife: '13.02.2027',
                Category: 'A',
                UserId: '',
            },
            {
                ID: '444',
                ServiceLife: '10.09.2020',
                Category: 'B',
                UserId: '',
            },
            {
                ID: '555',
                ServiceLife: '24.06.2029',
                Category: 'C',
                UserId: '',
            },
            {
                ID: '666',
                ServiceLife: '31.03.2030',
                Category: 'A',
                UserID: '',
            },
        ];
        for (const driverLicense of DriverLicenses) {
            driverLicense.docType = 'driverLicense';
            await ctx.stub.putState(
                driverLicense.ID,
                Buffer.from(JSON.stringify(driverLicense))
            );
        }
    }
    /**
     * Метод, для добавления пользователя в систему,
     * путём записи данных в объект, с последующим его преобразованием в JSON
     * и отправление его в систему через хук putState(ключ(к примеруID),Buffer.from(JSON-объект))
     * @param {ctx} ctx -для получения информации о пользователе, системный параметр
     * @param {string} userId -  ID пользователя
     * @param {string} fio - ФИО
     * @param {date} startDrive - дата начала вождения
     * @param {int} countForfeit - количество неоплаченных штрафов
     * @param {int} balance - баланс пользоватея
     */
    async Registration(
        ctx,
        userId,
        fio,
        password,
        startDrive,
        countForfeit,
        balance
    ) {
        const exist = await this.UserExists(ctx, userId);
        if (exist) {
            throw new Error(
                `Пользователь с таким id: ${userId}, зарегистрирован в системе`
            );
        }
        const user = {
            UserID: userId,
            FIO: fio,
            Password: password,
            StartDrive: startDrive,
            CountForfeit: countForfeit,
            Balance: balance,
            licenseId: '',
        };
        const strigifiedUser = JSON.stringify(user);
        await ctx.stub.putState(userId, Buffer.from(strigifiedUser));
        return strigifiedUser;
    }
    /**
     * Метод, для проверки на наличие пользователя в системе
     * @param {ctx} ctx - информация о пользователе, системный параметр
     * @param {string} userId -  адрес  пользователя
     */
    async UserExists(ctx, userId) {
        const userJSON = await ctx.stub.getState(userId);
        return userJSON && userJSON.length > 0;
    }
    /**
     * Метод для получения информации о пользователе
     */
    async GetUser(ctx, userId) {
        const userJSON = await ctx.stub.getState(userId);
        if (!userJSON || userJSON.length === 0) {
            throw new Error(`Вы не зарегистрированы в системе`);
        }
        const user = JSON.parse(userJSON);
        return user;
    }

    /**
     * Метод для добавления Водительского удостоверения
     * @param {ctx} ctx - информация о пользователе, системный параметр
     * @param {string} licenseId - ID водительского удостоверения
     * @param {string} userId -  адрес  пользователя
     * @param {date}serviceLifeV - срок действия В/У
     * @param {string} category - категория В/У
     * @returns {JSON} stringifyLicense - информация о В/У
     */
    async AddDriverLicense(ctx, licenseId, serviceLife, category, userId) {
        const exist = await this.DriverLicenseExists(ctx, licenseId);
        if (exist) {
            const license = {
                ID: licenseId,
                serviceLife: serviceLife,
                Category: category,
                userID: userId,
            };
            const user = await this.GetUser(ctx, userId);
            console.log(user);
            user.licenseId = licenseId;
            const stringfyUser = JSON.stringify(user);
            console.log(stringfyUser);
            await ctx.stub.putState(userId, Buffer.from(stringfyUser));
            const stringifyLicense = JSON.stringify(license);
            await ctx.stub.putState(licenseId, Buffer.from(stringifyLicense));
            return stringifyLicense;
        }
        throw new Error(`Такого водительского удостоверения нет в базе данных`);
    }
    /**
     * Метод для проверки на наличие В/У удостоверения в системе
     * @param {ctx} ctx - информация о пользователе, системный параметр
     * @param {string} licenseId -  ID водительского удостоверения
     */
    async DriverLicenseExists(ctx, licenseId) {
        const licenseJSON = await ctx.stub.getState(licenseId);
        return licenseJSON && licenseJSON.length > 0;
    }

    /**
     * Метод, для получения информации о В/У
     * @param {ctx} - информация о пользователе, системный параметр
     * @param {string} licenseId - ID В/У
     */
    async GetDriverLicense(ctx, licenseId) {
        const driverLicenseJSON = await ctx.stub.getState(licenseId);
        if (!driverLicenseJSON || driverLicenseJSON.length === 0) {
            throw new Error(`Машины ${licenseId} не существует`);
        }
        return driverLicenseJSON.toString();
    }

    /**
     * Метод для регистрации Транспортного средства,
     * по средству проверки категории В/У и категории Т/С
     * @param {ctx} ctx - информация о пользователе, системный параметр
     * @param {string} carId  - ID машины
     * @param {string} userId -  адрес  пользователя
     * @param {string} carCategory  - категория автомобиля
     * @param {int} price - рыночная стоимость автомобиля
     * @param {date} serviceLife - срок эксплуатации
     * @returns {JSON} stringfyCar- информация о машине
     */
    async AddCar(
        ctx,
        carId,
        userId,
        carCategory,
        price,
        serviceLife,
        licenseId
    ) {
        const licenseCategory = await this.GetLicenseCategory(ctx, licenseId);
        if (licenseCategory === carCategory) {
            const car = {
                CarID: carId,
                serviceLife: serviceLife,
                CarCategory: carCategory,
                Price: price,
                Owner: userId,
            };
            const stringfyCar = JSON.stringify(car);
            await ctx.stub.putState(carId, Buffer.from(stringfyCar));
            return stringfyCar;
        }
        throw new Error(
            `Категория вашего В/У, не соответсвует категории Автомобиля: ${JSON.stringify(
                licenseCategory
            )} != ${carCategory}`
        );
    }
    /**
     * Метод для получения информации о машине пользователя
     */
    async GetCar(ctx, carId) {
        const carJSON = await ctx.stub.getState(carId);
        if (!carJSON || carJSON.length === 0) {
            throw new Error(`Машины ${carId} не существует`);
        }
        return carJSON.toString();
    }

    /**
   * Метод, для получения категории В/У  по адресу пользователя =>
   * мы учитываем тот случай, что человек без В/У  не сможет зарегистрировать автомобиль
   * @param {ctx} ctx -информация о пользователе, системный параметр
   * @param {string} userId -  адрес  пользователя
   * @returns {string} Category - категория  В/У
   
   */
    async GetLicenseCategory(ctx, licenseId) {
        const licenseJSON = await ctx.stub.getState(licenseId);
        if (!licenseJSON || licenseJSON.length === 0) {
            throw new Error(`Водительского удостоверения  не существует`);
        }
        const license = JSON.parse(licenseJSON.toString());
        return license.Category;
    }
    /**
     * Метод, для продления В/У, проверка на штрафы и время
     * @param {ctx} ctx -информация о пользователе, системный параметр
     * @param {string} userId -  адрес  пользователя
     * ВАЖНЫЙ МОМЕНТ, по ТЗ 1 ДЕНЬ === 1 МИНУТЕ реального времени
     */
    async extensionLicense(ctx, userId) {
        const countForfeit = this.GetCountForfeit(ctx, userId);
        const licenseLife = this.GetLicenseLife(ctx, userId);
        const now = new Date();
        const resDate = now - licenseLife;

        // if(countForfeit ===0 && ){

        // }
    }

    /**
     * Метод, для получении информации о количестве штрафов у пользователя
     * @param {ctx} ctx - информация о пользователе, системный параметр
     * @param {string} userId -  адрес  пользователя
     * @returns {int} CountForfeit - количество штрафов у пользователя
     */
    async GetCountForfeit(ctx, userId) {
        const userJSON = await ctx.stub.getState(userId);
        if (!userJSON || userJSON.length === 0) {
            throw new Error(`Вы не зарегистрированы в системе`);
        }
        const user = JSON.parse(userJSON.toString());
        return user.CountForfeit;
    }
    /**
     * Метод для реализации авторизации
     */
    async Authorization(ctx, userId) {
        const userJSON = await ctx.stub.getState(userId);
        if (!userJSON || userJSON.length === 0) {
            throw new Error(`Вы не зарегистрированы в системе`);
        }
        const user = JSON.parse(userJSON.toString());
        return { id: user.UserID, password: user.Password };
    }
    /**
     * Метод для получения информации о сроке действия В/У пользователя
     * @param {ctx} ctx - информация о пользователе, системный параметр
     * @param {string} userId -  адрес  пользователя
     * @returns {string} serviceLife - срок действия В/У
     */
    async GetLicenseLife(ctx, userId) {
        const licenseJSON = await ctx.stub.getState(userId);
        if (!licenseJSON || licenseJSON.length === 0) {
            throw new Error(`У вас отсутствует В/У`);
        }
        const license = JSON.parse(licenseJSON.toString());
        return license.serviceLife;
    }
    /**
     * Метод, оформления штрафа водителю, происходит по В/У
     */
    async SendForfeit(ctx, userID, licenseId) {
        const user = this.GetUser(ctx, userID);
        const license = this.GetDriverLicense(ctx, licenseId);
        user.countForfeit += 1;
        license.forfeit += 1;
        return license.forfeit;
    }
}
/**
 * Для того чтобы контракт, можно было использовать вне файла
 * ОБЯЗАТЕЛЬНО прописать, указывается название класса,
 * по записи означает тоже самое как в реакте
 * export{Users};
 */
module.exports = Users;
