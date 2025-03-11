import Kontak from "../models/kontak.model.js";

class KontakMessage {
	constructor() {
		this.kontak = Kontak;
	}

	async pushNewMessage(telephone, name) {
		await this.kontak.create({ telephone, name });
	}

	async getAllMessage() {
		const result = await this.kontak.findAll();
		return result;
	}

	async deleteKontak(id) {
		const find = await this.kontak.findByPk(id);
		if (find) {
			await find.destroy();
		}
	}

	async deleteAllKontak() {
		await this.kontak.destroy({ truncate: true });
	}
}

export default KontakMessage;
