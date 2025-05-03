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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const User_1 = require("../entities/User");
const Company_1 = require("../entities/Company");
require("dotenv").config();
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const constants_1 = require("../constants");
const ioredis_1 = __importDefault(require("ioredis"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const ferror_1 = require("../shared/ferror");
const redis = new ioredis_1.default();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
let LocationData = class LocationData {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], LocationData.prototype, "ip", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], LocationData.prototype, "country", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], LocationData.prototype, "city", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], LocationData.prototype, "region", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], LocationData.prototype, "latitude", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], LocationData.prototype, "longitude", void 0);
LocationData = __decorate([
    (0, type_graphql_1.ObjectType)()
], LocationData);
let RegisterInput = class RegisterInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RegisterInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RegisterInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RegisterInput.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], RegisterInput.prototype, "contact", void 0);
RegisterInput = __decorate([
    (0, type_graphql_1.InputType)()
], RegisterInput);
let LoginInput = class LoginInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginInput.prototype, "email", void 0);
LoginInput = __decorate([
    (0, type_graphql_1.InputType)()
], LoginInput);
let VerifyCodeInput = class VerifyCodeInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], VerifyCodeInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], VerifyCodeInput.prototype, "code", void 0);
VerifyCodeInput = __decorate([
    (0, type_graphql_1.InputType)()
], VerifyCodeInput);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [ferror_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => LocationData, { nullable: true }),
    __metadata("design:type", LocationData)
], UserResponse.prototype, "location", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        return forwarded.split(',')[0].trim();
    }
    return req.socket.remoteAddress || '';
}
async function getLocationFromIp(ip) {
    if (ip === '::1' || ip === '127.0.0.1') {
        return {
            ip,
            country: 'Localhost',
            city: 'Development'
        };
    }
    try {
        const response = await fetch(`https://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,lat,lon,query`);
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to fetch location');
        }
        return {
            ip: data.query,
            country: data.country,
            city: data.city,
            region: data.regionName,
            latitude: data.lat,
            longitude: data.lon
        };
    }
    catch (error) {
        console.error('Location fetch error:', error);
        return {
            ip,
            country: 'Unknown',
            city: 'Unknown'
        };
    }
}
let UserResolver = class UserResolver {
    async me({ req, em }) {
        if (!req.session.userId) {
            return null;
        }
        return await em.findOne(User_1.User, { id: req.session.userId });
    }
    async register(options, { em }) {
        const existingSeller = await em.findOne(Company_1.Company, { email: options.email });
        const existingUser = await em.findOne(User_1.User, { username: options.username });
        if (existingUser) {
            return { errors: [{ field: "username", message: "Username already taken" }] };
        }
        if (existingSeller) {
            return { errors: [{ field: "email", message: "Email is already registered as a seller." }] };
        }
        if (options.username.length <= 3) {
            return { errors: [{ field: "username", message: "Username is too short" }] };
        }
        if (options.password.length <= 5) {
            return { errors: [{ field: "password", message: "Password is too short" }] };
        }
        const hashedPassword = await argon2_1.default.hash(options.password);
        const user = em.create(User_1.User, {
            username: options.username,
            password: hashedPassword,
            contact: options.contact,
            email: options.email,
            isEmailVerified: false,
            isPhoneVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await em.persistAndFlush(user);
        const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
        await redis.set(`emailCode:${user.email}`, emailCode, "EX", 600);
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Verify Your Email",
            text: `Your verification code is: ${emailCode}`,
        });
        return { user };
    }
    async verifyCode(input, { em }) {
        const user = await em.findOne(User_1.User, { email: input.email });
        if (!user) {
            return { errors: [{ field: "email", message: "User not found" }] };
        }
        const storedEmailCode = await redis.get(`emailCode:${input.email}`);
        if (!storedEmailCode || input.code !== storedEmailCode) {
            return { errors: [{ field: "code", message: "Invalid or expired verification code" }] };
        }
        user.isEmailVerified = true;
        await em.persistAndFlush(user);
        await redis.del(`emailCode:${input.email}`);
        return { user };
    }
    async login(options, { em, req, res }) {
        const user = await em.findOne(User_1.User, { username: options.username });
        if (!user) {
            return { errors: [{ field: "username", message: "Username doesn't exist" }] };
        }
        if (user.email !== options.email) {
            return { errors: [{ field: "email", message: "Invalid Email" }] };
        }
        if (!user.isEmailVerified) {
            return { errors: [{ field: "verification", message: "User not verified" }] };
        }
        const valid = await argon2_1.default.verify(user.password, options.password);
        if (!valid) {
            return { errors: [{ field: "password", message: "Incorrect password" }] };
        }
        const ip = getClientIp(req);
        const location = await getLocationFromIp(ip);
        res.cookie("user_location", JSON.stringify(location), {
            httpOnly: false,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        req.session.userId = user.id;
        return {
            user,
            location
        };
    }
    async users({ em }) {
        return em.find(User_1.User, {});
    }
    logout({ req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie(constants_1.COOKIE_NAME);
            res.clearCookie("user_location");
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }
};
exports.UserResolver = UserResolver;
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerifyCodeInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "verifyCode", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
exports.UserResolver = UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
//# sourceMappingURL=demo.js.map