import session from 'express-session';
import express from 'express';
const sessionStore = new session.MemoryStore();

export const fetchAllSessions = (
    callback: (error: any, sessions: { [sessionId: string]: any } | null) => void
  ) => {
    sessionStore.all((error, sessions) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, sessions as { [sessionId: string]: any }); // Using 'any' to bypass the type issue
      }
    });
  };