/**
 * @module HyperledgerFabric
 * @description Модуль для взаимодействия с сетью Hyperledger Fabric.
 */

/**
 * @param {Gateway} Gateway - Шлюз для управления сетевым взаимодействием от имени приложения.
 * @param {Wallets} Wallets - Кошелёк для связи пользователя с приложением.
 */
const { Gateway, Wallets } = require('fabric-network');
const {
    buildCCPOrg1,
    buildCCPOrg2,
    buildWallet,
} = require('../../test-application/javascript/AppUtil.js');

/**
 * @module path
 * @description Встроенный модуль path, который предоставляет различные утилиты для работы с файлами и путями в файловой системе.
 */
const path = require('path');

/**
 * @module express
 * @description Модуль express для создания веб-приложений.
 */
const express = require('express');

/**
 * Создаём объект приложения.
 */
const app = express();

/**
 * Позволяет считывать данные запросов сразу в формате JSON.
 */
app.use(express.json());

/**
 * Позволяет считывать информацию со всех доменов.
 * @param {Object} req - Запрос.
 * @param {Object} res - Ответ.
 * @param {Function} next - Функция, которая позволяет передать управление следующей функции.
 * @description Фреймворк Express.js построен на концепции ПО промежуточного уровня (англ. middleware). Суть этого подхода в том, что запрос к каждому ресурсу обрабатывается не одним единственным действием контролера, а целым стеком функций.
 */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Разрешить запросы только с определённого источника
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT,DELETE'); // Разрешённые методы
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Разрешённые заголовки

    next(); // Продолжить обработку запроса
});

/**
 * В chaincodeName вводим имя chaincode, которое мы указывали во время разворачивания контрактов во флаге -ccn.
 * В channelName вводим название канала блокчейна.
 */
const channelName = 'blockchain2025';
const chaincodeName = 'popitka4';

/**
 * Отправляет транзакцию в сеть Hyperledger Fabric.
 *
 * @async
 * @function postFunc
 * @param {string} contractName - Имя контракта.
 * @param {string} organization - Имя организации.
 * @param {string} userID - Идентификатор пользователя.
 * @param {string} func - Имя функции контракта.
 * @param {...*} args - Аргументы функции контракта.
 * @returns {Promise<string>} Результат выполнения транзакции.
 * @throws {Error} Если происходит ошибка при отправке транзакции.
 *
 * @example
 * postFunc('MyContract', 'org1', 'user1', 'createCar', 'CAR123', 'Honda', 'Accord', 'Black', 'Tom')
 *   .then(result => console.log(result))
 *   .catch(error => console.error(error));
 */
async function postFunc(organization, userID, func, args) {
    if (organization === 'Org1' || organization === 'org1') {
        const walletPath = path.join(__dirname, 'wallet/org1');
        const wallet = await buildWallet(Wallets, walletPath);
        try {
            const ccp = buildCCPOrg1();
            const gateway = new Gateway();
            const identity = await wallet.get(userID);

            await gateway.connect(ccp, {
                wallet: wallet,
                identity,
                discovery: { enabled: true, asLocalhost: true },
            });

            const network = await gateway.getNetwork(channelName);
            const contract = network.getContract(chaincodeName);

            const result = await contract.submitTransaction(func, ...args);
            console.log(`отправили транзакцию`);

            gateway.disconnect();
            return result.toString();
        } catch (error) {
            console.error(error);
        }
    } else {
        const ccp = buildCCPOrg2();
        const walletPath = path.join(__dirname, 'wallet/org2');
        const wallet = await buildWallet(Wallets, walletPath);
        const identity = await wallet.get(userID);
        try {
            const gateway = new Gateway();

            await gateway.connect(ccp, {
                wallet: wallet,
                identity,
                discovery: { enabled: true, asLocalhost: true },
            });

            const network = await gateway.getNetwork(channelName);
            const contract = network.getContract(chaincodeName);

            const result = await contract.submitTransaction(func, ...args);
            console.log(`отправили транзакцию`);

            gateway.disconnect();
            return result.toString();
        } catch (error) {
            console.error(error);
        }
    }
}

/**
 * Получает данные из сети Hyperledger Fabric.
 *
 * @async
 * @function getFunc
 * @param {string} contractName - Имя контракта.
 * @param {string} organization - Имя организации.
 * @param {string} userID - Идентификатор пользователя.
 * @param {string} func - Имя функции контракта.
 * @param {...*} args - Аргументы функции контракта.
 * @returns {Promise<string>} Результат выполнения транзакции.
 * @throws {Error} Если происходит ошибка при получении данных.
 *
 * @example
 * getFunc('MyContract', 'org1', 'user1', 'queryCar', 'CAR123')
 *   .then(result => console.log(result))
 *   .catch(error => console.error(error));
 */
