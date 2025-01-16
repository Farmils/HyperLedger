class UserService {
    async addCar( organization,userID,carID,userAddress,carCategory,price,serviceLife) {
        return await (
            await fetch('http://localhost:7000/addcar', {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    organization,
                    userID,
                    id,
                    color,
                    brand,
                    owner,
                }),
                method: 'POST',
            })
        ).json();
    }
    async getCar(organization, userID, carId) {
        return await (
            await fetch('http://localhost:7000/getCar', {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    organization,
                    userID,
                    carId,
                }),
                method: 'POST',
            })
        ).json();
    }
}
export default new CarsService();
