import { DataTypes } from "sequelize";
import { sequelize } from "../../config/Database.js";

const Kontak = sequelize.define(
	"Kontak",
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		telephone: {
			type: DataTypes.STRING,
			allowNull: false,
		}
	},
	{ tableName: "kontak", timestamps: false }
);

export default Kontak;