async function getFunc(organization, userID, func, args) {
    if (organization === 'Org1' || organization === 'org1') {
        const walletPath = path.join(__dirname, 'wallet/org1');
        const wallet = await buildWallet(Wallets, walletPath);
        try {
            const ccp = buildCCPOrg1();
            const gateway = new Gateway();
            const identity = await wallet.get(userID);

            await gateway.connect(ccp, {
                wallet: wallet,
                identity,
                discovery: { enabled: true, asLocalhost: true },
            });

            const network = await gateway.getNetwork(channelName);
            const contract = network.getContract(chaincodeName);

            const result = await contract.submitTransaction(func, ...args);
            console.log(`отправили транзакцию`);

            gateway.disconnect();
            return result.toString();
        } catch (error) {
            console.error(error);
        }
    } else {
        const ccp = buildCCPOrg2();
        const walletPath = path.join(__dirname, 'wallet/org2');
        const wallet = await buildWallet(Wallets, walletPath);
        const identity = await wallet.get(userID);
        await gateway.connect(ccp, {
            wallet: wallet,
            identity,
            discovery: { enabled: true, asLocalhost: true },
        });
        try {
            const network = await gateway.getNetwork(channelName);
            const contract = network.getContract(chaincodeName);
            // Получаем данные с блокчейна
            const result = await contract.evaluateTransaction(func, ...args);
            console.log(
                `Transaction has been evaluated, result is:${result.toString()}`
            );
            gateway.disconnect();
            return result.toString();
        } catch (error) {
            console.error(error);
        }
    }
}

/**
 * @module HyperledgerFabric
 * @description Модуль, в котором объясянется принцип работы с сетью HyperLedger Fabric
 */
/**
 * Функция для отправления данных о пользователе.
 *
 * @async
 * @function addUser
 * @param {string} organization - Имя организации.
 * @param {string} userID - идентификатор пользователя.
 * @param {string} fio - ФИО пользователя.
 * @param {string} startDrive - Дата начала вождения.
 * @param {number} countForfeit - Количество штрафов.
 * @param {number} balance - Баланс пользователя.
 * @returns {Promise<string>} Результат выполнения транзакции.
 * @throws {Error} Если происходит ошибка при отправке данных о пользователе.
 *
 * @example
 * addUser('org1', 'John Doe', '2020-01-01', 0, 1000, '123 Main St')
 *   .then(result => console.log(result))
 *   .catch(error => console.error(error));
 */
async function registration(
    organization,
    userID,
    fio,
    password,
    startDrive,
    countForfeit,
    balance
) {
    try {
        return await postFunc(organization, userID, 'Registration', [
            userID,
            fio,
            password,
            startDrive,
            countForfeit,
            balance,
        ]);
    } catch (error) {
        const errorMsg = `Failed Registration: ${error}`;
        console.error(errorMsg);
        return errorMsg;
    }
}

/**
 * Функция для получения данных о пользователе.
 *
 * @async
 * @function getUser
 * @param {string} organization - Имя организации.
 * @param {string} userID - Идентификатор пользователя.
 * @returns {Promise<string>} Результат выполнения транзакции.
 * @throws {Error} Если происходит ошибка при получении данных о пользователе.
 *
 * @example
 * getUser('org1', 'user1', '123 Main St')
 *   .then(result => console.log(result))
 *   .catch(error => console.error(error));
 */
async function getUser(organization, userID) {
    try {
        return await getFunc(organization, userID, 'UserExists', [userID]);
    } catch (error) {
        const errorMsg = `Failed to get User: ${error}`;
        console.error(errorMsg);
        return errorMsg;
    }
}

/**
 * Функция для отправки данных о водительском удостоверении (В/У).
 *
 * @async
 * @function addDriverLicense
 * * @param {string} organization - Имя организации.
 * @param {string} userID - Идентификатор пользователя.
 * @param {number} licenseId - ID водительского удостоверения.
 * @param {string} serviceLife - Срок действия водительского удостоверения.
 * @param {string} category - Категория водительского удостоверения.
 * @returns {Promise<string>} Результат выполнения транзакции.
 * @throws {Error} Если происходит ошибка при отправке данных о водительском удостоверении.
 *
 * @example
 * addDriverLicense('org1', 'user1', 12345, '123 Main St', '2025-01-01', 'B')
 *   .then(result => console.log(result))
 *   .catch(error => console.error(error));
 */
async function addDriverLicense(
    organization,
    licenseId,
    serviceLife,
    category,
    userID
) {
    try {
        return await postFunc(organization, userID, 'AddDriverLicense', [
            licenseId,
            serviceLife,
            category,
            userID,
        ]);
    } catch (error) {
        const errorMsg = `Failed to add Driver License, your licenseId ${licenseId} is not in the database. ${error}`;
        console.error(errorMsg);
        return errorMsg;
    }
}

