interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  githubId?: string;
}

const database: User[] = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
  },
];

const userModel = {
  findOne: (email: string): User | undefined => {
    const user = database.find((user) => user.email === email);
    return user;
  },
  findById: (id: number): User | undefined => {
    const user = database.find((user) => user.id === id);
    return user;
  },
  findOrCreate: async (
    githubId: string,
    profile: any
  ): Promise<{ user: User; created: boolean }> => {
    let user = database.find((user) => user.githubId === githubId);

    if (user) {
      return { user, created: false };
    }

    const newUser: User = {
      id: database.length + 1, 
      name: profile.displayName || profile.username,
      email: profile.emails[0].value,
      password: "", 
      githubId: githubId, 
    };

    database.push(newUser);

    return { user: newUser, created: true };
  },
};

export { database, userModel };
