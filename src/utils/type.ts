export type CreateUserParams = {
  username: string;
  password: string;
  email: string;
};

export type LoginUserParams = {
  password: string;
  email: string;
};

export type UpdateUserParams = {
  username: string;
  password: string;
  email: string;
};

export type CreateCorseParams = {
  courseTitle: string;
  courseDescription: string;
  category: string;
  courseImage: string;
  coursePrice: string;
  courseResource: string;
  active: number;
};
