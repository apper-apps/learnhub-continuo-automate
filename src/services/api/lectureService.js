import lecturesData from "@/services/mockData/lectures.json";

let lectures = [...lecturesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const lectureService = {
  async getAll() {
    await delay(300);
    return [...lectures];
  },

  async getByProgramSlug(programSlug) {
    await delay(250);
    return lectures
      .filter(l => l.program_slug === programSlug)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(l => ({ ...l }));
  },

  async getById(id) {
    await delay(200);
    const lecture = lectures.find(l => l.Id === parseInt(id));
    if (!lecture) {
      throw new Error(`Lecture with ID ${id} not found`);
    }
    return { ...lecture };
  },

  async create(lectureData) {
    await delay(400);
    const newLecture = {
      ...lectureData,
      Id: Math.max(...lectures.map(l => l.Id)) + 1
    };
    lectures.push(newLecture);
    return { ...newLecture };
  },

  async update(id, lectureData) {
    await delay(400);
    const index = lectures.findIndex(l => l.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Lecture with ID ${id} not found`);
    }
    lectures[index] = { ...lectures[index], ...lectureData };
    return { ...lectures[index] };
  },

  async delete(id) {
    await delay(300);
    const index = lectures.findIndex(l => l.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Lecture with ID ${id} not found`);
    }
    const deleted = lectures.splice(index, 1)[0];
    return { ...deleted };
  }
};