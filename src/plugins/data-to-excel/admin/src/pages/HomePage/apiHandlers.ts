import { request } from '@strapi/helper-plugin';

const apiHandler = {
  getContent: async ({
    content,
    startDate,
    endDate,
  }: {
    content: string;
    startDate: string;
    endDate?: string;
  }) => {
    return await request(`/data-to-excel/getContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: { content, startDate, endDate } as unknown as BodyInit,
    });
  },
};

export default apiHandler;
