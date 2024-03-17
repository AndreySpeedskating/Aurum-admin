"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => {
    strapi.customFields.register({
        name: 'phone-field',
        plugin: 'phone-input',
        type: 'text',
    });
};
