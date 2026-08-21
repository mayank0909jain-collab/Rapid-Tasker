const Category = require("../../models/Category");

const createCategory = async (data) => {
  const { name, description, image } = data;

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  return Category.create({
    name,
    description,
    image,
  });
};

const getCategories = async () => {
  return Category.find({
    isActive: true,
  }).sort({ createdAt: -1 });
};

const getAllCategories = async () => {
  return Category.find().sort({ createdAt: -1 });
};

const updateCategory = async (categoryId, data) => {
  const category = await Category.findByIdAndUpdate(
    categoryId,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

const deleteCategory = async (categoryId) => {
  const category = await Category.findByIdAndUpdate(
    categoryId,
    {
      isActive: false,
    },
    {
      new: true,
    }
  );

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

module.exports = {
  createCategory,
  getCategories,
  getAllCategories,
  updateCategory,
  deleteCategory,
};