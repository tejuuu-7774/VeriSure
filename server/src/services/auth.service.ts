import prisma from "../config/prisma";
import bcrypt from "bcryptjs";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export const registerUser = async ({
  name,
  email,
  password,
}: RegisterInput) => {
  // check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};