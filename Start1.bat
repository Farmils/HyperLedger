cd .\fabric-samples\test-network
WSL ./network.sh up createChannel -c blockchain2025 -ca -s couchdb
pause
 WSL ./network.sh deployCC -ccn end -ccl javascript -ccp ../my-project/chaincode -c blockchain2025 -cci InitLedger
pause
cd ..\my-project\aplication
start npm run dev
pause	
cd ..\..\..\nodeForStart
pause
call npm start