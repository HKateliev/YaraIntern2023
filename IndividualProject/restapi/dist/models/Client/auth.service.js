"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const client_service_1 = require("./client.service");
const crypto_1 = require("crypto");
const util_1 = require("util");
const scrypt = (0, util_1.promisify)(crypto_1.scrypt);
let AuthService = class AuthService {
    constructor(clientService) {
        this.clientService = clientService;
    }
    async signup(clientUsername, clientEmail, clientPassword) {
        const clients = await this.clientService.find(clientUsername);
        if (clients.length) {
            throw new common_1.BadRequestException('username in use');
        }
        const salt = (0, crypto_1.randomBytes)(8).toString('hex');
        const hash = (await scrypt(clientPassword, salt, 32));
        const result = salt + '.' + hash.toString('hex');
        const client = await this.clientService.create(clientUsername, clientEmail, result);
        return client;
    }
    async signin(clientUsername, clientPassword) {
        const [client] = await this.clientService.find(clientUsername);
        if (!client) {
            throw new common_1.NotFoundException('client not found');
        }
        const [salt, storedHash] = client.password.split('.');
        const hash = (await scrypt(clientPassword, salt, 32));
        if (storedHash !== hash.toString('hex')) {
            throw new common_1.BadRequestException('bad password');
        }
        return client;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_service_1.ClientService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map