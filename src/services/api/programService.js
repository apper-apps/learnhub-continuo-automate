import programsData from "@/services/mockData/programs.json";

let programs = [...programsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const programService = {
  async getAll() {
    await delay(300);
    return [...programs];
  },

  async getBySlug(slug) {
    await delay(200);
    const program = programs.find(p => p.slug === slug);
    if (!program) {
      throw new Error(`Program with slug "${slug}" not found`);
    }
    return { ...program };
  },

  async create(programData) {
    await delay(400);
    const newProgram = {
      ...programData,
      Id: Math.max(...programs.map(p => p.Id)) + 1,
      slug: programData.title.toLowerCase().replace(/\s+/g, "-")
    };
    programs.push(newProgram);
    return { ...newProgram };
  },

  async update(id, programData) {
    await delay(400);
    const index = programs.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Program with ID ${id} not found`);
    }
    programs[index] = { ...programs[index], ...programData };
    return { ...programs[index] };
  },

  async delete(id) {
    await delay(300);
    const index = programs.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Program with ID ${id} not found`);
    }
    const deleted = programs.splice(index, 1)[0];
    return { ...deleted };
  }
};