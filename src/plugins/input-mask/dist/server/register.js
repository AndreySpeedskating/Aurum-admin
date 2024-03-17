"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => {
    strapi.customFields.register({
        name: 'input-mask',
        plugin: 'input-mask',
        type: 'text',
    });
};
