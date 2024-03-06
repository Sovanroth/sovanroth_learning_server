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
  category: number;
  courseImage: string;
  coursePrice: string;
  courseResource: string;
  active: number;
};

export type UpdateCorseParams = {
  courseTitle: string;
  courseDescription: string;
  category: number;
  courseImage: string;
  coursePrice: string;
  courseResource: string;
  active: number;
};

export type CreateVideoParams = {
  video_title: string;
  video_url: string;
};

export type UpdateVideoParams = {
  video_title: string;
  video_url: string;
};

export type CreateUserProfileParams = {
  profileImage: string;
};

export type UpdateProfileParams = {
  profileImage: string;
};
