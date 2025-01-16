/**
 * @module HyperledgerFabric
 * @description Модуль для взаимодействия с сетью Hyperledger Fabric.
 */

/**
 * @param {Gateway} Gateway - Шлюз для управления сетевым взаимодействием от имени приложения.
 * @param {Wallets} Wallets - Кошелёк для связи пользователя с приложением.
 */
const { Gateway, Wallets } = require("fabric-network");

/**
 * @module path
 * @description Встроенный модуль path, который предоставляет различные утилиты для работы с файлами и путями в файловой системе.
 */
const path = require("path");

/**
 * @module fs
 * @description Встроенный модуль fs, который позволяет работать с файловой системой на компьютере.
 */
const fs = require("fs");

/**
 * @module express
 * @description Модуль express для создания веб-приложений.
 */
const express = require("express");

/**
 * @module FabricCAServices
 * @description Модуль fabric-ca-client для взаимодействия с сертификационным центром (CA).
 */
const FabricCAServices = require("fabric-ca-client");
const { userInfo } = require("os");

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
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

/**
 * В chaincodeName вводим имя chaincode, которое мы указывали во время разворачивания контрактов во флаге -ccn.
 * В channelName вводим название канала блокчейна.
 */
const channelName = "blockchain2024";
const chaincodeName = "jopa";
const contractName = "User";
const adminUserId = "admin";
const adminUserPasswd = "adminpw";
const orgMspIds = {
  org1: "Org1MSP",
  org2: "Org2MSP",
};

/**
 * Метод buildCCPOrg в Hyperledger Fabric используется для построения и возврата объекта Connection Profile (CCP) для указанной организации.
 * Connection Profile — это JSON-файл, который содержит информацию о сети Hyperledger Fabric, включая сведения о пирах (peers), сертификатах, каналах и других компонентах сети.
 * Этот файл необходим для настройки клиентских приложений, которые взаимодействуют с сетью Hyperledger Fabric.
 * @param {string} organization - Название организации.
 * @returns {Object} ccp - Возвращается вся информация о организации в виде JSON.
 * @throws {Error} Если происходит ошибка при построении CCP.
 */
function buildCCPOrg(organization) {
  try {
    // Путь к connection файлу указанной организации
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      `${organization}.example.com`,
      `connection-${organization}.json`
    );
    // Считывание connection файла в формате JSON
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    return ccp;
  } catch (error) {
    console.error(`Failed to build CCP: ${error}`);
    throw new Error(error);
  }
}

/**
 * Метод buildCAClient в Hyperledger Fabric используется для создания и возврата клиента Certificate Authority (CA) для указанной организации.
 * Этот клиент необходим для взаимодействия с CA, которая управляет сертификатами и аутентификацией в сети Hyperledger Fabric.
 * @param {Object} ccp - Информация о организации, получаемая из метода "buildCCPOrg".
 * @param {string} organization - Название организации.
 * @returns {Client} caClient - Клиент указанной организации.
 * @throws {Error} Если происходит ошибка при создании клиента CA.
 */
async function buildCAClient(ccp, organization) {
  try {
    const caInfo = ccp.certificateAuthorities[`ca.${organization}.example.com`];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const caClient = new FabricCAServices(
      caInfo.url,
      {
        trustedRoots: caTLSCACerts,
        verify: false,
      },
      caInfo.caName
    );
    return caClient;
  } catch (error) {
    console.error(`Failed to build CA client: ${error}`);
    throw new Error(error);
  }
}

/**
 * Метод buildWallet в Hyperledger Fabric используется для создания и возврата экземпляра кошелька (wallet) для указанной организации.
 * Кошелек используется для хранения и управления идентификационными данными пользователей, таких как сертификаты и ключи,
 * которые необходимы для аутентификации и выполнения транзакций в сети Hyperledger Fabric.
 * @param {string} organization - Название организации.
 * @returns {Wallet} wallet - Экземпляр кошелька.
 * @throws {Error} Если происходит ошибка при создании кошелька.
 */
