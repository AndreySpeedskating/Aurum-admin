"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async getContent(ctx) {
        const { content, startDate, endDate } = ctx.request.body;
        try {
            return await strapi
                .plugin('data-to-excel')
                .service('myService')
                .getContent({ content, startDate, endDate });
        }
        catch (err) {
            ctx.trow(500, err);
        }
    },
});
