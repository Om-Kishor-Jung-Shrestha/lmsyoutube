
import express from 'express';
import { activateUser, deleteUser, getAllUsers, getUserInfo, loginUser, logoutUser, registrationUser, socialAuth, updateAccessToken, updatePassword, updateProfilePicture,updateUserInfo, updateUserRole } from '../controllers/user.controller';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';

const userRouter = express.Router();

userRouter.post('/registration', registrationUser);

userRouter.post('/activate-user', activateUser);

userRouter.post('/login-user', loginUser);
userRouter.post('/login', loginUser);

userRouter.get('/logout-user', logoutUser);
userRouter.get('/logout-user', isAuthenticated,authorizeRoles("admin"), logoutUser);
userRouter.get("/refreshtoken", updateAccessToken);

userRouter.get("/me", updateAccessToken,isAuthenticated, getUserInfo);
userRouter.post("/socialAuth", socialAuth);
userRouter.put('/update-user-info', updateAccessToken,isAuthenticated, updateUserInfo);

userRouter.put("/update-user-password", updateAccessToken,isAuthenticated, updatePassword);
userRouter.put("/update-user-avatar",updateAccessToken, isAuthenticated, updateProfilePicture);

userRouter.get("/get-users", updateAccessToken,isAuthenticated, authorizeRoles("admin"), getAllUsers);
userRouter.put(
  "/update-user",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole
);

userRouter.put(
  "/delete-user/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);


export default userRouter;
