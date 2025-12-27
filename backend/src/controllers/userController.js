import userService from "../services/userService.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filters = {};

    if (role) {
      filters.role = role;
    }

    const users = await userService.getAllUsers(filters);

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
