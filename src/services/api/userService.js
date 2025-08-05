import usersData from "@/services/mockData/users.json";

let users = [...usersData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  async getAll() {
    await delay(300);
    return [...users];
  },

  async getById(id) {
    await delay(200);
    const user = users.find(u => u.Id === parseInt(id));
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return { ...user };
  },

  async update(id, userData) {
    await delay(400);
    const index = users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`User with ID ${id} not found`);
    }
    users[index] = { ...users[index], ...userData };
    return { ...users[index] };
  },

  async delete(id) {
    await delay(300);
    const index = users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`User with ID ${id} not found`);
    }
    const deleted = users.splice(index, 1)[0];
    return { ...deleted };
  }
};