:: Поднятие сети и создание канала blockchain2024
CD .\fabric-samples
CD .\test-network
WSL ./network.sh deployCC -ccn End -ccl javascript -ccp ../my-project/chaincode -c blockchain2025 -cci InitLedger
:: Установка зависимостей для приложения, взаимодействующего со смартконтрактом
pause
CD ..\my-project\aplication
CALL npm install
START npm run dev
:: Команды для запуска сайта
CD ..\..\..\front
CALL npm install
CALL npm run dev