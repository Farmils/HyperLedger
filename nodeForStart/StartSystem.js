const adminBank = async () => {
  const response = await fetch("http://localhost:7000/enrollAdmin", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      organization: "org2",
    }),
  });
  const data = await response.json();
  console.log(data);
};

const adminUsers = async () => {
  const response = await fetch("http://localhost:7000/enrollAdmin", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      organization: "org1",
    }),
  });
  const data = await response.json();
  console.log(data);
};

const BankStart = async () => {
  const response = await fetch("http://localhost:7000/enrollUser", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      organization: "org2",
      userId: "bank",
    }),
  });
  const data = await response.json();
  console.log(data);
};

const EnrollIvan = async () => {
  const response = await fetch("http://localhost:7000/enrollUser", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      organization: "org1",
      userId: "ivan",
    }),
  });
  const date = await response.json();
  console.log(date);
};

const EnrollPetr = async () => {
  const response = await fetch("http://localhost:7000/enrollUser", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      organization: "org1",
      userId: "petr",
    }),
  });
  const data = await response.json();
  console.log(data);
};

const EnrollSemen = async () => {
  const response = await fetch("http://localhost:7000/enrollUser", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      organization: "org1",
      userId: "semen",
    }),
  });
  const data = await response.json();
  console.log(data);
};

const registrationIvan = async () => {
  const response = await fetch("http://localhost:7000/registration", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      organization: "org1",
      userID: "ivan",
      fio: "Иванов Иван Иванович",
      startDrive: "2023",
      password: "123",
      countForfeit: "0",
      balance: "50",
    }),
  });
  const data = await response.json();
  console.log(data);
};

const registrationPetr = async () => {
  const response = await fetch("http://localhost:7000/registration", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      organization: "org1",
      userID: "petr",
      fio: "Петров Петр Петрович",
      startDrive: "2015",
      password: "123",
      countForfeit: "0",
      balance: "50",
    }),
  });
  const data = await response.json();
  console.log(data);
};

const registrationSemen = async () => {
  const response = await fetch("http://localhost:7000/registration", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      organization: "org1",
      userID: "semen",
      fio: "Семенов Семен Семенович",
      startDrive: "2020",
      password: "123",
      countForfeit: "0",
      balance: "50",
    }),
  });
  const data = await response.json();
  console.log(data);
};
adminBank();
adminUsers();
BankStart();
EnrollIvan();
EnrollPetr();
EnrollSemen();
registrationIvan();
registrationPetr();
registrationSemen();
