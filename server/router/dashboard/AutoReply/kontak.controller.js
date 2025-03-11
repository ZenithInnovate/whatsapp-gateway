import { Kontak } from "../../../database/db/messageRespon.db.js";

export default class KontakController extends Kontak {
	constructor() {
		super();
	}

	async create(req, res) {
		try {
			let { telephone, name } = req.body;
			if (!telephone || !name) {
				return res.status(400).json({ message: "Input Data Name & Telephone Number" });
			}

			// Validasi dan parsing nomor telepon
			const telephoneParts = telephone.match(/\((\d+)\)/);
			if (!telephoneParts) {
				return res.status(400).json({ message: "Invalid telephone format" });
			}
			const parsedTelephone = telephoneParts[1];

			const check = await this.checkExistKontak(parsedTelephone, name);
			if (check) {
				return res.status(403).json({ message: `Cannot create kontak with telephone ${name} again in same session ${parsedTelephone}` });
			}

			await super.create(name, parsedTelephone);
			return res.status(200).json({ message: `Success add kontak with telephone ${name}` });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Internal Server Error!" });
		}
	}

	async edit(req, res) {
		try {
			let { telephone, name, newRespon, newTelephone } = req.body;
			if (!telephone || !name || !newRespon || !newTelephone) {
				return res.status(400).json({ message: "Input Data Name" });
			}

			await this.editReplyMessage(telephone, name, newTelephone, newRespon);
			return res.status(200).json({ message: `Success edit kontak ${name} with telephone ${newTelephone}` });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Internal Server Error!" });
		}
	}

	async delete(req, res) {
		try {
			let { telephone, name } = req.query;
			if (!telephone || !name) {
				return res.status(400).json({ message: "Input Data!" });
			}

			await super.delete(telephone, name);
			return res.status(200).json({ message: `Success delete kontak with telephone ${name}` });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Internal Server Error!" });
		}
	}

	async deleteAll(req, res) {
		try {
			await super.deleteAll();
			return res.status(200).json({ message: "Success delete all telephone kontak" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Internal Server Error!" });
		}
	}
}