async function buildWallet(organization) {
  try {
    // Путь к wallet папке, в которой хранятся данные созданных аккаунтов организации
    const walletPath = path.join(process.cwd(), `wallet/${organization}`);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    return wallet;
  } catch (error) {
    console.error(`Failed to build wallet: ${error}`);
    throw new Error(error);
  }
}

/**
 * Метод buildX509Identity в Hyperledger Fabric используется для создания и возврата объекта идентификации X.509 на основе данных регистрации (enrollment)
 * и информации об организации. Идентификация X.509 используется для аутентификации пользователей и устройств в сети Hyperledger Fabric.
 * @param {Object} enrollment - Данные регистрации.
 * @param {string} organization - Название организации.
 * @returns {Object} x509Identity - Объект идентификации X.509.
 * @throws {Error} Если происходит ошибка при создании идентификации X.509.
 */
async function buildX509Identity(enrollment, organization) {
  try {
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspIds[organization],
      type: "X.509",
    };
    return x509Identity;
  } catch (error) {
    console.error(`Failed to build X509 identity: ${error}`);
    throw new Error(error);
  }
}

/**
 * Регистрирует администратора для указанной организации в сети Hyperledger Fabric.
 * @async
 * @function enrollAdmin
 * @param {string} organization - Имя организации, для которой регистрируется администратор.
 * @returns {Promise<string>} Сообщение о результате регистрации администратора.
 * @throws {Error} Если происходит ошибка при регистрации администратора.
 * @example
 * enrollAdmin('org1')
 *   .then(result => console.log(result))
 *   .catch(error => console.error(error));
 */
async function enrollAdmin(organization) {
  try {
    organization = organization.toLowerCase();
    const ccp = buildCCPOrg(organization);
    const caClient = await buildCAClient(ccp, organization);
    const wallet = await buildWallet(organization);
    if (await wallet.get(adminUserId)) {
      return "Admin already exist";
    }
    const enrollment = await caClient.enroll({
      enrollmentID: adminUserId,
      enrollmentSecret: adminUserPasswd,
    });
    const x509Identity = await buildX509Identity(enrollment, organization);
    await wallet.put(adminUserId, x509Identity);
    return "Admin registered";
  } catch (error) {
    const errorMsg = `Failed to enroll admin user: ${error}`;
    console.error(errorMsg);
    return errorMsg;
  }
}

/**
 * Регистрирует пользователя для указанной организации в сети Hyperledger Fabric.
 *
 * @async
 * @function enrollUser
 * @param {string} organization - Имя организации, для которой регистрируется пользователь.
 * @param {string} userId - Идентификатор пользователя.
 * @returns {Promise<string>} Сообщение о результате регистрации пользователя.
 * @throws {Error} Если происходит ошибка при регистрации пользователя.
 *
 * @example
 * enrollUser('org1', 'user1')
 *   .then(result => console.log(result))
 *   .catch(error => console.error(error));
 */
async function enrollUser(organization, userId) {
  try {
    organization = organization.toLowerCase();
    const ccp = buildCCPOrg(organization);
    const caClient = await buildCAClient(ccp, organization);
    const wallet = await buildWallet(organization);
    if (await wallet.get(userId)) {
      return `User ${userId} already exist`;
    }
    const adminIdentity = await wallet.get(adminUserId);
    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, adminUserId);
    let secret;
    try {
      secret = await caClient.register(
        {
          affiliation: `${organization}.department1`,
          enrollmentID: userId,
          role: "client",
        },
        adminUser
      );
    } catch (error) {
      console.error(`Failed to enroll user ${userId}: ${error}`);
      return `User ${userId} already exist`;
    }
    const enrollment = await caClient.enroll({
      enrollmentID: userId,
      enrollmentSecret: secret,
    });
    const x509Identity = await buildX509Identity(enrollment, organization);
    await wallet.put(userId, x509Identity);
    return `User ${userId} enrolled`;
  } catch (error) {
    const errorMsg = `Failed to enroll user ${userId}: ${error}`;
    console.error(errorMsg);
    return errorMsg;
  }
}

