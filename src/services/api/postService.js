import postsData from "@/services/mockData/posts.json";

let posts = [...postsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const postService = {
  async getAll() {
    await delay(300);
    return posts
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(p => ({ ...p }));
  },

  async getBySlug(slug) {
    await delay(200);
    const post = posts.find(p => p.slug === slug);
    if (!post) {
      throw new Error(`Post with slug "${slug}" not found`);
    }
    return { ...post };
  },

  async getFeatured(limit = 3) {
    await delay(250);
    return posts
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit)
      .map(p => ({ ...p }));
  },

  async create(postData) {
    await delay(400);
    const newPost = {
      ...postData,
      Id: Math.max(...posts.map(p => p.Id)) + 1,
      slug: postData.title.toLowerCase().replace(/\s+/g, "-"),
      created_at: new Date().toISOString()
    };
    posts.push(newPost);
    return { ...newPost };
  },

  async update(id, postData) {
    await delay(400);
    const index = posts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Post with ID ${id} not found`);
    }
    posts[index] = { ...posts[index], ...postData };
    return { ...posts[index] };
  },

  async delete(id) {
    await delay(300);
    const index = posts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Post with ID ${id} not found`);
    }
    const deleted = posts.splice(index, 1)[0];
    return { ...deleted };
  }
};