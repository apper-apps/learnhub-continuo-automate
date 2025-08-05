import reviewsData from "@/services/mockData/reviews.json";

let reviews = [...reviewsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reviewService = {
  async getAll() {
    await delay(300);
    return reviews
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(r => ({ ...r }));
  },

  async getFeatured(limit = 6) {
    await delay(250);
    return reviews
      .sort((a, b) => b.likes.length - a.likes.length)
      .slice(0, limit)
      .map(r => ({ ...r }));
  },

  async toggleLike(reviewId, userId) {
    await delay(200);
    const index = reviews.findIndex(r => r.Id === parseInt(reviewId));
    if (index === -1) {
      throw new Error(`Review with ID ${reviewId} not found`);
    }
    
    const review = reviews[index];
    const userIndex = review.likes.indexOf(userId);
    
    if (userIndex > -1) {
      review.likes.splice(userIndex, 1);
    } else {
      review.likes.push(userId);
    }
    
    return { ...review };
  },

  async create(reviewData) {
    await delay(400);
    const newReview = {
      ...reviewData,
      Id: Math.max(...reviews.map(r => r.Id)) + 1,
      likes: [],
      created_at: new Date().toISOString()
    };
    reviews.push(newReview);
    return { ...newReview };
  }
};