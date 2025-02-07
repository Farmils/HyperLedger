/**
 * @author Farmils
 */
'use strict';
const { Contract } = require('fabric-contract-api');
const ProfiCoin = require('./ProfiCoin.js');

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

        const token = new ProfiCoin();
        await token.Initialize(ctx, 'ProfiCoin', 'PROFI', '12');
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
        const token = new ProfiCoin();
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
        const bal = parseInt(balance);
        console.log(bal);
        await token.Mint(ctx, bal * 10 ** 12);
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
    async GetLicenseLife(ctx, licenseId) {
        const licenseJSON = await ctx.stub.getState();
        if (!licenseJSON || licenseJSON.length === 0) {
            throw new Error(`У вас отсутствует В/У`);
        }
        const license = JSON.parse(licenseJSON.toString());
        return license.serviceLife;
    }
    //  7. Продление лицензи
    async RenewLicense(ctx, userId, licenseId, currentDate) {
        const licenseByte = await ctx.stub.getState(licenseId);
        const userByte = await ctx.stub.getState(userId);
        if (!licenseByte || licenseByte.length === 0)
            throw new Error('Пользователь не найден');
        const user = JSON.parse(userByte.toString());
        const license = JSON.parse(licenseByte.toString());
        console.log(license);
        console.log(user);
        if (!license)
            throw new Error('У пользователя нет водительского удостоверения');
        if (user.CountForfeit > 0)
            throw new Error('Невозможно продлить, есть неоплаченные штрафы');

        const expirationDate = new Date(license.serviceLife);
        console.log(expirationDate);
        console.log(typeof expirationDate);
        const renewalThreshold = new Date(expirationDate);
        renewalThreshold.setMinutes(renewalThreshold.getMinutes() - 30);

        if (new Date(currentDate) < renewalThreshold) {
            throw new Error(
                'Продление возможно не ранее, чем за месяц до истечения срока'
            );
        }

        expirationDate.setMinutes(
            expirationDate.getMinutes() + 10 * 365 * 1440
        );
        license.serviceLife = expirationDate.toISOString();
        console.log(expirationDate);

        await ctx.stub.putState(
            licenseId,
            Buffer.from(JSON.stringify(license))
        );
        return 'Срок действия прав продлен';
    }

    //Выписка штрафа водителю
    async IssueFine(ctx, userId, licenseId) {
        const driverJSON = await ctx.stub.getState(userId);
        if (!driverJSON || driverJSON.length === 0) {
            throw new Error(`Водитель с идентификатором ${userId} не найден.`);
        }
        const license = licenseId;
        const driver = JSON.parse(driverJSON.toString());
        const issueDate = new Date().toISOString();
        const fine = { issueDate, amount: 10 };
        driver.CountForfeit = parseInt(driver.CountForfeit);
        driver.CountForfeit += 1;
        if (!driver.FineDetails) driver.FineDetails = [];
        driver.FineDetails.push(fine);
        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(driver)));

        return `Штраф успешно выписан водителю ${userId}.`;
    }

    // 6.Оплата штрафа с учетом времени выписки
    async PayFine(ctx, userId) {
        const token = new ProfiCoin();
        const userBytes = await ctx.stub.getState(userId);
        if (!userBytes || userBytes.length === 0)
            throw new Error('Пользователь не найден');

        const user = JSON.parse(userBytes.toString());
        if (!user.FineDetails || user.FineDetails.length === 0)
            throw new Error('Нет неоплаченных штрафов');

        const now = new Date();
        const fine = user.FineDetails[0]; // Берем самый старый штраф

        const issueTime = new Date(fine.issueDate);
        const minutesSinceIssue = (now - issueTime) / 60000; // Разница в минутах (1 мин = 1 день)

        const fineAmount = minutesSinceIssue <= 5 ? 5 : 10; // Скидка при оплате в первые 5 минут
        console.log(fineAmount);
        console.log(typeof fineAmount);

        if (user.Balance < fineAmount) throw new Error('Недостаточно средств');
        user.Balance -= fineAmount;
        await token.Transfer(ctx, 'bank', fineAmount);
        user.FineDetails.shift(); // Удаляем оплаченный штраф
        user.CountForfeit -= 1;
        const bankes = 'bank';
        const bankBytes = await ctx.stub.getState(bankes.toString());
        console.log(`please`);
        const bank = JSON.parse(bankBytes.toString());
        console.log(`work work please`);
        console.log(bank);
        bank.Balance = parseInt(bank.Balance);
        bank.Balance += fineAmount;
        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));
        await ctx.stub.putState(
            bankes.toString(),
            Buffer.from(JSON.stringify(bank))
        );

        return 'Штраф оплачен. Списано ${fineAmount} ProfiCoin. Остаток: ${user.balance} ProfiCoin';
    }
}
/**
 * Для того чтобы контракт, можно было использовать вне файла
 * ОБЯЗАТЕЛЬНО прописать, указывается название класса,
 * по записи означает тоже самое как в реакте
 * export{Users};
 */
module.exports = Users;
