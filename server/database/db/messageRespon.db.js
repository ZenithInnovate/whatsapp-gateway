import AutoReplyModel from "../models/autoReply.model.js";
import KontakModel from "../models/kontak.model.js";
import ButtonResponseModel from "../models/buttonRespon.model.js";
import ListResponseModel from "../models/listRespon.model.js";
import { moment } from "../../config/index.js";

class ButtonResponse {
	constructor() {
		this.button = ButtonResponseModel;
	}

	async createButtonResponse(session_name, target_number, msg_id, button, btnMessage) {
		for (let j = 0; j < button.filter((x) => x != "").length; j++) {
			await this.button.create({ session_name, target_number, msg_id, keyword: button.filter((x) => x != "")[j], response: btnMessage.filter((x) => x != "")[j] });
		}
	}

	async checkKeyword(keyword, target_number) {
		const array = await this.button.findAll({ where: { target_number } });
		if (Array.isArray(array) && array.length) {
			const index = array.findIndex((x) => x.keyword == keyword);
			if (index === -1) return false;
			return array[index];
		} else {
			return false;
		}
	}

	async deleteKeyword(msg_id, keyword) {
		const array = await this.button.findAll({ where: { msg_id } });
		if (Array.isArray(array) && array.length) {
			const index = array.findIndex((x) => x.keyword == keyword);
			const db = await this.button.findOne({ where: { id: array[index].id } });
			await db.destroy();
		}
	}
}

class ListResponse {
	constructor() {
		this.list = ListResponseModel;
	}

	async createListResponse(session_name, target_number, msg_id, list, responList) {
		for (let j = 0; j < list.filter((x) => x != "").length; j++) {
			await this.list.create({ session_name, target_number, msg_id, keyword: list.filter((x) => x != "")[j], response: responList.filter((x) => x != "")[j] });
		}
	}

	async checkKeyword(keyword, target_number) {
		const array = await this.list.findAll({ where: { target_number } });
		if (Array.isArray(array) && array.length) {
			const index = array.findIndex((x) => x.keyword == keyword);
			if (index === -1) return false;
			return array[index];
		} else {
			return false;
		}
	}
}

class AutoReply {
	constructor() {
		this.reply = AutoReplyModel;
	}

	async createAutoReply(session_name, session_number, keyword, response) {
		let date = moment().format("DD/MM/YY HH:mm:ss");
		await this.reply.create({ session_name, session_number, keyword, date, response });
	}

	async checkExistAutoReply(session_number, keyword) {
		const array = await this.reply.findAll({ where: { session_number } });
		if (Array.isArray(array) && array.length) {
			const index = array.findIndex((x) => x.keyword == keyword);
			if (index !== -1) return true;
			else return false;
		} else {
			return false;
		}
	}

	async checkReplyMessage() {
		const array = await this.reply.findAll();
		if (Array.isArray(array) && array.length) {
			return array;
		}
	}

	async editReplyMessage(session_number, keyword, newKeyword, newRespon) {
		const array = await this.reply.findAll({ where: { session_number } });
		if (Array.isArray(array) && array.length) {
			array.map(async (value) => {
				if (value.keyword == keyword) {
					await this.reply.update(
						{ keyword: newKeyword, response: newRespon },
						{
							where: {
								id: value.id,
							},
						}
					);
				}
			});
		}
	}

	async deleteReplyMessage(session_number, keyword) {
		const array = await this.reply.findAll({ where: { session_number } });
		if (Array.isArray(array) && array.length) {
			const index = array.findIndex((x) => x.keyword == keyword);
			const db = await this.reply.findOne({ where: { id: array[index].id } });
			await db.destroy();
		}
	}

	async checkMessageUser(session_number, keyword) {
		const array = await this.reply.findAll({ where: { session_number: session_number.split("@")[0] } });
		if (Array.isArray(array) && array.length !== 0) {
			const index = array.findIndex((x) => x.keyword.toLowerCase() == keyword.toLowerCase());
			if (index === -1) return false;
			const db = await this.reply.findOne({ where: { id: array[index].id } });
			return db;
		} else {
			return false;
		}
	}

	async deleteAllKeyword() {
		await this.reply.destroy({ truncate: true });
	}
}

class Kontak {
	constructor() {
		this.kon = KontakModel;
	}

	// Membuat kontak baru
	async create(telephone, name) {
		return await this.kon.create({ telephone, name });
	}

	// Mengecek apakah kontak sudah ada
	async checkExist(telephone, name) {
		const kontakList = await this.kon.findAll({ where: { telephone } });

		return kontakList.some((kontak) => kontak.name === name);
	}

	// Mengedit kontak berdasarkan nomor telepon dan nama
	async edit(telephone, name, newName) {
		const kontakList = await this.kon.findAll({ where: { telephone } });

		if (!kontakList.length) return false;

		await Promise.all(
			kontakList.map(async (kontak) => {
				if (kontak.name === name) {
					await kontak.update({ name: newName });
				}
			})
		);

		return true;
	}

	// Menghapus kontak berdasarkan nomor telepon dan nama
	async delete(telephone, name) {
		const kontak = await this.kon.findOne({ where: { telephone, name } });

		if (!kontak) return false;

		await kontak.destroy();
		return true;
	}

	// Mengecek apakah pengguna memiliki pesan terkait
	async checkMessageUser(telephone, name) {
		const kontakList = await this.kon.findAll({ where: { telephone: telephone.split("@")[0] } });

		if (!kontakList.length) return false;

		const kontak = kontakList.find((k) => k.name.toLowerCase() === name.toLowerCase());

		return kontak || false;
	}

	// Menghapus semua keyword dalam tabel kontak
	async deleteAllKeyword() {
		await this.kon.destroy({ truncate: true });
	}
}

export { ButtonResponse, ListResponse, AutoReply, Kontak };