/**
 * Получает экземпляр шлюза для указанной организации и пользователя.
 *
 * @async
 * @function getGateway
 * @param {string} organization - Имя организации.
 * @param {string} userID - Идентификатор пользователя.
 * @returns {Promise<Gateway>} Экземпляр шлюза.
 * @throws {Error} Если происходит ошибка при подключении к шлюзу.
 *
 * @example
 * getGateway('org1', 'user1')
 *   .then(gateway => console.log(gateway))
 *   .catch(error => console.error(error));
 */
async function getGateway(organization, userID) {
  try {
    organization = organization.toLowerCase();
    const ccp = buildCCPOrg(organization);
    const wallet = await buildWallet(organization);
    // Получение конкретного пользователя по userID
    const identity = await wallet.get(userID);
    if (!identity) {
      console.log(
        `An identity for the user ${userID} does not exist in the
  wallet`
      );
      console.log("Enroll user before retrying");
      return;
    }
    // Подключение к Fabric с данными пользователя
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity,
      discovery: { enabled: true, asLocalhost: true },
    });
    return gateway;
  } catch (error) {
    console.error(`Failed to connect: ${error}`);
    throw new Error(error);
  }
}

/**
 * Получает контракт для указанного шлюза и имени контракта.
 *
 * @async
 * @function getContract
 * @param {Gateway} gateway - Экземпляр шлюза.
 * @param {string} contractName - Имя контракта.
 * @returns {Promise<Contract>} Экземпляр контракта.
 * @throws {Error} Если происходит ошибка при получении контракта.
 *
 * @example
 * getContract(gateway, 'MyContract')
 *   .then(contract => console.log(contract))
 *   .catch(error => console.error(error));
 */
