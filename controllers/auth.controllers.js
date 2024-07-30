const asyncHandler = require(`express-async-handler`);
const bcrypt = require(`bcryptjs`);
const jwt = require(`jsonwebtoken`);
const {
  FRONTEND_URL,
  ACTIVATION_SECRET_KEY,
  SMTP_MAIL,
  COOKIE_EXPIRES_IN,
  JWT_EXPIRES_IN,
  JWT_SECRET_KEY,
} = require("../config/config");
const { generateUUID } = require("../utils/helperFunctions");

const { db } = require(`../config/database`);
const { promisify } = require("util");
const sendMail = require("../utils/sendMail");
const query = promisify(db.query).bind(db);

const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, phoneNumber, username, email, password } =
    req.body;
  const userId = generateUUID();
  const checkQuery = `SELECT * FROM users WHERE email = ? OR phoneNumber = ?`;
  // const createdAt = new Date();
  // const updatedAt = new Date();
  const insertUserQuery = `
  INSERT INTO users (userId, firstName, lastName, username, email, phoneNumber, password, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
`;

  //   console.log(req.body);
  //   console.log(userId);
  try {
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !phoneNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }
    // Hash password
    const hashPassword = bcrypt.hashSync(password, 10);

    // Check if the user already exists
    const existingUsers = await query(checkQuery, [email, phoneNumber]);

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User credentials already exist",
      });
    }

    // Start a transaction
    await query("START TRANSACTION");

    const newUser = [
      userId,
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      hashPassword,
      // createdAt,
      // updatedAt,
    ];

    const result = await query(insertUserQuery, newUser);

    if (result.affectedRows === 0) {
      await query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Failed to create user",
      });
    }

    // Commit the transaction
    await query("COMMIT");

    // Generate the activation token
    const activationToken = jwt.sign({ userId }, ACTIVATION_SECRET_KEY, {
      expiresIn: "1h",
    });

    // Construct the activation URL
    const activationUrl = `${FRONTEND_URL}/activate/${activationToken}`;

    // Send activation email
    try {
      await sendMail({
        from: SMTP_MAIL,
        to: email,
        subject: "Account Activation",
        text: `Your Account has been created successfully.... Please activate your account by clicking the following link: ${activationUrl}`,
      });
      return res.status(200).json({
        success: true,
        message:
          "Account created successfully. An activation email has been sent.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Account created but failed to send activation email. Please try again later.",
      });
    }
  } catch (error) {
    // Rollback the transaction in case of any error
    await query("ROLLBACK");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const verifyUser = asyncHandler(async (req, res) => {
  try {
    // Extract the token from the URL
    const { verifyToken } = req.params;

    if (!verifyToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Verify the token
    const decoded = jwt.verify(verifyToken, ACTIVATION_SECRET_KEY);

    if (!decoded) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Check if the user is already verified
    const checkQuery = `SELECT isVerified, email FROM users WHERE userId = ?`;
    const user = await query(checkQuery, [decoded.userId]);

    if (user.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user[0].isVerified === 1) {
      return res.status(400).json({
        success: false,
        message: "User already verified. Please proceed to login.",
      });
    }

    // Update user record to mark as verified
    const updateQuery = `
      UPDATE users
      SET isVerified = 1, updatedAt = NOW()
      WHERE userId = ?`;

    const result = await query(updateQuery, [decoded.userId]);

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found or already verified",
      });
    }

    // Send activation email
    try {
      await sendMail({
        from: SMTP_MAIL,
        to: user[0].email,
        subject: "Login Procedure",
        text: `Your account has been activated successfully`,
      });
    } catch (error) {
      console.log(error.stack);
      return res.status(500).json({
        success: false,
        message:
          "User verified but failed to send email. Please try logging in with the provided credentials.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User verified successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const checkQuery = `SELECT * FROM users WHERE email = ? OR username = ? OR phoneNumber = ? `;

    // Check if user exists
    const users = await query(checkQuery, [identifier, identifier, identifier]);

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "user does not exists",
      });
    }

    const user = users[0];

    if (user.isActive === 0) {
      return res.status(403).json({
        success: false,
        message: `Account suspended please phoneNumber admin for more inquiries`,
      });
    }

    if (user.isVerified === 0) {
      return res.status(403).json({
        success: false,
        message: `Account not verified please check your email`,
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.userId,
        role: user.role,
      },
      JWT_SECRET_KEY,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: parseInt(COOKIE_EXPIRES_IN),
    });

    // Login successful
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const { userId } = req.auth;
  try {
    if (!userId) {
      return res.status(403).json({
        success: false,
        message: `Logout failed`,
      });
    }
    // Clear the JWT cookie
    res.cookie("accessToken", "", {
      maxAge: 0,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // Logout successful
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const checkQuery = `SELECT email, userId FROM users WHERE email = ?`;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: `please enter an email` });
  }

  // Check if the user already exists
  const existingUsers = await query(checkQuery, [email]);

  if (existingUsers.length === 0) {
    return res.status(400).json({
      success: false,
      message: "user with email not found",
    });
  }

  const user = existingUsers[0];
  const userEmail = user.email;
  const userId = user.userId;

  // Generate a JWT reset token
  const resetToken = jwt.sign({ userId: userId }, JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  console.log(userId);
  // Create reset URL
  const resetURL = `${FRONTEND_URL}/reset-password/${resetToken}`;

  // Send the email
  try {
    await sendMail({
      from: SMTP_MAIL,
      to: userEmail,
      subject: "Password Reset",
      text: `You requested a password reset. Click the link to reset your password: ${resetURL}`,
    });
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error sending email. Please try again later.",
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword, confirmNewPassword } = req.body;
  console.log(req.body);
  try {
    // Validate input data
    if (!newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "all password fields are required",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: `confirm password and new password do not match`,
      });
    }
    // Verify the resetToken
    let decoded;
    try {
      decoded = jwt.verify(resetToken, JWT_SECRET_KEY);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const { userId } = decoded;

    // Check if the user exists
    const users = await query("SELECT * FROM users WHERE userId = ?", [userId]);

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No user found",
      });
    }

    // Hash the new password
    const hashPassword = bcrypt.hashSync(newPassword, 10);

    // Update the password in the database
    await query("UPDATE users SET password = ? WHERE userId = ?", [
      hashPassword,
      userId,
    ]);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  const { userId } = req.auth;
  console.log(req.auth);
  try {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(403).json({
        success: false,
        message: `All password fields are required `,
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(403).json({
        success: false,
        message: `New password and confirm password do not match`,
      });
    }
    // Check if the user exists
    const userQuery = "SELECT * FROM users WHERE userId = ?";
    const userResult = await query(userQuery, [userId]);

    if (userResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userResult[0];

    // Verify the old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Hash the new password
    const hashPassword = bcrypt.hashSync(newPassword, 10);

    // Update the password in the database
    const updatePasswordQuery =
      "UPDATE users SET password = ? WHERE userId = ?";
    const updateResult = await query(updatePasswordQuery, [
      hashPassword,
      userId,
    ]);

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "Failed to update password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = {
  createUser,
  verifyUser,
  loginUser,
  logoutUser,
  resetPassword,
  forgotPassword,
  changePassword,
};
