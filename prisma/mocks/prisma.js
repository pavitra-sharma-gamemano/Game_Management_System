const { mockDeep, mockReset } = require("jest-mock-extended");
const prisma = mockDeep();

module.exports = {
  prisma,
  mockReset: () => mockReset(prisma),
};
