import { ICommandModule, ICommandDefinition, ICommandsMap } from "../types/commands";
import { Message } from "whatsapp-web.js";
import { config } from "../config";
import { initOpenAI } from "../providers/openai";

export const GptModule: ICommandModule = {
	key: "gpt",
	register: (): ICommandsMap => {
		return {
			apiKey,
			baseUrl,
			maxModelTokens
		};
	}
};

const apiKey: ICommandDefinition = {
	help: "<value> - Set token pool, support multiple tokens with comma-separated",
	hint: "sk-xxxx,sk-xxxx",
	data: () => {
		// Randomly pick an API key
		return config.openAIAPIKeys[Math.floor(Math.random() * config.openAIAPIKeys.length)];
	},
	execute: function(message: Message, valueStr?: string) {
		if (!valueStr) {
			message.reply(`Invalid value, please give a comma-separated string of OpenAI api keys.`);
			return;
		}
		config.openAIAPIKeys = valueStr.split(",") as string[];
		message.reply(`Updated API keys, total keys: ${config.openAIAPIKeys.length}`);
	}
};

const baseUrl: ICommandDefinition = {
	help: "<value> - Set OpenAI-compatible api server base URL, which ends with '/v1'",
	hint: "xxxx/v1",
	data: () => {
		return config.openAIBaseUrl;
	},
	execute: function(message: Message, valueStr?: string) {
		if (!valueStr) {
			message.reply(`Invalid value, please give a OpenAI-compatible api server base URL, which ends with '/v1'.`);
			return;
		}
		config.openAIBaseUrl = valueStr.trim();
		message.reply(`Updated OpenAI-compatible api server base URL: ${config.openAIBaseUrl}`);
	}
};

const maxModelTokens: ICommandDefinition = {
	help: "<value> - Set max model tokens value",
	hint: "integer",
	data: config.maxModelTokens,
	execute: function(message: Message, valueStr?: string) {
		const value = parseInt(valueStr || "");
		if (!value || isNaN(value)) {
			message.reply(`Invalid value, please give an integer value`);
			return;
		}
		this.data = value;
		initOpenAI();
		message.reply(`Updated max model tokens to ${this.data}`);
	}
};