/**
 *
 */
async function getDriverLicense(organization, userID, licenseId) {
    try {
        return await getFunc(organization, userID, `GetDriverLicense`, [
            licenseId,
        ]);
    } catch (error) {
        const errorMsg = `Failed to get Driver License, license id ${licenseId} is not the database ${error}`;
        console.error(errorMsg);
        return errorMsg;
    }
}

/**
 * Получение информации о категории водительского удостоверения (В/У) пользователя,
 * а также проверка наличия у пользователя В/У.
 *
 * @async
 * @function getLicenseCategory
 * @param {string} organization - Имя организации.
 * @param {string} userID - Идентификатор пользователя.
 * @returns {Promise<string>} Результат выполнения транзакции.
 * @throws {Error} Если происходит ошибка при получении категории В/У.
 *
 * @example
 * getLicenseCategory('org1', 'user1', '123 Main St')
 *   .then(result => console.log(result))
 *   .catch(error => console.error(error));
 */
async function getLicenseCategory(organization, userID, licenseId) {
    try {
        return await getFunc(organization, userID, 'GetLicenseCategory', [
            licenseId,
        ]);
    } catch (error) {
        const errorMsg = `Failed to get Category your License, because you do not have a license`;
        console.error(errorMsg);
        return errorMsg;
    }
}

/**
 * Получениe информации о  зарегистрированном пользователе
 */
async function getUser(organization, userID) {
    try {
        return await getFunc(organization, userID, 'GetUser', [userID]);
    } catch (error) {
        const errorMsg = ` Вы не зарегистрированы в системе ${error}`;
        console.error(error);
        return errorMsg;
    }
}
async function getCar(organization, userID, carID) {
    try {
        return await getFunc(organization, userID, 'GetCar', [carID]);
    } catch (error) {
        const errorMsg = `Машина не зарегистрирована в системе ${error}`;
        console.error(error);
        return errorMsg;
    }
}

/**
 * Регистрация транспортного средства (Т/С) путем проверки категории В/У и категории Т/С.
 *
 * @async
 * @function addCar
 * @param {string} organization - Имя организации.
 * @param {string} userID - Идентификатор пользователя.
 * @param {number} carID - ID автомобиля.
 * @param {string} carCategory - Категория регистрируемого автомобиля.
 * @param {number} price - Рыночная стоимость автомобиля.
 * @param {string} serviceLife - Срок эксплуатации.
 * @returns {Promise<string>} Результат выполнения транзакции.
 * @throws {Error} Если происходит ошибка при регистрации автомобиля.
 *
 * @example
 * addCar('org1', 'user1', 12345, '123 Main St', 'B', 20000, '2025-01-01')
 *   .then(result => console.log(result))
 *   .catch(error => console.error(error));
 */
async function addCar(
    organization,
    carID,
    userID,
    carCategory,
    price,
    serviceLife,
    licenseId
) {
    try {
        return await postFunc(organization, userID, 'AddCar', [
            carID,
            userID,
            carCategory,
            price,
            serviceLife,
            licenseId,
        ]);
    } catch (error) {
        const errorMsg = `Failed to add Car, because category your license does not match the category of your auto ${error}`;
        console.error(errorMsg);
        return errorMsg;
    }
}

async function IssueFine(organization, userID, licenseId) {
    try {
        console.log(`Пошла жара туц туц`);
        return await postFunc(organization, userID, 'IssueFine', [
            userID,
            licenseId,
        ]);
    } catch (error) {
        console.log(`ошибочка`);

        const errorMsg = `Не удалось выписать штраф пользователю ${userID}, ${error}`;
        console.error(errorMsg);
        return errorMsg;
    }
}

async function PayFine(organization, userID) {
    try {
        return await postFunc(organization, userID, 'PayFine', [userID]);
    } catch (error) {
        const errorMsg = `Не удалось оплатить штраф, ${error}`;
        console.error(errorMsg);
        return errorMsg;
    }
}

/**
 * Авторизация
 */
async function Authorization(organization, userID) {
    try {
        return await getFunc(organization, userID, 'Authorization', [userID]);
    } catch (error) {
        const errorMsg = ` Failed you not registration in system, ${error}`;
        console.error(errorMsg);
        return errorMsg;
    }
}
async function RenewLicense(organization, userID, licenseId, currentDate) {
    try {
        return await postFunc(organization, userID, 'RenewLicense', [
            userID,
            licenseId,
            currentDate,
        ]);
    } catch (error) {
        const errorMsg = 'piska lox ${error}';
        console.error(errorMsg);
        return errorMsg;
    }
}