async function getContract(gateway, contractName) {
  try {
    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName, contractName);
    return contract;
  } catch (error) {
    console.error(`Failed to get contract: ${error}`);
    throw new Error(error);
  }
}

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
async function postFunc(contractName, organization, userID, func, args) {
  try {
    const gateway = await getGateway(organization, userID);
    const contract = await getContract(gateway, contractName);
    // Отправка транзакции
    const result = await contract.submitTransaction(func, ...args);
    // Обязательно завершаем сессию после завершения операции
    await gateway.disconnect();
    // Возвращаем результат выполнения транзации
    return result.toString();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    throw new Error(error);
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
async function getFunc(contractName, organization, userID, func, ...args) {
  try {
    const gateway = await getGateway(organization, userID);
    const contract = await getContract(gateway, contractName);
    // Получаем данные с блокчейна
    const result = await contract.evaluateTransaction(func, ...args);
    console.log(
      `Transaction has been evaluated, result is:
  ${result.toString()}`
    );
    await gateway.disconnect();
    return result.toString();
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    throw new Error(error);
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
  startDrive,
  countForfeit,
  balance
) {
  try {
    return await postFunc(contractName, organization, userID, "Registration", [
      userID,
      fio,
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
    return await getFunc(contractName, organization, userID, "UserExists", [
      userID,
    ]);
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
 * @param {string} organization - Имя организации.
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
  userID,
  licenseId,
  serviceLife,
  category
) {
  try {
    return await postFunc(
      contractName,
      organization,
      userID,
      "AddDriverLicense",
      [licenseId, userID, serviceLife, category]
    );
  } catch (error) {
    const errorMsg = `Failed to add Driver License, your licenseId ${licenseId} is not in the database. ${error}`;
    console.error(errorMsg);
    return errorMsg;
  }
}

/**
 * Функция для получения данных о водительском удостоверении (В/У).
 *
 * @async
 * @function getDriverExists
 * @param {string} organization - Имя организации.
 * @param {string} userID - Идентификатор пользователя.
 * @param {number} licenseId - ID водительского удостоверения.
 * @returns {Promise<string>} Результат выполнения транзакции.
 * @throws {Error} Если происходит ошибка при получении данных о водительском удостоверении.
 *
 * @example
 * getDriverExists('org1', 'user1', 12345)
 *   .then(result => console.log(result))
 *   .catch(error => console.error(error));
 */
async function getDriverExists(organization, userID, licenseId) {
  try {
    return await getFunc(
      contractName,
      organization,
      userID,
      "DriverLicenseExists",
      [licenseId]
    );
  } catch (error) {
    const errorMsg = `Failed to get DriverLicense, LicenseId ${licenseId} is not in the database`;
    console.error(errorMsg);
    return errorMsg;
  }
}
/**
 *
 */
async function getDriverLicense(organization, userID, licenseId) {
  try {
    return await getFunc(
      contractName,
      organization,
      userID,
      "GetDriverLicense",
      [licenseId]
    );
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
async function getLicenseCategory(organization, userID, userID) {
  try {
    return await getFunc(
      contractName,
      organization,
      userID,
      "GetLicenseCategory",
      [userID]
    );
  } catch (error) {
    const errorMsg = `Failed to get Category your License, because you do not have a license`;
    console.error(errorMsg);
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
  userID,
  carID,
  userID,
  carCategory,
  price,
  serviceLife
) {
  try {
    return await postFunc(contractName, organization, userID, "AddCar", [
      carID,
      serviceLife,
      carCategory,
      price,
      userID,
    ]);
  } catch (error) {
    const errorMsg = `Failed to add Car, because category your license does not match the category of your auto`;
    console.error(errorMsg);
    return errorMsg;
  }
}
/**
 * Асинхронно получает количество конфискаций для заданного адреса пользователя.
 *
 * @async
 * @function GetCountForfeit
 * @param {string} organization - Идентификатор организации.
 * @param {string} userID - Идентификатор пользователя.
 * @returns {Promise<string|number>} - Количество конфискаций или сообщение об ошибке.
 */
async function GetCountForfeit(organization, userID, userID) {
  try {
    return await getFunc(
      contractName,
      organization,
      userID,
      "GetCountForfeit",
      [userID]
    );
  } catch (error) {
    const errorMsg = `Ошибка, потому что вы не зарегистрированы в системе`;
    console.error(errorMsg);
    return errorMsg;
  }
}

/**
 * Асинхронно получает срок действия лицензии для заданного адреса пользователя.
 *
 * @async
 * @function GetLicenseLife
 * @param {string} organization - Идентификатор организации.
 * @param {string} userID - Идентификатор пользователя.
 * @returns {Promise<string|number>} - Срок действия лицензии или сообщение об ошибке.
 */
async function GetLicenseLife(organization, userID, userID) {
  try {
    return await getFunc(contractName, organization, userID, [userID]);
  } catch (error) {
    const errorMsg = `Ошибка, потому что ваша лицензия не зарегистрирована в системе`;
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
app.post("/enrollAdmin", async (request, response) => {
  const { organization } = request.body;
  const result = await enrollAdmin(organization);
  response.send(result);
});
app.post("/addDriverLicense", async (req, res) => {
  const { organization, userID, licenseId, serviceLife, category } = req.body;
  const result = await addDriverLicense(
    organization,
    userID,
    licenseId,
    serviceLife,
    category
  );
  res.send(result);
});
app.post("/registration", async (req, res) => {
  const { organization, userID, fio, startDrive, countForfeit, balance } =
    req.body;
  const result = await registration(
    organization,
    userID,
    fio,
    startDrive,
    countForfeit,
    balance,
    userID
  );
  res.send(result);
});

app.post("/getDriverLicense", async (req, res) => {
  const { organization, userID, licenseId } = req.body;
  const result = await getDriverLicense(organization, userID, licenseId);
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
app.post("/addCar", async (request, response) => {
  const { organization, userID, carID, carCategory, price, serviceLife } =
    request.body;
  const result = await addCar(
    organization,
    userID,
    carID,
    userID,
    carCategory,
    price,
    serviceLife
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
app.listen(7000, () => console.log("Сервер работает на http://localhost:7000"));
