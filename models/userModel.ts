import { User as IUser } from "../interfaces/user";

const database: IUser[] = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
    role: "normalUser",
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
    role: "normalUser",
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
    role: "normalUser",
  },
  {
    id: 4,
    name: "Christy Wan",
    email: "christy123@gmail.com",
    password: "christy123!",
    role: "admin",
  },
];

const userModel = {
  findOne: (email: string): IUser | undefined => {
    const user = database.find((user) => user.email === email);
    return user;
  },
  findById: (id: number): IUser | undefined => {
    const user = database.find((user) => user.id === id);
    return user;
  },
  findOrCreate: async (
    githubId: string,
    profile: any
  ): Promise<{ user: IUser; created: boolean }> => {
    let user = database.find((user) => user.githubId === githubId);

    if (user) {
      return { user, created: false };
    }

    const email =
      profile.emails && profile.emails.length > 0
        ? profile.emails[0].value
        : "no-email@example.com";

    const newUser: IUser = {
      id: database.length + 1,
      name: profile.displayName || profile.username || "Unknown Name",
      email: email,
      password: "",
      githubId: githubId,
      role: "normalUser",
    };

    database.push(newUser);

    return { user: newUser, created: true };
  },
};

export { database, userModel };