/**
 * Эндпоинт для регистрации пользователя.
 *
 * @name POST /enrollUser
 * @function
 * @module express
 * @param {Object} req - Объект запроса.
 * @param {Object} req.body - Тело запроса.
 * @param {string} req.body.organization - Идентификатор организации.
 * @param {string} [req.body.userId] - Идентификатор пользователя.
 * @param {Object} res - Объект ответа.
 * @returns {void}
 */
app.post(`/enrollUser`, async (req, res) => {
    const { organization, userId } = req.body;
    let result;
    if (userId === undefined) {
        result = `Ошибка регистрации пользователя. Вы не указали имя пользователя`;
    } else {
        result = await enrollUser(organization, userId);
    }
    res.send(result);
});
app.post('/renewLicense', async (req, res) => {
    const { organization, userID, licenseId, currentDate } = req.body;
    const result = await RenewLicense(
        organization,
        userID,
        licenseId,
        currentDate
    );
    res.send(result);
});
app.get('/authorization', async (req, res) => {
    const query = req.query;
    const result = await Authorization(query.organization, query.userID);
    console.log(query.organization, query.userID, result);

    res.send(result);
});
app.get('/getCar', async (req, res) => {
    const query = req.query;
    const result = await getCar(query.organization, query.userID, query.carID);
    res.send(result);
});
app.post('/issueFine', async (req, res) => {
    const { organization, userID, licenseId } = req.body;
    const result = await IssueFine(organization, userID, licenseId);
    res.send(result);
});
app.post('/payFine', async (req, res) => {
    const { organization, userID } = req.body;
    const result = await PayFine(organization, userID);
    console.log(req.body);
    console.log(result);
    res.send(result);
});

/**
 * Эндпоинт для регистрации администратора.
 *
 * @name POST /enrollAdmin
 * @function
 * @param {Object} request - Объект запроса.
 * @param {Object} request.body - Тело запроса.
 * @param {string} request.body.organization - Идентификатор организации.
 * @param {Object} response - Объект ответа.
 * @returns {void}
 */
app.post('/enrollAdmin', async (request, response) => {
    const { organization } = request.body;
    const result = await enrollAdmin(organization);
    response.send(result);
});
app.post('/addDriverLicense', async (req, res) => {
    const { organization, licenseId, serviceLife, category, userID } = req.body;
    const result = await addDriverLicense(
        organization,
        Number(licenseId),
        serviceLife,
        category,
        userID
    );
    console.log(req.body);
    res.send(result);
});
app.post('/registration', async (req, res) => {
    const {
        organization,
        userID,
        fio,
        password,
        startDrive,
        countForfeit,
        balance,
    } = req.body;
    const result = await registration(
        organization,
        userID,
        fio,
        password,
        startDrive,
        countForfeit,
        balance
    );
    console.log(req.body);
    res.send(result);
});
app.get('/getUser', async (req, res) => {
    const query = req.query;
    const result = await getUser(query.organization, query.userID);
    res.send(result);
});
app.get('/getDriverLicense', async (req, res) => {
    const query = req.query;
    console.log(query);
    const result = await getDriverLicense(
        query.organization,
        query.userID,
        query.licenseId
    );
    res.send(result);
});
app.get('/getLicenseCategory', async (req, res) => {
    const query = req.query;
    const result = await getLicenseCategory(
        query.organization,
        query.userID,
        query.licenseId
    );
    res.send(result);
});

/**
 * Эндпоинт для добавления автомобиля.
 *
 * @name POST /addCar
 * @function
 * @param {Object} request - Объект запроса.
 * @param {Object} request.body - Тело запроса.
 * @param {string} request.body.organization - Идентификатор организации.
 * @param {string} request.body.userID - Идентификатор пользователя.
 * @param {string} request.body.carID - Идентификатор автомобиля.
 * @param {string} request.body.carCategory - Категория автомобиля.
 * @param {number} request.body.price - Цена автомобиля.
 * @param {number} request.body.serviceLife - Срок службы автомобиля.
 * @param {Object} response - Объект ответа.
 * @returns {void}
 */
app.post('/addCar', async (request, response) => {
    const {
        organization,
        carID,
        userID,
        carCategory,
        price,
        serviceLife,
        licenseId,
    } = request.body;
    const result = await addCar(
        organization,
        carID,
        userID,
        carCategory,
        price,
        serviceLife,
        licenseId
    );
    response.send(result);
});

/**
 * Запускает сервер и прослушивает указанный порт.
 *
 * @function
 * @param {number} port - Номер порта для прослушивания.
 * @param {function} callback - Функция обратного вызова для выполнения при запуске сервера.
 * @returns {void}
 */
app.listen(7000, () => console.log('Сервер работает на http://localhost:7000'));
